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
});

const video = document.getElementById("webcam");
const canvasCtx = canvasElement.getContext("2d");
const gestureOutput = document.getElementById("gesture_output");

/********************************************************************
// Step 1: Init game variables
********************************************************************/
let fly = new Fly(Math.random(), Math.random());
let score = 0;
noise.seed(Math.random());

/********************************************************************
// Step 2: Continuously grab image from webcam stream and detect it.
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
    if (results.landmarks) {
        for (const landmarks of results.landmarks) {
            drawingUtils.drawConnectors(landmarks, GestureRecognizer.HAND_CONNECTIONS, {
                color: "#00FF00",
                lineWidth: 5
            });
            drawingUtils.drawLandmarks(landmarks, {
                color: "#FF0000",
                lineWidth: 2
            });
        }
    }
    canvasCtx.restore();

    if (results.gestures.length > 0) {
        gestureOutput.style.display = "block";
        gestureOutput.style.width = videoWidth;
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
                radius: fistRadius
            }
        });
        if(categoryName == "Closed_Fist") {
            window.dispatchEvent(closedFistEvent);
        }
    }
    else {
        gestureOutput.style.display = "none";
    }

    fly.update();
    drawRoughCanvas();    

    // Call this function again to keep predicting when the browser is ready.
    if (webcamRunning === true) {
        window.requestAnimationFrame(predictWebcam);
    }
}

window.addEventListener("closed_fist", debounce((e) => closedFistHandler(e)));

async function drawRoughCanvas() {
    fly.show();
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
        let sqdist = Math.pow(pt.x - center.x, 2) + Math.pow(pt.y - center.y, 2);
        if(sqdist > maxsqdist) {
            maxsqdist = sqdist;
        }
    }
    return maxsqdist;
}

function closedFistHandler(e) {
    let fistflydist = Math.sqrt(Math.pow(e.detail.center.x - fly.pos.x, 2) + Math.pow(e.detail.center.y - fly.pos.y, 2));
    
    if(fistflydist < e.detail.radius) {
        // fly caught!
        score++;
        document.getElementById('score_val').innerHTML = score;
        fly = new Fly(Math.random(), Math.random());
    } 
}   

function debounce(func, timeout = 30){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}