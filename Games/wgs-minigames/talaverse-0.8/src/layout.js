/******************************************************************************
 * The following program defines the layout and responsiveness of the game.   *
 * The game at first is meant to be played on a mobile device with a screen   *
 * orientation of portrait. It can be played on a tablet and desktop as well, *
 * but the game will always be forced to display in portrait orientation.     *
 ******************************************************************************/

import * as cfg from "./config.js";

"use strict";

/**
 * Function to get the current window ratio.
 * @returns {Float} the ratio of the window width to the window height
 */
const windowRatio = () => window.visualViewport.height / window.visualViewport.width;

/**
 * Procedure to calculate the size of the game
 */
export default function resizeLayout() {
    // Calculate the size of the game board relative to the size of the screen
    let scaleFactor = cfg.renderScaleFactor;
    if (cfg.canvasIsPortrait && windowRatio() <= cfg.canvasRatio) {
        let height = window.visualViewport.height;
        board.width = height / cfg.canvasRatio * scaleFactor;
        board.height = height * scaleFactor;
    } else {
        let width = window.visualViewport.width;
        board.height = width * cfg.canvasRatio * scaleFactor;
        board.width = width * scaleFactor;
    }

    // Calculate the size of the game HUDs relative to the size of the game board
    hud.style.width = board.width + "px";
    hud.style.height = board.height + "px";

    scaleFactor = cfg.spriteImageScaleFactor * cfg.renderScaleFactor;
    windowScaleFactor = windowRatio() <= cfg.canvasRatio
        ? window.visualViewport.height / cfg.canvasHeight * scaleFactor
        : window.visualViewport.width / cfg.canvasWidth * scaleFactor;

    // Set CSS variables to help the scaling of the game resources
    // without having to worry about the growth of the game sprites
    document.documentElement.style.setProperty("--scaleFactor", windowScaleFactor);
    document.documentElement.style.setProperty("--spriteImageWidth", spriteImage.width + "px");
    document.documentElement.style.setProperty("--spriteImageHeight", spriteImage.height + "px");

    // To avoid the address bar hiding when scrolling on mobile browsers,
    // we must make our own implementation for calculating the viewport's height
    // TODO: until the new viewport units mentioned at https://web.dev/interop-2022/#new-viewport-units
    // are widely implemented, we can use this hackaround
    document.documentElement.style.setProperty("--viewportHeight", window.visualViewport.height * 0.01 + "px");
    document.documentElement.style.setProperty("--canvasHeight", board.height * 0.01 + "px");
}
