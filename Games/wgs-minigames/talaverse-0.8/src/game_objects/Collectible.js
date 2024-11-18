import GameObject from "./GameObject.js";

export default class Collectible extends GameObject
{
    constructor(context, image, point=0) {
        super();

        this.context = context;
        this.image = image;
        this.point = point;
    }
}
