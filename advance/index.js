// game constants and  variable
let inputDir = { x: 0, y: 0 };
const foodEatSound = new Audio('../game_assests/musics/eat1.mp3');
// const turnSound = new Audio('game_assests/musics/turn1.mp3');
const startSound = new Audio('../game_assests/musics/start1.mp3');
const stopSound = new Audio('../game_assests/musics/stop1.mp3');
const gameOverSound = new Audio('../game_assests/musics/game_over1.mp3');
const bgMusicSound = new Audio('../game_assests/musics/bgMusicSound1.mp3');
const acceptInputKeyCode = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const boundaryArea = { min: 0, max: 20 };
const foodPositionBetween = { min: 2, max: 18 };

// foods 
const FOOD = '🍓';
const FOOD_speed = '🚴';
const FOOD_slow = '🐢';
const FOOD_poison = '🦠';
const FOOD_stop = '🚦';
const FOOD_reverse = '⌚';
let SNAKE_HEAD = '';
const FOOD_alienFace = '👽';
const FOOD_skullFace = '💀';
const FOOD_monsterFace = '👹';
const FOOD_angryFace = '👿';
const FOOD_tigerFace = '🐯';
const FOOD_frogFace = '🐸';
const FOOD_cowFace = '🐮';
const FOOD_pandaFace = '🐼';
const FOOD_invisible = '🕶';
const FOOD_music = '🔊';

let prevKey = null;
let speed = 4;
let lastTime = 0;
let lastPaintTime = 0;
let moveSnakeTimeThrottle = 100;
let moveSnakeTimeDelay = 100;
let snakeArr = [{ x: 12, y: 15, d: 'L' }]; // LRTB
let score = 0;
let highscore = 0;
let foodPosition = { x: 4, y: 15 };
let magicalFoodPosition = { x: 1, y: 1 };
let previousInputKey = 0;
let life = 0;
let magicalEffectTime = 15;
let magicalEffectDelayTime = 20;
let randomMagialFoodIntervalTime = 4;
let randomNormalFoodIntervalTime = 5;
let slowModeIncreaseLimit = 2;
let speedModeIncreaseLimit = 2;
let magicalMode = '🚦';
let showMagicalFood = false;
let randomeMoveMagicalFood = false;
let startMagicalFood = false;
let randomeMoveNormalFood = false;
let isEnableSnakeMove = true;
let isEnableGamepad = true;
let isSnakeBodyVisible = true;
// let magicalFoodElement;


//-------------- Derveloper Credit & Console Output 
const about = {
    developed_by: 'Subhodip Pal',
    email: 'subhodip.india@gmail.com',
    made_by: 'Made with ♥ by Subhodip',
    game: 'This is a simple web based snake game, using javascript,html,and css',
};
const consoleStyleCyanL = "color: #008b8b; padding: 1rem 0; font-size:1.5rem; text-shadow: 0px 0px 10px #008b8b";
const consoleStyleRedL = "color: #dc143c; padding: 1rem 0; font-size:1.5rem; text-shadow: 0px 0px 10px #dc143c";
const consoleStyleCyanS = "color: #008b8b; padding: .5rem 0; font-size:1rem;";
const consoleStyleRedS = "color: #dc143c; padding: .5rem 0; font-size:1rem;";
console.log(`%c Made with %c♥ %cby Subhodip`, consoleStyleCyanL, consoleStyleRedL, consoleStyleCyanL);
const aboutMe = () => {
    for (const property in about) {
        console.log(`%c${property}: %c${about[property]}`, consoleStyleRedS, consoleStyleCyanS);
    }
};
// ----------------------------- /Console Output ------------------------



let state = {
    level: 0,
    gameState: 'initial',
}

let prevState = {
    speed: 0,
    life: 0,
    // score
}

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
    const highscoreJson = await localStorage.getItem('highscore_advance');
    highscore = !!highscoreJson ? JSON.parse(highscoreJson) : 0;
    highscoreBoard.innerHTML = 'HighScore: ' + highscore;
})();

document.querySelector('#modal p').innerText = about.made_by;

// (() => {
//     let origin = window.location.origin;
//     let href = window.location.href;
//     let x = href.split(origin);
//     let endPoint = x[1];
//     if (endPoint=== endPoint.match(/lite/g)) {
//         // snake_version.innerHTML = 'Snake Lite';
//         // document.querySelector('.links .lite').style.color = '#223000';
//     } else if (endPoint=== endPoint.match(/beta/g)) {
//         // snake_version.innerHTML = 'Snake Beta';
//         // document.querySelector('.links .lite').style.color = '#223000';
//     } else {
//         // snake_version.innerHTML = 'Snake Stable';
//         // document.querySelector('.links .stable').style.color = '#223000';
//     }
// })();

// @$u6h0d!p ------------------------------------------- 
// game function and method
const resetGame = () => {
    modal.style.display = 'none';
    document.querySelector('#modal p').innerText = '';
    gameOverSound.pause();
    gameOverSound.currentTime = 0;
    magicalFoodPosition = { x: 0, y: 0 };
    // inputDir = { x: 0, y: 0 };
    // snakeArr = [{ x: 12, y: 15 }];
    score = 0;
    speed = 4;
    initialDialouge.style.display = "block";
    manageScoreBoard('reset');
    startMagicalFood = false;
    showMagicalFood = false;
    randomeMoveMagicalFood = false;
    randomeMoveNormalFood = false;
    state.gameState = 'initial';
    SNAKE_HEAD = '';
    gameLevel.innerHTML = 'Snake Pro';

    isEnableSnakeMove = true;
    isEnableGamepad = true;
    gameMode.innerHTML = '';
    gameMode.classList.remove("contentvisible");
    gameMode.classList.add("contenthidden"); 
    prevKey = null;
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

const updateMagicalModeList = () => {
    magicalModeList = ['slow', 'speed', 'alienFace', 'monsterFace', 'tigerFace', 'frogFace', 'pandaFace'];
}

const manageMagicalFood = () => {
    // Upcomming features
    /**
     * # special foods
     * 1. Slow move / fast move , no point
     * 2. poisonus apple food || > life decrease, no point, 
     * 3. surprise treasure hunt || randome value point (50-100)
     * 4. presious stones || gold,diamond,lapiz lazuli,silver,pearl (change the color of snake body)
     * 5. megneteto || collect nereast foods, and attactact to wall
     * 6. distract || not hit in wall and not catch any food
     * 7. red apple increase life
     * 8. Blind mode | 🕶 👓
     * faces:  😎🤑😛😜😇😌🤖👽👻💀👹👿😺👩👨🎅🐯🦁🐮🐷🐸🐵🐶🐱🐭🐹🐰🐻🐼🐨🐗
     * food type 1: 🕷🐞🐌🐢🐜🦀🐟🐡🐠🍄
     * food type 2: 🍐🍏🍎🍊🍋🍉🍇🍓🍈🍒🍍🍅🍆🌶🌽🍔🍕🍥🍨🍦🍰🎂🍮🍬🍭🍫🍩🍺☕🍼🍭🦠 
     * extra type: 🚴🏆🎖🕴👾🏍🚀🚦⛽🏠🏰⌚🕹⏳💎💰⚙❤🚫⏸▶👑💧🔥🔇🔊🍀     🔊 👓 🕶
     * 
     * extras: 🌵 🔦📎〰➖◽◻ 🔲  
     * 
     * FOOD_faces: ['😎','🤑','😛','😇','🤖','👽','💀','👹','👿','🎅','🐯','🦁','🐮','🐷','🐸','🐵','🐶','🐱','🐭','🐹','🐰','🐻','🐼','🐨','🐗'];
     * FOOD_music_play: ▶
     * FOOD_music_pause: ⏸
     * FOOD_mute: 🔇
     * FOOD_unmute: 🔊
     * FOOD_speed: '🚴'; 
     * 
     * FOOD_slow: '🐢';
     * FOOD_poison: '🍄'
     * FOOD_medicine:
     * FOOD_magnet:
     * FOOD_distract:
     * FOOD_blind: 
     * FOOD_glass:👓
     * FOOD_treasure: //by eat treasure get multiple food spread for 10 second need to eat all
     * FOOD_fire: 🔥
     * FOOD_water: 💧
     * FOOD_stone_blue: 💎

     * FOOD_stop: 🚦
     * FOOD_disable_controller: 🕹
     */

    magicalModeList = ['slow', 'speed'];
    const rndInt = Math.floor(Math.random() * magicalModeList.length)
    magicalMode = magicalModeList[rndInt];
    updateMagicalModeList();

    // ['BackgroundMusicpaush']
    // make a food Music play/pause
}
manageMagicalFood();




const setMegicalEffect = () => {
    prevState.life = life;
    prevState.speed = speed;
}
const resetMegicalEffect = () => {
    life = prevState.life;
    speed = prevState.speed;
    isEnableSnakeMove = true;
    isEnableGamepad = true;
    gameMode.innerHTML = '';
    gameMode.classList.remove("contentvisible");
    gameMode.classList.add("contenthidden"); 
    isSnakeBodyVisible  = true;
}

const timeDelay = (fn, time = magicalEffectTime) => setTimeout(() => {fn()}, 1000 * time);

const speedMode = () => {
    speed = speed + speedModeIncreaseLimit;
    showGameMode('Speed Mode!');
}
const slowMode = () => {
    speed = speed - slowModeIncreaseLimit;
    showGameMode('Slow Mode!');
}
const poisonMode = () => {
    const half_length = Math.ceil(snakeArr.length / 2);
    snakeArr = snakeArr.splice(0,half_length);
    showGameMode('Half Life!');
}
const stopMode = () => {
    isEnableGamepad = false;
    isEnableSnakeMove = false;
    showGameMode('Stop!');
}
const invisibleMode = () => {
    isSnakeBodyVisible=false;
    showGameMode('Invisible Mode!');
}
const musicMode = () => {
    if (bgMusicSound.paused) {
        bgMusicSound.play();
        showGameMode('Music Playing!');
    } else {
        bgMusicSound.pause();
        showGameMode('Music Paused!');
    }

}
const reverseMode = () => {
    showGameMode('Reverse Mode');
    snakeArr.reverse();
    let direction = snakeArr[0].d;
    if(direction==='U')  {
        inputDir = { x: 1, y: 0 };
    } else if (direction==='D') {
        inputDir = { x: -1, y: 0 };
    } else if (direction==='L') {
        inputDir = { x: 0, y: 1 };
    } else if (direction==='R') {
        inputDir = { x: 0, y: -1 };
    }
    
}


const setRandomMagicalFood = () => {
    const rndInt = Math.floor(Math.random() * magicalModeList.length);
    magicalMode = magicalModeList[rndInt];
}

const showGameMode = (gameModeName = '') => {
    gameMode.classList.remove("contenthidden");
    gameMode.classList.add("contentvisible");
    gameMode.innerHTML = gameModeName;
    setTimeout(() => {
        gameMode.classList.remove("contentvisible");
        gameMode.classList.add("contenthidden");
        gameMode.innerHTML = '';
    }, 3000);
}

const eatMagicalFood = (type=magicalMode) => {
    if (showMagicalFood) {
        if (snakeArr[0].x === magicalFoodPosition.x && snakeArr[0].y === magicalFoodPosition.y) {
            foodEatSound.play();
            moveSnake();
            showMagicalFood = false;
            // magicalFoodPosition = {x: -100, y: -100};
            // const rndInt = Math.floor(Math.random() * magicalModeList.length)
            // magicalMode = magicalModeList[rndInt];
            setRandomMagicalFood();
            timeDelay(setMagicalFood, magicalEffectDelayTime);
            setMegicalEffect();

            if(type==='speed') {
                speedMode();
            } else if (type==='slow') {
                slowMode();
            } else if (type==='poison') {
                poisonMode();
            } else if (type==='invisible') {
                invisibleMode();
            } else if (type==='music') {
                musicMode();
            } else if (type.match(/Face/g)) {
                SNAKE_HEAD = eval(`FOOD_${type}`);
                console.log('SNAKE_HEAD : ', SNAKE_HEAD);
                let faceName = type.split('Face')[0];
                showGameMode(`${faceName} Face`);
            } else if (type==='stop') {
                stopMode();
            } else if (type==='reverse') {
                reverseMode();
            }
            timeDelay(resetMegicalEffect);
        } 
    }
}

const startAutoHideMagicalFood = (status) => {
    if (startMagicalFood) {
        setRandomMagicalFood();
        const position = foodPositionBetween;
        const x = Math.floor(Math.random() * (position.max - position.min)) + position.min;
        const y = Math.floor(Math.random() * (position.max - position.min)) + position.min;
        magicalFoodPosition = { x, y };
        timeDelay(() => {showMagicalFood = !status; startAutoHideMagicalFood(!status)}, magicalEffectTime);
    }
        
}

const setMagicalFood = (position = foodPositionBetween) => {
    startMagicalFood = true;
    showMagicalFood = true;
    startAutoHideMagicalFood(true);
    if (!randomeMoveMagicalFood) {
        const x = Math.floor(Math.random() * (position.max - position.min)) + position.min;
        const y = Math.floor(Math.random() * (position.max - position.min)) + position.min;
        magicalFoodPosition = { x, y };
    }
}
// let itimeIterval = setInterval((position = foodPositionBetween) => {
//     if (showMagicalFood && randomeMoveMagicalFood) {
//         setRandomMagicalFood();
//         const x = Math.floor(Math.random() * (position.max - position.min)) + position.min;
//         const y = Math.floor(Math.random() * (position.max - position.min)) + position.min;
//         magicalFoodPosition = { x, y };
//     }
// }, randomMagialFoodIntervalTime*1000);

// let ntimeIterval = setInterval((position = foodPositionBetween) => {
//     if (randomeMoveNormalFood) {
//         const x = Math.floor(Math.random() * (position.max - position.min)) + position.min;
//         const y = Math.floor(Math.random() * (position.max - position.min)) + position.min;
//         foodPosition = { x, y };
//     }
// }, randomNormalFoodIntervalTime*1000);

const crazyRandomMoveNormalFood = (position = foodPositionBetween) => {
    if (randomeMoveNormalFood) {
        const x = Math.floor(Math.random() * (position.max - position.min)) + position.min;
        const y = Math.floor(Math.random() * (position.max - position.min)) + position.min;
        foodPosition = { x, y };
    }
    timeDelay(crazyRandomMoveNormalFood, randomNormalFoodIntervalTime);
};crazyRandomMoveNormalFood();

const crazyRandomMoveMagicalFood = (position = foodPositionBetween) => {
    if (showMagicalFood && randomeMoveMagicalFood) {
        setRandomMagicalFood();
        const x = Math.floor(Math.random() * (position.max - position.min)) + position.min;
        const y = Math.floor(Math.random() * (position.max - position.min)) + position.min;
        magicalFoodPosition = { x, y };
    }
    timeDelay(crazyRandomMoveMagicalFood, randomMagialFoodIntervalTime);
};crazyRandomMoveMagicalFood();




const manageSnakeLife = () => {
    // Snake Life

    /**
     * increase / decrease life
     */
}

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
    state.gameState = 'gameover';
    gameOverSound.play();
    gameOverSound.loop = true;
    modal.style.display = 'block';
    document.querySelector('#modal h4').innerText = `Your score is: ${score}`;

    // updatehighscore
    await localStorage.setItem('highscore_advance', JSON.stringify(highscore));
};

const eatFood = () => {
    // if food eaten then increase snake length, respawn new food, increment score
    if (snakeArr[0].x === foodPosition.x && snakeArr[0].y === foodPosition.y) {
        // food eat
        foodEatSound.play();
        snakeArr.push({
            x: (snakeArr[0].x + inputDir.x),
            y: (snakeArr[0].y + inputDir.y)
        });
        moveSnake();
        manageScoreBoard(+1);
        // add new food
        foodPosition = getRandomeFoodPosition();
        manageLevel();
        if (score === 3) setMagicalFood();
        // if (score === 10) randomeMoveMagicalFood = true;
        // if (score === 20) randomeMoveNormalFood = true;
        if (score === 5) {
            magicalModeList = ['slow', 'speed', 'alienFace', 'tigerFace'];
            randomeMoveMagicalFood = true;
            magicalEffectTime = 20;
            magicalEffectDelayTime = 25;
            randomMagialFoodIntervalTime = 6;
            // randomNormalFoodIntervalTime = 5;
            slowModeIncreaseLimit = 2;
            speedModeIncreaseLimit = 2;
        }
        if (score === 10) {
            magicalModeList = ['slow', 'speed', 'invisible', 'reverse', 'music', 'monsterFace', 'pandaFace'];
            randomeMoveNormalFood = true;
            magicalEffectTime = 15;
            magicalEffectDelayTime = 20;
            randomMagialFoodIntervalTime = 5;
            randomNormalFoodIntervalTime = 6;
            slowModeIncreaseLimit = 3;
            speedModeIncreaseLimit = 3;
        }
        if (score === 20) {
            magicalModeList = ['slow', 'speed', 'reverse', 'invisible', 'alienFace', 'music', 'monsterFace', 'tigerFace'];
            magicalEffectTime = 10;
            magicalEffectDelayTime = 15;
            randomMagialFoodIntervalTime = 4;
            randomNormalFoodIntervalTime = 5;
            slowModeIncreaseLimit = 4;
            speedModeIncreaseLimit = 4;
        }
        if (score === 40) {
            magicalModeList = ['slow', 'speed', 'reverse', 'poison', 'invisible', 'monsterFace', 'music', 'tigerFace', 'frogFace', 'pandaFace'];
            magicalEffectTime = 10;
            magicalEffectDelayTime = 10;
            randomMagialFoodIntervalTime = 2;
            randomNormalFoodIntervalTime = 2;
            slowModeIncreaseLimit = 5;
            speedModeIncreaseLimit = 5;
        }

    }
};

const getDirection = (inputDir) => {
    if (inputDir.x === 0 && inputDir.y === -1) return 'L';  // Left
    else if (inputDir.x === 0 && inputDir.y === 1) return 'R'; // Right
    else if (inputDir.x === 1 && inputDir.y === 0) return 'D'; // down
    else return 'U'; //up
}

const moveSnake = () => {
    if (isEnableSnakeMove) {
        for (let i = snakeArr.length - 2; i >= 0; i--) {
            snakeArr[i + 1] = { ...snakeArr[i] };
        }
        const direction = getDirection(inputDir);
        snakeArr[0].x += inputDir.x;
        snakeArr[0].y += inputDir.y;
        snakeArr[0].d = direction;
    }
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
            // sankeElement.classList.add('s_head');
            sankeElement.classList.add('s_head');

            
            sankeElement.innerHTML = SNAKE_HEAD;
            // sankeElement.innerHTML = '';
            profileFace.innerHTML = SNAKE_HEAD || '🐍';
            const direction = getDirection(inputDir);
            if(direction ==='L') sankeElement.classList.add('r-l');
            if(direction ==='R') sankeElement.classList.add('r-r');
            if(direction ==='D') sankeElement.classList.add('r-d');
            if(direction ==='U') sankeElement.classList.add('r-u');
        } else if (i == (snakeArr.length - 1)) {
            // tail
            sankeElement.classList.add('s_tail');
            
            // sankeElement.innerHTML = '👹';
            // if(e.d ==='L') sankeElement.classList.add('r-l');
            // if(e.d ==='R') sankeElement.classList.add('r-r');
            // if(e.d ==='D') sankeElement.classList.add('r-d');
            // if(e.d ==='U') sankeElement.classList.add('r-u');
        } else {
            if (isSnakeBodyVisible) {
                sankeElement.classList.add('s_body');
            }
            // sankeElement.classList.add('s_body');
            // sankeElement.innerHTML = '👹';
            // if(e.d ==='L') sankeElement.classList.add('r-l');
            // if(e.d ==='R') sankeElement.classList.add('r-r');
            // if(e.d ==='D') sankeElement.classList.add('r-d');
            // if(e.d ==='U') sankeElement.classList.add('r-u');
        }

        board.appendChild(sankeElement);
    });
};

const displayFood = () => {
    let foodElement = document.createElement('div');
    foodElement.innerHTML = FOOD;
    foodElement.style.gridRowStart = foodPosition.x;
    foodElement.style.gridColumnStart = foodPosition.y;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
};

const displayMagicalFood = () => {
    let magicalFoodElement = null;
    if (showMagicalFood) {
        magicalFoodElement = document.createElement('div');
        magicalFoodElement.innerHTML = eval(`FOOD_${magicalMode}`);
        magicalFoodElement.style.gridRowStart = magicalFoodPosition.x;
        magicalFoodElement.style.gridColumnStart = magicalFoodPosition.y;
        magicalFoodElement.classList.add('magical_food');
        board.appendChild(magicalFoodElement);
    } else {
        !!magicalFoodElement && board.removeChild(magicalFoodElement);
    }
    
}

const manageLevel = () => {
    gameLevel.innerHTML = 'Level 1';
    if (score >= 10 && score < 20) {
        state.level = 1;
        speed = 5;
        life = ++life;
        gameLevel.innerHTML = 'Level 2';
    } else if (score >= 20 && score < 30) {
        state.level = 2;
        speed = 6;
        life = ++life;
        gameLevel.innerHTML = 'Level 3';
    } else if (score >= 30 && score < 40) {
        state.level = 3,
        speed = 7;
        life = ++life;
        gameLevel.innerHTML = 'Level 4';
    } else if (score >= 40 && score < 50) {
        state.level = 4,
        speed = 8;
        life = ++life;
        gameLevel.innerHTML = 'Level 5';
    } else if (score >= 50 && score < 60) {
        state.level = 5,
        speed = 9;
        life = ++life;
        gameLevel.innerHTML = 'Level 6';
    } else if (score >= 60 && score < 70) {
        state.level = 6,
        speed = 10;
        life = ++life;
        gameLevel.innerHTML = 'Level 7';
    } else if (score >= 70 && score < 80) {
        state.level = 7,
        speed = 11;
        life = ++life;
        gameLevel.innerHTML = 'Level 8';
    } else if (score >= 80 && score < 90) {
        state.level = 8,
        speed = 12;
        life = ++life;
        gameLevel.innerHTML = 'Level 9';
    } else if (score >= 90) {
        state.level = 9,
        speed = 14;
        life = ++life;
        gameLevel.innerHTML = 'Level 10';
    }
};


//-- Manage Snake Speed
const calculateSnakeMovementSpeedTime = () => {
    if (speed === 1) return 1000;
    if (speed === 2) return 850;
    if (speed === 3) return 750;
    if (speed === 4) return 600;
    if (speed === 5) return 450;
    if (speed === 6) return 300;
    if (speed === 7) return 200;
    if (speed === 8) return 150;
    if (speed === 9) return 100;
    if (speed === 10) return 50;
}

//--- Throttle fucntion for manage the snake movement speed along with render speed
const moveSnakeRender = () => {
    const now = new Date();
    if (now - lastTime >= calculateSnakeMovementSpeedTime()) {
        moveSnake();
        lastTime = now;
    }
}

// Main Game Engine
const gameEngine = () => {
    // updateing the snake array and food!
    if (isColide(snakeArr)) {
        gameoverHandler();
    }

    // eat magical Food
    eatMagicalFood();

    // display the snake
    displaySnake();

    // display the food
    displayFood();

    // display the magical food
    displayMagicalFood();

    // if sneke eating food
    eatFood();

    // move snaek
    moveSnakeRender();
};

// game loop 
const main = (ctime) => {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / 100) {
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
    prevKey = key;
    if (isEnableGamepad) {
        if (state.gameState === 'initial') {
            state.gameState = 'start'; // start the game
            initialDialouge.style.display = "none";
            startSound.play();
            bgMusicSound.play();
            bgMusicSound.loop = true;
        }
    
        if (isOppositeDirrection(key)) {
            // turnSound.play();
            switch (key) {
                case "ArrowUp":
                    inputDir = { x: -1, y: 0 };
                    moveSnake();
                    break;
    
                case "ArrowDown":
                    inputDir = { x: 1, y: 0 };
                    moveSnake();
                    break;
    
                case "ArrowLeft":
                    inputDir = { x: 0, y: -1 };
                    moveSnake();
                    break;
    
                case "ArrowRight":
                    inputDir = { x: 0, y: 1 };
                    moveSnake();
                    break;
            }
        }
    }
    
};

const gotoLink = (endpoint) => {
    const origin = window.location.origin;
    const url = `${origin}/${endpoint}`;
    window.location.href = url;
}

let t2LastTime = 0;
const throttle2 = (fn, e, t) => {
    const now = new Date();
    if (now - t2LastTime >= t) {
        fn(e);
        t2LastTime = now;
    }
}

const delay2 = (fn, e, t) => {
    setTimeout(() => {
        fn(e);
    }, t);
}

const onKeyEvent = (e) => {
    if (prevKey===e)
        throttle2(moveSnake, e, moveSnakeTimeThrottle)
    else
        delay2(keyInputHandler, e, moveSnakeTimeDelay)
}

// Event Listners
window.requestAnimationFrame(main);

window.addEventListener("keydown", (e) => onKeyEvent(e.key));

gamepad.addEventListener("mousedown", (e) => {
    console.log('on mouse down');
    if (e.target.dataset.up != undefined) onKeyEvent('ArrowUp');
    else if (e.target.dataset.down != undefined) onKeyEvent('ArrowDown');
    else if (e.target.dataset.left != undefined) onKeyEvent('ArrowLeft');
    else if (e.target.dataset.right != undefined) onKeyEvent('ArrowRight');
    // undefined != e.target.dataset.up ? keyInputHandler("ArrowUp") : undefined != e.target.dataset.down ? keyInputHandler("ArrowDown") : undefined != e.target.dataset.left ? keyInputHandler("ArrowLeft") : undefined != e.target.dataset.right && keyInputHandler("ArrowRight")
});

links.addEventListener('click', (e) => {
    if (e.target.dataset.lite != undefined) gotoLink('lite');
    else if (e.target.dataset.normal != undefined) gotoLink('');
    else if (e.target.dataset.beta != undefined) gotoLink('beta');
});
// @$u6h0d!p -------------------------------------------
