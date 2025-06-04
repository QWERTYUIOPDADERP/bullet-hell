let keys = [false, false, false, false];
let pAttack = false;
let pAbility = false;
let dx = 0;
let dy = 0;
let screenX = window.innerWidth;
let screenY = window.innerHeight;
let playerSize = 25;
let x = screenX/2 - playerSize/2;
let y = screenY/2 - playerSize/2;
let playerAngle = 0;
let score = 0;
let dashTimeout;
let song = '';
// 0 = up
// 1 = left
// 2 = right
// 3 = down

let player = document.getElementById('player');
let txt = document.getElementById('testingText');
let startScreen = document.getElementById('start');
let dude = document.getElementById('boss');

let deadScreen = document.getElementById('youDied');
let winScreen = document.getElementById('youWon');

let hud = document.getElementById('hud');
let hudAbility = document.getElementById('pAbility');
let hudStamina = document.getElementById('pStamina');
let hudHealth = document.getElementById('pHealth');

let startTime = 0;

let turrets = document.getElementsByClassName('autoTurret');

let debugMode = false;

// let lobbySound = new Audio('sounds/cyberpunkHeavy.mp3');
let lobbySound = new Audio('sounds/lobbyAmbience.mp3');
let bossPhase1Sound = new Audio('sounds/bossMusic2.mp3');
let bossPhase2Sound = new Audio('sounds/bossMusic1.mp3');
let bossPhase3StartSound = new Audio('sounds/dramaticBuildup.mp3');
let bossPhase3Sound = new Audio('sounds/cyberpunkHeavy.mp3');
let shootSound = new Audio('sounds/electronicBullet.mp3');
let enemyShootSound = new Audio('sounds/otherBullet.mp3');
let collisionSound = new Audio('sounds/');
let buttonHoverSound = new Audio('sounds/buttonHover.mp3');
let buttonClickSound = new Audio('sounds/buttonHover.mp3');

lobbySound.volume = 0.3;
lobbySound.loop = true;
bossPhase1Sound.volume = 0.3;
bossPhase1Sound.loop = true;
bossPhase2Sound.volume = 0.3;
bossPhase2Sound.loop = true;
bossPhase3Sound.volume = 0.3;
bossPhase3Sound.loop = true;
bossPhase3Sound.currentTime = 12;
lobbySound.play();

let buttons = document.getElementsByTagName('button');

let stats = {
    bulletFired: 0,
    bulletsHit: 0,
    turretsDestroyed: 0,
    timesDied: 0,
    bossDefeated: 0,
    gameTime: 0,
}

const playerStates = {
    default: {type: 'normal', speed: 2, color: "blue"},
    speedy: {type: 'fast', speed: 5, color: "red"}
};

let enemyStates = {
    defaultTooFar: {
        type: 'normalTooFar', 
        moveSpeed: 6,
        turnSpeed: 8, 
        ableToMove: true,
        attacks: {
            dash: {
                counter: -40,
                reload: 30,
                function: (entity) => bossDash(entity),
            },
            strong: {
                counter: 0,
                reload: 100,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 10, angle, 20, 15, 2),
            },
            gatling1: {
                counter: 0,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 18, angle, 8, 5),
            },
            gatling2: {
                counter: -10,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX-10, centerY, 18, angle+25, 8, 5),
            },
            gatling3: {
                counter: -10,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX+10, centerY, 18, angle-25, 8, 5),
            },
            summonTurret: {
                counter: 0,
                reload: 160,
                function: () => createTurret(),
            }
        },
        idealDistance: 300,
        lowerDistance: 320,
    },
    defaultFar: {
        type: 'normalFar', 
        moveSpeed: 2,
        turnSpeed: 4, 
        attacks: {
            strong: {
                counter: -30,
                reload: 100,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 10, angle, 20, 15, 2),
            },
            gatling1: {
                counter: -30,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 18, angle, 8, 5),
            },
            gatling2: {
                counter: -40,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX-10, centerY, 18, angle+25, 8, 5),
            },
            gatling3: {
                counter: -40,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX+10, centerY, 18, angle-25, 8, 5),
            },
            summonTurret: {
                counter: -30,
                reload: 160,
                function: () => createTurret(),
            }

        },
        upperDistance: 480,
        idealDistance: 300,
        lowerDistance: 150,
    },
    defaultClose: {
        type: 'normalClose', 
        moveSpeed: 3,
        turnSpeed: 10,  
        attacks: {
            punch: {
                counter: 0,
                reload: 100,
                function: (fist, attack) => melee(fist, attack),
                state: 0,
            },
        },
        idealDistance: 50,
        upperDistance: 150,
    },
    angySpin: {
        type: 'angySpin', 
        moveSpeed: 1,
        turnSpeed: 44, 
        bulletSpeed: 10,
        attacks: {
            gatling1: {
                counter: 0,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle, 8, 5),
            },
            gatling2: {
                counter: -3,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+36, 8, 5),
            },
            gatling3: {
                counter: -6,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*2), 8, 5),
            },
            gatling4: {
                counter: -9,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*3), 8, 5),
            },
            gatling5: {
                counter: -12,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*4), 8, 5),
            },
            gatling6: {
                counter: -15,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*5), 8, 5),
            },
            gatling7: {
                counter: -18,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*6), 8, 5),
            },
            gatling8: {
                counter: -21,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*7), 8, 5),
            },
            gatling9: {
                counter: -24,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*8), 8, 5),
            },
            gatling10: {
                counter: -27,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*9), 8, 5),
            },
            gatling11: {
                counter: 0,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+90, 8, 5),
            },
            gatling12: {
                counter: -3,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+36+90, 8, 5),
            },
            gatling13: {
                counter: -6,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*2)+90, 8, 5),
            },
            gatling14: {
                counter: -9,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*3)+90, 8, 5),
            },
            gatling15: {
                counter: -12,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*4)+90, 8, 5),
            },
            gatling16: {
                counter: -15,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*5)+90, 8, 5),
            },
            gatling17: {
                counter: -18,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*6)+90, 8, 5),
            },
            gatling18: {
                counter: -21,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*7)+90, 8, 5),
            },
            gatling19: {
                counter: -24,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*8)+90, 8, 5),
            },
            gatling20: {
                counter: -27,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*9)+90, 8, 5),
            },
            gatling21: {
                counter: 0,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+180, 8, 5),
            },
            gatling22: {
                counter: -3,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36)+180, 8, 5),
            },
            gatling23: {
                counter: -6,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*2)+180, 8, 5),
            },
            gatling24: {
                counter: -9,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*3)+180, 8, 5),
            },
            gatling25: {
                counter: -12,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*4)+180, 8, 5),
            },
            gatling26: {
                counter: -15,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*5)+180, 8, 5),
            },
            gatling27: {
                counter: -18,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*6)+180, 8, 5),
            },
            gatling28: {
                counter: -21,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*7)+180, 8, 5),
            },
            gatling29: {
                counter: -24,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*8)+180, 8, 5),
            },
            gatling30: {
                counter: -27,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*9)+180, 8, 5),
            },
            gatling31: {
                counter: 0,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*0)+270, 8, 5),
            },
            gatling32: {
                counter: -3,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*1)+270, 8, 5),
            },
            gatling33: {
                counter: -6,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*2)+270, 8, 5),
            },
            gatling34: {
                counter: -9,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*3)+270, 8, 5),
            },
            gatling35: {
                counter: -12,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*4)+270, 8, 5),
            },
            gatling36: {
                counter: -15,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*5)+270, 8, 5),
            },
            gatling37: {
                counter: -18,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*6)+270, 8, 5),
            },
            gatling38: {
                counter: -21,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*7)+270, 8, 5),
            },
            gatling39: {
                counter: -24,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*8)+270, 8, 5),
            },
            gatling40: {
                counter: -27,
                reload: 35,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*9)+270, 8, 5),
            },
        },
        idealDistance: 80,
    },
    angyTooFar: {
        type: 'angyTooFar', 
        moveSpeed: 6,
        turnSpeed: 8, 
        ableToMove: true,
        attacks: {
            dash: {
                counter: -40,
                reload: 30*0.8,
                function: (entity) => bossDash(entity),
            },
            gatling1: {
                counter: 0,
                reload: 35*0.8,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 18*1.5, angle, 8, 5),
            },
            gatling2: {
                counter: -10,
                reload: 35*0.8,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX-10, centerY, 18*1.5, angle+25, 8, 5),
            },
            gatling3: {
                counter: -10,
                reload: 35*0.8,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX+10, centerY, 18*1.5, angle-25, 8, 5),
            },
        },
        idealDistance: 300,
        lowerDistance: 320,
    },
    angyFar: {
        type: 'angyFar', 
        moveSpeed: 2,
        turnSpeed: 2, 
        attacks: {
            gatling1: {
                counter: -30-40,
                reload: 20*0.8,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 18*1.2, angle, 8, 5),
            },
            gatling4: {
                counter: -30-(20*0.5*0.5)-40,
                reload: 20*0.8,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX+15, centerY, 18*1.2, angle, 8, 5),
            },
            gatling2: {
                counter: -40-40,
                reload: 35*0.5,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX-10, centerY, 18*1.2, angle+25, 8, 5),
            },
            gatling3: {
                counter: -40-40,
                reload: 35*0.5,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX+10, centerY, 18*1.2, angle-25, 8, 5),
            },
            gatling5: {
                counter: -40-40,
                reload: 40,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX-10, centerY, 18*0.2, angle+85, 8, 5),
            },
            gatling6: {
                counter: -40-40,
                reload: 40,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX+10, centerY, 18*0.2, angle-85, 8, 5),
            },
            gatling7: {
                counter: -40-40,
                reload: 40,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX-10, centerY, 18*0.2, angle+75, 8, 5),
            },
            gatling8: {
                counter: -40-40,
                reload: 40,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX+10, centerY, 18*0.2, angle-75, 8, 5),
            },
            gatling9: {
                counter: -40-40,
                reload: 40,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX-10, centerY, 18*0.2, angle+65, 8, 5),
            },
            gatling10: {
                counter: -40-40,
                reload: 40,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX+10, centerY, 18*0.2, angle-65, 8, 5),
            },
            gatling11: {
                counter: -40-40,
                reload: 40,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX-10, centerY, 18*0.2, angle+55, 8, 5),
            },
            gatling12: {
                counter: -40-40,
                reload: 40,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX+10, centerY, 18*0.2, angle-55, 8, 5),
            },
            gatling13: {
                counter: -40-40,
                reload: 40,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX-10, centerY, 18*0.2, angle+45, 8, 5),
            },
            gatling14: {
                counter: -40-40,
                reload: 40,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX+10, centerY, 18*0.2, angle-45, 8, 5),
            },
            gatling15: {
                counter: -40-40,
                reload: 40,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX-10, centerY, 18*0.2, angle+35, 8, 5),
            },
            gatling16: {
                counter: -40-40,
                reload: 40,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX+10, centerY, 18*0.2, angle-35, 8, 5),
            },
            gatling9: {
                counter: -40-40,
                reload: 40,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX-10, centerY, 18*0.2, angle+95, 8, 5),
            },
            gatling10: {
                counter: -40-40,
                reload: 40,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX+10, centerY, 18*0.2, angle-95, 8, 5),
            },
            gatling11: {
                counter: -40-40,
                reload: 40,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX-10, centerY, 18*0.2, angle+105, 8, 5),
            },
            gatling12: {
                counter: -40-40,
                reload: 40,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX+10, centerY, 18*0.2, angle-105, 8, 5),
            },
            gatling13: {
                counter: -40-40,
                reload: 40,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX-10, centerY, 18*0.2, angle+115, 8, 5),
            },
            gatling14: {
                counter: -40-40,
                reload: 40,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX+10, centerY, 18*0.2, angle-115, 8, 5),
            },
            gatling15: {
                counter: -40-40,
                reload: 40,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX-10, centerY, 18*0.2, angle+125, 8, 5),
            },
            gatling16: {
                counter: -40-40,
                reload: 40,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX+10, centerY, 18*0.2, angle-125, 8, 5),
            },
        },
        // upperDistance: 480,
        idealDistance: 300,
        // lowerDistance: 150,
    },
    angyClose: {
        type: 'angyClose', 
        moveSpeed: 3,
        turnSpeed: 10,  
        attacks: {
            punch: {
                counter: 0,
                reload: 80,
                function: (fist, attack) => melee(fist, attack),
                state: 0,
            },
        },
        idealDistance: 50,
        upperDistance: 150,
    },
    // speedy: {type: 'fast', speed: 4, color: "red"}
};

enemyStates.defaultFar.tooClose = enemyStates.defaultClose;
enemyStates.defaultFar.tooFar = enemyStates.defaultTooFar;
enemyStates.defaultClose.tooFar = enemyStates.defaultFar;
enemyStates.defaultTooFar.tooClose = enemyStates.defaultFar;

enemyStates.angyFar.tooClose = enemyStates.angyClose;
enemyStates.angyFar.tooFar = enemyStates.angyTooFar;
enemyStates.angyClose.tooFar = enemyStates.angyFar;
enemyStates.angyTooFar.tooClose = enemyStates.angyFar;

let mouseX = 0;
let mouseY = 0;

let turretList = [];
let enemyAttacks = [];
let playerAttacks = [];

function Turt(health, element, angle, speed, reload, inX, inY, counter) {
    this.health = health;
    this.maxHealth = health;
    this.element = element;
    this.angle = angle;
    this.speed = speed;
    this.reload = reload;
    this.counter = counter;
    this.size = 50;
    this.x = inX;
    this.y = inY;
}

function Boss(x, y, health, element, angle, counter) {
    this.x = x;
    this.y = y;
    this.state = enemyStates.defaultFar;
    this.health = health;
    this.maxHealth = health;
    this.element = element;
    this.angle = angle;
    this.counter = counter;
}

const boss1 = {
    inPlayer: false,
    x: screenX/2,
    y: 2*screenY/3,
    state: enemyStates.defaultFar,
    health: 60,
    maxHealth: 60,
    element: dude,
    angle: 90,
    size: 50,
};

const char = {
    maxHealth: 20,
    health: 20,
    state: playerStates.default,
    fireSpeed: 15,
    counter: 0,
    damage: 1,
    bulletSpeed: 25,
    stamina: 200,
    maxStamina: 200,
    size: 25,
    ability: () => rapidFire(),
    abilityStart: () => startRapidFire(),
    abilityEnd: () => endRapidFire(),
    abilityReload: 800,
    abilityCounter: 800,
    usingAbility: false,
    abilityTime: 130,
    // abiltyTime: 700,
}

document.addEventListener("keydown", (e) => {
    const key = e.key;
    switch (key) {
        case 'ArrowUp':
            keys[0] = true;
            break;
        case 'ArrowDown':
            keys[3] = true;
            break;
        case 'ArrowLeft':
            keys[1] = true;
            break;
        case 'ArrowRight':
            keys[2] = true;
            break;
        case 'w':
            keys[0] = true;
            break;
        case 's':
            keys[3] = true;
            break;
        case 'a':
            keys[1] = true;
            break;
        case 'd':
            keys[2] = true;
            break;
        case ' ':
            e.preventDefault();
            setPlayerState(playerStates.speedy);
            break;
        case 'e':
            pAbility = true;
            break;
        default:
            break;
    }

});

document.addEventListener("keyup", (e) => {
    const key = e.key;
    switch (key) {
        case 'ArrowUp':
            keys[0] = false;
            break;
        case 'ArrowDown':
            keys[3] = false;
            break;
        case 'ArrowLeft':
            keys[1] = false;
            break;
        case 'ArrowRight':
            keys[2] = false;
            break;
        case 'w':
            keys[0] = false;
            break;
        case 's':
            keys[3] = false;
            break;
        case 'a':
            keys[1] = false;
            break;
        case 'd':
            keys[2] = false;
            break;
        case ' ':
            setPlayerState(playerStates.default);
            break;
        case 'e':
            pAbility = false;
            break;
        default:
            break;
    }
});

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

function updatePlayerAngle(){
    const pointerRect = player.getBoundingClientRect();
    const pointerCenterX = pointerRect.left + pointerRect.width / 2;
    const pointerCenterY = pointerRect.top + pointerRect.height / 2;
  
    const deltaX = mouseX - pointerCenterX;
    const deltaY = mouseY - pointerCenterY;
  
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  
    playerAngle = angle;
    player.style.transform = `rotate(${angle}deg)`;
}

document.addEventListener('mousedown', function(event) {
    if (event.buttons === 1) {
      pAttack = true;
    }
});

document.addEventListener('mouseup', function(event) {
    if (event.buttons === 0) {
      pAttack = false;
    }
});

function gameplay(){
    if(debugMode){
        clearHitboxes();
    }
    calcPlayerMovement(char.state.speed);
    collide();
    ability();
    movePlayer();
    friction();
    parseEnemeies();
    updatePlayerAngle();
    updateAttacks();
    updatePlayerCombat();
    console.log(Math.round((performance.now()-startTime)/1000));
    console.log(stats.gameTime)
    if((Math.round((performance.now()-startTime)/1000))>stats.gameTime){
        console.log('ye')
        stats.gameTime = Math.round((performance.now()-startTime)/1000);
    }
    saveToLocalStorage();
}

function modifiedGameplay(){
    if(debugMode){
        clearHitboxes();
    }
    calcPlayerMovement(char.state.speed);
    collide();
    ability();
    movePlayer();
    friction();
    updatePlayerAngle();
    updateAttacks();
    updatePlayerCombat();
}

function ability(){
    if(char.usingAbility){
        char.abilityCounter -= (char.abilityReload/char.abilityTime);
        char.ability();
        if(char.abilityCounter<=0){
            char.abilityEnd();
            char.abilityCounter = 0;
            char.usingAbility = false;
            char.element.style.boxShadow = ``;
        }
    } else {
        if(char.abilityCounter>=char.abilityReload){
            if(pAbility){
                char.element.style.boxShadow = `gold 0px 0px 3px 1px`;
                char.usingAbility = true;
                char.abilityStart();
            }
        } else {
            char.abilityCounter ++;
        }
    }
    const percent = (100*(1-(((char.abilityReload-char.abilityCounter))/char.abilityReload))).toFixed(1);
    hudAbility.style.background = `linear-gradient(90deg, gray ${(percent)}%, black ${(percent)}%`;
}

function updatePlayerCombat(){
    if(char.health<=0){
        // player.remove();
        deadScreen.style.display = 'flex';
        stats.timesDied ++;
        clearInterval(intervalID);
    }
    if(char.counter >= char.fireSpeed && pAttack){
        char.counter = 0;
        const p = player.getBoundingClientRect();
        firePlayerBullet(p.x+p.width/2, p.y+p.height/2, char.bulletSpeed, playerAngle, dx, dy);
    } else {
        char.counter ++;
    }
    player.style.filter = `grayscale(${1-(char.health/char.maxHealth)})`
}

function parseEnemeies(){
    doBoss(boss1);
    doTurrets((x+12.5), screenY-(y+12.5));
}

function calcPlayerMovement(speed){
    if(keys[0]){
        dy += speed;
    }
    if(keys[1]){
        dx -= speed;
    }
    if(keys[2]){
        dx += speed;
    }
    if(keys[3]){
        dy -= speed;
    }
}

function friction(){
    dx/=1.2;
    dy/=1.2;
    if(Math.abs(dx) < 1) dx = 0;
    if(Math.abs(dy) < 1) dy = 0;
}

function collide(){
    if(y>(screenY-playerSize)){
        dy = 0;
        y = screenY-playerSize;
    }
    if(y<(0)){
        dy = 0;
        y = 0;
    }
    if(x>(screenX-playerSize)){
        dx = 0;
        x = screenX-playerSize;
    }
    if(x<(0)){
        dx = 0;
        x = 0;
    }
}

function movePlayer(){
    txt.innerHTML = boss1.health;
    switch (char.state.type) {
        case "fast":
            if(char.stamina>0){
                screenX = window.innerWidth;
                // screenY = window.innerHeight;
                x += dx;
                y += dy;
                player.style.left = `${x}px`;
                player.style.bottom = `${y}px`;
                if(char.health>0){
                    // txt.innerHTML = Math.round((performance.now()-startTime)/1000)+score;
                }
                char.stamina -= 10;
            } else {
                setPlayerState(playerStates.default);
            }
            break;
        case 'normal':
            screenX = window.innerWidth;
            // screenY = window.innerHeight;
            x += dx;
            y += dy;
            player.style.left = `${x}px`;
            player.style.bottom = `${y}px`;
            if(char.health>0){
                // txt.innerHTML = Math.round((performance.now()-startTime)/1000)+score;
            }
            if(char.stamina<char.maxStamina){
                char.stamina ++;
            }
            break;
        default:
            break;
    }

    let percent = ((char.maxHealth-char.health)/char.maxHealth);
    hudHealth.style.background = `linear-gradient(90deg, rgb(0, 255, 0) ${(1-percent)*100}%, rgb(255, 0, 0) ${(1-percent)*100}%`;
    
    percent = ((char.maxStamina-char.stamina)/char.maxStamina);
    hudStamina.style.background = `linear-gradient(90deg, deepskyblue ${(1-percent)*100}%, black ${(1-percent)*100}%`;
}

const getNextEnumItem = (enumeration, currentItem) => {
    const enumValues = Object.values(enumeration);
    const currentIndex = enumValues.indexOf(currentItem);
  
    const nextIndex = (currentIndex + 1) % enumValues.length;
    return enumValues[nextIndex];
};

function normalizeAngle(angle) {
    return ((angle % 360) + 360) % 360;
}

function togglePlayerMode(num){
    char.state = playerStates[num];
    setPlayer(char.state);
}

function setPlayerState(state){
    // console.log('not switching')
    if(char.state.type !== state.type){
        // console.log('switching')
        char.state = state;
        setPlayer(char.state);
    }
}

function setPlayer(state){
    player.style.backgroundColor = state.color;
}

function setUpTurrets(){
    for(const turret of turrets) {
        turretList.push(new Turt(10, turret, 0, 3, 15, 0));
    };
}

function doTurrets(targetX, targetY){
    for (let tur of turretList){
        if(tur.health<=0){
            turretList.splice(turretList.indexOf(tur), 1);
            tur.element.parentNode.remove();
            stats.turretsDestroyed ++;
            score += 20;
            continue;
        }
        const tint = tur.element.nextElementSibling;
        tint.style.backgroundColor = `rgba(255,0,0,${((tur.maxHealth-tur.health)/tur.maxHealth)/2})`;
        if(tur.counter < 0){
            tur.counter ++;
        } else {
            const rect = tur.element.getBoundingClientRect();
    
            const divCenterX = rect.left + rect.width / 2;
            const divCenterY = rect.top + rect.height / 2;
            
            const deltaX = (targetX) - divCenterX;
            const deltaY = targetY - (divCenterY);
            
            let targetAngle = normalizeAngle(Math.atan2(deltaY, deltaX) * (180 / Math.PI));
    
            const currentAngle = normalizeAngle(tur.angle);
    
            targetAngle += (currentAngle - (currentAngle % 360));
            if((targetAngle-currentAngle) > 180){
                targetAngle-=360;
            } else if ((currentAngle-targetAngle) > 180){
                targetAngle+=360;
            }
    
            if(Math.abs(targetAngle - currentAngle) > tur.speed){
                tur.angle = currentAngle + Math.min(tur.speed, Math.max(-tur.speed, targetAngle - currentAngle));
            } else {
                tur.angle = targetAngle;
            }
    
            tur.element.style.transform = `rotate(${(tur.angle)}deg)`;
    
            if(tur.counter>tur.reload && Math.abs(targetAngle - tur.angle) < 5){
                tur.counter = -8;
                fireEnemyBullet(divCenterX, divCenterY, 20, tur.angle);
            } else {
                tur.counter ++;
            }
        }
    };
}

function doBoss(b){
    if(b.health<=0){
        if(b.state != 'dead'){
            const h = b.element.nextElementSibling;
            winScreen.style.display = 'flex';
            clearInterval(intervalID);
            score += 100;
            b.state = 'dead';
            h.remove();
            b.element.remove();
            stats.bossDefeated ++;
        }
    } else {
        const tint = b.element.children[1];
        const percent = ((b.maxHealth-b.health)/b.maxHealth)/2;
        if((1-(percent*2))<0.333 && !(b.element.style.boxShadow).includes('red')){
            b.state = enemyStates.angyFar;
            b.element.style.boxShadow = '0 0 75px 30px red'
            bossPhase3StartSound.playbackRate = 4;
            bossPhase3StartSound.play();
            if(song != bossPhase3Sound){
                console.log('yeah')
                fadeIn(bossPhase3Sound, 10000);
            }
            if(song = bossPhase1Sound){
                fadeOut(bossPhase1Sound, 10000);
            }
            if(song = bossPhase2Sound){
                fadeOut(bossPhase2Sound, 10000);
            }
            song = bossPhase3Sound;
        } else if((1-(percent*2))<0.667 && !(b.element.style.boxShadow).includes('red')){
            b.state = enemyStates.angySpin;
            if(song != bossPhase2Sound){
                fadeIn(bossPhase2Sound, 10000);
            }
            if(song = bossPhase1Sound){
                fadeOut(bossPhase1Sound, 10000);
            }
            // if(song = bossPhase3Sound){
            //     console.log('noYeah')
            //     fadeOut(bossPhase3Sound, 10000);
            // }
            song = bossPhase2Sound;
        } else if (!(b.element.style.boxShadow).includes('red')){
            if(song != bossPhase1Sound){
                fadeIn(bossPhase1Sound, 10000);
            }
            song = bossPhase1Sound;
        }
        tint.style.backgroundColor = `rgba(255,0,0,${percent})`;
        tint.style.transform = 'scale(1)';
        const elm = b.element;
        const rect = elm.getBoundingClientRect();
        
        const divCenterX = rect.left + rect.width / 2;
        const divCenterY = rect.top + rect.height / 2;

        const deltaX = (x + playerSize / 2) - divCenterX;
        const deltaY = (screenY - (y + playerSize / 2)) - (divCenterY);

        let targetAngle = normalizeAngle(Math.atan2(deltaY, deltaX) * (180 / Math.PI));

        if(b.state.type == `angySpin`){
            b.angle = normalizeAngle(b.angle+b.state.turnSpeed);
            elm.style.transform = `translate(-50%, -50%) rotate(${b.angle}deg)`;
        } else {
            const currentAngle = normalizeAngle(b.angle);

            targetAngle += (currentAngle - (currentAngle % 360));
            if((targetAngle-currentAngle) > 180){
                targetAngle-=360;
            } else if ((currentAngle-targetAngle) > 180){
                targetAngle+=360;
            }

            if(!(b.state.ableToMove === false)){
                if(Math.abs(targetAngle - currentAngle) > b.state.turnSpeed){
                    b.angle = currentAngle + Math.min(b.state.turnSpeed, Math.max(-b.state.turnSpeed, targetAngle - currentAngle));
                } else {
                    b.angle = targetAngle;
                }
                elm.style.transform = `translate(-50%, -50%) rotate(${b.angle}deg)`
            } else {
                if(Math.abs(targetAngle - currentAngle) > b.state.turnSpeed/10){
                    b.angle = currentAngle + Math.min(b.state.turnSpeed/10, Math.max(-b.state.turnSpeed/10, targetAngle - currentAngle));
                } else {
                    b.angle = targetAngle;
                }
                elm.style.transform = `translate(-50%, -50%) rotate(${b.angle}deg)`
            }
        }

        elm.style.left = `${b.x}px`
        elm.style.bottom = `${b.y}px`

        const health = b.element.nextElementSibling;
        health.style.left = `${rect.left}px`;
        health.style.top = `${rect.top-rect.height*0.5}px`;
        
        // health.style.background = `linear-gradient(90deg, rgb(0, 255, 0) 0%, rgb(0, 255, 0) ${(1-percent*2)*100}%, rgb(255, 0, 0) ${(1-percent*2)*100}%, rgb(255, 0, 0) 100%)`;
        health.style.background = `linear-gradient(90deg, rgb(0, 255, 0) ${(1-percent*2)*100}%, rgb(255, 0, 0) ${(1-percent*2)*100}%`;

        moveBoss(divCenterX, divCenterY, b, targetAngle);
        bossAttack(b, divCenterX, divCenterY);
    }
}

function moveBoss(bossX, bossY, b, tAngle){
    const distToPlayer = Math.hypot((Math.abs(bossY-(screenY - (y+playerSize/2)))),(bossX-((x+playerSize/2))));
    switch (b.state.type) {
        case `normalFar`:
        case `normalClose`:
        case `angyFar`:
        case `angyClose`:
            if(distToPlayer-b.state.idealDistance>15){
                b.x += b.state.moveSpeed * Math.cos(b.angle/180*Math.PI);
                b.y -= b.state.moveSpeed * Math.sin(b.angle/180*Math.PI);
            } else if(b.state.idealDistance-distToPlayer>15){
                b.x -= b.state.moveSpeed * Math.cos(b.angle/180*Math.PI);
                b.y += b.state.moveSpeed * Math.sin(b.angle/180*Math.PI);
            }
            if(b.state.lowerDistance && (distToPlayer<b.state.lowerDistance)){
                b.state = b.state.tooClose;
            }
            
            if(b.state.upperDistance && (distToPlayer>b.state.upperDistance)){
                b.state = b.state.tooFar;
            }
            break;
        case `angySpin`:
            if(distToPlayer-b.state.idealDistance>15){
                b.x += b.state.moveSpeed * Math.cos(tAngle/180*Math.PI);
                b.y -= b.state.moveSpeed * Math.sin(tAngle/180*Math.PI);
            } else if(b.state.idealDistance-distToPlayer>15){
                b.x -= b.state.moveSpeed * Math.cos(tAngle/180*Math.PI);
                b.y += b.state.moveSpeed * Math.sin(tAngle/180*Math.PI);
            }
            if(b.state.lowerDistance && (distToPlayer<b.state.lowerDistance)){
                b.state = b.state.tooClose;
            }
            
            if(b.state.upperDistance && (distToPlayer>b.state.upperDistance)){
                b.state = b.state.tooFar;
            }
            break;
        case `normalTooFar`:
        case `angyTooFar`:
            if(b.state.ableToMove){
                const dash = b.state.attacks.dash;
                const percent = (100*(1-(dash.reload-dash.counter)/dash.reload))
                if(dash.counter >= 0){
                    b.element.style.background = `rgb(${73+percent}, ${0+percent}, ${130+percent})`;
                } else {
                    b.element.style.background = `rgb(73, 0, 130)`;
                }
                if(distToPlayer-b.state.idealDistance>15){
                    b.x += b.state.moveSpeed * Math.cos(b.angle/180*Math.PI);
                    b.y -= b.state.moveSpeed * Math.sin(b.angle/180*Math.PI);
                } else if(b.state.idealDistance-distToPlayer>15){
                    b.x -= b.state.moveSpeed * Math.cos(b.angle/180*Math.PI);
                    b.y += b.state.moveSpeed * Math.sin(b.angle/180*Math.PI);
                }
                if(b.state.lowerDistance && (distToPlayer<b.state.lowerDistance)){
                    b.state = b.state.tooClose;
                }
                
                if(b.state.upperDistance && (distToPlayer>b.state.upperDistance)){
                    b.state = b.state.tooFar;
                }
            } else {
                if(!b.inPlayer && (satCollision(b.angle, playerAngle, b.size, b.size, char.size, char.size, b.x, screenY-b.y-b.size, x+char.size/2, screenY-y-char.size/2))){
                    b.inPlayer = true;
                    char.health -= 5;
                    // console.log('damaging');
                } else if (!satCollision(b.angle, playerAngle, b.size, b.size, char.size, char.size, b.x, screenY-b.y-b.size, x+char.size/2, screenY-y-char.size/2)){
                    b.inPlayer = false;
                }
                b.x += b.state.moveSpeed * 14 * Math.cos(b.angle/180*Math.PI);
                b.y -= b.state.moveSpeed * 14 * Math.sin(b.angle/180*Math.PI);
                const rect = b.element.getBoundingClientRect();
                const isOffScreen = (
                    rect.top < 0 ||
                    rect.left < 0 ||
                    rect.bottom > (window.innerHeight || document.documentElement.clientHeight) ||
                    rect.right > (window.innerWidth || document.documentElement.clientWidth)
                );
                if(isOffScreen){
                    // console.log('correcting');
                    b.state.ableToMove = true;
                    // b.angle = normalizeAngle(b.angle+180);
                    b.x -= b.state.moveSpeed * 20 * Math.cos(b.angle/180*Math.PI);
                    b.y += b.state.moveSpeed * 20 * Math.sin(b.angle/180*Math.PI);
                }
            }
            break;
    
        default:
            break;
    }
    b.counter++;
}

function bossAttack(b, centerX, centerY){
    const attacks = b.state.attacks;
    switch (b.state.type) {
        case `normalFar`:
        case `angyFar`:
            for(const attack in attacks){
                if(attacks[attack].counter>attacks[attack].reload){
                    attacks[attack].function(centerX, centerY, b.angle);
                    attacks[attack].counter = 0;
                } else {
                    attacks[attack].counter ++;
                }
            }
            
            break;
        case `normalClose`:
        case `angyClose`:
            const fist = b.element.children[2];
            const punch = attacks['punch']
            for(const attack in attacks){
                if(attacks[attack] === punch){
                    if(fist.style.opacity != 0){
                        let rect = b.element.getElementsByClassName('fist')[0].getBoundingClientRect();
                        if((attacks[attack].hit !== 1) && (satCollision(b.angle, playerAngle, rect.width, rect.height, char.size, char.size, rect.x+rect.width/2, rect.y+rect.height/2, x+char.size/2, screenY-y-char.size/2) || satCollision(b.angle, playerAngle, b.size, b.size, char.size, char.size, b.x, screenY-b.y-b.size, x+char.size/2, screenY-y-char.size/2))){
                            attacks[attack].hit = 1;
                            char.health -= 5;
                        }
                    }
                    if(punch.counter>punch.reload){
                        punch.function(fist, attacks[attack]);
                        punch.counter = 0;
                    } else {
                        punch.counter ++;
                    }
                } else if(attacks[attack].counter>attacks[attack].reload){
                    // attacks[attack].function(centerX, centerY, b.angle);
                    // attacks[attack].counter = 0;
                } else {
                    // attacks[attack].counter ++;
                }
            }
            break;
        case `normalTooFar`:
        case `angyTooFar`:
            const dash = attacks['dash']
            for(const attack in attacks){
                if(attacks[attack] === dash){
                    // console.log('ye')
                    if(dash.counter>dash.reload){
                        dash.function(b);
                        dash.counter = -40;
                    } else if (b.state.ableToMove){
                        dash.counter ++;
                    }
                } else if ((dash.counter <= (dash.reload-5)) && b.state.ableToMove){
                    if(attacks[attack].counter>attacks[attack].reload){
                        attacks[attack].function(centerX, centerY, b.angle);
                        attacks[attack].counter = 0;
                        
                    } else {
                        attacks[attack].counter ++;
                    }
                }
            }
            break;
        case `angySpin`:
            for(const attack in attacks){
                if(attacks[attack].counter>attacks[attack].reload){
                    attacks[attack].function(centerX, centerY, b.angle);
                    attacks[attack].counter = 0;
                } else {
                    attacks[attack].counter ++;
                }
            }
            
            break;
        default:
            break;
    }
}

function createBullet(x, y, speed, angle, color = 'black', radius = 8, damage = 5, health, dx = 0, dy = 0) {
    const elm = document.createElement('div');
    elm.className = 'bullet'
    document.body.appendChild(elm);

    elm.style.transform = `translate(${x-radius}px, ${y-radius}px) rotate(${angle}deg)`;
    elm.style.zIndex = `12`;
    if(char.usingAbility && (color == 'red' || color == `blue`)){
        elm.style.boxShadow = `gold 0px 0px 3px 1px`;
    }

    return {
        health: health,
        element: elm,
        x: x,
        dx: dx,
        dy: dy,
        y: y,
        damage: damage,
        speed: speed,
        angle: angle,
        radius: radius,
        color: color,
        update: function() {
            this.x += this.speed * Math.cos(this.angle/180*Math.PI);
            this.y += this.speed * Math.sin(this.angle/180*Math.PI);
            this.element.style.transform = `translate(${this.x-this.radius}px, ${this.y-this.radius}px) rotate(${this.angle}deg)`;
            this.element.style.backgroundColor = `${color}`;
            this.element.style.width = `${radius*2}px`;
            this.element.style.height = `${radius*2}px`;

            checkRemoveAttack(this);
        },
        playerUpdate: function() {
            this.x += this.speed * Math.cos(this.angle/180*Math.PI) + this.dx/1.8;
            this.y += this.speed * Math.sin(this.angle/180*Math.PI) - this.dy/1.8;
            this.element.style.transform = `translate(${this.x-this.radius}px, ${this.y-this.radius}px) rotate(${this.angle}deg)`;
            this.element.style.backgroundColor = `${color}`;
            this.element.style.width = `${radius*2}px`;
            this.element.style.height = `${radius*2}px`;
            
            this.dx /= 1.2;
            this.dy /= 1.2;

            checkRemoveAttack(this, false);
        },
    };
}

function createTurret(){
    const turt = document.createElement('div');
    turt.className = 'turret';

    const turret = document.createElement('div');
    turret.className = 'autoTurret';
    turret.appendChild(turt);

    const tint = document.createElement('div');
    tint.className = 'tint';

    const container = document.createElement('div');
    container.className = 'turretContainer';

    const turtX = (Math.round(Math.random()*screenX))
    const turtY = (Math.round(Math.random()*screenY))
    container.style.left = `${turtX}px`;
    container.style.top = `${turtY}px`;
    container.appendChild(turret);
    container.appendChild(tint);

    document.body.appendChild(container);

    turretList.push(new Turt(3, turret, 0, 4, 15, turtX, turtY, 0));
    // turrets.push(container);
    turrets = document.getElementsByClassName('autoTurret');
}

function checkRemoveAttack(attack, check = true){
    const rect = attack.element.getBoundingClientRect();
    const isOffScreen = (
      rect.bottom < 0 ||
      rect.right < 0 ||
      rect.top > (window.innerHeight || document.documentElement.clientHeight) ||
      rect.left > (window.innerWidth || document.documentElement.clientWidth)
    );

    if (isOffScreen && check) {
        removeAttack(attack);
    } else if (isOffScreen && !check){
        // console.log(rect)
        removePlayerAttack(attack);
    }

    if(check){
        if(satCollision(attack.angle, playerAngle, attack.radius*2, attack.radius*2, char.size, char.size, attack.x, attack.y, x+char.size/2, screenY-y-char.size/2)){
            removeAttack(attack);
            char.health -= attack.damage;
        }
    } else {
        for (let turt of turretList){
            // console.log(turt);
            if(satCollision(attack.angle, turt.angle, attack.radius*2, attack.radius*2, turt.size, turt.size, attack.x, attack.y, turt.x, turt.y)){
                removePlayerAttack(attack);
                stats.bulletsHit ++;
                turt.health -= attack.damage;
                break;
            }
        };
        if(satCollision(attack.angle, boss1.angle, attack.radius*2, attack.radius*2, boss1.size, boss1.size, attack.x, attack.y, boss1.x, screenY-boss1.y-boss1.size)){
            removePlayerAttack(attack);
            stats.bulletsHit ++;
            boss1.health -= attack.damage;
        }
    }
}

function removeAttack(attack){
    attack.element.remove();
    enemyAttacks.splice(enemyAttacks.indexOf(attack), 1);
}

function removePlayerAttack(attack){
    attack.element.remove();
    playerAttacks.splice(playerAttacks.indexOf(attack), 1);
}

function checkRectCollision(div1, div2) {
    const rect1 = div1.getBoundingClientRect();
    const rect2 = div2.getBoundingClientRect();
  
    const touching = !(
      rect1.top > rect2.bottom ||
      rect1.right < rect2.left ||
      rect1.bottom < rect2.top ||
      rect1.left > rect2.right
    );
  
    return touching;
  }

function fireEnemyBullet(x, y, speed, angle, radius = 8, damage, health = 1){
    const bullet = createBullet(x, y, speed, angle, `black`, radius, damage, health);
    enemyAttacks.push(bullet);
}

function firePlayerBullet(x, y, speed, angle, dx, dy){
    const bullet = createBullet(x, y, speed, angle, char.state.color, 5, char.damage, 1, dx, dy);
    stats.bulletFired ++;
    playerAttacks.push(bullet);
    shootSound.currentTime = 0;
    shootSound.volume = 0.15+(Math.random()*0.1-0.05);
    shootSound.playbackRate = 1.8+(Math.random()*0.4-0.2);
    shootSound.play();
}

function start(){
    player = document.getElementById('player');
    char.element = player;
    deadScreen.style.display = 'none';
    startScreen.style.display = 'none';
    hud.style.display = 'block';
    boss1.x = screenX/2;
    startTime = performance.now();
    fadeOut(lobbySound, 10000);
    setUpTurrets();
    getLocalStorage();
    intervalID = setInterval(() => {
        gameplay();
    }, 25);
}

let t = document.getElementById('tutorial');
let tTxt = document.getElementById('tutorialText');
let intervalID;
let tutorialNum;

function tutorial(){
    tutorialNum = 0;
    player = document.getElementById('fakePlayer');
    char.element = player;
    deadScreen.style.display = 'none';
    startScreen.style.display = 'none';
    hud.style.display = 'block';
    startTime = performance.now();
    t.style.display = 'flex';
    boss1.x = `-100`;
    tTxt.innerHTML = 'Use WASD or Arrow Keys to Move'
    intervalID = setInterval(() => {
        modifiedGameplay();
    }, 25);
}

function tContinue(){
    switch (tutorialNum) {
        case 0:
            tTxt.innerHTML = 'Aim with the mouse. Click/hold left click to shoot.';
            break;
        case 1:
            tTxt.innerHTML = 'Note that aim is affected by movement.';
            break;
        case 2:
            tTxt.innerHTML = 'Sprint with space.';
            break;
        case 3:
            tTxt.innerHTML = 'The green bar in the lower left is health, the blue is stamina.';
            break;
        case 4:
            tTxt.innerHTML = `The gray bar is your ability recharge.`;
            break
        case 5:
            tTxt.innerHTML = `Your ability can be triggered with 'e' Do so while shooting.`;
            break;
        case 6:
            tTxt.innerHTML = `Note that your ability is triggered and runs until complete.`;
            break;
        case 7:
            tTxt.innerHTML = `That's all for now. Press 'continue' again to return.`;
            break;
        case 8:
            tReturn();
            break;
        default:
            break;
    }
    tutorialNum ++;
}

function tReturn(){
    clearInterval(intervalID);
    for (i = 0; i<(playerAttacks.length);){
        playerAttacks[i].element.remove();
        playerAttacks.splice(i,1);
    }
    for (i = 0; i<(turretList.length);){
        turretList[i].element.parentNode.remove();
        turretList.splice(turretList.indexOf(turretList[i]), 1);
    }
    for (i = 0; i<(enemyAttacks.length);){
        enemyAttacks[i].element.remove();
        enemyAttacks.splice(i,1);
    }
    // console.log(playerAttacks);
    dx = 0; 
    dy = 0;
    screenX = window.innerWidth;
    screenY = window.innerHeight;
    x = screenX/2 - playerSize/2;
    y = screenY/2 - playerSize/2;
    playerAngle = 0;
    score = 0;
    tutorialNum = 0;
    player.style.left = `-25%`;
    boss1.health = boss1.maxHealth;
    boss1.inPlayer = false;
    boss1.x = screenX/2;
    boss1.y = 2*screenY/3;
    boss1.state = enemyStates.defaultFar;
    boss1.angle = 90;
    player = document.getElementById('player');
    char.element = player;
    char.health = char.maxHealth;
    char.stamina = char.maxStamina;
    startScreen.style.display = 'flex';
    hud.style.display = 'none';
    startTime = performance.now();
    t.style.display = 'none';
    tTxt.innerHTML = '';
    char.abilityCounter = char.abilityReload;
    char.stamina = char.maxStamina;
    char.state = playerStates.default;
    char.fireSpeed = 15;
    char.counter = 0;
    char.damage = 1;
    char.abilityReload = 800;
    char.abilityCounter = 800;
    char.usingAbility = false;
}

function updateAttacks(){
    enemyAttacks.forEach(attack => {
        attack.update();
    });
    playerAttacks.forEach(attack => {
        attack.playerUpdate();
    });
    bulletBulletCollision();
}

function bulletBulletCollision(){
    let pAttack;
    let eAttack;
    let pShiftX;
    let pShiftY;
    let pShift;
    let eShiftX;
    let eShiftY;
    let eShift;
    for (i = 0; i<(playerAttacks.length); i++){
        pAttack = playerAttacks[i];
        for (l = 0; l<enemyAttacks.length; l++){
            eAttack = enemyAttacks[l];
            pShiftY =  (pAttack.speed * Math.sin(pAttack.angle/180*Math.PI) + pAttack.dy);
            pShiftX =  (pAttack.speed * Math.cos(pAttack.angle/180*Math.PI) + pAttack.dx);
            pShift =  Math.hypot(pShiftX, pShiftY);
            eShiftY =  (eAttack.speed * Math.sin(eAttack.angle/180*Math.PI));
            eShiftX =  (eAttack.speed * Math.cos(eAttack.angle/180*Math.PI));
            eShift =  Math.hypot(eShiftX, eShiftY);
            if(satCollision(pAttack.angle, eAttack.angle, pAttack.radius*2 + pShift, pAttack.radius*2, eAttack.radius*2 + eShift, eAttack.radius*2, pAttack.x-pShiftX, pAttack.y-pShiftY, eAttack.x-eShiftX, eAttack.y-eShiftY, true)){
                pAttack.health --;
                eAttack.health --;

                if(eAttack.health<=0) removeAttack(eAttack);
                if(pAttack.health<=0) {
                    removePlayerAttack(pAttack);
                    stats.bulletsHit ++;
                }
                break;
            }
        }
    }
}

function getRectVertices(x, y, width, height, angle = 0) {
    const cx = x + width / 2;
    const cy = y + height / 2;

    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const hw = width / 2;
    const hh = height / 2;


    const corners = [
        { x: -hw, y: -hh },
        { x: hw, y: -hh },
        { x: hw, y: hh },
        { x: -hw, y: hh }
    ];


    return corners.map(p => ({
        x: cx + p.x * cos - p.y * sin,
        y: cy + p.x * sin + p.y * cos
    }));
}

function getAxes(vertices) {
    const axes = [];
    for (let i = 0; i < vertices.length; i++) {
        const p1 = vertices[i];
        const p2 = vertices[(i + 1) % vertices.length];
        const edge = { x: p2.x - p1.x, y: p2.y - p1.y };
        const normal = { x: -edge.y, y: edge.x };

        const len = Math.hypot(normal.x, normal.y);
        axes.push({ x: normal.x / len, y: normal.y / len });
    }
    return axes;
}

function project(vertices, axis) {
    let min = Infinity;
    let max = -Infinity;
    for (const p of vertices) {
        const dot = p.x * axis.x + p.y * axis.y;
        min = Math.min(min, dot);
        max = Math.max(max, dot);
    }
    return { min, max };
}

function isOverlap(proj1, proj2) {
    return proj1.max >= proj2.min && proj2.max >= proj1.min;
}

function satCollision(bAng, tAng, bWidth, bHeight, tWidth, tHeight, bX, bY, tX, tY) {

    bX -= bWidth/2;
    bY -= bHeight/2;

    tX -= tWidth/2;
    tY -= tHeight/2;

    bAng *= (Math.PI/180);
    tAng *= (Math.PI/180);

    let verts1;
    let verts2;

        verts1 = getRectVertices(bX, bY, bWidth, bHeight, bAng);
        verts2 = getRectVertices(tX, tY, tWidth, tHeight, tAng);
    
    const axes1 = getAxes(verts1);
    const axes2 = getAxes(verts2);
    
    const axes = axes1.concat(axes2);

    for (const axis of axes) {
        const proj1 = project(verts1, axis);
        const proj2 = project(verts2, axis);

        if (!isOverlap(proj1, proj2)) {
            if(debugMode){
                drawHitbox(verts1, 'blue');
                drawHitbox(verts2, 'blue');
            }
            return false;
        }
    }

    if(debugMode){
        drawHitbox(verts1, 'red');
        drawHitbox(verts2, 'red');
    }
    return true;
}

function drawHitbox(vertices, color = 'blue') {
    let svg = document.getElementById('hitbox-svg');
    if (!svg) {
        svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("id", "hitbox-svg");
        svg.style.position = "fixed";
        svg.style.top = 0;
        svg.style.left = 0;
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.pointerEvents = "none"; // allow mouse interaction below
        svg.style.zIndex = 9999;
        document.body.appendChild(svg);
    }

    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    const points = vertices.map(p => `${p.x},${p.y}`).join(' ');
    polygon.setAttribute('points', points);
    polygon.setAttribute('stroke', color);
    polygon.setAttribute('stroke-width', '2');
    polygon.setAttribute('fill', 'none');
    svg.appendChild(polygon);
}

function clearHitboxes() {
    const svg = document.getElementById('hitbox-svg');
    if (svg) {
        svg.innerHTML = '';
        svg.remove();
    }
}

function toggleDebugMode(elm){
    if(debugMode){
        debugMode = false;
        elm.innerHTML = `Debug Mode: OFF`;
    } else {
        debugMode = true;
        elm.innerHTML = `Debug Mode: ON`;
    }
}

function bossDash(b){
    b.state.ableToMove = false;
    dashTimeout = setTimeout(() => {
        if(!b.state.ableToMove){
            b.state.ableToMove = true;
        }
    }, 450);
}

function melee(f, a){
    if(a.state === 0){
        a.state = 1;
        f.style.top = `-100%`
        f.classList.toggle('punchRight');
    } else {
        a.state = 0;
        f.style.top = `200%`
        f.classList.toggle('punchLeft');
    }
    f.style.opacity = `1`;
    setTimeout(() => {
        f.className = `fist`;
        f.style.opacity = `0`;
        a.hit = 0;
    }, 1000);
}

function rapidFire(){
    char.fireSpeed = char.oldFireSpeed/3;
}

function endRapidFire(){
    char.fireSpeed = char.oldFireSpeed;
}

function startRapidFire(){
    char.oldFireSpeed = char.fireSpeed;
}

for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    buttonHoverSound.volume = 0.6;
    button.addEventListener('mouseover', function() {
        buttonHoverSound.play();
    }, false);

    button.addEventListener('click', function() {
        buttonClickSound.play();
    }, false);
}

function fadeIn(audio, duration) {
    let volume = 0;
    const increment = 0.01;
    const intervalTime = duration / (1 / increment);

    audio.volume = volume;
    audio.play();

    const fadeInterval = setInterval(() => {
        if (volume < 0.1) {
        volume += increment;
        audio.volume = volume;
        } else {
        clearInterval(fadeInterval);
        }
    }, intervalTime);
}

function fadeOut(audio, duration) {
    let volume = 0.1;
    const decrement = 0.01;
    const intervalTime = duration / (1 / decrement);

    audio.volume = volume;

    const fadeInterval = setInterval(() => {
        if (volume > (0+decrement)) {
            volume -= decrement;
            audio.volume = volume;
        } else {
            audio.pause();
            audio.volume = 0;
            audio.currentTime = 0;
            clearInterval(fadeInterval);
        }
    }, intervalTime);
}

function playAudio() {
    if(!intervalID){
        lobbySound.play();
    }
    //remove the event listener to prevent multiple playbacks
    document.removeEventListener('click', playAudio);
    document.removeEventListener('keydown', playAudio);
}

function saveToLocalStorage(){
    localStorage.setItem('stats', JSON.stringify(stats));
}

function getLocalStorage(){
    if(localStorage.getItem('stats')){
        stats = JSON.parse(localStorage.getItem('stats'));
    }
}
// bulletFired: 0,
//     bulletsHit: 0,
//     turretsDestroyed: 0,
//     timesDied: 0,
//     timesWon: 0,
const statScreen = document.getElementById('stats');
const shots = document.getElementById('shots');
const hit = document.getElementById('shotsHit');
const tDestroyed = document.getElementById('turretsDestroyed');
const deaths = document.getElementById('deaths');
const wins = document.getElementById('wins');
const longestGame = document.getElementById('longGame');

function viewStats(){
    statScreen.style.display = 'flex';
    getLocalStorage();
    shots.innerText = `Shots Fired: ${stats.bulletFired}`;
    hit.innerText = `Shots Hit: ${stats.bulletsHit}`;
    tDestroyed.innerText = `Turrets Destroyed: ${stats.turretsDestroyed}`;
    deaths.innerText = `Deaths: ${stats.timesDied}`;
    wins.innerText = `Wins: ${stats.bossDefeated}`;
    longestGame.innerText = `Longest Game: ${stats.gameTime} sec`;
}

function resetStats(){
    stats = {
        bulletFired: 0,
        bulletsHit: 0,
        turretsDestroyed: 0,
        timesDied: 0,
        bossDefeated: 0,
        gameTime: 0,
    };
    saveToLocalStorage();
    viewStats();
}

function hideStats(){
    statScreen.style.display = 'none';
}

document.addEventListener('click', playAudio);
document.addEventListener('keydown', playAudio);