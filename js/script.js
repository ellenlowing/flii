// Copyright 2023 The MediaPipe Authors.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//      http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

//         _
//       _./_),
//     -:_) ) )  BzzzBzBzzzz
//   mrf  '\_)'

import { GestureRecognizer, FilesetResolver, DrawingUtils } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
const demosSection = document.getElementById("demos");
let gestureRecognizer;
let runningMode = "IMAGE";
let enableWebcamButton;
let webcamRunning = false;
const videoHeight = `${videoHeightVal}px`;
const videoWidth = `${videoWidthVal}px`;
// Before we can use HandLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
const createGestureRecognizer = async () => {
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
    gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
            delegate: "GPU"
        },
        runningMode: runningMode
    });
    demosSection.classList.remove("invisible");
};
// Automatically enable webcam for debug
createGestureRecognizer().then(() => {
    enableCam();
    startGame();
});

const video = document.getElementById("webcam");
const gestureOutput = document.getElementById("gesture_output");
const restartButton = document.getElementById("restartButton");

/********************************************************************
// Step 1: Init game variables
********************************************************************/
let fly = new Fly();
let flyPath = new Path();
let vx = 0, vy = 0;
let btn = false;
let btnreset = true;
let catchmarks = [];
let candy = null;
// let annoyance = new Meter();
let catchCooldownTime = 2000;
let catchCooled = true;
let fist = null;
let score = 0;
let flyLives = 3;
let humanLives = 3;
let bitemeter = null;
noise.seed(Math.random());

/********************************************************************
// Step 2: Init gamepad
********************************************************************/

const haveEvents = "ongamepadconnected" in window;
const controllers = {};

function connecthandler(e) {
  addgamepad(e.gamepad);
}

function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad;
  requestAnimationFrame(updateStatus);
}

function disconnecthandler(e) {
  removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
  delete controllers[gamepad.index];
}

function updateStatus() {
  if (!haveEvents) {
    scangamepads();
  }

  Object.entries(controllers).forEach(([i, controller]) => {
    vx = -controller.axes[0];
    vy = controller.axes[1];
    btn = controller.buttons[0].pressed;
    if (!btn) {
        btnreset = true;
    }
  });

  requestAnimationFrame(updateStatus);
}

function scangamepads() {
  const gamepads = navigator.getGamepads();
  for (const gamepad of gamepads) {
    if (gamepad) {
      // Can be null if disconnected during the session
      if (gamepad.index in controllers) {
        controllers[gamepad.index] = gamepad;
      } else {
        addgamepad(gamepad);
      }
    }
  }
}

window.addEventListener("gamepadconnected", connecthandler);
window.addEventListener("gamepaddisconnected", disconnecthandler);

if (!haveEvents) {
  setInterval(scangamepads, 500);
}


/********************************************************************
// Step 3: Continuously grab image from webcam stream and detect it.
********************************************************************/

// Check if webcam access is supported.
function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}
// If webcam supported, add event listener to button for when user
// wants to activate it.
if (hasGetUserMedia()) {
    enableWebcamButton = document.getElementById("webcamButton");
    enableWebcamButton.addEventListener("click", enableCam);
}
else {
    console.warn("getUserMedia() is not supported by your browser");
}
// Enable the live webcam view and start detection.
function enableCam(event) {
    if (!gestureRecognizer) {
        alert("Please wait for gestureRecognizer to load");
        return;
    }
    if (webcamRunning === true) {
        webcamRunning = false;
        enableWebcamButton.innerText = "ENABLE PREDICTIONS";
    }
    else {
        webcamRunning = true;
        enableWebcamButton.innerText = "DISABLE PREDICTIONS";
    }
    // getUsermedia parameters.
    const constraints = {
        video: true
    };
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        video.srcObject = stream;
        video.addEventListener("loadeddata", predictWebcam);
    });
}
let lastVideoTime = -1;
let results = undefined;
async function predictWebcam() {
    const webcamElement = document.getElementById("webcam");
    // Now let's start detecting the stream.
    if (runningMode === "IMAGE") {
        runningMode = "VIDEO";
        await gestureRecognizer.setOptions({ runningMode: "VIDEO" });
    }
    let nowInMs = Date.now();
    if (video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;
        results = gestureRecognizer.recognizeForVideo(video, nowInMs);
    }
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    const drawingUtils = new DrawingUtils(canvasCtx);
    canvasElement.style.height = videoHeight;
    webcamElement.style.height = videoHeight;
    canvasElement.style.width = videoWidth;
    webcamElement.style.width = videoWidth;
    canvasCtx.restore();

    if (results.gestures.length > 0) {
        // gestureOutput.style.display = "block";
        // gestureOutput.style.width = videoWidth;
        const categoryName = results.gestures[0][0].categoryName;
        const categoryScore = parseFloat(results.gestures[0][0].score * 100).toFixed(2);
        const handedness = results.handednesses[0][0].displayName;
        gestureOutput.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore} %\n Handedness: ${handedness}`;

        // analyze gesture landmarks and pass to event
        const fistCenter = getCenterOfPoints(results.landmarks[0]);
        const fistRadius = Math.sqrt(getBoundingSqRadius(fistCenter, results.landmarks[0]));

        let closedFistEvent = new CustomEvent("closed_fist", {
            detail: {
                center: fistCenter,
                radius: fistRadius,
                handedness: handedness
            }
        });
        if(categoryName == "Closed_Fist" || categoryName == "Thumb_Up" || categoryName == "Thumb_Down") {
            if(catchCooled) {
                window.dispatchEvent(closedFistEvent);
                catchCooled = false;
                bitemeter = new Meter(fist.center.x, fist.center.y + fist.radius, map(fist.radius, 0, 0.25, 50, 200));
                setTimeout(() => {
                    catchCooled = true;
                    fist = null;
                    bitemeter = null;
                }, catchCooldownTime);
            }
            
        }
    }
    else {
        gestureOutput.style.display = "none";
    }

    update();
    draw();    

    // Call this function again to keep predicting when the browser is ready.
    if (webcamRunning === true) {
        window.requestAnimationFrame(predictWebcam);
    }
}

window.addEventListener("closed_fist", e => closedFistHandler(e));

restartButton.addEventListener("click", (e) => {
    startGame();
})

function update() {
    // annoyance and candy
    // annoyance.update();
    // if(annoyance.value > 0.4 && candy == null) {
    //     candy = new Candy();
    // }
    // if(candy) {
    //     const sqdist = Math.sqrt(getSqDistanceBetweenPoints(fly.pos, candy.pos));
    //     if(sqdist < candy.nr) {
    //         fly.speedup();
    //         candy = null;
    //     }
    // }

    if(fist && bitemeter) {
        let fistflydist = Math.sqrt(getSqDistanceBetweenPoints(fist.center, fly.pos));
        
        if(bitemeter.value >= 1) {
            console.log('taking 1 human life');
            updateHumanLives(humanLives - 1);
            catchCooled = true;
            fist = null;
            bitemeter = null;
            catchmarks.shift();
        } else if(fistflydist < fist.radius) {
            if(btn && btnreset) {
                // meter increases !
                bitemeter.value += 0.2;
                bitemeter.update();
                btnreset = false;
            }
        }
    }

    fly.update(vx, vy);
    flyPath.addRoughPoint(fly.pos.x * videoWidthVal, fly.pos.y * videoHeightVal);
}

async function draw() {
    // annoyance.show();
    for(let catchmark of catchmarks) {
        catchmark.show();
    }
    // if(candy) candy.show();
    fly.show();
    flyPath.show();

    if(bitemeter) {
        bitemeter.show();
    }
}

function getSqDistanceBetweenPoints(p1, p2) {
    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
}

function getCenterOfPoints(arr) {
    let cx = 0, cy = 0;
    for(let pt of arr) {
        cx += pt.x;
        cy += pt.y;
    }
    return {x: cx / arr.length, y: cy / arr.length};
}

function getBoundingSqRadius(center, arr) {
    let maxsqdist = -1;
    for(let pt of arr) {
        let sqdist = getSqDistanceBetweenPoints(pt, center);
        if(sqdist > maxsqdist) {
            maxsqdist = sqdist;
        }
    }
    return maxsqdist;
}

function startGame() {
    // updateScore(0);
    fly.reset();
    flyPath = new Path();
    updateHumanLives(3);
    updateFlyLives(3);
    // annoyance = new Meter();
    // candy = null;
}

function closedFistHandler(e) {
    let fistflydist = Math.sqrt(getSqDistanceBetweenPoints(e.detail.center, fly.pos));
    let flycaught = false;
    fist = e.detail;

    if(fistflydist < e.detail.radius * 0.8) {
        // fly caught!
        // updateScore(score+1);
        updateFlyLives(flyLives - 1);
        fly.respawn();
        flyPath.clearPoints();
        flycaught = true;
        // candy = null;
        // annoyance.value = 0;
    } 

    catchmarks.push(new Catchmark(e.detail.center, e.detail.radius, e.detail.handedness, flycaught));
    setTimeout(() => {
        catchmarks.shift();
    }, catchCooldownTime)
}   

function debounce(func, timeout = 30){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

function updateScore(newScore) {
    score = newScore;
    document.getElementById('score_val').innerHTML = score;
}

function updateHumanLives(lives) {
    humanLives = lives;
    document.getElementById('human_lives').innerHTML = lives;
}

function updateFlyLives(lives) {
    flyLives = lives;
    document.getElementById('fly_lives').innerHTML = lives;
}