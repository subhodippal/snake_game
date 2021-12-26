// game constants and  variable
const foodEatSound = new Audio('../game_assests/musics/eat1.mp3');
const startSound = new Audio('../game_assests/musics/start1.mp3');
const stopSound = new Audio('../game_assests/musics/stop1.mp3');
const acceptInputKeyCode = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const boundaryArea = { min: 0, max: 20 };
const foodPositionBetween = { min: 2, max: 18 };

let inputDir = { x: 0, y: 0 };
let speed = 4;
let lastPaintTime = 0;
let snakeArr = [{ x: 12, y: 15 }];
let score = 0;
let highscore = 0;
let foodPosition = { x: 4, y: 15 };
let gameState = 'initial'; //pause, play, initial, stop, gameover

// ---------- About Me Section-------------
const about = {
    developed_by: 'Subhodip Pal',
    email: 'subhodip.india@gmail.com',
    made_by: 'Made with ♥ by Subhodip',
    game: 'This is a simple web based snake game, using javascript,html,and css',
};
const consoleStyleCyanS = "color: #008b8b; padding: .5rem 0; font-size:1rem;";
const consoleStyleRedS = "color: #dc143c; padding: .5rem 0; font-size:1rem;";
console.log(`%c Made with %c♥ %cby Subhodip`, consoleStyleCyanS, consoleStyleRedS, consoleStyleCyanS);
// ----------------------------- /About Me Section ------------------------

(async () => {
    const highscoreJson = await localStorage.getItem('highscore_lite');
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

const showGameoverPopup = () => {
    alert('Game Over. press any key to play again!');
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
    stopSound.play();
    gameState = 'gameover';
    showGameoverPopup();
    await localStorage.setItem('highscore_lite', JSON.stringify(highscore));
    resetGame();
};

const eatingFood = () => {
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


// Main Game Engine
const gameEngine = () => {
    // updateing the snake array and food!
    if (isColide(snakeArr)) gameoverHandler();
    displaySnake();
    displayFood();
    eatingFood();
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


// User input handler
const keyInputHandler = (key) => {
    // if (gameState === 'initial') {
    //     gameState = 'start'; // start the game
    //     startSound.play();
    // }

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

    // switch (key) {
    //     case "ArrowUp":
    //         inputDir = inputDir.x > 0 ? { ...inputDir } : { x: -1, y: 0 };
    //         break;

    //     case "ArrowDown":
    //         inputDir = inputDir.x < 0 ? { ...inputDir } : { x: 1, y: 0 };
    //         break;

    //     case "ArrowLeft":
    //         inputDir = inputDir.y > 0 ? { ...inputDir } : { x: 0, y: -1 };
    //         break;

    //     case "ArrowRight":
    //         inputDir = inputDir.y < 0 ? { ...inputDir } : { x: 0, y: 1 };
    //         break;
    // }
};

const gotoLink = (endpoint) => {
    const host = window.location.origin;
    const url = `${host}/${endpoint}`;
    window.location.href = url;
}


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

links.addEventListener('click', (e) => {
    if (e.target.dataset.lite != undefined) gotoLink('lite');
    else if (e.target.dataset.normal != undefined) gotoLink('');
    else if (e.target.dataset.advance != undefined) gotoLink('advance');
});
// @$u6h0d!p -------------------------------------------
