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
    new Audio('assets/audio/Oogways Ascends.mp3'),
    new Audio('assets/audio/We Were the Lucky Ones.mp3'),
    new Audio('assets/audio/Never Forget.mp3'),
    new Audio('assets/audio/French Library.mp3'),
    new Audio('assets/audio/Experience Flwos In You.mp3'),
    new Audio('assets/audio/Comptine d\'un autre été.mp3'),
    new Audio('assets/audio/Sonata quasi una fantasia 1.Mvt.mp3'),
    new Audio('assets/audio/An Old Friend.mp3'),
    new Audio('assets/audio/Fly.mp3'),
    new Audio('assets/audio/Una mattina.mp3'),
    new Audio('assets/audio/Gladiator.mp3'),
    new Audio('assets/audio/London Calling.mp3'),
    new Audio('assets/audio/London Calling.mp3'),
    new Audio('assets/audio/Lullaby.mp3'),
    new Audio('assets/audio/Hijo de la luna.mp3'),
    new Audio('assets/audio/Who you really are.mp3'),
    new Audio('assets/audio/1ère Gymnopèdie.mp3'),
    new Audio('assets/audio/1ère Gnossienne.mp3'),
    new Audio('assets/audio/Pirates of the Caribbean.mp3'),
    new Audio('assets/audio/La petite fille de la mer.mp3'),
    new Audio('assets/audio/Picard.mp3'),
    new Audio('assets/audio/Time.mp3'),
    new Audio('assets/audio/Golden Hour.mp3'),
    new Audio('assets/audio/Video Games.mp3'),
    new Audio('assets/audio/Interstellar.mp3')
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