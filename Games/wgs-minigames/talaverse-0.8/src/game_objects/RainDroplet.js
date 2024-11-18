import Collectible from "./Collectible.js";

export default class RainDroplet extends Collectible
{
    constructor(offscreenCanvas, context, image, point=-1) {
        super();

        this.offscreenCanvas = offscreenCanvas;
        this.context = context;
        this.point = point;
        this.image = image;

        this.originalW = 128;
        this.originalH = 162;
        this.w = this.originalW;
        this.h = this.originalH;
    }

    render() {
        this.context.drawImage(
            this.offscreenCanvas,
            600, 210, 128, 162,
            this.x + (this.x < 0 ? -1 : 0) >> 0,
            this.y + (this.y < 0 ? -1 : 0) >> 0,
            this.w >> 0, this.h >> 0
        );
    }
}
