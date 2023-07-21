import * as audioController from "./audioController.js";


const canvas = document.getElementById("visualizer")
const canvasCtx = canvas.getContext("2d");

// get same Color of the Window behind the canvas, in order to let the canvas appear transparent except for the drawing 
const visualizerWindow = document.getElementById('VisualizerWindow');
const backgroundColor = window.getComputedStyle(visualizerWindow).getPropertyValue('background');

const audioCtx = new window.AudioContext();
const audio = document.getElementById("audio");
const track = audioCtx.createMediaElementSource(audio);
let analyser = audioCtx.createAnalyser();
analyser.fftSize = 128;
let bufferLength = analyser.frequencyBinCount;

track.connect(analyser).connect(audioCtx.destination);
//let dataArray = new Uint8Array(bufferLength);

let visualizationOption = 9; 

export function setVisualizationOption(option) {
  visualizationOption = option;
}

export function getVisualizationOption() {
  return visualizationOption;
}

let drawing = false;

// sets drawing variable to true and starts the draw method
export function startDrawing() {
  drawing = true;
  draw();
}

// disabels the drawing variable that the draw method stops calling itself
export function stopDrawing() {
  drawing = false;
  
}

function clearCanvas() {
  //  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawLines() {
  canvasCtx.lineWidth = 1;
  canvasCtx.strokeStyle = document.getElementById('colorpickerVisualization1').value;
  let sliceWidth = canvas.width * 1.0 / bufferLength;
  
  let dataArray = audioController.getAudioArrayA();
  
  
  let x = 0;

  canvasCtx.beginPath();
  for (let i = 0; i < bufferLength; i++) {
      //console.log("Index: " + i + " // Wert: " + dataArray[i]);
      let v = dataArray[i] / 128.0;
      let y = v * canvas.height/2;
      if (i === 0) {
          canvasCtx.moveTo(x, y);
      } else {
          canvasCtx.lineTo(x, y);
      }
      x += sliceWidth;
  }
  canvasCtx.lineTo(canvas.width, canvas.height);
  canvasCtx.stroke();

}

function drawPillars() {

  let barWidth = canvas.width / bufferLength;

  let dataArray = audioController.getAudioArrayA();

  let barHeight;
  let x = 0;

  for (let i = 0; i < bufferLength / 2; i++) {
    barHeight = dataArray[i];
    const red = (i * barHeight) / 10;
    const green = i * 4;
    const blue = barHeight / 4 - 12;
    canvasCtx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
    canvasCtx.fillRect(
      canvas.width / 2 - x,
      canvas.height - barHeight,
      barWidth,
      barHeight
    );
    canvasCtx.fillRect(
      canvas.width / 2 + x,
      canvas.height - barHeight,
      barWidth,
      barHeight
    );
    x += barWidth;
  }
}

function drawAbstract() {

  const barWidth = 15;
  let barHeight;
  let x = 0;

  let dataArray = audioController.getAudioArrayA();

  console.log(dataArray[28] + " " + audioController.audioBVolume);

  for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] * 2 
      canvasCtx.save();
      canvasCtx.translate(canvas.width / 2, canvas.height / 2);
      canvasCtx.rotate(i * 3.2);
      const hue = 0;
      canvasCtx.fillStyle = 'hsl(' + hue + ',100%,50%)';
      canvasCtx.strokeStyle = 'hsl(' + hue + ',100%,50%)'; 
      canvasCtx.beginPath();
      canvasCtx.moveTo(0, 0);
      canvasCtx.lineTo(0, barHeight);
     
      canvasCtx.stroke();

      x -= barWidth;

      if (i > bufferLength * 0.6) {
        canvasCtx.beginPath();
        canvasCtx.arc(0, 0, barHeight / 1.5, 0, Math.PI * 2);
        canvasCtx.stroke();
      }
      canvasCtx.restore();
  }

}

export function draw() {

  console.log("draw");
  //analyser.getByteTimeDomainData(dataArray);
  //analyser.getByteFrequencyData(dataArray);

  canvasCtx.fillStyle = backgroundColor;

  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

  switch (visualizationOption) {
    case 1:
      drawLines();
      //console.log("option: " + visualizationOption);
      break;
    case 2:
      drawPillars();
      //console.log("option: " + visualizationOption);
      break;
    case 3:
      drawAbstract();
      //console.log("option: " + visualizationOption);
    case 9:
      //console.log("no visualization");
      break;
  }

  if (drawing === true) 
    requestAnimationFrame(draw);

}


/* Zweiter Visualizer

  const barWidth = 15;
  let barHeight;
  let x;


      x = 0;
   

  
      drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray);
      

function drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {
  
  
} */