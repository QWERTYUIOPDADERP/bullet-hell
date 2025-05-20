let keys = [false, false, false, false];
let pAttack = false;
let x = 0;
let y = 0;
let dx = 0;
let dy = 0;
let screenX = window.innerWidth;
let screenY = window.innerWidth;
let playerSize = 20;
let playerAngle = 0;
// 0 = up
// 1 = left
// 2 = right
// 3 = down

let player = document.getElementById('player');
let txt = document.getElementById('testingText');

let turrets = document.getElementsByClassName('autoTurret');

const playerStates = {
    default: {type: 'normal', speed: 2, color: "blue"},
    speedy: {type: 'fast', speed: 4, color: "red"}
};

let playerState = playerStates.default;

let turretList = [];
let enemyAttacks = [];
let playerAttacks = [];

function Turt(element, angle, speed, reload, counter) {
    this.element = element;
    this.angle = angle;
    this.speed = speed;
    this.reload = reload;
    this.counter = counter;
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
            togglePlayerMode();
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
        default:
            break;
    }
});

document.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
  
    const pointerRect = player.getBoundingClientRect();
    const pointerCenterX = pointerRect.left + pointerRect.width / 2;
    const pointerCenterY = pointerRect.top + pointerRect.height / 2;
  
    const deltaX = mouseX - pointerCenterX;
    const deltaY = mouseY - pointerCenterY;
  
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  
    playerAngle = angle;
    player.style.transform = `rotate(${angle}deg)`;
});

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
    calcPlayerMovement(playerState.speed);
    collide();
    movePlayer();
    friction();
    parseEnemeies();
    updateAttacks();
    if(pAttack){
        fireEnemyBullet(x, y, 15, playerAngle);
    }
}

function parseEnemeies(){
    aimTurrets(x+12.5, y+12.5);
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
    x += dx;
    y += dy;
    player.style.left = `${x}px`;
    player.style.bottom = `${y}px`;
    // txt.innerHTML = `(${x}, ${y})`
}

const getNextEnumItem = (enumeration, currentItem) => {
    const enumValues = Object.values(enumeration);
    const currentIndex = enumValues.indexOf(currentItem);
  
    const nextIndex = (currentIndex + 1) % enumValues.length;
    return enumValues[nextIndex];
};

function getRotationAngle(element) {
    const style = window.getComputedStyle(element);
    const matrix = style.getPropertyValue('transform') || style.getPropertyValue('-webkit-transform') || style.getPropertyValue('-moz-transform') || style.getPropertyValue('-ms-transform') || style.getPropertyValue('-o-transform');
  
    if (matrix !== 'none') {
      const values = matrix.split('(')[1].split(')')[0].split(',');
      const a = parseFloat(values[0]);
      const b = parseFloat(values[1]);
      const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
      return angle;
    }
  
    return 0;
}

function normalizeAngle(angle) {
    return ((angle % 360) + 360) % 360;
}

function togglePlayerMode(){
    playerState = getNextEnumItem(playerStates, playerState);
    setPlayer(playerState);
}

function setPlayer(state){
    player.style.backgroundColor = state.color;
}

function setUpTurrets(){
    for(const turret of turrets) {
        turretList.push(new Turt(turret, 0, 4, 15, 0));
    };
}

function aimTurrets(targetX, targetY){
    turretList.forEach(turt => {
        if(turt.counter < 0){
            turt.counter ++;
        } else {
            const rect = turt.element.getBoundingClientRect();
    
            const divCenterX = rect.left + rect.width / 2;
            const divCenterY = rect.top + rect.height / 2;
            
            const deltaX = (targetX) - divCenterX;
            const deltaY = divCenterY - (targetY);
            
            let targetAngle = normalizeAngle(Math.atan2(deltaY, deltaX) * (180 / Math.PI));
    
            const currentAngle = normalizeAngle(getRotationAngle(turt.element));
    
            targetAngle += (currentAngle - (currentAngle % 360));
            if((targetAngle-currentAngle) > 180){
                targetAngle-=360;
            } else if ((currentAngle-targetAngle) > 180){
                targetAngle+=360;
            }
    
            if(Math.abs(targetAngle - currentAngle) > turt.speed){
                turt.angle = currentAngle + Math.min(turt.speed, Math.max(-turt.speed, targetAngle - currentAngle));
            } else {
                turt.angle = targetAngle;
            }
    
            turt.element.style.transform = `rotate(${(turt.angle)}deg)`;
    
            if(turt.counter>turt.reload && Math.abs(targetAngle - turt.angle) < 5){
                turt.counter = -8;
                fireEnemyBullet(divCenterX, divCenterY, 15, turt.angle);
            } else {
                turt.counter ++;
            }
        }
    });
}

function createBullet(x, y, speed, angle, color = 'black', radius = 8) {
    const elm = document.createElement('div');
    elm.className = 'bullet'
    document.body.appendChild(elm);

    return {
        element: elm,
        x: x,
        y: y,
        speed: speed,
        angle: angle,
        radius: radius,
        color: color,
        update: function(isPlayer = false) {
            checkRemoveAttack(this, isPlayer);

            this.x += this.speed * Math.cos(this.angle/180*Math.PI);
            this.y += this.speed * Math.sin(this.angle/180*Math.PI);
            this.element.style.transform = `translate(${this.x-this.radius}px, ${this.y-this.radius}px) rotate(${this.angle}deg)`;
            this.element.style.backgroundColor = `${color}`;
            this.element.style.width = `${radius*2}px`;
            this.element.style.height = `${radius*2}px`;
        },
    };
}

function checkRemoveAttack(attack, isPlayer){
    const rect = attack.element.getBoundingClientRect();
    const isOffScreen = (
      rect.bottom < 0 ||
      rect.right < 0 ||
      rect.top > (window.innerHeight || document.documentElement.clientHeight) ||
      rect.left > (window.innerWidth || document.documentElement.clientWidth)
    );

    if (isOffScreen) {
        removeAttack(attack)
    }

    if(!isPlayer){
        if(checkRectCollision(attack.element, player)){
            removeAttack(attack);
        }
    }
}

function removeAttack(attack){
    attack.element.remove();
    enemyAttacks.splice(enemyAttacks.indexOf(attack), 1);
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

function fireEnemyBullet(x, y, speed, angle){
    const bullet = createBullet(x, y, speed, angle);
    enemyAttacks.push(bullet);
}

function firePlayerBullet(x, y, speed, angle){
    const bullet = createBullet(x, y, speed, angle);
    playerAttacks.push(bullet);
}

setInterval(() => {
    gameplay();
}, 25);

function start(){
    setUpTurrets();
}

function updateAttacks(){
    enemyAttacks.forEach(attack => {
        attack.update();
    });
    playerAttacks.forEach(attack => {
        attack.update(true);
    });
}