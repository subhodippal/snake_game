// game constants and  variable
let inputDir = { x: 0, y: 0 };
const foodEatSound = new Audio('./game_assests/musics/eat1.mp3');
// const turnSound = new Audio('game_assests/musics/turn1.mp3');
const startSound = new Audio('./game_assests/musics/start1.mp3');
const stopSound = new Audio('./game_assests/musics/stop1.mp3');
const gameOverSound = new Audio('./game_assests/musics/game_over1.mp3');
const bgMusicSound = new Audio('./game_assests/musics/bgMusicSound1.mp3');
const acceptInputKeyCode = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const boundaryArea = { min: 0, max: 20 };
const foodPositionBetween = { min: 2, max: 18 };
const about = {
    developed_by: 'Subhodip Pal',
    email: 'subhodip.india@gmail.com',
    made_by: 'Made with ♥ by Subhodip',
    game: 'This is a simple web based snake game, using javascript,html,and css',
};

// --------------------- Console Output--------------------------------
const consoleStyleCyanL = "color: #008b8b; padding: 3rem 0; font-size:3.5rem; text-shadow: 0px 0px 10px #008b8b";
const consoleStyleRedL = "color: #dc143c; padding: 3rem 0; font-size:3.5rem; text-shadow: 0px 0px 10px #dc143c";
const consoleStyleCyanS = "color: #008b8b; padding: .5rem 0; font-size:1rem;";
const consoleStyleRedS = "color: #dc143c; padding: .5rem 0; font-size:1rem;";

console.log(`%c Made with %c♥ %cby Subhodip`, consoleStyleCyanL, consoleStyleRedL, consoleStyleCyanL);

const aboutMe = () => {
    for (const property in about) {
        console.log(`%c${property}: %c${about[property]}`, consoleStyleRedS, consoleStyleCyanS);
    }
};
// ----------------------------- /Console Output ------------------------


let speed = 4;
let lastPaintTime = 0;
let snakeArr = [{ x: 12, y: 15 }];
let score = 0;
let highscore = 0;
let foodPosition = { x: 4, y: 15 };
let previousInputKey = 0;
let gameState = 'initial'; //pause, play, initial, stop, gameover

const supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
gamepad.innerHTML = supportsTouch ? `
    <div class="row">
        <div class="key key-up" data-up> <span data-up>Up</span></div>
        <div class="key key-right" data-right> <span data-right>Right</span></div>
    </div>
    <div class="row">
        <div class="key key-left" data-left> <span data-left>Left</span></div>
        <div class="key key-down" data-down> <span data-down>Down</span></div>
    </div>
    ` : '';
gamepad.style.display = !!supportsTouch ? 'flex' : 'none';


(async () => {
    const highscoreJson = await localStorage.getItem('highscore');
    highscore = !!highscoreJson ? JSON.parse(highscoreJson) : 0;
    highscoreBoard.innerHTML = 'HighScore: ' + highscore;
})();

document.querySelector('#modal p').innerText = about.made_by;


// @$u6h0d!p ------------------------------------------- 
// game function and method
const resetGame = () => {
    modal.style.display = 'none';
    document.querySelector('#modal p').innerText = '';
    gameOverSound.pause();
    gameOverSound.currentTime = 0;
    // inputDir = { x: 0, y: 0 };
    // snakeArr = [{ x: 12, y: 15 }];
    score = 0;
    speed = 4;
    initial_dialouge.style.display = "block";
    manageScoreBoard('reset');
    gameState = 'initial';
};

const manageScoreBoard = (status) => {
    if (status === 'reset') {
        score = 0;
        currentScoreBoard.innerHTML = 'Score: 0';
        return;
    }
    score += status;
    highscore = (score > highscore) ? score : highscore;
    currentScoreBoard.innerHTML = 'Score: ' + score;
    highscoreBoard.innerHTML = 'HighScore: ' + highscore;
};

const isColide = (snake) => {
    // body colide
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            return true;
        }
    }

    // wall colide
    if (snake[0].x <= boundaryArea.min || snake[0].y <= boundaryArea.min || snake[0].x > boundaryArea.max || snake[0].y > boundaryArea.max) {
        return true;
    }
    return false;
};

const getRandomeFoodPosition = (position = foodPositionBetween) => {
    const x = Math.floor(Math.random() * (position.max - position.min)) + position.min;
    const y = Math.floor(Math.random() * (position.max - position.min)) + position.min;

    return { x, y };
};

const gameoverHandler = async () => {
    bgMusicSound.pause();
    bgMusicSound.currentTime = 0;
    stopSound.play();
    inputDir = { x: 0, y: 0 };
    snakeArr = [{ x: 12, y: 15 }];
    gameState = 'gameover';
    gameOverSound.play();
    gameOverSound.loop = true;
    modal.style.display = 'block';
    document.querySelector('#modal h4').innerText = `Your score is: ${score}`;

    // updatehighscore
    await localStorage.setItem('highscore', JSON.stringify(highscore));
};

const eatingFood = () => {
    // if food eaten then increase snake length, respawn new food, increment score
    if (snakeArr[0].x === foodPosition.x && snakeArr[0].y === foodPosition.y) {
        // food eat
        foodEatSound.play();
        snakeArr.push({
            x: (snakeArr[0].x + inputDir.x),
            y: (snakeArr[0].y + inputDir.y)
        });
        manageScoreBoard(+1);
        // add new food
        foodPosition = getRandomeFoodPosition();
        manageLevel();
    }
};

const moveSnake = () => {
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;
};

const displaySnake = () => {
    // display the snake
    board.innerHTML = "";
    snakeArr.forEach((e, i) => {
        let sankeElement = document.createElement('div');
        sankeElement.style.gridRowStart = e.x;
        sankeElement.style.gridColumnStart = e.y;
        if (i === 0) {
            // head
            sankeElement.classList.add('s_head');
        } else if (i == (snakeArr.length - 1)) {
            // tail
            sankeElement.classList.add('s_tail');
        } else {
            sankeElement.classList.add('s_body');
        }

        board.appendChild(sankeElement);
    });
};

const displayFood = () => {
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = foodPosition.x;
    foodElement.style.gridColumnStart = foodPosition.y;
    foodElement.classList.add('food_good');
    board.appendChild(foodElement);
};

const manageLevel = () => {
    if (score >= 10 && score < 20)
        speed = 5;
    else if (score >= 20 && score < 30)
        speed = 6;
    else if (score >= 30 && score < 40)
        speed = 7;
    else if (score >= 40 && score < 50)
        speed = 8;
    else if (score >= 50 && score < 60)
        speed = 9;
    else if (score >= 60 && score < 70)
        speed = 10;
    else if (score >= 70 && score < 80)
        speed = 12;
    else if (score >= 80 && score < 90)
        speed = 14;
    else if (score >= 90 && score < 100)
        speed = 16;
    // else speed = 20;
};


// Main Game Engine
const gameEngine = () => {
    // updateing the snake array and food!
    if (isColide(snakeArr)) {
        gameoverHandler();
    }

    // display the snake
    displaySnake();

    // display the food
    displayFood();

    // if sneke eating food
    eatingFood();

    // move snaek
    moveSnake();
};

// game loop 
const main = (ctime) => {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
};

const isOppositeDirrection = (inputKey) => {
    if (inputKey === 'ArrowUp' && (inputDir.y < 0 || inputDir.y > 0))
        return true;
    else if (inputKey === 'ArrowDown' && (inputDir.y < 0 || inputDir.y > 0))
        return true;
    else if (inputKey === 'ArrowLeft' && (inputDir.x < 0 || inputDir.x > 0))
        return true;
    else if (inputKey === 'ArrowRight' && (inputDir.x < 0 || inputDir.x > 0))
        return true;
    else if (inputDir.y === 0 && inputDir.x === 0)
        return true;
    else return false;
    // return true;
};

// User input handler
const keyInputHandler = (key) => {
    if (gameState === 'initial') {
        gameState = 'start'; // start the game
        initial_dialouge.style.display = "none";
        startSound.play();
        bgMusicSound.play();
        bgMusicSound.loop = true;
    }

    if (isOppositeDirrection(key)) {
        // turnSound.play();
        switch (key) {
            case "ArrowUp":
                inputDir = { x: -1, y: 0 };
                break;

            case "ArrowDown":
                inputDir = { x: 1, y: 0 };
                break;

            case "ArrowLeft":
                inputDir = { x: 0, y: -1 };
                break;

            case "ArrowRight":
                inputDir = { x: 0, y: 1 };
                break;
        }
    }
};

// Event Listners
window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    acceptInputKeyCode.includes(e.key) && keyInputHandler(e.key);
});
gamepad.addEventListener('click', (e) => {
    if (e.target.dataset.up != undefined) keyInputHandler('ArrowUp');
    else if (e.target.dataset.down != undefined) keyInputHandler('ArrowDown');
    else if (e.target.dataset.left != undefined) keyInputHandler('ArrowLeft');
    else if (e.target.dataset.right != undefined) keyInputHandler('ArrowRight');
});
// @$u6h0d!p -------------------------------------------
