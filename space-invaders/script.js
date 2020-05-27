//PROBLEM/CHANGES TO BE DONE 
// Limiting the player and enemy moving rate when speed increases
// Missile Launch position
// Better collision and explosion
// Stopping the refreshing of enemy and missiles when splicing
// Player goes outside the frame - decreasing/managing thee pixels player moves while pressing up/down keys

let bg = new Image();
bg.src = "images/space.png";
let spaceship = new Image();
spaceship.src = "images/spaceship.png";
let missile = new Image();
missile.src = "images/missile.png";
let redShip = new Image();
redShip.src = "images/enemy.png";

let blast = new Image();
blast.src = "images/blast.png"; 

let explosion = new Audio('sounds/explosion.mp3');
let shootSound = new Audio('sounds/shoot.mp3');
let playMusic = new Audio('sounds/music.mp3');
let liveLoss = new Audio('sounds/loselife.wav');

playMusic.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

function initCanvas() {
    let ctx = document.getElementById("myCanvas").getContext('2d');
    let cW = ctx.canvas.width;
    let cH = ctx.canvas.height;

    document.getElementById("myCanvas").focus();
    let gameOver = false;
    let shootCheck = 0;
    let spaceHit = false;
    let level = 1; 
    let lives = 3;
    let highScore = 0;
    let counter = 0;
    
    function Background() {
        this.x = 0;
        this.y = 0;
        this.w = bg.width;
        this.h = bg.height;
        this.render = function() {
            ctx.drawImage(bg, this.x-=2, 0);
            if(this.x <= -499){
                this.x = 0;
            }
        }
    }
    
    function Spaceship() {
        this.x = 20;
        this.y = cH/2 - 50;
        this.w = 100;
        this.h = 100;
        this.missiles = [];
        this.render = function() {
            ctx.drawImage(spaceship, this.x, this.y, this.w, this.h);
        }
    
        this.hitDetect = function(missItem, missIndex){
            enemyList.forEach((item, index, enemyArr) => {
                if(missItem.x + missItem.w >= item.x && missItem.x <= item.x + item.w && missItem.y >= item.y && missItem.y <= item.y + item.h){
                    enemyArr.splice(index, 1);
                    this.missiles.splice(missIndex, 1);
                    counter++;
                    explosion.play();
                    ctx.drawImage(blast, item.x - 30, item.y, 100, 100);
                }
            });
        }
    }
    
    function Missile(sX, sY) {
        this.x = sX-30;
        this.y = sY - 7;
        this.w = 40;
        this.h = 15;
        this.render = function() {
            ctx.drawImage(missile, this.x+=10, this.y, this.w, this.h);
        }
        
    }
    
    function Enemy() {
        this.x = cW;
        this.y = Math.floor(Math.random() * (cH - 80));
        this.w = 80;
        this.h = 80;
        
        this.render = function() {
            ctx.drawImage(redShip, this.x-=(level+5), this.y, this.w, this.h);
        }
    }

    function shoot() {
        if(spaceHit && (shootCheck == 1)){
            setTimeout(() => {
                shootSound.play();
                player.missiles.push(new Missile(player.x+player.w, player.y+(player.h/2)));
                shootCheck = 0;
            }, 300);
        }
        
    }

    let background = new Background();
    let player = new Spaceship();
    let playerRate = level + 4;

    let enemyList = [];
    let moveUp = false;
    let moveDown = false;
 
    function animate() {
        if(gameOver){
            ctx.font = "bold 72px Arial, sans-serif";
            ctx.fillStyle = "#c0392b";
            ctx.fillText("GAME OVER", cW/2-(72*3) ,cH/2);
            ctx.font = "36px Arial, sans-serif";
            ctx.fillStyle = "#fff";
            ctx.fillText("Press Space to Restart", cW/2-(36*5) ,cH/2 + 90);

            document.addEventListener('keydown', function spPress(event){
                let key = event.keyCode;
                if(key == 32){
                    ctx.clearRect(0, 0, cW, cH);
                    counter = 0;
                    lives = 3;
                    player.missiles = [];
                    enemyList = [];
                    gameOver = false;
                    document.removeEventListener('keydown', spPress);
                    playMusic.play();
                }
            });

            return;
        }

        ctx.save();
        ctx.clearRect(0, 0, cW, cH);
        background.render();

        player.render();

        enemyList.forEach(function(item, index, enemyArr){
            item.render();
            if(item.x <= -item.w){
                enemyArr.splice(index, 1)
            }

            if(item.x + item.w >= player.x && item.x <= player.x + player.w && item.y >= player.y && item.y <= player.y + player.h){
                if(lives == 1){
                    explosion.play();
                    ctx.drawImage(blast, item.x - 30, item.y, 100, 100);
                    if(counter > highScore){
                        highScore = counter;
                    }
                    gameOver = true;
                }else{
                    liveLoss.play();
                    enemyArr.splice(index, 1);
                }
                lives--;
            }
            
        });
        
        player.missiles.forEach(function(item, index, missileArr){
            item.render();
            if(item.x >= cW){
                missileArr.splice(index, 1)
            }
            player.hitDetect(item, index);
        });
        
        ctx.font = "18px Arial, sans-serif";
        ctx.fillStyle = "#fff";
        ctx.fillText("Score: "+counter, 20,40);
        
        ctx.font = "18px Arial, sans-serif";
        ctx.fillStyle = "#fff";
        ctx.fillText("Highscore: "+highScore, 120,40);

        ctx.font = "18px Arial, sans-serif";
        ctx.fillStyle = "#fff";
        ctx.fillText("Lives: "+lives, 20,80);

        level = Math.floor(counter/5) + 1;
        ctx.font = "18px Arial, sans-serif";
        ctx.fillStyle = "#fff";
        ctx.fillText("Level: "+level, 120,80);

        playerRate = level + 4;
        if(moveUp){
            player.y -= playerRate;
            console.log(playerRate);
        }

        if(moveDown){
            player.y += playerRate;
        }

        ctx.restore();
    };

    let rate = 2000 - level*100;
    let timOut = setTimeout(function mvenm(){
        rate = 2000 - level*100;
        enemyList.push(new Enemy());
        timeOut = setTimeout(mvenm, rate);
    },100);
    
   


    if(!gameOver){
        let animateInterval = setInterval(animate, 50);
    }

    document.addEventListener('keydown', function(event){
        let key = event.keyCode;
        if(key == 38){
            if(player.y >= 0){
                moveUp = true;
            }else{
                moveUp = false;
            }
        }
        if(key == 40){
            if(player.y >= (cH - player.h)){
                moveDown = false;
            }else{
                moveDown = true;
            }
        }
        if(key == 32){
            spaceHit = true;
            shootCheck += 1;
            shoot();
        }
    });

    document.addEventListener('keyup', function(event){
        let key = event.keyCode;
        if(key == 38){
            moveUp = false;
        }
        if(key == 40){
            moveDown = false;
        }
        if(key == 32){
            spaceHit = false;
            shoot();
        }
    });

}

function startPage(){
    let ctx = document.getElementById("myCanvas").getContext('2d');
    let cW = ctx.canvas.width;
    let cH = ctx.canvas.height;
    
    ctx.drawImage(bg, 0, 0);
    ctx.font = "bold 72px Arial, sans-serif";
    ctx.fillStyle = "#fff";
    ctx.fillText("Press Space to Start", cW/7 ,cH/2);

    document.addEventListener('keydown', function spPress(event){
        let key = event.keyCode;
        if(key == 32){
            ctx.clearRect(0, 0, cW, cH);
            document.removeEventListener('keydown', spPress);
            initCanvas();
            playMusic.play();
        }
    });
}

window.addEventListener('load', function(event){
    startPage();
    
});
