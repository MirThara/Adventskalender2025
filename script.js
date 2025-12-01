import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161/build/three.module.js";

const canvas = document.getElementById("webgl");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
    -window.innerWidth / 2, window.innerWidth / 2,
    window.innerHeight / 2, -window.innerHeight / 2,
    1, 10000
);
camera.position.z = 2;

let particleSystem;
let particles = [];
let geometry;
let positions, colors;
let particleCount = 0;

// -----------------------------------------------
async function loadImage(url, gap = 4) {
    return new Promise(async (resolve, reject) => {
        try {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = url;
            await img.decode();

            // --- 100vh SKALIERUNG ---
            const maxH = window.innerHeight;   // 100vh
            let newW = img.width;
            let newH = img.height;

            if (newH > maxH) {
                const scale = maxH / newH;
                newW = Math.round(newW * scale);
                newH = Math.round(newH * scale);
            }

            // safer ImageBitmap
            const bitmap = await createImageBitmap(img, {
                premultiplyAlpha: 'none',
                resizeWidth: newW,
                resizeHeight: newH,
                resizeQuality: 'high'
            });

            const w = bitmap.width;
            const h = bitmap.height;

            // Offscreen canvas
            const off = document.createElement('canvas');
            off.width = w;
            off.height = h;
            const ctx = off.getContext('2d');

            // Hintergrund opak
            ctx.fillStyle = "rgba(255,255,255,1)";
            ctx.fillRect(0, 0, w, h);

            // Bild darüber zeichnen
            ctx.drawImage(bitmap, 0, 0, w, h);

            // Pixel holen
            const imgdata = ctx.getImageData(0, 0, w, h);
            const data = imgdata.data;

            // Alpha erzwingen
            for (let i = 0; i < data.length; i += 4) {
                data[i + 3] = 255;
            }

            ctx.putImageData(imgdata, 0, 0);

            // Punkte + Farben erzeugen
            const pts = [];
            const cols = [];

            for (let y = 0; y < h; y += gap) {
                for (let x = 0; x < w; x += gap) {
                    const i = (y * w + x) * 4;
                    pts.push(x - w / 2, -(y - h / 2), 0);
                    cols.push(
                        data[i] / 255,
                        data[i + 1] / 255,
                        data[i + 2] / 255
                    );
                }
            }

            if (bitmap.close) bitmap.close();

            resolve({ points: pts, colors: cols, width: w, height: h });
        } catch (err) {
            reject(err);
        }
    });
}

// -----------------------------------------------
// Partikelklasse wie in 2D
class Particle {
    constructor(x, y, color, target) {
        this.x = x;
        this.y = y;
        this.z = 0;
        this.vx = 0;
        this.vy = 0;
        this.friction = Math.random() * 0.7 + 0.15;
        this.ease = Math.random() * 0.05 + 0.05;
        this.originX = target[0];
        this.originY = target[1];
        this.originZ = target[2];
        this.color = color;
        this.active = true; // <- Partikel ist aktiv, solange sie sich bewegen
    }

    update() {
        if (!this.active) return;

        const dx = this.originX - this.x;
        const dy = this.originY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Bewegung nur, wenn noch nicht am Ziel
        if (distance < 0.5) {
            this.x = this.originX;
            this.y = this.originY;
            this.z = this.originZ;
            this.vx = 0;
            this.vy = 0;
            this.active = false; // Partikel stoppt hier
            return;
        }

        this.vx += dx * this.ease;
        this.vy += dy * this.ease;

        // Wirbel nur solange aktiv
        if (distance > 1) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 2;
            this.vx += Math.cos(angle) * radius * 0.1;
            this.vy += Math.sin(angle) * radius * 0.1;
        }

        this.vx *= this.friction;
        this.vy *= this.friction;
        this.x += this.vx;
        this.y += this.vy;
    }
}


// -----------------------------------------------
// Partikel-System erzeugen
function createParticleSystem(startX, startY, points, cols) {
    particles = [];
    particleCount = points.length / 3;
    positions = new Float32Array(particleCount * 3);
    colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        const target = points.slice(i * 3, i * 3 + 3);
        const color = cols.slice(i * 3, i * 3 + 3);
        particles.push(new Particle(startX, startY, color, target));
        positions.set([startX, startY, 0], i * 3);
        colors.set(color, i * 3);
    }

    geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        blending: THREE.NormalBlending,
    });

    if (particleSystem) scene.remove(particleSystem);
    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

// -----------------------------------------------
// Animation
function animate() {
    requestAnimationFrame(animate);
    if (particles.length > 0) {
        particles.forEach((p, i) => {
            p.update();
            positions[i * 3] = p.x;
            positions[i * 3 + 1] = p.y;
            positions[i * 3 + 2] = p.z;
        });
        geometry.attributes.position.needsUpdate = true;
    }
    renderer.render(scene, camera);
}
animate();

// -----------------------------------------------
const resetBtn = document.getElementById('resetBtn');
// Klick auf Areas
document.querySelectorAll("area").forEach(area => {
    area.addEventListener("click", async e => {

        const day = parseInt(area.dataset.day);   // z.B. "1"
        const month = parseInt(area.dataset.month); // z.B. "12"

        if (!isDateReached(month, day)) {
            console.error(`Tag ${day} liegt in der Zukunft!`);
            return;
        }

        resetBtn.style.display = "block";
        const img = area.dataset.img;
        if (!img) return;

        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - window.innerWidth / 2;
        const clickY = -(e.clientY - window.innerHeight / 2);

        const result = await loadImage(img, 1); // Schrittweite für Performance
        createParticleSystem(clickX, clickY, result.points, result.colors);
    });
});

// Reset-Button
resetBtn.addEventListener('click', () => {
    // Partikel-System entfernen
    if (particleSystem) {
        scene.remove(particleSystem);
        particleSystem.geometry.dispose();
        particleSystem.material.dispose();
        particleSystem = null;
    }
    // Array leeren
    particles = [];
    positions = null;
    colors = null;
    resetBtn.style.display = "none";


    stopAll();
});
