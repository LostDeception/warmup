var gameCanvas = document.getElementById("gameCanvas");
var gameMenu = document.getElementById("gameMenu");
var btnPlayTimed = document.getElementById("playTimed");
var btnPlayEndless = document.getElementById("playEndless");
var btnRestart = document.getElementById("btnRestart");
var gameTimer = document.getElementById("gameTimer");
var targetBox = document.getElementById("targetBox");
var gameScore = document.getElementById("gameScore");
var targetHits = document.getElementById("hits");
var targetMisses = document.getElementById("misses");
var finalTargetHits = document.getElementById("finalHits");
var finalTargetMisses = document.getElementById("finalMisses");
var countdownText = document.getElementById("gameCountdown");

var gameInterval = null;
var targetBounds = 125;
var countdown = 3;
var isTimed = false;
var timer = 60;

var hitCount = 0;
var missCount = 0;
var activeTargets = 0;
var targetsToSpawn = 1;
var targetSpeed = "0.5s";

function timedGame()
{
    isTimed = true;

    /**
     * animate button down and display the game timer
     * and play the randomly generatd game music
     */
    btnPlayTimed.style.setProperty('--animate-duration', '1s');
    btnPlayTimed.classList.add('animate__animated', 'animate__zoomOutDown');
    btnPlayTimed.addEventListener('animationend', () => {
        gameTimer.style.display = 'flex';
        btnPlayTimed.classList.remove('animate__animated', 'animate__zoomOutDown');
        playMusic();
    }, {once: true});

    
    /**
     * hide the game menu and display
     * the game canvas
     */
    displayGame();
    

    /**
     * begin game countdown and start
     * spawning in targets in the target box
     */
    startGame();
}

function endlessGame()
{
    isTimed = false;

    /**
     * animate button down and display the game timer
     * and play the randomly generatd game music
     */
     btnPlayEndless.style.setProperty('--animate-duration', '1s');
     btnPlayEndless.classList.add('animate__animated', 'animate__zoomOutDown');
     btnPlayEndless.addEventListener('animationend', () => {
         btnPlayEndless.classList.remove('animate__animated', 'animate__zoomOutDown');
         playMusic();
     }, {once: true});

    /**
     * hide the game menu and display
     * the game canvas
     */
    displayGame();

    /**
     * begin game countdown and start
     * spawning in targets in the target box
     */
    startGame();
}

function displayGame()
{
    gameMenu.classList.add('animate__animated', 'animate__fadeOut');
    gameMenu.addEventListener('animationend', () => {
        gameMenu.style.display = 'none';
        gameCanvas.style.display = 'flex';
        gameTimer.innerHTML = timer;
        gameMenu.classList.remove('animate__animated', 'animate__fadeOut');
    }, {once: true});
}

function startGame()
{
    try
    {
        timer = 60;
        countdown = 3;

        // add classes to countdown text for fade in left animate.css effect
        countdownText.innerHTML = 3;
        countdownText.style.display = 'flex';
        countdownText.classList.add('animate__animated', 'animate__fadeInLeft');
        countdownText.addEventListener('animationend', () => {
            countdownText.classList.remove('animate__animated', 'animate__fadeInLeft');
        }, {once: true});

        gameInterval = setInterval(function ()
        {
            // Check that countdown has not hit 0
            if(countdown != -2)
            {
                displayCountdown(countdown);

                // Spawn first target right before timer starts
                if (countdown == -1)
                {
                    targetBox.style.display = 'block';
                    spawnTargets();
                }

                countdown--;
            }
            else if(isTimed)
            {
                if(timer == 0)
                {
                    endGame();
                }
                else
                {
                    timer--;
                    gameTimer.innerHTML = timer;

                    // Check if timer is divisible by 10 and that there are only 5 active targets out
                    if((timer % 8 == 0) && (activeTargets <= 5))
                    {
                        spawnTargets();
                    }
                }
            }
            else
            {
                timer++;

                // Check if timer is divisible by 10 and that there are only 5 active targets out
                if((timer % 10 == 0) && (activeTargets <= 6))
                {
                    spawnTargets();
                }
            }

        }, 1000);
    }
    catch(err)
    {
        alert(err);
    }
}

function displayCountdown(seconds)
{
    if(seconds != -1)
    {
        if(seconds == 0)
        {
            countdownText.innerHTML = "GO!";
            countdownText.classList.add('animate__animated', 'animate__bounceOut');
            countdownText.addEventListener('animationend', countdownAnimEnd, false);
        }
        else
        {
            countdownText.innerHTML = seconds;
        }

        seconds--;
    }
}

function countdownAnimEnd() {
    countdownText.style.display = 'none';
    countdownText.classList.remove('animate__animated','animate__bounceOut');
    countdownText.removeEventListener('animationend', countdownAnimEnd, false);
                
}

function createTarget()
{
    try
    {
        var target = document.createElement("BUTTON");
        target.style.setProperty('--animate-duration', targetSpeed);
        target.classList.add('target','animate__animated', 'animate__zoomIn');
        target.innerHTML = '<i class="pulse animate__animated animate__pulse animate__infinite fas fa-dot-circle"></i>';

        // Get random size for target
        var targetSize = ((Math.random() * 115) + 100).toFixed();

        // Get position to spawn target
        var posx = (Math.random() * (window.innerWidth - targetSize)).toFixed();
        var posy = (Math.random() * (window.innerHeight - targetSize)).toFixed();

        // Set width and height of target
        target.style.width = targetSize + "px";
        target.style.height = targetSize + "px";

        // Remove outline from target
        target.style.outline = 'none';

        var bottomBoundary = (window.innerHeight - targetSize) - targetBounds;
        var rightBoundary = (window.innerWidth - targetSize) - targetBounds;

        // Check that position y does not go below bounds
        if(posy <= targetBounds) { posy = targetBounds; }

        // Check that position x does not go below bounds
        if(posx <= targetBounds) { posx = targetBounds }

        // Check that position y is not equal or greater than window height - target size
        if(posy >= bottomBoundary) { posy = bottomBoundary; }

        // Check that position x is not equal or greater than window width - target size
        if(posx >= rightBoundary) { posx = rightBoundary; }

        // Set target location
        target.style.left = posx + "px";
        target.style.top = posy + "px";

        // Set target mouse down event listener
        target.addEventListener('mousedown', function() 
        {
            this.disabled = true;
            target.style.pointerEvents = 'none';
            target.classList.replace('animate__zoomIn', 'animate__zoomOut');
            target.addEventListener('animationend', function() {
                this.parentNode.removeChild(this);
            })

            createTarget();
            updateHitCount();
        });

        // Append target button to game canvas
        targetBox.appendChild(target);
    }
    catch(err)
    {
        alert(err);
    }
}

function endGame()
{
    clearInterval(gameInterval);
    targetBox.style.display = 'none';
    finalHits.innerHTML = 'Hits: ' + hitCount;
    finalMisses.innerHTML = 'Misses: ' + missCount;
    gameScore.style.display = 'flex';
}

function restart()
{
    try
    {
        clearRandomTargets();
        clearInterval(gameInterval);
        gameInterval = null;
        gameTimer.innerHTML = "";
        restartMusic();

        gameMenu.style.display = 'block';
        gameCanvas.style.display = 'none';
        gameScore.style.display = 'none';
    }
    catch(err)
    {
        alert(err);
    }
}

function spawnTargets(amount)
{
    if(amount == undefined || amount == 0) {
        amount = targetsToSpawn;
    }

    while(amount > 0)
    {
        createTarget();
        activeTargets++;
        amount--;
    }
}

function clearRandomTargets()
{
    targetBox.innerHTML = '';
    targetBox.style.display = 'none';
    targetHits.innerHTML = ' 0';
    targetMisses.innerHTML = ' 0';
    hitCount = 0;
    missCount = 0;
    activeTargets = 0;
}

function updateHitCount()
{
    hitCount++;
    targetHits.innerHTML = ' ' + hitCount;
}

function updateMissCount()
{
    missCount++;
    targetMisses.innerHTML = ' ' + missCount;
}

// On window resize restart game
window.onresize = function() 
{
    restart();
};

targetBox.addEventListener('mousedown', function() 
{
    if(event.target.id == 'targetBox')
    {
        updateMissCount();
    }
});

btnPlayTimed.addEventListener('mousedown', timedGame);
btnPlayEndless.addEventListener('mousedown', endlessGame);
btnRestart.addEventListener('mousedown', restart);