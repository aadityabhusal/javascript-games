const blockSize = 16;
const blocks = 39;
let random = () => Math.floor(Math.random() * blocks) * blockSize;

class Food {
    constructor(context){
        this.color = "red";
        this.ctx = context;
        this.x = random();
        this.y = random();
    }
    render(){
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, blockSize, blockSize);
    }
}

class Snake {
    constructor(context){
        this.color = "green";
        this.ctx = context;
        this.x = random();
        this.y = random();
        this.score = 0;
        this.direction = Math.floor(Math.random() * 4) + 1;
        this.body = [];
        this.body[0] = {x: this.x, y: this.y};
        this.snakeX = this.body[0].x;
        this.snakeY = this.body[0].y;
    }

    render(food){ 
        this.body.forEach(item => {
            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(item.x, item.y, blockSize, blockSize);
        });

        if(this.snakeX == food.x && this.snakeY == food.y){
            this.score++;
            console.log(this.score);
            food.x = random();
            food.y = random();
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
        if(this.snakeX < 0 || this.snakeX > blocks * blockSize || this.snakeY < 0 || this.snakeY > blocks * blockSize){
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
        context.fillStyle = "#fff";
        context.font = "15px Arial";
        context.fillText("Score: " + snake.score, 5, 20);
        food.render();
        snake.render(food);
        if(snake.gameOver()){
            clearInterval(play);
        }
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