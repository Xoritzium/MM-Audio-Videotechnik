import * as audioController from "./audioController.js"

  // setup canvas context 1 & 2
  var canvasElements = document.getElementsByClassName("areaVisualizerCanvas")
  let canvasHeight = canvasElements[0].height
  let canvasWidth = canvasElements[0].width  
  let canvasCtx = []
  for (let i = 0; i < canvasElements.length; i++) {
    canvasCtx.push(canvasElements[i].getContext("2d"))
    console.log("pushed canvas ctx")
  }


  console.log("pushed canvas ctx :" + canvasCtx.length)

  // setup audio context for testing
  let audioCtx = new window.AudioContext()
  let audio = document.getElementById("audioTest")
  let track = audioCtx.createMediaElementSource(audio)
  let analyser = audioCtx.createAnalyser()
  analyser.fftSize = 8192
  let bufferLength = analyser.frequencyBinCount
  let dataArray = new Uint8Array(bufferLength);
  let dataArrayB = new Uint8Array(bufferLength); // Add this line for the second data array

  analyser.getByteTimeDomainData(dataArray);
  analyser.getByteTimeDomainData(dataArrayB);
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
  const frequencyAreas = []
  
  for (let i = 0; i < frequencySpectrum.length; i++) {

  }

  let subBass = [0,60]
  let bass = [61,250]
  let lowerMid = [250, 500]
  let mid = [500, 2000]
  let higherMid = [2000, 4000]
  let presence = [4000, 6000]
  let brilliance = [6000, 20000]


  let subBassArea = [subBass[0], Math.round((subBass[1]/20000) * bufferLength)]
  let bassArea = [subBassArea[1] +1, (subBassArea[1] +1) + (Math.round( ( (bass[1] - bass[0]) / 20000) * bufferLength ))]
  let lowerMidArea = [bassArea[1] +1, (bassArea[1] +1) + (Math.round( ((lowerMid[1] - lowerMid[0]) /20000 ) * bufferLength))]
  let midArea = [lowerMidArea[1] +1, (lowerMidArea[1] +1) + (Math.round( ((mid[1] - mid[0])/ 20000) * bufferLength))]
  let higherMidArea = [midArea[1] +1, (midArea[1] +1) + (Math.round( ((higherMid[1] - higherMid[0]) / 20000) * bufferLength))]
  let presenceArea = [higherMidArea[1] +1, (higherMidArea[1] +1) + (Math.round( ( (presence[1] - presence[0]) / 20000) * bufferLength))]
  let brillianceArea = [presenceArea[1] +1, bufferLength]

  console.log(subBassArea, bassArea, lowerMidArea, midArea, higherMidArea, presenceArea, brillianceArea)

  let x = 0;
  const yOffset = canvasElements[0].height / 2

  let subBassFrequency = 0.014;
  let bassFrequency = 0.028;
  let lowerMidFrequency = 0.042;
  let midFrequency = 0.056;
  let higherMidFrequency = 0.07; 
  let presenceFrequency = 0.084;
  let brillianceFrequency = 0.1;

  let subBassAmplitude;
  let bassAmplitude;
  let lowMidAmplitude;
  let midAmplitude;
  let higherMidAmplitude;
  let presenceAmplitude;
  let brillianceAmplitude;


  function drawFunction(canvasCtx, dataArray, lineWidth, lineColor, frequencyRange, frequency, functionOffset, reverted) {

    canvasCtx.lineWidth = lineWidth
    canvasCtx.strokeStyle = lineColor
    canvasCtx.beginPath();

    let amplitude = 0;
    let revertAdjustment = 0;

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
      canvasCtx.strokeStyle = "rgb(0, 0, 0)"
      canvasCtx.lineWidth = 0.3
      canvasCtx.beginPath()
      canvasCtx.lineTo(1,0)
      canvasCtx.lineTo(1,canvasHeight)
      canvasCtx.stroke()

    } else {

      for (let i = 0; i < (canvasWidth - functionOffset); i ++) {
        const y = amplitude * Math.sin((i + x) * frequency) + yOffset
        canvasCtx.lineTo(i, y)
      }
    
      canvasCtx.stroke()
      canvasCtx.strokeStyle = "rgb(0, 0, 0)"
      canvasCtx.lineWidth = 0.3
      canvasCtx.beginPath()
      canvasCtx.lineTo(canvasWidth,0)
      canvasCtx.lineTo(canvasWidth,canvasHeight)
      canvasCtx.stroke()

    }

  }
    

    function drawFrequencyCurve(canvasCtx, dataArray, x, yOffset, xLeftOffset, aggregation, rgbColor, frequencyArea, frequencyFrequency) {
      let amplitude = 0;
    
      for (let i = frequencyArea[0]; i < frequencyArea[1]; i++) {
        if (dataArray[i] > amplitude) {
          amplitude = (dataArray[i] / 255) * yOffset;
        }
      }
    
      let y = amplitude * Math.sin(x * frequencyFrequency) + yOffset;
      canvasCtx.beginPath()
      canvasCtx.moveTo(0, y)
    
      for (let i = 0; i < canvasCtx.canvas.width; i += aggregation) {
        y = amplitude * Math.sin((i + x) * frequencyFrequency) + yOffset;
        canvasCtx.lineTo(i, y);
      }
    
      canvasCtx.strokeStyle = rgbColor;
      canvasCtx.stroke();
    }



  function draw() {
    
    analyser.getByteFrequencyData(dataArray);

    
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
    drawFunction(canvasCtx[0], dataArray, 3.5, subBassColor, subBassArea, subBassFrequency, 40 , false) 
    drawFunction(canvasCtx[1], dataArrayB, 3.5, subBassColor, subBassArea, subBassFrequency, 40 , true) 
    //bass
    drawFunction(canvasCtx[0], dataArray, 3, bassColor, bassArea, bassFrequency, 35, false) 
    drawFunction(canvasCtx[1], dataArrayB, 3, bassColor, bassArea, bassFrequency, 35, true) 
    //lowmid
    drawFunction(canvasCtx[0], dataArray, 2.5, lowerMidColor, lowerMidArea, lowerMidFrequency, 30, false) 
    drawFunction(canvasCtx[1], dataArrayB, 2.5, lowerMidColor, lowerMidArea, lowerMidFrequency, 30, true) 
    //mid
    drawFunction(canvasCtx[0], dataArray, 2, midColor, midArea, midFrequency, 25, false) 
    drawFunction(canvasCtx[1], dataArrayB, 2, midColor, midArea, midFrequency, 25, true) 
    //highmid
    drawFunction(canvasCtx[0], dataArray, 1.5, higherMidColor, higherMidArea, higherMidFrequency, 20, false) 
    drawFunction(canvasCtx[1], dataArrayB, 1.5, higherMidColor, higherMidArea, higherMidFrequency, 20, true) 
    //presence
    drawFunction(canvasCtx[0], dataArray, 1, presenceColor, presenceArea, presenceFrequency, 15, false) 
    drawFunction(canvasCtx[1], dataArrayB, 1, presenceColor, presenceArea, presenceFrequency, 15, true)
    //brilliance
    drawFunction(canvasCtx[0], dataArray, 0.5, brillianceColor, brillianceArea, brillianceFrequency, 10, false) 
    drawFunction(canvasCtx[1], dataArrayB, 0.5, brillianceColor, brillianceArea, brillianceFrequency, 10, true)
    
    x += 1;

    requestAnimationFrame(draw);
  }

  draw()

