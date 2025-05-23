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
        attack: ()=> console.log('toDO'),
        reload: 15,
        idealDistance: 80,
        upperDistance: 200,
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

function Turt(health, element, angle, speed, reload, counter) {
    this.health = health;
    this.maxHealth = health;
    this.element = element;
    this.angle = angle;
    this.speed = speed;
    this.reload = reload;
    this.counter = counter;
}

function Boss(x, y, health, element, angle, counter) {
    this.x = x;
    this.y = y;
    this.state = enemyStates.defaultFar;
    // this.dx = dx;
    // this.dy = dy;
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
};

const char = {
    maxHealth: 20,
    health: 20,
    state: playerStates.default,
    fireSpeed: 15,
    counter: 0,
    damage: 1,
    bulletSpeed: 25,
    stamina: 100,
    maxStamina: 100,
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
                char.stamina -= 5;
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
    console.log('not switching')
    if(char.state.type !== state.type){
        console.log('switching')
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
        tint.style.backgroundColor = `rgba(255,0,0,${percent})`;
        tint.style.transform = 'scale(1)';
        const elm = b.element;
        const rect = elm.getBoundingClientRect();
        
        const divCenterX = rect.left + rect.width / 2;
        const divCenterY = rect.top + rect.height / 2;

        const deltaX = (x + playerSize / 2) - divCenterX;
        const deltaY = (screenY - (y + playerSize / 2)) - (divCenterY);

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
                if(!b.inPlayer && (satCollision(b.element, b.angle, player, player.angle))){
                    b.inPlayer = true;
                    char.health -= 5;
                    console.log('damaging');
                } else if (!satCollision(b.element, b.angle, player, player.angle)){
                    b.inPlayer = false;
                }
                b.x += b.state.moveSpeed * 14 * Math.cos(b.angle/180*Math.PI);
                b.y -= b.state.moveSpeed * 14 * Math.sin(b.angle/180*Math.PI);
                const rect = b.element.getBoundingClientRect();
                const isOffScreen = (
                    rect.bottom < 0 ||
                    rect.right < 0 ||
                    rect.top > (window.innerHeight || document.documentElement.clientHeight) ||
                    rect.left > (window.innerWidth || document.documentElement.clientWidth)
                );
                if(isOffScreen){
                    b.state.ableToMove = true;
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
            if(b.counter>b.state.reload){
                // b.state.attack();
                b.counter = 0;
            }
            break;
        case `normalTooFar`:
            const dash = attacks['dash']
            for(const attack in attacks){
                if(attacks[attack] === dash){
                    console.log('ye')
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
            checkRemoveAttack(this);

            this.x += this.speed * Math.cos(this.angle/180*Math.PI);
            this.y += this.speed * Math.sin(this.angle/180*Math.PI);
            this.element.style.transform = `translate(${this.x-this.radius}px, ${this.y-this.radius}px) rotate(${this.angle}deg)`;
            this.element.style.backgroundColor = `${color}`;
            this.element.style.width = `${radius*2}px`;
            this.element.style.height = `${radius*2}px`;
        },
        playerUpdate: function() {
            console.log(this.x);
            console.log(this.y);
            checkRemoveAttack(this, false);

            this.x += this.speed * Math.cos(this.angle/180*Math.PI) + dx/1.8;
            this.y += this.speed * Math.sin(this.angle/180*Math.PI) - dy/1.8;
            this.element.style.transform = `translate(${this.x-this.radius}px, ${this.y-this.radius}px) rotate(${this.angle}deg)`;
            this.element.style.backgroundColor = `${color}`;
            this.element.style.width = `${radius*2}px`;
            this.element.style.height = `${radius*2}px`;

            dx /= 1.2;
            dy /= 1.2;
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
    container.style.left = `${(Math.round(Math.random()*screenX))}px`;
    container.style.top = `${(Math.round(Math.random()*screenY))}px`;
    container.appendChild(turret);
    container.appendChild(tint);

    document.body.appendChild(container);

    turretList.push(new Turt(10, turret, 0, 4, 15, 0));
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
        console.log(rect)
        removePlayerAttack(attack)
    }

    if(check){
        if(satCollision(attack.element, attack.angle, player, playerAngle)){
            removeAttack(attack);
            char.health -= attack.damage;
        }
    } else {
        for (let turt of turretList){
            // console.log(satCollision(attack, turt));
            if(satCollision(attack.element, attack.angle, turt.element, turt.angle)){
                removePlayerAttack(attack);
                turt.health -= attack.damage;
                break;
            }
        };
        if(satCollision(attack.element, attack.angle, boss1.element, boss1.angle)){
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

function satCollision(bElm, bAng, tElm, tAng) {
    const rect1 = bElm.getBoundingClientRect();
    const rect2 = tElm.getBoundingClientRect();

    const verts1 = getRectVertices(rect1.left, rect1.top, rect1.width, rect1.height, bAng);
    const verts2 = getRectVertices(rect2.left, rect2.top, rect2.width, rect2.height, tAng);
    
    const axes1 = getAxes(verts1);
    const axes2 = getAxes(verts2);
    
    const axes = axes1.concat(axes2);

    for (const axis of axes) {
        const proj1 = project(verts1, axis);
        const proj2 = project(verts2, axis);

        if (!isOverlap(proj1, proj2)) {
            return false;
        }
    }
    return true;
}

function bossDash(b){
    b.state.ableToMove = false;
    dashTimeout = setTimeout(() => {
        if(!b.state.ableToMove){
            b.state.ableToMove = true;
        }
    }, 450);
}