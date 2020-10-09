// Using canvas to display the Mandelbrot set

const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

// create image data to control pixel values
const mandelbrotSet = new ImageData(context, canvas.width, canvas.height);

// define boundaries
const realBounds = { min: -2, max: 2 };
realBounds.range = realBounds.max - realBounds.min;

const imaginaryBounds = { min: -2, max: 2 };
imaginaryBounds.range = imaginaryBounds.max - imaginaryBounds.min;

// get real and imaginary components from pixel coordinates
getRealFromCol = (col) => (col / canvas.width) * realBounds.range + realBounds.min;
getImaginaryFromRow = (row) => (row / canvas.width) * imaginaryBounds.range + imaginaryBounds.min;

const maxIterations = 50;
const divergeThreshold = 20;

// set each pixel to corrospond to Mandelbrot set
for (let row = 0; row < canvas.height; row++) {
    for (let col = 0; col < canvas.width; col++) {

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
        let diverge = false;
        for (let iteration = 0; iteration < maxIterations; iteration++){
            zReal = zReal**2 - zImaginary**2 + real;
            zImaginary = 2 * zReal * zImaginary + imaginary;

            const absValue = Math.abs(zReal - zImaginary);
            if (absValue > divergeThreshold) {
                diverge = true;
                break;
            }
        }

        if (diverge == false) {
            mandelbrotSet.setRed(row, col, 255);
            mandelbrotSet.setGreen(row, col, 255);
            mandelbrotSet.setBlue(row, col, 255);
        }
        mandelbrotSet.setAlpha(row, col, 255);
    }
}

mandelbrotSet.draw();


