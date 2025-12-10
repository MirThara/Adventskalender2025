/**
 * Prüft, ob ein bestimmter Monat+Tag <= heute ist
 * @param {number} month Monat 1-12
 * @param {number} day Tag 1-31
 * @returns {boolean} true, wenn Datum erlaubt
 */
function isDateReached(month, day) {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // 0-basiert
    const currentDay = today.getDate();

    return month < currentMonth || (month === currentMonth && day <= currentDay);
}

window.sounds = [
    new Audio("https://mirthara.github.io/Adventskalender2025/assets/audio/OogwaysAscends.mp3"), // 1
    new Audio("https://mirthara.github.io/Adventskalender2025/assets/audio/WeWereTheLuckyOnes.mp3"), // 2
    new Audio('https://mirthara.github.io/Adventskalender2025/assets/audio/NeverForget.mp3'), // 3
    new Audio('https://mirthara.github.io/Adventskalender2025/assets/audio/FrenchLibrary.mp3'), // 4
    new Audio('https://mirthara.github.io/Adventskalender2025/assets/audio/ExperienceFlowsInYou.mp3'), // 5
    new Audio('https://mirthara.github.io/Adventskalender2025/assets/audio/ComptineD\'unAutreEte.mp3'), // 6
    new Audio('https://mirthara.github.io/Adventskalender2025/assets/audio/Mondscheinsonate.mp3'), // 7
    new Audio('https://mirthara.github.io/Adventskalender2025/assets/audio/AnOldFriend.mp3'), // 8
    new Audio('https://mirthara.github.io/Adventskalender2025/assets/audio/Fly.mp3'), // 9
    new Audio('https://mirthara.github.io/Adventskalender2025/assets/audio/UnaMattina.mp3'), // 10
    new Audio('https://mirthara.github.io/Adventskalender2025/assets/audio/Gladiator.mp3'), // 11
    new Audio('https://mirthara.github.io/Adventskalender2025/assets/audio/LondonCalling.mp3'), // 12
    new Audio('https://mirthara.github.io/Adventskalender2025/assets/audio/Lullaby.mp3'), // 13
    new Audio('https://mirthara.github.io/Adventskalender2025/assets/audio/Scherzo.mp3'), // 14
    new Audio('https://mirthara.github.io/Adventskalender2025/assets/audio/HijoDeLaLuna.mp3'), // 15
    new Audio('https://mirthara.github.io/Adventskalender2025/assets/audio/WhoYouReallyAre.mp3'), // 16
    new Audio('https://mirthara.github.io/Adventskalender2025/assets/audio/Pirates.mp3'), // 17
    new Audio('https://mirthara.github.io/Adventskalender2025/assets/audio/1Gnossienne.mp3'), // 18
    new Audio('https://mirthara.github.io/Adventskalender2025/assets/audio/LaPetiteFilleDeLaMer.mp3'), // 19
    new Audio('https://mirthara.github.io/Adventskalender2025/assets/audio/Picard.mp3'), // 20
    new Audio('https://mirthara.github.io/Adventskalender2025/assets/audio/Time.mp3'), // 21
    new Audio('https://mirthara.github.io/Adventskalender2025/assets/audio/GoldenHour.mp3'), // 22
    new Audio('https://mirthara.github.io/Adventskalender2025/assets/audio/VideoGames.mp3'), // 23
    new Audio('https://mirthara.github.io/Adventskalender2025/assets/audio/Interstellar.mp3') // 24
];

function stopAll() {
    window.sounds.forEach(audio => {
        audio.pause();
        audio.currentTime = 0; // zurückspulen
    });
}

function play(day) {
    const monthForDay = 12;

    if (!isDateReached(monthForDay, day)) {
        swal({
            title: "Fehler",
            text: `Heute ist noch nicht der ${day}.12.`,
            icon: "warning",
            button: "OK",
        });
        return;
    }

    stopAll();

    const audioIndex = day - 1; // day=1 => index 0, day=2 => index 1 usw.
    const audio = window.sounds[audioIndex];

    if (!audio) {
        console.warn(`Kein Audio für den Tag ${day} vorhanden.`);
        return;
    }

    audio.play();
}