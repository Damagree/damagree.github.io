"use strict"

// HTML element selectors
var mainContainer = document.getElementById("main-container");

var hud = document.getElementById("hud");
var gamePoint = document.getElementById("game-points");
var scoreText = document.getElementById("score");
var finalScoreText = document.getElementById("final-score");;
var finalScoreVerboseText = document.getElementById("final-score-verbose");;
var lifePointItems = Array.from(document.getElementsByClassName("life-point-item"));
var fpsText = document.getElementById("fps");

var pauseScreen = document.getElementById("pause-screen");
var splashScreen = document.getElementById("splash-screen");
var howToPlay = document.getElementById("how-to-play");
var gameResult = document.getElementById("game-result");

var playButton = document.getElementById("play-game");
var startButton = document.getElementById("start-game");
var muteButtons = Array.from(document.getElementsByClassName("mute-game"));
var shareFacebookButton = document.getElementById("share-facebook");
var shareWhatsappButton = document.getElementById("share-whatsapp");
var shareTelegramButton = document.getElementById("share-telegram");
var restartButton = document.getElementById("restart-game");

var timerDisplay = document.getElementById("timer-game");

var gameControl = document.getElementById("game-controls");
var moveLeftButton = document.getElementById("move-left");
var moveRightButton = document.getElementById("move-right");

var board = document.getElementById("game-board");
var context = board.getContext("2d");

var offscreenCanvas = document.createElement('canvas');
var offscreenContext = offscreenCanvas.getContext("2d");

// Browser states
var windowScaleFactor = 1.0;
var visibility;
var hidden = "";

var serverUrl = window.location.href;
var documentTitle = document.title;

var shareText = "";

// Game resources
var spriteImage = new Image();
var shibaInuImage  = new Image();
var talaxImage = new Image();
var successSFX = new Audio();
// var failureSFX = new Audio();
var gameOverSFX = new Audio();
var backgroundMusic = new Audio();

// Game time
var currentTime = 0;
var previousTime = 0;
var passedTime = 0;
var shiftTime = 0;
var elapsedTime = 0;

// Game objects
var bb;
var newCollectible;
var collectibles = [];
var bloodDropletPool = [];
var shibaInuDropletPool = [];
var coinTalax1DropletPool = [];
var rainDropletPool = [];
var rainDropletInRow = 0;
var rainDropletInLastThree = 0;
var twoRainDropletInRow = false;

// Game states
var score = 0;
var finalScore = 0;
var lifePoints = 0;
var collectibleCreationElapsedTime = 0;
var gameSpeedFactor = 1.0;

var isPlayed = false;
var isGameOver = false;
var isPlaying = false;

var leftButtonPressed = false;
var rightButtonPressed = false;

var muteGameSound = true;

var isTimerMode = true; // add this

// Controllers
var isLeftRightButton = false;

// Debug variables
var fpsPreviousTime = 0;
var fpsElapsedTime = 0;
var frameCount = 0;
var fps = 0;
