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

let drawFrequency = []

function initDrawFrequency() {
  let switches = document.querySelectorAll('.fxMenu input[type="checkbox"]')
  for (let i = 0; i < switches.length; i++) {
    drawFrequency.push(switches[i].checked)
  }
}

export function setDrawFrequency(index, bool) {
  drawFrequency[index] = bool
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

//creating array with lower and upper bounds of subBass, bass, lowerMid, mid, higherMid, presence and brilliance 
const frequencySpectrum = []
frequencySpectrum.push([0,16]) 
frequencySpectrum.push([17,60])
frequencySpectrum.push([61,250])
frequencySpectrum.push([250, 500])
frequencySpectrum.push([500, 2000])
frequencySpectrum.push([2000, 4000])
frequencySpectrum.push([4000, 6000])
frequencySpectrum.push([6000, 16000])

//translating bounds to specific areas in the data array which should then represent the boundaries of the frequency bands in the hearable sound spectrum 
// to do get buffer length from player
const frequencyAreas = []
for (let i = 0; i < frequencySpectrum.length; i++) {
  let lowerBound;
  let upperBound;
  if (i == 0) {
    lowerBound = Math.round( (frequencySpectrum[0][0] /frequencySpectrum[6][1]) * bufferLength ) 
    upperBound = Math.round( ((frequencySpectrum[0][1] - frequencySpectrum[0][0])/frequencySpectrum[6][1]) * bufferLength )
  } else 
    lowerBound = frequencyAreas[i-1][1] +1
  if (i+1 == frequencySpectrum.length)
    upperBound = bufferLength
  else if (i > 0 && i < frequencySpectrum.length) 
    upperBound = (frequencyAreas[i-1][1] + 1) + (Math.round( ((frequencySpectrum[i][1] - frequencySpectrum[i][0]) / frequencySpectrum[7][1]) * bufferLength ))
  frequencyAreas.push([lowerBound, upperBound])
  //console.log(lowerBound, upperBound)
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

export function draw(dataA, dataB) {
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
    let dataArray;
    if (i == 0)
      dataArray = dataA
    else 
      dataArray = dataB


    for (let o = 0; o < frequencyAreas.length; o++){
      let tmpFreq = (o+1) * freq
      if (drawFrequency[o]) {
        drawFunction(canvasCtx[i], dataArray, lineWidth, colors[o],frequencyAreas[o], tmpFreq, offset, reverted)
      }
      lineWidth -= 0.5
      offset -= 5
    }
  }

  x += 1;

  //requestAnimationFrame(draw);
}

initDrawFrequency()
initColors()

