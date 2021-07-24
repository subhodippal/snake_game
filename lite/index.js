// game constants and  variable
let inputDir = { x: 0, y: 0 };
const basePath = '../game_assests/musics/';

const foodEatSound = new Audio(`${basePath}eat1.mp3`);
// const turnSound = new Audio('game_assests/musics/turn1.mp3');
const startSound = new Audio(`${basePath}start2.mp3`);
const stopSound = new Audio(`${basePath}stop1.mp3`);
const gameOverSound = new Audio(`${basePath}game_over1.mp3`);
const bgMusicSound = new Audio(`${basePath}bgMusicSound1.mp3`);
const acceptInputKeyCode = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const boundaryArea = { min: 0, max: 20 };
const foodPositionBetween = { min: 2, max: 18 };
const about = {
    developed_by: 'Subhodip Pal',
    email: 'subhodip.india@gmail.com',
    made_by: 'Made With ♥ by Subhodip Pal',
    game: 'This is a simple web based snake game, using javascript,html,and css'
};

console.log(about.made_by);

let speed = 4;
let lastPaintTime = 0;
let snakeArr = [{ x: 12, y: 15 }];
let score = 0;
let highscore = 0;
let foodPosition = { x: 5, y: 2 };
let previousInputKey = 0;

let gameState = 'initial'; //pause, play, initial, stop, gameover

(async () => {
    const highscoreJson = await localStorage.getItem('highscore');
    highscore = !!highscoreJson ? JSON.parse(highscoreJson) : 0;
    highscoreBoard.innerHTML = 'HighScore: ' + highscore;
})();


// @$u6h0d!p ------------------------------------------- 
// game function and method
const resetGame = () => {
    inputDir = { x: 0, y: 0 };
    snakeArr = [{ x: 12, y: 15 }];
    score = 0;

    manageScoreBoard('reset');
    gameState = 'initial';
}

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
}

const showGameoverPopup = () => {
    alert('Game Over. press any key to play again!');
}

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
    stopSound.play();
    // setTimeout(() => {
    gameState = 'gameover';
    gameOverSound.play();
    showGameoverPopup();
    // updatehighscore
    await localStorage.setItem('highscore', JSON.stringify(highscore));
    // setHighScore();
    // wait for alert ok 
    resetGame();
    gameOverSound.pause();
    // }, 100);
}

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
    }
}

const moveSnake = () => {
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;
}
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
            sankeElement.classList.add('s_tail');
        } else {
            sankeElement.classList.add('s_body');
        }

        board.appendChild(sankeElement);
    });
}
const displayFood = () => {
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = foodPosition.x;
    foodElement.style.gridColumnStart = foodPosition.y;
    foodElement.classList.add('food_good');
    board.appendChild(foodElement);
}

const manageLevel = () => {
    console.log('Upcomming Features| this is in development mode');
    // if (score > 5) {
    //     console.log('score > 5   : speed', speed);
    //     ++speed
    // } else {
    //     console.log('score < 5  : speed', speed);
    // }
}


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

    // manage snake speeed
    // manageLevel();
}

// game loop 
const main = (ctime) => {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

// User input handler
const keyInputHandler = (e) => {

    // if (acceptInputKeyCode.includes(e.keyCode) && e.keyCode != previousInputKey) {

    previousInputKey = e.key; // prevent duplicate input for same key

    if (gameState === 'initial') {
        gameState = 'start'; // start the game
        startSound.play();
        setTimeout(() => bgMusicSound.play(), 1000);
    }
    // turnSound.play();

    switch (e) {
        case "ArrowUp":
            inputDir = inputDir.x > 0 ? { ...inputDir } : { x: -1, y: 0 };
            // inputDir = { x: -1, y: 0 };
            break;

        case "ArrowDown":
            inputDir = inputDir.x < 0 ? { ...inputDir } : { x: 1, y: 0 };
            // inputDir = { x: 1, y: 0 };
            break;

        case "ArrowLeft":
            inputDir = inputDir.y > 0 ? { ...inputDir } : { x: 0, y: -1 };
            // inputDir = { x: 0, y: -1 };
            break;

        case "ArrowRight":
            inputDir = inputDir.y < 0 ? { ...inputDir } : { x: 0, y: 1 };
            // inputDir = { x: 0, y: 1 };
            break;
    }
}

// Listner
window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    acceptInputKeyCode.includes(e.key) && keyInputHandler(e.key);
});
// @$u6h0d!p -------------------------------------------
