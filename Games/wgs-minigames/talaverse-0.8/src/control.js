/******************************************************************************
 * The following program defines how the user interacts with the game.        *
 * The user can start, restart, and share the game. The user can also move    *
 * the main character using the keyboard, mouse, or touch.                    *
 ******************************************************************************/

"use strict";

/**
 * Mouse Event Handler
 */
// moveLeftButton.onmousedown = () => leftButtonPressed = true;
// moveLeftButton.onmouseup = () => leftButtonPressed = false;
// moveLeftButton.onmouseleave = () => leftButtonPressed = false;

// moveRightButton.onmousedown = () => rightButtonPressed = true;
// moveRightButton.onmouseup = () => rightButtonPressed = false;
// moveRightButton.onmouseleave = () => rightButtonPressed = false;

/**
 * Keyboard Event Handler
 */
document.onkeydown = (event) => {
    if (event.key === "ArrowLeft") leftButtonPressed = true;
    if (event.key === "ArrowRight") rightButtonPressed = true;
}
document.onkeyup = (event) => {
    if (event.key === "ArrowLeft") leftButtonPressed = false;
    if (event.key === "ArrowRight") rightButtonPressed = false;
}

/**
 * Touch Event Handler
 */
// moveLeftButton.ontouchstart = () => leftButtonPressed = true;
// moveLeftButton.ontouchend = () => leftButtonPressed = false;

// moveRightButton.ontouchstart = () => rightButtonPressed = true;
// moveRightButton.ontouchend = () => rightButtonPressed = false;
