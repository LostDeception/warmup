var audio = document.getElementById("gameMusic");
var btnPlay = document.getElementById("btnPlayAudio");
var btnStop = document.getElementById("btnStopAudio");

var volume = 0.2;
var musicPath = 'music/';

// Game song playlist
var songs = 
[
    "Stranger - Yung Kartz",
    "Jakarta Riddim - Konrad OldMoney",
    "Jungle Mission - Cxdy",
    "Jetsons - Cxdy",
    "Rage - Cxdy",
    "Triforce - Cxdy", 
    "Chase - The Brothers Records",
    "Life After Death - DJ Freedem",
    "Savior Search - DJ Freedem",
    "Demon - JVNA",
    "Beside Me - Patrick Patrikios"
];

// Play random sound track
function playMusic()
{
    // Check that user did not pause the audio
    if(!isPaused())
    {
        audio.volume = volume;
        let song = songs[Math.floor(Math.random() * songs.length)];
        song = song.replaceAll(" ", "%20");
        song = musicPath.concat(song + '.mp3');
        audio.src = song;
        audio.play();
    }
}

function pauseMusic()
{
    btnPlay.style.display = 'none';
    btnStop.style.display = 'block';
    audio.pause();
}

function resumeMusic()
{
    btnPlay.style.display = 'block';
    btnStop.style.display = 'none';
    audio.play();
}

function restartMusic()
{
    audio.currentTime = 0;
    audio.pause();
}

function isPaused()
{
    if(btnPlay.style.display == 'none')
    {
        return true;
    }

    return false;
}

btnPlay.addEventListener('click', pauseMusic);

btnStop.addEventListener('click', resumeMusic);

audio.addEventListener('ended', function() 
{
    audio.pause();
    audio.load();
    audio.play();
});