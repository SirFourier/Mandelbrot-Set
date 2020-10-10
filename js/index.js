// Using canvas to display the Mandelbrot set

const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

// create image data to control pixel values
const mandelbrotSet = new ImageData(context, canvas.width, canvas.height);

// slider to zoom
const zoomSlider = document.getElementById("zoom");
zoomSlider.oninput = main;

// slider to move in the horizontal plane
const horizontalSlider = document.getElementById("horizontal");
horizontalSlider.oninput = main;

// slider to move in the vertical plane
const verticalSlider = document.getElementById("vertical");
verticalSlider.oninput = main;

// define boundaries
let boundary = null;
let horizontalOffset = null;
let verticalOffset = null;
let realBounds = undefined;
let imaginaryBounds = undefined;

// get real and imaginary components from pixel coordinates
getRealFromCol = (col) => (col / canvas.width) * realBounds.range + realBounds.min;
getImaginaryFromRow = (row) => (row / canvas.height) * imaginaryBounds.range + imaginaryBounds.min;

function calculateMandelbrotSet() {
    const maxIterations = 100;
    const divergeThreshold = 4;

    // set each pixel to corrospond to Mandelbrot set
    for (let row = 0; row < canvas.height; row++) {
        for (let col = 0; col < canvas.width; col++) {
            
            // map position to complex number
            const real = getRealFromCol(col);
            const imaginary = getImaginaryFromRow(row);
    
            // (z+1) = z^2 + c (where c is the original complex number)
    
            // square a complex number
            // (a+bi)**2
            // a**2 + 2abi - b**2
            // real = a**2 - b**2
            // imaginary = 2ab
    
            let zReal = 0;
            let zImaginary = 0;
            let absValue = 0;
            let iteration = 0;
            for (iteration; iteration < maxIterations; iteration++){
                // square complex number and add the original complex number
                const tempZReal = zReal;
                zReal = zReal**2 - zImaginary**2 + real;
                zImaginary = 2 * tempZReal * zImaginary + imaginary;

                absValue = zReal**2 + zImaginary**2;
                if (absValue > divergeThreshold) {
                    break;
                }
            }

            const brightness = 255*iteration/maxIterations
            mandelbrotSet.setRed(row, col, brightness);
            mandelbrotSet.setGreen(row, col, brightness);
            mandelbrotSet.setBlue(row, col, brightness);
            mandelbrotSet.setAlpha(row, col, 255);
        }
    }
}

function main() {
    boundary = 2 * parseFloat(zoomSlider.value);

    horizontalOffset = parseFloat(horizontalSlider.value);
    verticalOffset = parseFloat(verticalSlider.value);

    realBounds = { min: -boundary + horizontalOffset, max: boundary + horizontalOffset };
    realBounds.range = realBounds.max - realBounds.min;

    imaginaryBounds = { min: -boundary + verticalOffset , max: boundary + verticalOffset };
    imaginaryBounds.range = imaginaryBounds.max - imaginaryBounds.min;

    calculateMandelbrotSet();
    mandelbrotSet.draw();
}

main();