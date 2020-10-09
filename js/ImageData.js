// Create an image data object and define pixel values

class ImageData {
    #width = null;
    #height = null;
    #imageData = undefined;
    #context = undefined;

    constructor(context, width, height) {
        this.#context = context;
        this.#width = width;
        this.#height = height;
        this.#imageData = context.createImageData(width, height);
    }

    #getPixelIndex = (row, col) => (row * this.#width + col) * 4; 

    setRed(row, col, value) {
        const index = this.#getPixelIndex(row, col);
        this.#imageData.data[index] = value;
    }

    setGreen(row, col, value) {
        const index = this.#getPixelIndex(row, col);
        this.#imageData.data[index + 1] = value;
    }

    setBlue(row, col, value) {
        const index = this.#getPixelIndex(row, col);
        this.#imageData.data[index + 2] = value;
    }

    setAlpha(row, col, value) {
        const index = this.#getPixelIndex(row, col);
        this.#imageData.data[index + 3] = value;
    }

    // draw from top left corner
    draw(row=0, col=0) {
        this.#context.putImageData(this.#imageData, row, col);
    }
}