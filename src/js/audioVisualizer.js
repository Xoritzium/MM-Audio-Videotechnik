import * as audioPlayer from "./audioPlayer.js";

const canvas = document.getElementById("visualizer")
const canvasCtx = canvas.getContext("2d");

// get same Color of the Window behind the canvas, in order to let the canvas appear transparent except for the drawing 
const visualizerWindow = document.getElementById('VisualizerWindow');
const backgroundColor = window.getComputedStyle(visualizerWindow).getPropertyValue('background');

const audioCtx = new window.AudioContext || window.webkitAudioContext;
const audio = document.getElementById("audio");
const track = audioCtx.createMediaElementSource(audio);
let analyser = audioCtx.createAnalyser();
analyser.fftSize = 128;
let bufferLength = analyser.frequencyBinCount;

track.connect(analyser).connect(audioCtx.destination);
let dataArray = new Uint8Array(bufferLength);

let visualizationOption = 1; 

export function setVisualizationOption(option) {
  visualizationOption = option;
}

function drawLines() {
  console.log("draw line method");
  canvasCtx.lineWidth = 1;
  canvasCtx.strokeStyle = document.getElementById('colorpickerVisualization1').value;
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  canvasCtx.beginPath();
  let sliceWidth = canvas.width * 1.0 / bufferLength;

  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
      //console.log("Index: " + i + " // Wert: " + dataArray[i]);
      let v = dataArray[i] / 128.0;
      let y = v * canvas.height/2 - 25;
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
      let v = dataArray[i] / 128;
      let y = v * canvas.height/2 - 50;
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

  let barWidth = canvas.width / bufferLength;

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

export function draw() {

  console.log("draw lines");

  //analyser.getByteTimeDomainData(dataArray);
  analyser.getByteFrequencyData(dataArray);

  canvasCtx.fillStyle = backgroundColor;
  //

  //console.log(visualizationOption);

  /*
  if (visualizationOption != 0){
    console.log("draw lines in draw function");
    drawLines();
    
  }
  */

  drawLines();

  /*
  switch (visualizationOption) {
    case 1:
      drawLines();
      console.log("draw Lines");
      //console.log("option: " + option);
    case 2:
      drawPillars();
      //console.log("option: " + option);
    default:
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      //console.log("no visualization");
  }
  */

  
  requestAnimationFrame(draw);
}

draw();


/* Zweiter Visualizer
  container.addEventListener('click', function () {
  const audio1 = document.getElementById('audio1');
  audio1.src = "Cris Velasco & Sascha Dikiciyan - Warhammer 40,000 Space Marine (Original Soundtrack) - 13 - The Meat Grinder.mp3";
  const audioContext = new AudioContext();
  audio1.play();
  audioSource = audioContext.createMediaElementSource(audio1);
  analyser = audioContext.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioContext.destination);
  analyser.fftSize = 128;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const barWidth = 15;
  let barHeight;
  let x;

  function animate() {
      x = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      analyser.getByteFrequencyData(dataArray);
      drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray);
      requestAnimationFrame(animate);
  }
  animate();
});


function drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {
  for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] * 2 
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(i * 3.2);
      const hue = 0;
      ctx.fillStyle = 'hsl(' + hue + ',100%,50%)';
      ctx.strokeStyle = 'hsl(' + hue + ',100%,50%)'; 
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, barHeight);
     
      ctx.stroke();

      x -= barWidth;

      if (i > bufferLength * 0.6) {
          ctx.beginPath();
          ctx.arc(0, 0, barHeight / 1.5, 0, Math.PI * 2);
          ctx.stroke();
      }
      ctx.restore();
  }
} */