function setBackground(context) {
    let skyColor = context.createLinearGradient(0, 0, 0, 400);
    skyColor.addColorStop(0, '#3498db');
    skyColor.addColorStop(1, '#1276b9');
    context.fillStyle = skyColor;
    context.fillRect(0,0, 480, 420);

    let groundColor = context.createLinearGradient(0, 420, 0, 480);
    groundColor.addColorStop(0, "#1abc9c")
    groundColor.addColorStop(1, "#16a085")
    context.fillStyle = groundColor;
    context.fillRect(0,420, 480, 480);
}

function Pipe(context) {
    this.color = "#009432";
    this.border = "#44bd32";
    this.height = 150;
    this.width = 80;
    this.x = 480;
    this.top = Math.floor(Math.random() * 220);

    this.render = function(){
        // Pipe Border
        context.lineWidth = 10;
        context.strokeStyle = this.border;
        context.strokeRect(this.x, 0, this.width, this.top);
        context.strokeRect(this.x, this.top+this.height, this.width, 420 - (this.top+this.height) - 5);
        // Pipe Body
        context.fillStyle = this.color;
        context.fillRect(this.x, 0, this.width, this.top);
        context.fillRect(this.x, this.top+this.height, this.width, 420 - (this.top+this.height) - 5);
    }

    this.collision = function(bird){
        if((bird.x+bird.radius >= this.x && bird.y <= this.top) || (bird.x+bird.radius >= this.x && bird.y+bird.radius >= this.top+this.height)){
            return true;
        }

        // if(((bird.x + bird.radius >= this.x) && (bird.x <= this.x + this.width)) && bird.y <= this.top){
        //     return true
        // }
    }
}

function intiGame() {
    let context = document.getElementById("canvas").getContext("2d");
    let contextWidth = context.canvas.width;
    let contextHeight = context.canvas.height;
    let spacePressed = false;
    let gravity = -4;
    let angle = 0;
    let pipes = [];

    let bird = {
        x: contextWidth/3,
        y: contextHeight/3,
        radius: 25,
        render(degree){
            context.save();
            let radian = degree * Math.PI / 180;
            context.translate(this.x + this.radius / 2, this.y + this.radius / 2);
            context.rotate(radian);
            // Body
            context.fillStyle = "#f1c40f";
            context.beginPath();
            context.arc(this.radius/-2, this.radius/-2, this.radius, Math.PI*1.8, Math.PI*0.7, false);
            context.closePath();
            context.fill();
            // Beak
            context.fillStyle = "#c0392b";
            context.fillRect((this.radius/-2)+this.radius-1, (this.radius/-2)+2, 10, 5);
            // Eye
            context.fillStyle = "#fff";
            context.beginPath();
            context.arc((this.radius/-2)+this.radius-8, this.radius / -2, 3, 0, Math.PI*2, false);
            context.closePath();
            context.fill();
            context.restore();
        }
    }

    

    pipes.push(new Pipe(context));

    function createPipe(){
        pipes.push(new Pipe(context));
    }

    setInterval(createPipe, 2000);

    function play() {
        context.clearRect(0, 0, contextWidth, contextHeight);
        setBackground(context);
        
        pipes.forEach((item, index, array) => {
            item.x -= 2;
            item.render();
            if(item.x+item.width <= 0){
                array.splice(index, 1);
            }

            if(item.collision(bird)){
                console.log("collision!");
            }
        });

        bird.render(angle);
        if(spacePressed){
            bird.y -= 5;
            gravity = -4;
            angle = 0;
        }else{
            if(bird.y+bird.radius <= 420){
                if(gravity <= 10){
                    gravity += 0.4;
                }
                if(gravity >= 6){
                    angle += 3;
                }
                bird.y += gravity;
            }
        }

        requestAnimationFrame(play);
    }
    requestAnimationFrame(play);

    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 32){
            spacePressed = true;
        }
    });

    document.addEventListener('keyup', function(event) {
        if(event.keyCode == 32){
            spacePressed = false;
        }
    })

}

window.addEventListener('load', intiGame);