/******************************************************************************
 * The following program declares the game constants and any other variables  *
 * that cannot be changed during runtime. They are separated from the         *
 * main program to make it easier to control how the game runs without having *
 * to worry about the game logics.                                            *
 ******************************************************************************/

"use strict";

// These variables define the target size of the game board. It is used to scale
// the game resources. The default size is 1080x1920 (portrait mode).
export const canvasHeight = 1920; // in pixels
export const canvasWidth = 1080; // in pixels

// This variable defines the ratio of the game board, written as `height/width`.
// The default value is `16/9`. It can be changed to any other ratio, but it is
// not guaranteed to display best.
export const canvasRatio = 16 / 9;

// This variable controls the orientation of the game board.
// It should be always set to `true` for the game to work correctly.
export const canvasIsPortrait = true;

// These variables control the scale of the game resources.
// There is no reason to change these values manually.
export const spriteImageScaleFactor = 1.0;
export const renderScaleFactor = 1.0;

// These variables help the optimisation of the game
export const collectiblePoolSize = 40;

// These variables define the game over state
export const gameLifePoints = 3; // hardcoded, do not change

// These variables control the initial speed of the game
export const characterSpeed = 1.0; // in canvas width per second
export const gravitationSpeed = 0.2; // in canvas height per second
export const gameSpeedFactorMax = 5.0;
export const collectibleCreationInterval = 800; // in miliseconds

// These variables define the probability of the game
export const BloogDropletGenerationProbability = 0; // in range from 0 to 1

// These variable define timer mode games
export const initialTime = 5;

// These variables define the dynamic UI text template
// The `{score}` and `{link}` must be included in the text,
// they will be replaced by the user's game score and the game page's URL
export const shareText = "Hey friends, join me in the Blood Bag Rush and help BB stock up the blood bank here: {link} I've collected a total of {score} blood bags. Tell me yours!";
export const finalScoreText = "You filled up {score} blood {bags}";

// These variables are meant to be used for debugging
export const debugMode = false;
export const showFPS = true;
export const showBoundingBoxes = false;
export const noGameOver = false;
export const skipToGamePlay = false;
export const fpsUpdateInterval = 1000; // in miliseconds
export const debugFontSize = 4.0;
