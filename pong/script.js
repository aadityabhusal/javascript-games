
class Player{
    constructor(num, ctx){
        this.ctx = ctx;
        this.y = ctx.canvas.height /2 - this.h/2;
        if(num == 1){
            this.x = 0;
        }else{
            this.x = ctx.canvas.width - this.w;
        }
    }
    h = 120;
    w = 30;
    score = 0;
    render(){
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

class Ball{
    constructor(ctx){
        this.ctx = ctx;
        this.y = this.ctx.canvas.height/2 - this.radius/2;
        this.x = this.ctx.canvas.width/2 - this.radius/2;
    }

    radius = 20;
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

    update(user,comp){
        this.x += this.velocityX;
        this.y += this.velocityY;

        if(this.y+this.radius > this.ctx.canvas.height || this.y-this.radius < 0){
            this.velocityY = - this.velocityY;
        }

        let player = (this.x < this.ctx.canvas.width/2) ? user : comp;

        if(collision(this, player)){
            let collidePoint = (this.y - (player.y + player.h/2));
            collidePoint = collidePoint / (player.h/2);
            let angleRad = (Math.PI/4)*collidePoint;

            let dirn = (this.x < this.ctx.canvas.width/2) ? 1 : -1;

            this.velocityX = dirn * (this.speed * Math.cos(angleRad));
            this.velocityY = dirn * (this.speed * Math.sin(angleRad));
            this.speed += 0.1;
        }

        if(this.x - this.radius < 0){
            comp.score++;
            this.reset();
        }else if(this.x+this.radius > this.ctx.canvas.width){
            user.score++;
            this.reset();
        }
    }

    reset(){
        this.x = this.ctx.canvas.width/2 - this.radius/2;
        this.y = this.ctx.canvas.height/2 - this.radius/2;
        this.speed = 5;
        this.velocityX = -this.velocityX;
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
    player.bottom = player.y + player.h;
    player.left = player.x;
    player.right = player.x + player.w;
    
    ball.top = ball.y - ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x + ball.radius;
    
    return (player.left < ball.right && player.top < ball.bottom && player.right > ball.left && player.bottom > ball.top);
}

function initGame(){
    let context = document.getElementById("canvas").getContext("2d");
    let cW = context.canvas.width;
    let cH = context.canvas.height;
    
    


    let user = new Player(1, context);
    let comp = new Player(2, context);
    comp.y -= 20;
    let ball = new Ball(context);
    
    function play(){
        context.clearRect(0,0, cW, cH)
        centerLine(context);
        user.render();
        comp.render();
        ball.render();
            
        ball.update(user, comp);
    
        drawText(user.score, cW/4, cH/5, context);
    
        drawText(comp.score, 3*cW/4, cH/5, context);
    }

    setInterval(play, 1000/50);

    document.addEventListener("mousemove", function(event){
        let rect = context.canvas.getBoundingClientRect();
        if(event.clientY > rect.top+(user.h/2) && event.clientY < rect.top + cH - (user.h/2)){
            user.y = event.clientY - rect.top - user.h/2;
        }
    })
}






window.addEventListener('load', event => initGame());