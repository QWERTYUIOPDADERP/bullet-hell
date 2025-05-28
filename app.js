let keys = [false, false, false, false];
let pAttack = false;
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
// 0 = up
// 1 = left
// 2 = right
// 3 = down

let player = document.getElementById('player');
let txt = document.getElementById('testingText');
let startScreen = document.getElementById('start');
let dude = document.getElementById('boss');

let hud = document.getElementById('hud');
let hudStamina = document.getElementById('pStamina');
let hudHealth = document.getElementById('pHealth');

let startTime = 0;

let turrets = document.getElementsByClassName('autoTurret');

let debugMode = false;

const playerStates = {
    default: {type: 'normal', speed: 2, color: "blue"},
    speedy: {type: 'fast', speed: 5, color: "red"}
};

const enemyStates = {
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
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 10, angle, 20, 15),
            },
            gatling1: {
                counter: 0,
                reload: 20,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 18, angle, 8, 5),
            },
            gatling2: {
                counter: -10,
                reload: 20,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX-10, centerY, 18, angle+25, 8, 5),
            },
            gatling3: {
                counter: -10,
                reload: 20,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX+10, centerY, 18, angle-25, 8, 5),
            },
            summonTurret: {
                counter: 0,
                reload: 190,
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
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 10, angle, 20, 15),
            },
            gatling1: {
                counter: -30,
                reload: 20,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 18, angle, 8, 5),
            },
            gatling2: {
                counter: -40,
                reload: 20,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX-10, centerY, 18, angle+25, 8, 5),
            },
            gatling3: {
                counter: -40,
                reload: 20,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX+10, centerY, 18, angle-25, 8, 5),
            },
            summonTurret: {
                counter: -30,
                reload: 190,
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
                function: (boss, fist, attack) => melee(boss, fist, attack),
                state: 0,
            },
        },
        idealDistance: 50,
        upperDistance: 150,
    },
    angySpin: {
        type: 'angySpin', 
        moveSpeed: 1,
        turnSpeed: 70, 
        bulletSpeed: 10,
        attacks: {
            gatling1: {
                counter: 0,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle, 8, 5),
            },
            gatling2: {
                counter: -3,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+36, 8, 5),
            },
            gatling3: {
                counter: -6,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*2), 8, 5),
            },
            gatling4: {
                counter: -9,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*3), 8, 5),
            },
            gatling5: {
                counter: -12,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*4), 8, 5),
            },
            gatling6: {
                counter: -15,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*5), 8, 5),
            },
            gatling7: {
                counter: -18,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*6), 8, 5),
            },
            gatling8: {
                counter: -21,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*7), 8, 5),
            },
            gatling9: {
                counter: -24,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*8), 8, 5),
            },
            gatling10: {
                counter: -27,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*9), 8, 5),
            },
            gatling11: {
                counter: 0,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+90, 8, 5),
            },
            gatling12: {
                counter: -3,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+36+90, 8, 5),
            },
            gatling13: {
                counter: -6,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*2)+90, 8, 5),
            },
            gatling14: {
                counter: -9,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*3)+90, 8, 5),
            },
            gatling15: {
                counter: -12,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*4)+90, 8, 5),
            },
            gatling16: {
                counter: -15,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*5)+90, 8, 5),
            },
            gatling17: {
                counter: -18,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*6)+90, 8, 5),
            },
            gatling18: {
                counter: -21,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*7)+90, 8, 5),
            },
            gatling19: {
                counter: -24,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*8)+90, 8, 5),
            },
            gatling20: {
                counter: -27,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*9)+90, 8, 5),
            },
            gatling21: {
                counter: 0,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+180, 8, 5),
            },
            gatling22: {
                counter: -3,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36)+180, 8, 5),
            },
            gatling23: {
                counter: -6,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*2)+180, 8, 5),
            },
            gatling24: {
                counter: -9,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*3)+180, 8, 5),
            },
            gatling25: {
                counter: -12,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*4)+180, 8, 5),
            },
            gatling26: {
                counter: -15,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*5)+180, 8, 5),
            },
            gatling27: {
                counter: -18,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*6)+180, 8, 5),
            },
            gatling28: {
                counter: -21,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*7)+180, 8, 5),
            },
            gatling29: {
                counter: -24,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*8)+180, 8, 5),
            },
            gatling30: {
                counter: -27,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*9)+180, 8, 5),
            },
            gatling31: {
                counter: 0,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*0)+270, 8, 5),
            },
            gatling32: {
                counter: -3,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*1)+270, 8, 5),
            },
            gatling33: {
                counter: -6,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*2)+270, 8, 5),
            },
            gatling34: {
                counter: -9,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*3)+270, 8, 5),
            },
            gatling35: {
                counter: -12,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*4)+270, 8, 5),
            },
            gatling36: {
                counter: -15,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*5)+270, 8, 5),
            },
            gatling37: {
                counter: -18,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*6)+270, 8, 5),
            },
            gatling38: {
                counter: -21,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*7)+270, 8, 5),
            },
            gatling39: {
                counter: -24,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*8)+270, 8, 5),
            },
            gatling40: {
                counter: -27,
                reload: 30,
                function: (centerX, centerY, angle) => fireEnemyBullet(centerX, centerY, 3, angle+(36*9)+270, 8, 5),
            },
        },
    },
    // speedy: {type: 'fast', speed: 4, color: "red"}
};

enemyStates.defaultFar.tooClose = enemyStates.defaultClose;
enemyStates.defaultFar.tooFar = enemyStates.defaultTooFar;
enemyStates.defaultClose.tooFar = enemyStates.defaultFar;
enemyStates.defaultTooFar.tooClose = enemyStates.defaultFar;

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
    health: 40,
    maxHealth: 40,
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
            setPlayerState(playerStates.speedy);
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
    movePlayer();
    friction();
    parseEnemeies();
    updatePlayerAngle();
    updateAttacks();
    updatePlayerCombat();
}

function modifiedGameplay(){
    if(debugMode){
        clearHitboxes();
    }
    calcPlayerMovement(char.state.speed);
    collide();
    movePlayer();
    friction();
    updatePlayerAngle();
    updateAttacks();
    updatePlayerCombat();
}

function updatePlayerCombat(){
    if(char.health<=0){
        player.remove();
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
                    txt.innerHTML = Math.round((performance.now()-startTime)/1000)+score;
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
                txt.innerHTML = Math.round((performance.now()-startTime)/1000)+score;
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
    hudStamina.style.background = `linear-gradient(90deg, deepskyblue ${(1-percent)*100}%, skyblue ${(1-percent)*100}%`;
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
        turretList.push(new Turt(10, turret, 0, 4, 15, 0));
    };
}

function doTurrets(targetX, targetY){
    for (let tur of turretList){
        if(tur.health<=0){
            turretList.splice(turretList.indexOf(tur), 1);
            tur.element.parentNode.remove();
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
            score += 100;
            b.state = 'dead';
            h.remove();
            b.element.remove();
        }
    } else {
        const tint = b.element.children[1];
        const percent = ((b.maxHealth-b.health)/b.maxHealth)/2;
        if((1-(percent*2))<0.5){
            b.state = enemyStates.angySpin;
        }
        tint.style.backgroundColor = `rgba(255,0,0,${percent})`;
        tint.style.transform = 'scale(1)';
        const elm = b.element;
        const rect = elm.getBoundingClientRect();
        
        const divCenterX = rect.left + rect.width / 2;
        const divCenterY = rect.top + rect.height / 2;

        const deltaX = (x + playerSize / 2) - divCenterX;
        const deltaY = (screenY - (y + playerSize / 2)) - (divCenterY);

        if(b.state.type == `angySpin`){
            b.angle = normalizeAngle(b.angle+b.state.turnSpeed);
            elm.style.transform = `translate(-50%, -50%) rotate(${b.angle}deg)`;
        } else {
            let targetAngle = normalizeAngle(Math.atan2(deltaY, deltaX) * (180 / Math.PI));

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

        moveBoss(divCenterX, divCenterY, b);
        bossAttack(b, divCenterX, divCenterY);
    }
}

function moveBoss(bossX, bossY, b){
    const distToPlayer = Math.hypot((Math.abs(bossY-(screenY - (y+playerSize/2)))),(bossX-((x+playerSize/2))));
    switch (b.state.type) {
        case `normalFar`:
        case `normalClose`:
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
        case `normalTooFar`:
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
                if(!b.inPlayer && (satCollision(b.angle, playerAngle, b.size, char.size, b.x, screenY-b.y-b.size, x+char.size/2, screenY-y-char.size/2))){
                    b.inPlayer = true;
                    char.health -= 5;
                    // console.log('damaging');
                } else if (!satCollision(b.angle, playerAngle, b.size, char.size, b.x, screenY-b.y-b.size, x+char.size/2, screenY-y-char.size/2)){
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
            const fist = b.element.children[2];
            const punch = attacks['punch']
            for(const attack in attacks){
                if(attacks[attack] === punch){
                    if(fist.style.opacity != 0){
                        if((attacks[attack].hit !== 1) && satCollision(b.angle, playerAngle, b.size, char.size, b.x, screenY-b.y-b.size, x+char.size/2, screenY-y-char.size/2)){
                            attacks[attack].hit = 1;
                            char.health -= 5;
                        }
                    }
                    if(punch.counter>punch.reload){
                        punch.function(b, fist, attacks[attack]);
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

function createBullet(x, y, speed, angle, color = 'black', radius = 8, damage = 5, dx = 0, dy = 0) {
    const elm = document.createElement('div');
    elm.className = 'bullet'
    document.body.appendChild(elm);

    elm.style.transform = `translate(${x-radius}px, ${y-radius}px) rotate(${angle}deg)`;
    elm.style.zIndex = `12`;

    return {
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
            // console.log(this.x);
            // console.log(this.y);
            
            this.x += this.speed * Math.cos(this.angle/180*Math.PI) + dx/1.8;
            this.y += this.speed * Math.sin(this.angle/180*Math.PI) - dy/1.8;
            this.element.style.transform = `translate(${this.x-this.radius}px, ${this.y-this.radius}px) rotate(${this.angle}deg)`;
            this.element.style.backgroundColor = `${color}`;
            this.element.style.width = `${radius*2}px`;
            this.element.style.height = `${radius*2}px`;
            
            dx /= 1.2;
            dy /= 1.2;

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

    turretList.push(new Turt(10, turret, 0, 4, 15, turtX, turtY, 0));
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
        removeAttack(attack)
    } else if (isOffScreen && !check){
        // console.log(rect)
        removePlayerAttack(attack)
    }

    if(check){
        if(satCollision(attack.angle, playerAngle, attack.radius*2, char.size, attack.x, attack.y, x+char.size/2, screenY-y-char.size/2)){
            removeAttack(attack);
            char.health -= attack.damage;
        }
    } else {
        for (let turt of turretList){
            // console.log(turt);
            if(satCollision(attack.angle, turt.angle, attack.radius*2, turt.size, attack.x, attack.y, turt.x, turt.y)){
                removePlayerAttack(attack);
                turt.health -= attack.damage;
                break;
            }
        };
        if(satCollision(attack.angle, boss1.angle, attack.radius*2, boss1.size, attack.x, attack.y, boss1.x, screenY-boss1.y-boss1.size)){
            removePlayerAttack(attack);
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

function fireEnemyBullet(x, y, speed, angle, radius = 8, damage){
    const bullet = createBullet(x, y, speed, angle, `black`, radius, damage);
    enemyAttacks.push(bullet);
}

function firePlayerBullet(x, y, speed, angle, dx, dy){
    const bullet = createBullet(x, y, speed, angle, char.state.color, 5, char.damage, dx, dy);
    playerAttacks.push(bullet);
}

function start(){
    player = document.getElementById('player');
    char.element = player;
    startScreen.style.display = 'none';
    hud.style.display = 'block';
    startTime = performance.now();
    setUpTurrets();
    setInterval(() => {
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
    startScreen.style.display = 'none';
    hud.style.display = 'block';
    startTime = performance.now();
    t.style.display = 'flex';
    dude.style.left = `-100%`;
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
            tTxt.innerHTML = `That's it for now. Click continue again to return.`;
            break;
        case 5:
            tReturn();
            break;
        default:
            break;
    }
    tutorialNum ++;
}

function tReturn(){
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
    player = document.getElementById('player');
    char.element = player;
    startScreen.style.display = 'flex';
    hud.style.display = 'none';
    startTime = performance.now();
    t.style.display = 'none';
    tTxt.innerHTML = '';
    clearInterval(intervalID);
}

function updateAttacks(){
    enemyAttacks.forEach(attack => {
        attack.update();
    });
    playerAttacks.forEach(attack => {
        attack.playerUpdate();
    });
    bulletBulletCollision();
    // bulletBulletCollision(); Too complicated to do interpolation (required b/c too samll and fast)
}

function bulletBulletCollision(){
    let pAttack;
    let eAttack;
    for (i = 0; i<(playerAttacks.length); i++){
        pAttack = playerAttacks[i];
        for (l = 0; l<enemyAttacks.length; l++){
            eAttack = enemyAttacks[l];
            if(satCollision(pAttack.angle, eAttack.angle, pAttack.radius*2, eAttack.radius*2, pAttack.x, pAttack.y, eAttack.x, eAttack.y)){
                removePlayerAttack(pAttack);
                removeAttack(eAttack);
                // char.health -= attack.damage;
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

function satCollision(bAng, tAng, bSize, tSize, bX, bY, tX, tY) {

    bX -= bSize/2;
    bY -= bSize/2;

    tX -= tSize/2;
    tY -= tSize/2;

    bAng *= (Math.PI/180);
    tAng *= (Math.PI/180);

    const verts1 = getRectVertices(bX, bY, bSize, bSize, bAng);
    const verts2 = getRectVertices(tX, tY, tSize, tSize, tAng);
    
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

function melee(b, f, a){
    const elm = b.element;
    const rect = elm.getBoundingClientRect();
    
    const divCenterX = rect.left + rect.width / 2;
    const divCenterY = rect.top + rect.height / 2;

    if(a.state === 0){
        a.state = 1;
        f.style.top = `-100%`
        f.classList.toggle('punchRight');
        // f.style.bottom = ``
    } else {
        a.state = 0;
        f.style.top = `200%`
        f.classList.toggle('punchLeft');
        // f.style.bottom = `100%`
    }
    f.style.opacity = `1`;
    setTimeout(() => {
        f.className = `fist`;
        f.style.opacity = `0`;
        a.hit = 0;
    }, 1000);
}