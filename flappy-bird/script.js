function setBackground(context) {
    // Painting the sky
    let skyColor = context.createLinearGradient(0, 0, 0, 400);
    skyColor.addColorStop(0, '#3498db');
    skyColor.addColorStop(1, '#1276b9');
    context.fillStyle = skyColor;
    context.fillRect(0,0, 480, 420);
    // Painting the ground
    let groundColor = context.createLinearGradient(0, 420, 0, 480);
    groundColor.addColorStop(0, "#1abc9c")
    groundColor.addColorStop(1, "#16a085")
    context.fillStyle = groundColor;
    context.fillRect(0,420, 480, 480);
}

class Bird {
    constructor(context){
        this.context = context;
        this.x = this.context.canvas.width/3;
        this.y = this.context.canvas.height/3;
        this.width = 35;
        this.height = 25;
        this.score = 0;
    }

    render(degree){
        this.context.save();
        // Rotate the bird
        let radian = degree * Math.PI / 180;
        this.context.translate(this.x + this.width / 2, this.y + this.height / 2);
        this.context.rotate(radian);
        // Body
        this.context.fillStyle = "#e1b12c";
        this.context.fillRect(this.width/-2, this.height/-2, 30, 25);
        // Beak
        this.context.fillStyle = "#c0392b";
        this.context.fillRect((this.width/-2)+this.width-15, (this.height/-2)+14, 16, 8);
         // Wing
         this.context.fillStyle = "#ecf0f1";
         this.context.beginPath();
         this.context.arc((this.width/-2)+3, (this. height/-2)+12, 10, Math.PI*1.7, Math.PI*0.8, false);
         this.context.fill();
        // Eye
        this.context.beginPath();
        this.context.arc((this.width/-2)+this.width-12, (this.height/-2)+7, 6, 0, Math.PI*2, false);
        this.context.fill();
        // Pupil
        this.context.fillStyle = "#000";
        this.context.beginPath();
        this.context.arc((this.width/-2)+this.width-10, (this.height/-2)+7, 2, 0, Math.PI*2, false);
        this.context.fill();
        this.context.restore();
    }
}

function Pipe(context) {
    this.height = 100;
    this.width = 80;
    this.x = 480;
    this.top = Math.floor(Math.random() * 220) + 10;
    let playHeight = 420;

    this.render = function(){
        context.fillStyle = "#009432";
        context.fillRect(this.x, 0, this.width, this.top);
        context.fillRect(this.x, this.top+this.height, this.width, playHeight - (this.top+this.height));
    }

    this.collision = function(bird){
        if((((bird.x + bird.width >= this.x) && (bird.x <= this.x + this.width)) && ((bird.y <= this.top) || (bird.y + bird.height >= this.top + this.height))) || (bird.y + bird.height >= playHeight))
            return true
    }
}

function endScreen(context, highscore = null){
    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = "#fff";
    context.font = "28px monospace";
    let primaryText;

    if(highscore === null){
        primaryText = "Flappy Bird";
    }else{
        primaryText = "Game Over";
        context.fillText("Highscore: "+highscore, context.canvas.width*(1/4), context.canvas.height*(1/4));
    }
    context.fillText(primaryText, context.canvas.width/3, context.canvas.height/2);
    context.font = "20px monospace";
    context.fillText("Press space or click to continue", context.canvas.width*(1/7), context.canvas.height*(3/4));
}

function intiGame() {
    let context = document.getElementById("canvas").getContext("2d");
    let contextWidth = context.canvas.width;
    let contextHeight = context.canvas.height;
    let spacePressed = false;
    let gravity = -4;
    let angle = 0;
    let gameOver = false;
    let gameStart = true;
    let highscore = 0;
    let createPipeInterval;
    let pipes = [];
    let bird = new Bird(context);
    play();
    endScreen(context);

    function createPipe(){
        if(!gameOver){
            pipes.push(new Pipe(context));
            bird.score++;
        }
    }

    function play() {
        context.clearRect(0, 0, contextWidth, contextHeight);
        setBackground(context);
        
        pipes.forEach((item, index, array) => {
            if(!gameOver)
                item.x -= 3;

            if(item.x+item.width <= 0)
                array.splice(index, 1)

            if(item.collision(bird)){
                gameOver = true;
                highscore = (bird.score > highscore) ? bird.score : highscore;
                clearInterval(createPipeInterval);
            }
            item.render();
        });

        if(spacePressed && !gameOver){
            bird.y -= 5;
            gravity = -4;
            angle = -10;
        }else{
            if(bird.y+bird.height <= 420){
                if(gravity <= 10)
                    gravity += 0.4;

                if(gravity >= 6 && angle<=90)
                    angle += 3;

                bird.y += gravity;
            }
        }

        bird.render(angle);
        context.fillStyle = "#fff";
        context.font = "28px monospace";
        context.fillText(bird.score, context.canvas.width/2, 50);
        
        if(gameOver)
            endScreen(context, highscore);
        
        if(!gameStart)
            requestAnimationFrame(play);
    }

    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 32)
            down();
    });
    document.addEventListener('keyup', function(event) {
        if(event.keyCode == 32)
            spacePressed = false;
    })

    context.canvas.addEventListener('mousedown', down);
    context.canvas.addEventListener('mouseup', () => spacePressed = false);

    context.canvas.addEventListener('touchstart', down);
    context.canvas.addEventListener('touchend', () => spacePressed = false);

    function down(){    
        spacePressed = true;
        if(gameOver){
            gameOver = false;
            pipes = [];
            pipes.push(new Pipe(context));
            bird = new Bird(context);
            createPipeInterval = setInterval(createPipe, 2000);
        }
        if(gameStart){
            gameStart = false;
            pipes.push(new Pipe(context));
            requestAnimationFrame(play);
            createPipeInterval = setInterval(createPipe, 2000);
        }
    }
}

window.addEventListener('load', intiGame);