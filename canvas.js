window.addEventListener('load', () => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    // Resizing
    canvas.height = 300; //window.innerHeight;
    canvas.width = 533; //window.innerWidth;

    // Variables
    let painting = false;

    function startPosition(e){
        painting = true;
        draw(e);
    }

    function finishPosition(){
        painting = false;
        ctx.beginPath();
    }

    function draw(e){
        if(!painting) return;

        ctx.lineWidth = 30;
        ctx.lineCap = 'round';

        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX, e.clientY);
    }

    // Event Listeners
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', finishPosition);
    canvas.addEventListener('mousemove', draw);

    /*
    ctx.fillStyle = "green";
    ctx.fillRect(50, 70, 300, 200);
    ctx.strokeStyle = "red";
    ctx.strokeRect(80, 90, 200, 100);

    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(200, 100);
    ctx.lineTo(250, 150);
    ctx.closePath();
    ctx.stroke();*/
});