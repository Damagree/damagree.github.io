import Collectible from "./Collectible.js";

export default class CoinTalax1 extends Collectible
{
    constructor(offscreenCanvas, context, image, point=1, weight=1){
        super();


        this.offscreenCanvas = offscreenCanvas;
        this.context = context;
        this.point = point;
        this.image = image;
        this.weight = weight;

        this.originalW = image.width;
        this.originalH = image.height;
        this.scale = 0.5;
        this.w = this.originalW;
        this.h = this.originalH;
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