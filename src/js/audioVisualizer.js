import * as audioController from "./audioController.js"

// get canvas elements
var canvasElements = document.getElementsByClassName("areaVisualizerCanvas")

// get height and width
let canvasHeight = canvasElements[0].height
let canvasWidth = canvasElements[0].width 

// set offset
const yOffset = canvasHeight / 2

// set 
let x = 0  

// get canvas contexts and store them in array
const canvasCtx = []
for (let i = 0; i < canvasElements.length; i++) { 
  canvasCtx.push(canvasElements[i].getContext("2d")) 
}

let colors = []

function initColors() {
  let colorsPicker = document.querySelectorAll('input[type=color]')
  for (let i = 0; i < colorsPicker.length; i++) {
    colors.push(colorsPicker[i].value)
  }
}

export function setColor(index, color) {
  colors[index] = color
}

// setup audio context for testing
let audioCtx = new window.AudioContext()
let audio = document.getElementById("audioTest")
let track = audioCtx.createMediaElementSource(audio)
let analyser = audioCtx.createAnalyser()
analyser.fftSize = 8192
let bufferLength = analyser.frequencyBinCount
let dataArray = new Uint8Array(bufferLength)
analyser.getByteTimeDomainData(dataArray)
track.connect(analyser).connect(audioCtx.destination)


//creating array with lower and upper bounds of subBass, bass, lowerMid, mid, higherMid, presence and brilliance 
const frequencySpectrum = []
frequencySpectrum.push([0,60])
frequencySpectrum.push([61,250])
frequencySpectrum.push([250, 500])
frequencySpectrum.push([500, 2000])
frequencySpectrum.push([2000, 4000])
frequencySpectrum.push([4000, 6000])
frequencySpectrum.push([6000, 20000])

//translating bounds to specific areas in the data array which should then represent the boundaries of the frequency bands in the hearable sound spectrum 
// to do get buffer length from player
const frequencyAreas = []
for (let i = 0; i < frequencySpectrum.length; i++) {
  let lowerBound;
  let upperBound;
  if (i == 0) {
    lowerBound = frequencySpectrum[0][0]
    upperBound = Math.round( (frequencySpectrum[0][1]/frequencySpectrum[6][1]) * bufferLength )
  } else 
    lowerBound = frequencyAreas[i-1][1] +1
  if (i+1 == frequencySpectrum.length)
    upperBound = bufferLength
  else if (i > 0 && i < frequencySpectrum.length) 
    upperBound = (frequencyAreas[i-1][1] + 1) + (Math.round( ((frequencySpectrum[i][1] - frequencySpectrum[i][0]) / frequencySpectrum[6][1]) * bufferLength ))
  frequencyAreas.push([lowerBound, upperBound])
}

function drawFunction(canvasCtx, dataArray, lineWidth, lineColor, frequencyRange, frequency, functionOffset, reverted) {
  canvasCtx.lineWidth = lineWidth
  canvasCtx.strokeStyle = lineColor
  canvasCtx.beginPath();
  let amplitude = 0;
  for (let i = frequencyRange[0]; i <= frequencyRange[1]; i++){
    if (dataArray[i] > amplitude)
      amplitude = (dataArray[i] / 255 ) * yOffset
  }
  if (reverted) {
    for (let i = 0; i < (canvasWidth - functionOffset); i ++) {
      const y = amplitude * Math.sin((i + x) * frequency) + yOffset
      canvasCtx.lineTo(canvasWidth - i , y)
    }
    canvasCtx.stroke()
  } else {
    for (let i = 0; i < (canvasWidth - functionOffset); i ++) {
      const y = amplitude * Math.sin((i + x) * frequency) + yOffset
      canvasCtx.lineTo(i, y)
    }
    canvasCtx.stroke()
  }
}

function draw() {
  analyser.getByteFrequencyData(dataArray)
  
  canvasCtx[0].clearRect(0, 0, canvasWidth, canvasHeight)
  canvasCtx[1].clearRect(0, 0, canvasWidth, canvasHeight)
  
  let reverted = false

  for (let i = 0; i < canvasCtx.length; i++) {
    
    if (i == 1){
      reverted = true
    }
    let offset = 40;
    let lineWidth = 3.5
    let freq = 0.014

    for (let o = 0; o < frequencyAreas.length; o++){
      let tmpFreq = (o+1) * freq
      drawFunction(canvasCtx[i], dataArray, lineWidth, colors[o],frequencyAreas[o], tmpFreq, offset, reverted)
      lineWidth -= 0.5
      offset -= 5
    }
  }

  x += 1;

  requestAnimationFrame(draw);
}

initColors()

draw()

  

