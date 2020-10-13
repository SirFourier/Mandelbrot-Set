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

    setRGBA(row, col, red, green, blue, alpha) {
        let index = this.#getPixelIndex(row, col);
        this.#imageData.data[index] = red;
        this.#imageData.data[++index] = green;
        this.#imageData.data[++index] = blue;
        this.#imageData.data[++index] = alpha;
    }

    // draw from top left corner
    draw(row=0, col=0) {
        this.#context.putImageData(this.#imageData, row, col);
    }
}