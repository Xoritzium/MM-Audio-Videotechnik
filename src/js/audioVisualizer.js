import * as audioController from "./audioController.js"

  // setup canvas context 1 & 2
  let canvas = document.getElementById("visualizer1")
  let canvasCtx = canvas.getContext("2d")
  
  let canvas2 = document.getElementById("visualizer2")
  let canvasCtx2 = canvas2.getContext("2d")



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
  
  const subBass = [0,60]
  const bass = [61,250]
  const lowerMid = [250, 500]
  const mid = [500, 2000]
  const higherMid = [2000, 4000]
  const presence = [4000, 6000]
  const brilliance = [6000, 20000]

  let subBassArea = [subBass[0], Math.round((subBass[1]/20000) * bufferLength)]
  let bassArea = [subBassArea[1] +1, (subBassArea[1] +1) + (Math.round( ( (bass[1] - bass[0]) / 20000) * bufferLength ))]
  let lowerMidArea = [bassArea[1] +1, (bassArea[1] +1) + (Math.round( ((lowerMid[1] - lowerMid[0]) /20000 ) * bufferLength))]
  let midArea = [lowerMidArea[1] +1, (lowerMidArea[1] +1) + (Math.round( ((mid[1] - mid[0])/ 20000) * bufferLength))]
  let higherMidArea = [midArea[1] +1, (midArea[1] +1) + (Math.round( ((higherMid[1] - higherMid[0]) / 20000) * bufferLength))]
  let presenceArea = [higherMidArea[1] +1, (higherMidArea[1] +1) + (Math.round( ( (presence[1] - presence[0]) / 20000) * bufferLength))]
  let brillianceArea = [presenceArea[1] +1, bufferLength]

  console.log(subBassArea, bassArea, lowerMidArea, midArea, higherMidArea, presenceArea, brillianceArea)

  let y = 0;
  const xOffset = canvas.width / 2

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

  
  function drawFunction(canvasCtx, dataArray, lineWidth, lineColor, frequencyRange, aggregation, frequency, functionOffset) {
    
    canvasCtx.lineWidth = lineWidth
    canvasCtx.strokeStyle = lineColor
    canvasCtx.beginPath();

    let amplitude = 0;

    for (let i = frequencyRange[0]; i <= frequencyRange[1]; i++){
      switch (aggregation) {
        case "min":
          if (i = 0 || dataArray[i] < amplitude)
            amplitude = (dataArray[i] / 255) *  xOffset
        case "mean":
          amplitude += (dataArray[i] / 255) 
          if (i = frequencyRange[1])
            amplitude = Math.floor(amplitude/i) * xOffset
        case "max":
            if (dataArray[i] > amplitude)
              amplitude = (dataArray[i] / 255) * xOffset
      }
    }

    for (let i = 0; i < (canvas.height - functionOffset); i ++) {
      const x = amplitude * Math.sin((i + y) * frequency) + xOffset
      canvasCtx.lineTo(x, i)
    }

    canvasCtx.stroke()

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

    //canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    
    let aggregation = "max"
  

    //sub bass
    drawFunction(canvasCtx, dataArray, 3.5, "rgb(128, 0, 0)", subBassArea, aggregation, subBassFrequency, 30 ) 
    
    //bass
    drawFunction(canvasCtx, dataArray, 3, "rgb(0, 128, 0)", bassArea, aggregation, bassFrequency, 25) 

    //lowmid
    drawFunction(canvasCtx, dataArray, 2.5, "rgb(0, 0, 128)", lowerMidArea, aggregation, lowerMidFrequency, 20) 

    //mid
    drawFunction(canvasCtx, dataArray, 2, "rgb(255, 0, 0)", midArea, aggregation, midFrequency, 15) 

    //highmid
    drawFunction(canvasCtx, dataArray, 1.5, "rgb(0, 255, 0)", higherMidArea, aggregation, higherMidFrequency, 10) 

    //presence
    drawFunction(canvasCtx, dataArray, 1, "rgb(0, 0, 255)", presenceArea, aggregation, presenceFrequency, 5) 

    //brilliance
    drawFunction(canvasCtx, dataArray, 0.5, "rgb(255, 255, 255)", brillianceArea, aggregation, brillianceFrequency, 0) 
    

    /*drawFrequencyCurve(canvasCtx, dataArray, x, yOffset, xLeftOffset, 3.5, "rgb(128, 0, 0)", subBassArea, subBassFrequency);
    drawFrequencyCurve(canvasCtx, dataArray, x, yOffset, xLeftOffset, 3, "rgb(0, 128, 0)", bassArea, bassFrequency);
    drawFrequencyCurve(canvasCtx, dataArray, x, yOffset, xLeftOffset, 2.5, "rgb(0, 0, 128)", lowerMidArea, lowMidFrequency);
    drawFrequencyCurve(canvasCtx, dataArray, x, yOffset, xLeftOffset, 2, "rgb(255, 0, 0)", midArea, midFrequency);
    drawFrequencyCurve(canvasCtx, dataArray, x, yOffset, xLeftOffset, 1.5, "rgb(0, 255, 0)", higherMidArea, higherMidFrequency);
    drawFrequencyCurve(canvasCtx, dataArray, x, yOffset, xLeftOffset, 1, "rgb(0, 0, 255)", presenceArea, presenceFrequency);
    drawFrequencyCurve(canvasCtx, dataArray, x, yOffset, xLeftOffset, 0.5, "rgb(255, 255, 255)", brillianceArea, brillianceFrequency);
    */

    y += 1;

    requestAnimationFrame(draw);
  }

  draw()

