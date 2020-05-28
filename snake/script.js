const blockSize = 16;
const blocksX = 49;
const blocksY = 29;
let randomX = () => Math.floor(Math.random() * blocksX) * blockSize;
let randomY = () => Math.floor(Math.random() * blocksY) * blockSize;

class Food {
    constructor(context){
        this.color = "#c0392b";
        this.ctx = context;
        this.x = randomX();
        this.y = randomY();
    }
    
    render(){
        this.ctx.strokeStyle = "#fff";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.x, this.y, blockSize, blockSize)
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, blockSize, blockSize);
    }
}

class Snake {
    constructor(context){
        this.color = "#27ae60";
        this.ctx = context;
        this.x = randomX();
        this.y = randomY();
        this.score = 0;
        this.direction = Math.floor(Math.random() * 4) + 1;
        this.body = [];
        this.body[0] = {x: this.x, y: this.y};
        this.body[1] = {x: this.x, y: this.y};
        this.snakeX = this.body[0].x;
        this.snakeY = this.body[0].y;
    }

    render(food){ 
        this.body.forEach((item,index) => {
            this.ctx.lineWidth = 2;

            if(index == 0)
                this.ctx.strokeStyle = "#fff";
            else
                this.ctx.strokeStyle = "#bdc3c7";

            this.ctx.strokeRect(item.x, item.y, blockSize, blockSize)
            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(item.x, item.y, blockSize, blockSize);

            if(index == 0){
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.arc(item.x + (blockSize/2), item.y + (blockSize/2), (blockSize/4), 0, Math.PI*2, false);
                this.ctx.stroke();
            }
        });

        if(this.snakeX == food.x && this.snakeY == food.y){
            this.score++;
            food.x = randomX();
            food.y = randomY();
        }else{
            this.body.pop();
        }
        
        if(this.direction == 1) this.snakeX -= blockSize;
        if(this.direction == 2) this.snakeY -= blockSize;
        if(this.direction == 3) this.snakeX += blockSize;
        if(this.direction == 4) this.snakeY += blockSize;

        this.body.unshift({x: this.snakeX, y: this.snakeY});
    }

    gameOver(){
        if(this.snakeX < 0 || this.snakeX > blocksX * blockSize || this.snakeY < 0 || this.snakeY > blocksY * blockSize){
            return true;
        }
        for (let i = 1; i < this.body.length; i++) {
            if(this.snakeX == this.body[i].x && this.snakeY == this.body[i].y){
                return true;
            }
        }
    }
}

function pauseScreen(ctx, gameOver, gamePause, pauseCount){
    let primaryText;

    if(pauseCount < 1){
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = "28px monospace";
        ctx.fillStyle = "#fff";

        if(pauseCount == -1) 
            primaryText = "Play Game";
        else if(gameOver) 
            primaryText = "Game Over";
        else if(gamePause) 
            primaryText = "Game Paused";

        ctx.fillText(primaryText, ctx.canvas.width/2 - 80, ctx.canvas.height/2);
        ctx.font = "20px monospace";
        ctx.fillText("Press space to continue", ctx.canvas.width/2 - 130, ctx.canvas.height*(3/4));
    }
}

function initGame() {
    let context = document.querySelector("#canvas").getContext("2d");
    let canvasWidth = context.canvas.width;
    let canvasHeight = context.canvas.height;
    let gameOver = false;
    let gamePause = true;
    let snake = new Snake(context);
    let food = new Food(context);
    let pauseCount = -1;

    pauseScreen(context, gameOver, gamePause, pauseCount);

    function game() {
        if(!gamePause && !gameOver){
            context.clearRect(0, 0, canvasWidth, canvasHeight);
            let gradient = context.createLinearGradient(0, 0, 0, canvasHeight)
            gradient.addColorStop(0, "#16a085")
            gradient.addColorStop(1, "#1abc9c")
            context.fillStyle = gradient;
            context.fillRect(0, 0, canvasWidth, canvasHeight);
            
            food.render();
            snake.render(food);
            if(snake.gameOver()){
                snake = new Snake(context);
                gameOver = true;
            }
            
            context.fillStyle = "#fff";
            context.font = "15px monospace";
            context.fillText("Score: " + snake.score, 10, 20);
            pauseCount = 0;
        }else{
            pauseScreen(context, gameOver, gamePause, pauseCount);
            pauseCount++;
        }
    }

    document.addEventListener("keydown", function(event) {
        let key = event.keyCode;
        if(key == 37 && snake.direction != 3 && !gamePause && !gameOver){
            snake.direction = 1;
        }else if(key == 38 && snake.direction != 4 && !gamePause && !gameOver){
            snake.direction = 2;
        }else if(key == 39 && snake.direction != 1 && !gamePause && !gameOver){
            snake.direction = 3;
        }else if(key == 40 && snake.direction != 2 && !gamePause && !gameOver){
            snake.direction = 4;
        }else if(key == 32){ 
            if(gameOver) 
                gameOver = gamePause = false;
            else 
                gamePause = gamePause ? false : true;

            if(pauseCount == -1) 
                setInterval(game, 100);
        }
    });
}

window.addEventListener('load', initGame);