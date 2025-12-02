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
    new Audio("https://mirthara.github.io/Adventskalender2025/assets/audio/OogwaysAscends.mp3"),
    new Audio("https://mirthara.github.io/Adventskalender2025/assets/audio/WeWereTheLuckyOnes.mp3"),
    new Audio('./assets/audio/NeverForget.mp3'),
    new Audio('./assets/audio/FrenchLibrary.mp3'),
    new Audio('./assets/audio/ExperienceFlwosInYou.mp3'),
    new Audio('./assets/audio/ComptineD\'unAutreEte.mp3'),
    new Audio('./assets/audio/Mondscheinsonate.mp3'),
    new Audio('./assets/audio/AnOldFriend.mp3'),
    new Audio('./assets/audio/Fly.mp3'),
    new Audio('./assets/audio/UnaMattina.mp3'),
    new Audio('./assets/audio/Gladiator.mp3'),
    new Audio('./assets/audio/LondonCalling.mp3'),
    new Audio('./assets/audio/Lullaby.mp3'),
    new Audio('./assets/audio/HijoDeLaLuna.mp3'),
    new Audio('./assets/audio/WhoYouReallyAre.mp3'),
    new Audio('./assets/audio/1Gymnopedie.mp3'),
    new Audio('./assets/audio/1Gnossienne.mp3'),
    new Audio('./assets/audio/PiratesOfTheCaribbean.mp3'),
    new Audio('./assets/audio/LaPetiteFilleDeLaMer.mp3'),
    new Audio('./assets/audio/Picard.mp3'),
    new Audio('./assets/audio/Time.mp3'),
    new Audio('./assets/audio/GoldenHour.mp3'),
    new Audio('./assets/audio/VideoGames.mp3'),
    new Audio('./assets/audio/Interstellar.mp3')
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