import * as audioPlayer from "./audioPlayer.js";

const canvas = document.getElementById("visualizer")
const canvasCtx = canvas.getContext("2d");


// get same Color of the Window behind the canvas, in order to let the canvas appear transparent except for the drawing 
const visualizerWindow = document.getElementById('VisualizerWindow');
const backgroundColor = window.getComputedStyle(visualizerWindow).getPropertyValue('background');

//temporary line color
let visualizationColor;
visualizationColor = getComputedStyle(document.documentElement).getPropertyValue('--green');
//visualizationColor = 'black';


const audioCtx = new window.AudioContext || window.webkitAudioContext;
const audio = document.getElementById("audio");
const track = audioCtx.createMediaElementSource(audio);
let analyser = audioCtx.createAnalyser();
analyser.fftSize = 128;
let bufferLength = analyser.frequencyBinCount;


track.connect(analyser).connect(audioCtx.destination);

let dataArray = new Uint8Array(bufferLength);

function drawLines() {
    
    analyser.getByteTimeDomainData(dataArray);
    canvasCtx.fillStyle = backgroundColor;
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    canvasCtx.lineWidth = 1;
    canvasCtx.strokeStyle = visualizationColor;
    canvasCtx.beginPath();
    let sliceWidth = canvas.width * 1.0 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        console.log("Index: " + i + " // Wert: " + dataArray[i]);
        let v = dataArray[i] / 128.0;
        let y = v * canvas.height - 25;
        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
    }
    canvasCtx.lineTo(canvas.width+100, canvas.height);
    canvasCtx.stroke();


    canvasCtx.beginPath();
    let sliceWidth2 = canvas.width * 1.0 / bufferLength;
    let x2 = 0;
    for (let i = 0; i < bufferLength; i++) {
        let v = dataArray[i] / 128.0;
        let y = v * canvas.height - 50;
        if (i === 0) {
            canvasCtx.moveTo(x2, y);
        } else {
            canvasCtx.lineTo(x2, y);
        }
        x2 += sliceWidth2;
    }
    canvasCtx.lineTo(canvas.width+100, canvas.height * 0.75);
    canvasCtx.stroke();

}

function drawPillars() {
    
    analyser.getByteTimeDomainData(dataArray);
    const barWidth = canvas.width / bufferLength;

    let x = 0;
    //canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        canvasCtx.fillStyle = visualizationColor;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth;
    }

}



function draw() {

    drawLines();

    //drawPillars();

    requestAnimationFrame(draw);
}

draw();