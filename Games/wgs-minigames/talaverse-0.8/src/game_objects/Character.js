import GameObject from "./GameObject.js";

export default class Character extends GameObject {
    constructor(offscreenCanvas, context, image) {
        super();

        this.offscreenCanvas = offscreenCanvas;
        this.context = context;
        this.image = image;

        this.originalW = 303;
        this.originalH = 320;
        this.w = this.originalW;
        this.h = this.originalH;

        this.moveTo = 0;
        this.direction = 'right';

        this.frameHeight = 334; // in pixels
        this.frameWidth = 339; // in pixels
        this.frameCount = 9; // number of walking animation frames
        this.frameNumber = 0; // current walking animation frame

        this.frameUpdateInterval = 0.6; // in seconds
        this.elapsedTime = 0; // in milliseconds

        this.celebrationTimer = null;
        this.celebrationStartTime = null;
        this.celebrationEndTime = null;
        this.celebrationDuration = 300;
        this.celebrationFrameNumber = 0;
        this.celebrationFrameWidth = 236;
        this.celebrationFrameCount = 3;
        this.isCelebrating = false;

        this.dizzyTimer = null;
        this.dizzyStartTime = null;
        this.dizzyEndTime = null;
        this.dizzyDuration = 300;
        this.dizzyFrameNumber = 0;
        this.dizzyFrameWidth = 236;
        this.dizzyFrameCount = 3;
        this.isDizzy = false;

        this.isWalking = false; // Flag to track if the character should walk
    }

    render() {
        // this.frameNumber = (this.elapsedTime / this.frameUpdateInterval) >> 0;
        // this.frameNumber += this.elapsedTime > 0 ? 1 : 0;
        // this.frameNumber *= this.frameWidth;

        // this.context.drawImage(
        //     this.offscreenCanvas,
        //     this.frameNumber, // clipping x
        //     (this.isDizzy ? 1252 : 585) + (this.direction == 'left' ? this.frameHeight : 0), // clipping y
        //     303, 320, // clipping width and height
        //     this.x + (this.x < 0 ? -1 : 0) >> 0,
        //     this.y + (this.y < 0 ? -1 : 0) >> 0,
        //     this.w >> 0, this.h >> 0
        // );

        // Calculate frame position for rendering
        // Calculate the X-position of the frame in the sprite sheet
        const frameX = this.frameNumber * this.frameWidth;

        // Render the current frame of the character based on direction
        this.context.drawImage(
            this.offscreenCanvas,
            frameX, // X-position in sprite sheet
            (this.isDizzy ? 1252 : 585) + (this.direction == 'left' ? this.frameHeight : 0), // clipping y
            this.frameWidth, this.frameHeight, // Frame width and height
            this.x + (this.x < 0 ? -1 : 0) >> 0,
            this.y + (this.y < 0 ? -1 : 0) >> 0,
            this.w >> 0, this.h >> 0
        );

        if (this.isCelebrating) {
            this.celebrationFrameNumber = Date.now() - this.celebrationStartTime;
            this.celebrationFrameNumber /= this.celebrationDuration / this.celebrationFrameCount;
            this.celebrationFrameNumber = this.celebrationFrameNumber >> 0;
            this.celebrationFrameNumber *= this.celebrationFrameWidth;
            this.celebrationFrameNumber += 1685;

            this.context.drawImage(
                this.offscreenCanvas,
                this.celebrationFrameNumber, // clipping x
                (this.direction == 'right' ? 1947 : 2120), // clipping y
                236, 128, // clipping width and height
                this.x
                + (this.x < 0 ? -1 : 0)
                + (this.direction == 'right' ? 120 : -50)
                * this.scale
                >> 0,
                this.y
                + (this.y < 0 ? -1 : 0)
                - (60 * this.scale)
                >> 0,
                236 * this.scale >> 0,
                128 * this.scale >> 0
            );
        }

        if (this.isDizzy) {
            this.dizzyFrameNumber = Date.now() - this.dizzyStartTime;
            this.dizzyFrameNumber /= this.dizzyDuration / this.dizzyFrameCount;
            this.dizzyFrameNumber = this.dizzyFrameNumber >> 0;
            this.dizzyFrameNumber *= this.dizzyFrameWidth;
            this.dizzyFrameNumber += 1685;

            this.context.drawImage(
                this.offscreenCanvas,
                this.dizzyFrameNumber, // clipping x
                (this.direction == 'right' ? 2293 : 2468), // clipping y
                236, 128, // clipping width and height
                this.x
                + (this.x < 0 ? -1 : 0)
                + (this.direction == 'right'
                    ? (50 - this.dizzyFrameWidth)
                    : (this.originalW - 50))
                * this.scale
                >> 0,
                this.y
                + (this.y < 0 ? -1 : 0)
                - (30 * this.scale)
                >> 0,
                236 * this.scale >> 0,
                128 * this.scale >> 0
            );
        }
    }

    update(elapsedTime) {

        if (isLeftRightButton) {
            this.elapsedTime += elapsedTime;
            this.frameUpdateInterval = 0.5 / ((this.frameCount - 1) * this.vx);
            if (((this.elapsedTime / this.frameUpdateInterval) >> 0) >= (this.frameCount - 1)) {
                this.elapsedTime = 0;
            }
        } else {
            if (this.isWalking) {
                // Only update frames if the character is in walking state
                this.elapsedTime += elapsedTime;
                
                // Set the frame update interval to 0.5 seconds
                const frameUpdateInterval = 50; // in milliseconds (0.5 seconds)
                
                //console.log(`isWalking ${this.isWalking} with  ${this.elapsedTime >= frameUpdateInterval}`);
                // Check if the elapsed time exceeds the frame update interval
                while (this.elapsedTime >= frameUpdateInterval) {
                    this.frameNumber++; // Advance to the next frame

                    // Loop back to the start of the animation when reaching the last frame
                    if (this.frameNumber >= this.frameCount) {
                        this.frameNumber = 0; // Loop back to the first frame
                    }

                    // Subtract the interval from elapsed time
                    this.elapsedTime -= frameUpdateInterval;
                }
            } else {
                this.frameNumber = 0; // Reset animation when not walking
            }
        }

    }

    // Event handler to start walking animation
    startWalking() {
        this.isWalking = true;
    }

    // Event handler to stop walking animation
    stopWalking() {
        this.isWalking = false;
    }

    moveLeft(elapsedTime, boardWidth) {
        if (this.direction != 'left') {
            this.direction = 'left';

            // Reset the boundary on the x-axis
            this.boundaryX = 0;

            this.stop();
        } else {
            // Calculate the movement with dynamic frame rates in mind
            this.moveTo = this.x - this.vx * boardWidth * elapsedTime;

            // Clamp the movement to the game board width
            this.moveTo = Math.max(Math.min(this.moveTo, boardWidth - this.w), 0);

            // Update the position
            this.x = this.moveTo;

            // Update the animation frame
            this.update(elapsedTime);
        }
    }

    moveRight(elapsedTime, boardWidth) {
        if (this.direction != 'right') {
            this.direction = 'right';

            // Flip the boundary on the x-axis
            this.boundaryX = 130 * this.scale;

            this.stop();
        } else {
            // Calculate the movement with dynamic frame rates in mind
            this.moveTo = this.x + this.vx * boardWidth * elapsedTime;

            // Clamp the movement to the game board width
            this.moveTo = Math.max(Math.min(this.moveTo, boardWidth - this.w), 0);

            // Update the position
            this.x = this.moveTo;

            this.update(elapsedTime);

            // Update the animation frame
            this.update(elapsedTime);
        }
    }

    stop() {
        // Reset the animation frame
        this.elapsedTime = 0;
    }

    celebrate() {
        clearTimeout(this.dizzyTimer);
        clearTimeout(this.celebrationTimer);
        this.isDizzy = false;
        this.isCelebrating = true;
        this.celebrationTimer = setTimeout(() => {
            clearTimeout(this.celebrationTimer);
            this.isCelebrating = false;
        }, this.celebrationDuration);
        this.celebrationStartTime = Date.now();
        this.celebrationEndTime = this.celebrationStartTime + this.celebrationDuration;
    }

    dizzy() {
        clearTimeout(this.dizzyTimer);
        clearTimeout(this.celebrationTimer);
        this.isDizzy = true;
        this.isCelebrating = false;
        this.dizzyTimer = setTimeout(() => {
            clearTimeout(this.dizzyTimer);
            this.isDizzy = false;
        }, this.dizzyDuration);
        this.dizzyStartTime = Date.now();
        this.dizzyEndTime = this.dizzyStartTime + this.dizzyDuration;
    }

    resize(scale) {
        this.scale = scale;
        this.w = this.originalW * scale;
        this.h = this.originalH * scale;

        // Apply custom collision boundary
        this.boundaryX = 130 * scale;
        this.boundaryY = 0;
        this.boundaryW = 170 * scale;
        this.boundaryH = 80 * scale;
    }

    snapMove(targetX, boardWidth, direction, elapsedTime, distanceThreshold) {
        this.direction = direction;

        // Clamp the target position within the game board width
        this.x = Math.max(Math.min(targetX, boardWidth - this.w), 0);

        // Update the animation frame
        this.update(100); // Assuming no elapsed time since position change is immediate
    }

}
