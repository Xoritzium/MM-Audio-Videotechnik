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
frequencySpectrum.push([0,20]) // up for debate, included it to get whole frequency spectrum
frequencySpectrum.push([20,60])
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
    lowerBound = Math.round( (frequencySpectrum[0][0] /frequencySpectrum[6][1]) * bufferLength ) 
    upperBound = Math.round( ((frequencySpectrum[0][1] - frequencySpectrum[0][0])/frequencySpectrum[6][1]) * bufferLength )
  } else 
    lowerBound = frequencyAreas[i-1][1] +1
  if (i+1 == frequencySpectrum.length)
    upperBound = bufferLength
  else if (i > 0 && i < frequencySpectrum.length) 
    upperBound = (frequencyAreas[i-1][1] + 1) + (Math.round( ((frequencySpectrum[i][1] - frequencySpectrum[i][0]) / frequencySpectrum[6][1]) * bufferLength ))
  frequencyAreas.push([lowerBound, upperBound])
  console.log(lowerBound, upperBound)
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
      if (drawFrequency[o]) {
        drawFunction(canvasCtx[i], dataArray, lineWidth, colors[o],frequencyAreas[o], tmpFreq, offset, reverted)
      }
      lineWidth -= 0.5
      offset -= 5
    }
  }

  x += 1;

  requestAnimationFrame(draw);
}

initDrawFrequency()
initColors()

draw()

// Draw Audio from AudioA on canvasCntx[0] -> will be called each frame
// ich hab die Methode "draw" in drawAudioA umbenannt und anstatt dem dataArray wird der drawFunction 
//die audioData übergeben.
// diese Methode wird jeden Frame aufgerufen. ->vgl AudioController Methode: getAudioSpectrumAudioA
//TODO: ->auch wenns zwei canvases sind, wird immer nur eines seperat angezeigt (probierts aus)...
//      ->Die einzelnen Linien an und ausschalten muss noch angezeigt werden.
  

export function drawAudioA(audioData) {
 console.log("audioDataA: " + audioData[250]);



  canvasCtx[0].clearRect(0, 0, canvasWidth, canvasHeight);
  canvasCtx[1].clearRect(0, 0, canvasWidth, canvasHeight);

  for (let i = 0; i <= 14; i++) {
  }

  const subBassColor = document.getElementById("colorpickerSubBass").value; 
  const bassColor = document.getElementById("colorpickerBass").value;
  const lowerMidColor = document.getElementById("colorpickerLowMid").value;
  const midColor = document.getElementById("colorpickerMid").value;
  const higherMidColor = document.getElementById("colorpickerHighMid").value;
  const presenceColor = document.getElementById("colorpickerPresence").value;
  const brillianceColor = document.getElementById("colorpickerBrilliance").value;


  //sub bass
  drawFunction(canvasCtx[0], audioData, 3.5, subBassColor, subBassArea, subBassFrequency, 40, false)

  //bass
  drawFunction(canvasCtx[0], audioData, 3, bassColor, bassArea, bassFrequency, 35, false)

  //lowmid
  drawFunction(canvasCtx[0], audioData, 2.5, lowerMidColor, lowerMidArea, lowerMidFrequency, 30, false)

  //mid
  drawFunction(canvasCtx[0], audioData, 2, midColor, midArea, midFrequency, 25, false)

  //highmid
  drawFunction(canvasCtx[0], audioData, 1.5, higherMidColor, higherMidArea, higherMidFrequency, 20, false)

  //presence
  drawFunction(canvasCtx[0], audioData, 1, presenceColor, presenceArea, presenceFrequency, 15, false)

  //brilliance
  drawFunction(canvasCtx[0], audioData, 0.5, brillianceColor, brillianceArea, brillianceFrequency, 10, false)



}

export function drawAudioB(audioData) {

console.log("audioDataB: " + dataArray[250]);

  canvasCtx[0].clearRect(0, 0, canvasWidth, canvasHeight);
  canvasCtx[1].clearRect(0, 0, canvasWidth, canvasHeight);

  for (let i = 0; i <= 14; i++) {
  }

  const subBassColor = document.getElementById("colorpickerSubBass").value;
  const bassColor = document.getElementById("colorpickerBass").value;
  const lowerMidColor = document.getElementById("colorpickerLowMid").value;
  const midColor = document.getElementById("colorpickerMid").value;
  const higherMidColor = document.getElementById("colorpickerHighMid").value;
  const presenceColor = document.getElementById("colorpickerPresence").value;
  const brillianceColor = document.getElementById("colorpickerBrilliance").value;


  //sub bass
  drawFunction(canvasCtx[1], audioData, 3.5, subBassColor, subBassArea, subBassFrequency, 40, true)

  //bass
  drawFunction(canvasCtx[1], audioData, 3, bassColor, bassArea, bassFrequency, 35, false)

  //lowmid
  drawFunction(canvasCtx[1], audioData, 2.5, lowerMidColor, lowerMidArea, lowerMidFrequency, 30, true)

  //mid
  drawFunction(canvasCtx[1], audioData, 2, midColor, midArea, midFrequency, 25, false)
 
  //highmid
  drawFunction(canvasCtx[1], audioData, 1.5, higherMidColor, higherMidArea, higherMidFrequency, 20, true)

  //presence
  drawFunction(canvasCtx[1], audioData, 1, presenceColor, presenceArea, presenceFrequency, 15, true)
 
  //brilliance
  drawFunction(canvasCtx[1], audioData, 0.5, brillianceColor, brillianceArea, brillianceFrequency, 10, true)

}

