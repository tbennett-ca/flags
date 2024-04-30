//////////////////////////
// Canvas and UI
//////////////////////////

const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
clearBtn = document.querySelector(".clear-canvas"),
submitBtn = document.querySelector(".submit-img")
ctx = canvas.getContext("2d");

let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
selectedColor = "#000",
brushWidth = 5;

// TODO: add undo/redo
// TODO: add more colours
// TODO: add fill button
// TODO: API

window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
})

function drawRect(e){
    if(!fillColor.checked){
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

function drawCircle(e){
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2))
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2*Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
    //ctx.fillCircle(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

function drawLine(e){
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
}

function startDraw(e){
    isDrawing = true;
    prevMouseX = e.offsetX
    prevMouseY = e.offsetY;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;

    // copy canvas to avoid dragging image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function endDraw(){
    isDrawing = false;
}

function drawing(e){
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0); // add copied data to canvas

    switch(selectedTool) {
        case "rectangle":
            drawRect(e);
            break;
        case "circle":
            drawCircle(e);
            break;
        case "line":
            drawLine(e);
            break;
        default:
            // brush
            ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            ctx.moveTo(e.offsetX, e.offsetY);
      }

}

function processDrawing(){
    let imageData = canvas.toDataURL("image/jpeg");
    console.log(imageData);
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(selectedTool);
    })
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value)

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    })
});

clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
})

submitBtn.addEventListener("click", () => processDrawing())

canvas.addEventListener("mousedown", startDraw)
canvas.addEventListener("mousemove", drawing)
document.addEventListener("mouseup", endDraw)

//////////////////////////
// Image matching
//////////////////////////

var fs = require('fs')
var files = fs.readdirSync('/flags/')
console.log(files)