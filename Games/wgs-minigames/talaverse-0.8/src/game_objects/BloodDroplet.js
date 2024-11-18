import Collectible from "./Collectible.js";

export default class BloodDroplet extends Collectible
{
    constructor(offscreenCanvas, context, image, point=1, bloodType=0) {
        super();

        this.offscreenCanvas = offscreenCanvas;
        this.context = context;
        this.point = point;
        this.image = image;

        this.originalW = 128;
        this.originalH = 162;
        this.w = this.originalW;
        this.h = this.originalH;

        let clips = [
            { x: 0,   y: 210 }, // O+
            { x: 150, y: 210 }, // O-
            { x: 300, y: 210 }, // A+
            { x: 450, y: 210 }, // A-
            { x: 0,   y: 395 }, // B+
            { x: 150, y: 395 }, // B-
            { x: 300, y: 395 }, // AB+
            { x: 450, y: 395 }, // AB-
        ];
        this.clip = clips[bloodType % clips.length];
    }

    render() {
        this.context.drawImage(
            this.offscreenCanvas,
            this.clip.x, this.clip.y, 128, 162,
            this.x + (this.x < 0 ? -1 : 0) >> 0,
            this.y + (this.y < 0 ? -1 : 0) >> 0,
            this.w >> 0, this.h >> 0
        );
    }
}
