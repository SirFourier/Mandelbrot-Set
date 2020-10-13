/* -----------------------Calculating the Mandelbrot set using HTML canvas----------------------- */

const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 600;

// Create image data from ImageData class
const mandelbrotSet = new ImageData(context, canvas.width, canvas.height);

// initialise complex plane properties
let boundary = null;
let horizontalOffset = null;
let verticalOffset = null;
let realBounds = { min: null, max: null };
let imaginaryBounds = { min: null, max: null };

function getMousePos(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        row: event.clientY - rect.top,
        col: event.clientX - rect.left
    }
}

const divergeThreshold = 4;
let maxIterations = 100;

// map value with range to new value with new range
translate = (value, min, max, newMin, newMax) => ((value - min) / (max - min)) * (newMax - newMin) + newMin;

function generateMandelbrotSet() {
    // set each pixel to corrospond to Mandelbrot set
    for (let row = 0; row < canvas.height; row++) {
        for (let col = 0; col < canvas.width; col++) {

            // map position to complex number
            const real = translate(col, 0, canvas.width, realBounds.min, realBounds.max);
            const imaginary = translate(row, 0, canvas.height, imaginaryBounds.min, imaginaryBounds.max);
            
            // Mandelbrot set iteraiton:
            // (z+1) = z^2 + c (where c is the original complex number)
            //
            // this is how to square a complex number:
            // (a+bi)**2
            // a**2 + 2abi - b**2
            // real = a**2 - b**2
            // imaginary = 2ab
    
            let zReal = 0;
            let zImaginary = 0;
            let iteration = 0;
            for (iteration; iteration < maxIterations; iteration++){
                // square complex number and add the original complex number
                const tempZReal = zReal;
                zReal = zReal**2 - zImaginary**2 + real;
                zImaginary = 2 * tempZReal * zImaginary + imaginary;

                if (zReal**2 + zImaginary**2 > divergeThreshold) {
                    break;
                }
            }
            
            const brightness = 255 * iteration / maxIterations;
            mandelbrotSet.setRGBA(row, col, brightness, brightness, brightness, 255);
        }
    }
}

function showComplexNumber(colour, x, y, real, imaginary, xTextOffset=0, yTextOffset=0) {
        // draw dot
        context.beginPath();
        context.arc(x, y, 5, 0, 2 * Math.PI);
        context.fillStyle = colour;
        context.fill();
        context.closePath();

        // show complex number as text
        context.font = "20px Arial";
        context.fillText(`${real.toFixed(4)} + ${-imaginary.toFixed(4)}i`, x + xTextOffset, y + yTextOffset);
}

// show iterating lines
const showLines = document.getElementById("showLines");
showLines.checked = true;
canvas.addEventListener("mousemove", function(event) {
    if (showLines.checked) {
        // clear canvas to mandelbrot set
        mandelbrotSet.draw();

        const mousePos = getMousePos(event);

        // map position to complex number
        const real = translate(mousePos.col, 0, canvas.width, realBounds.min, realBounds.max);
        const imaginary = translate(mousePos.row, 0, canvas.height, imaginaryBounds.min, imaginaryBounds.max);

        let zReal = 0;
        let zImaginary = 0;
        let iteration = 0;

        // draw dot on initial complex number and show the complex number;
        showComplexNumber("red", mousePos.col, mousePos.row, real, imaginary, -175, 0);

        context.beginPath();
        context.moveTo(mousePos.col, mousePos.row);
        context.strokeStyle = "#e65c0cb6";
        let posRow = null;
        let posCol = null;
        for (iteration; iteration < maxIterations; iteration++){
            // square complex number and add the original complex number
            const tempZReal = zReal;
            zReal = zReal**2 - zImaginary**2 + real;
            zImaginary = 2 * tempZReal * zImaginary + imaginary;
            
            // draw iterating lines on current mouse position
            posRow = translate(zImaginary, imaginaryBounds.min, imaginaryBounds.max, 0, canvas.height); 
            posCol = translate(zReal, realBounds.min, realBounds.max, 0, canvas.width); 
            context.lineTo(posCol, posRow);   
            context.stroke();
        }
        context.closePath();

        // draw dot on last iteration and show the complex number assoiciated with it;
        showComplexNumber("green", posCol, posRow, zReal, zImaginary, 20, 0);
    }
});

// initialise sliders
const sliders = {
    scale:      document.getElementById("scale"),
    horizontal: document.getElementById("horizontal"),
    vertical:   document.getElementById("vertical"),
    iterations: document.getElementById("iterations")
};

sliders.scale.min = 0.00001;
sliders.scale.max = 2;
sliders.scale.step = 0.00001;
sliders.scale.value = 2;

sliders.horizontal.min = -5;
sliders.horizontal.max = 5;
sliders.horizontal.step = 0.00001;
sliders.horizontal.value = 0;

sliders.vertical.min = -5;
sliders.vertical.max = 5;
sliders.vertical.step = 0.00001;
sliders.vertical.value = 0;

sliders.iterations.min = 1;
sliders.iterations.max = 100;
sliders.iterations.step = 1;
sliders.iterations.value = 50;

function drawMandelbrotSet() {
    boundary = parseFloat(sliders.scale.value);
    
    horizontalOffset = parseFloat(sliders.horizontal.value);
    verticalOffset = parseFloat(sliders.vertical.value);
    
    realBounds.min = -boundary + horizontalOffset;
    realBounds.max =  boundary + horizontalOffset;

    imaginaryBounds.min = -boundary + verticalOffset; 
    imaginaryBounds.max = boundary + verticalOffset;

    generateMandelbrotSet();
    mandelbrotSet.draw();
}

// display max number of iterations next to the slider
const iterationsValue = document.getElementById("iterationsValue");
iterationsValue.innerHTML = sliders.iterations.value;
sliders.iterations.oninput = () => {
    // redraw Mandelbrot set when iterations slider changes
    iterationsValue.innerHTML = sliders.iterations.value;
    maxIterations = sliders.iterations.value;
    drawMandelbrotSet();
};

// initialise Mandelbrot set
drawMandelbrotSet();

// Re-draw Mandelbrot set when slider values change
Object.keys(sliders).filter(slider => slider != "iterations").forEach(slider => sliders[slider].oninput = drawMandelbrotSet);
