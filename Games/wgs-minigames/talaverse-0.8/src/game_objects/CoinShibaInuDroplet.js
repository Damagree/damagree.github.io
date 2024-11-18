import Collectible from "./Collectible.js";

export default class CoindShibaInuDroplet extends Collectible
{
    constructor(offscreenCanvas, context, image, point=2, weight=1.5){
        super();


        this.offscreenCanvas = offscreenCanvas;
        this.context = context;
        this.point = point;
        this.image = image;
        this.weight = weight;

        this.originalW = image.width;
        this.originalH = image.height;
        this.scale = 5;
        this.w = this.originalW * this.scale;
        this.h = this.originalH * this.scale;
    }

    render() {
        this.context.drawImage(
            this.image,
            0, 0, this.originalW, this.originalH,
            this.x + (this.x < 0 ? -1 : 0) >> 0,
            this.y + (this.y < 0 ? -1 : 0) >> 0,
            this.w >> 0,
            this.h >> 0
        )
    }
}