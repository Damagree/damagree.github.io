export default class GameObject
{
    constructor(offscreenCanvas, context, image, x=0, y=0, vx=0, vy=0, w=0, h=0, weight=1) {
        this.offscreenCanvas = offscreenCanvas; // CanvasRenderingContext2D()
        this.context = context;                 // CanvasRenderingContext2D()
        this.x = x;                             // horizontal position in pixels
        this.y = y;                             // vertical position in pixels
        this.vx = vx;                           // horizontal velocity in canvas width per second
        this.vy = vy;                           // vertical velocity in canvas height per second
        this.originalW = w;                     // original width in pixels
        this.originalH = h;                     // original height in pixels
        this.w = w;                             // width in pixels
        this.h = h;                             // height in pixels
        this.boundaryX = x;                     // collission boundary on the X axis in pixels
        this.boundaryY = y;                     // collission boundary on the Y axis in pixels
        this.boundaryW = w;                     // collission boundary width in pixels
        this.boundaryH = h;                     // collission boundary height in pixels
        this.scale = 1;                         // scale of the object
        this.image = image;                     // Image()
        this.weight = weight;
    }

    render() {
        this.context.drawImage(
            this.image,
            this.x + (this.x < 0 ? -1 : 0) >> 0, // position on the X axis on canvas
            this.y + (this.y < 0 ? -1 : 0) >> 0, // position on the Y axis on canvas
            this.w >> 0, this.h >> 0             // size on canvas
        );
    }

    renderBoundary() {
        this.context.save();
        this.context.strokeStyle = "green";
        context.strokeRect(
            this.x + this.boundaryX,
            this.y + this.boundaryY,
            this.boundaryW,
            this.boundaryH
        );
        this.context.restore();
    }

    moveLeft(elapsedTime, boardWidth) {
        this.x -= this.vx * boardWidth * elapsedTime;
    }

    moveRight(elapsedTime, boardWidth) {
        this.x += this.vx * boardWidth * elapsedTime;
    }

    moveDown(elapsedTime, boardHeight) {
        this.y += this.vy * boardHeight * elapsedTime;
    }

    moveUp(elapsedTime, boardHeight) {
        this.y -= this.vy * boardHeight * elapsedTime;
    }

    collidesWith(gameObject) {
        return (
            this.x + this.boundaryX < gameObject.x + gameObject.w &&
            this.x + this.boundaryX + this.boundaryW > gameObject.x &&
            this.y + this.boundaryY < gameObject.y + gameObject.h &&
            this.y + this.boundaryY + this.boundaryH > gameObject.y
        );
    }

    resize(scale) {
        this.scale = scale;
        this.w = this.originalW * scale;
        this.h = this.originalH * scale;
        this.boundaryW = this.originalW * scale;
        this.boundaryH = this.originalH * scale;
    }
}
