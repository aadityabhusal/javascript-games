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
            if(index == 0){
                this.ctx.strokeStyle = "#fff";
            }else{
                this.ctx.strokeStyle = "#bdc3c7";

            }
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

function initGame() {
    let context = document.querySelector("#canvas").getContext("2d");
    let canvasWidth = context.canvas.width;
    let canvasHeight = context.canvas.height;

    let snake = new Snake(context);
    let food = new Food(context);
    
    function game() {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        let gradient = context.createLinearGradient(0, 0, 0, canvasHeight)
        gradient.addColorStop(0, "#16a085")
        gradient.addColorStop(1, "#1abc9c")
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvasWidth, canvasHeight);
        
        food.render();
        snake.render(food);
        if(snake.gameOver()){
            clearInterval(play);
        }
        
        context.fillStyle = "#fff";
        context.font = "15px monospace";
        context.fillText("Score: " + snake.score, 10, 20);
    }

    let play = setInterval(game, 100);

    document.addEventListener("keydown", function(event) {
        let key = event.keyCode;
        if(key == 37 && snake.direction != 3){
            snake.direction = 1;
        }else if(key == 38 && snake.direction != 4){
            snake.direction = 2;
        }else if(key == 39 && snake.direction != 1){
            snake.direction = 3;
        }else if(key == 40 && snake.direction != 2){
            snake.direction = 4;
        }
    })

}

window.addEventListener('load', initGame);