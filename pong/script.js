class Player{
    constructor(ctx, computer = false){
        this.ctx = ctx;
        this.computer = computer;
        this.y = this.ctx.canvas.height /2 - this.height/2;
        if(this.computer){
            this.x = this.ctx.canvas.width - this.width;
        }else{
            this.x = 0;
        }
    }

    height = 120;
    width = 20;
    score = 0;

    render(){
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    autoPlay(ball){
      if(this.computer){
        let level = 0.1;
        if(this.y <= 0){
            this.y = 1;
        }else if(this.y >= this.ctx.canvas.height - this.height){
            this.y = this.ctx.canvas.height - this.height;
        }
        this.y += (ball.y - (this.y + this.height/2)) * level;
      }  
    }
}

class Ball{
    constructor(ctx){
        this.ctx = ctx;
        this.y = this.ctx.canvas.height/2 - this.radius/2;
        this.x = this.ctx.canvas.width/2 - this.radius/2;
    }

    radius = 15;
    speed = 5;
    velocityX = 5;
    velocityY = 5;

    render(){
        this.ctx.fillStyle = "white";
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        this.ctx.closePath();
        this.ctx.fill();
    }

    update(user,computer){
        this.x += this.velocityX;
        this.y += this.velocityY;

        if(this.y+this.radius > this.ctx.canvas.height || this.y - this.radius < 0){
            this.velocityY = - this.velocityY;
        }

        let player = (this.x < this.ctx.canvas.width/2) ? user : computer;

        if(collision(this, player)){
            let collidePoint = (this.y - (player.y + player.height/2));
            collidePoint = collidePoint / (player.height/2);
            let angleRad = (Math.PI/4)*collidePoint;
            let direction = (this.x < this.ctx.canvas.width/2) ? 1 : -1;

            this.velocityX = direction * (this.speed * Math.cos(angleRad));
            this.velocityY = direction * (this.speed * Math.sin(angleRad));
            this.speed += 0.5;
        }

        if(this.x - this.radius < 0){
            computer.score++;
            this.reset();
        }else if(this.x + this.radius > this.ctx.canvas.width){
            user.score++;
            this.reset();
        }
    }

    reset(){
        this.x = this.ctx.canvas.width/2 - this.radius/2;
        this.y = this.ctx.canvas.height/2 - this.radius/2;
        this.speed = 5;
        this.velocityX = -5 * Math.sign(this.velocityX);
        this.velocityY = -5 * Math.sign(this.velocityY);
    }
}

function centerLine(ctx){
    ctx.fillStyle = "black";
    ctx.fillRect(0,0, ctx.canvas.width, ctx.canvas.height);

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 7;
    ctx.setLineDash([20,20])
    ctx.beginPath();
    ctx.moveTo(ctx.canvas.width/2 - 10, 0);
    ctx.lineTo(ctx.canvas.width/2 - 10, ctx.canvas.height);
    ctx.stroke();
}

function drawText(text, x, y, ctx){
    ctx.fillStyle = "white";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

function collision(ball, player) {
    player.top = player.y;
    player.bottom = player.y + player.height;
    player.left = player.x;
    player.right = player.x + player.width;
    
    ball.top = ball.y - ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x + ball.radius;
    
    return (player.left < ball.right && player.top < ball.bottom && player.right > ball.left && player.bottom > ball.top);
}

function initGame(){
    let context = document.getElementById("canvas").getContext("2d");
    let contextWidth = context.canvas.width;
    let contextHeight = context.canvas.height;
    
    let user = new Player(context);
    let computer = new Player(context, true);
    let ball = new Ball(context);
    
    function play(){
        context.clearRect(0,0, contextWidth, contextHeight)
        centerLine(context);
        user.render();
        computer.render();
        console.log(computer.height);
        computer.autoPlay(ball);
        ball.render();
        ball.update(user, computer);
        drawText(user.score, contextWidth/4, contextHeight/5, context);
        drawText(computer.score, 3*contextWidth/4, contextHeight/5, context);
    }

    setInterval(play, 1000/50);
    
    document.addEventListener("mousemove", function(event){
        let rect = context.canvas.getBoundingClientRect();
        if(event.clientY > rect.top+(user.height/2) && event.clientY < rect.top + contextHeight - (user.height/2)){
            user.y = event.clientY - rect.top - user.height/2;
        }
    });
}

window.addEventListener('load', initGame);