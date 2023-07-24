import * as audioController from "./audioController.js";

  // setup canvas context 
  let canvas = document.getElementById("visualizer")
  let canvasCtx = canvas.getContext("2d")

  // get same Color of the Window behind the canvas, in order to let the canvas appear transparent except for the drawing 
  const visualizerWindow = document.getElementById('VisualizerWindow')
  const backgroundColor = window.getComputedStyle(visualizerWindow).getPropertyValue('background')
  canvasCtx.fillStyle = backgroundColor;

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

  console.log(subBassArea, bassArea, lowerMidArea, midArea, higherMid, presenceArea, brillianceArea)

  let x = 0;
  let amplitude = 0; // Controls the height of the wave
  let frequency = 0.03; // Controls the speed of the wave
  const yOffset = canvas.height / 2; // Vertical center of the canvas
  const xLeftOffset = canvas.width * 0.25
  const xRightOffset = canvas.width * 0.75

  let subBassFrequency = 0.014;
  let bassFrequency = 0.028;
  let lowMidFrequency = 0.042;
  let midFrequency = 0.056;
  let higherMidFrequency = 0.07; 
  let presenceFrequency = 0.084;
  let brillainceFrequency = 0.1;

  let subBassAmplitude;
  let bassAmplitude;
  let lowMidAmplitude;
  let midAmplitude;
  let higherMidAmplitude;
  let presenceAmplitude;
  let brillianceAmplitude;

  function drawFunction(lineWidth, lineColor, frequencyRange, aggregation) {
    canvasCtx.lineWidth = lineWidth
    canvasCtx.strokeStyle = lineColor
    canvasCtx.beginPath();

    amplitude = 0;

   

    console.log(frequencyRange)

    for (let i = frequencyRange[0]; i <= frequencyRange[1]; i++){
      switch (aggregation) {
        case "min":
          if (i = 0 || dataArray[i] < amplitude)
            amplitude = (dataArray[i] / 255) * yOffset
        case "mean":
          amplitude += (dataArray[i] / 255) 
          if (i = frequencyRange[1])
            amplitude = Math.floor(amplitude/i) * yOffset
        case "max":
            if (dataArray[i] > amplitude)
              amplitude = (dataArray[i] / 255) * yOffset
      }
    }
    


  }

  function draw() {
    
    analyser.getByteFrequencyData(dataArray);
    canvasCtx.fillStyle = backgroundColor;
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    
    let aggregation = "mean"
  


    console.log(subBassArea)
    //sub bass
    let rgbSubBass = "rgb(128, 0, 0)"
    
    drawFunction(3.5, rgbSubBass, subBassArea, aggregation ) 
    

    subBassAmplitude = 0
    for (let i = subBassArea[0]; i < subBassArea[1]; i++ )
      if (dataArray[i] > subBassAmplitude)
        subBassAmplitude = (dataArray[i] / 255 ) * xLeftOffset

    let subY = subBassAmplitude * Math.sin(x * subBassFrequency) + xLeftOffset
    canvasCtx.moveTo(0, subY );

    for (let i = 0; i < canvas.width; i += 25) {
      const y = subBassAmplitude * Math.sin((i + x) * subBassFrequency) + yOffset
      canvasCtx.lineTo(i, y)
    }
    canvasCtx.stroke()

    //bass
    drawFunction(3, "rgb(0, 128, 0)") 

    bassAmplitude = 0
    for (let i = bassArea[0]; i < bassArea[1]; i++ )
      if (dataArray[i] > bassAmplitude)
      bassAmplitude = (dataArray[i] / 255 ) * yOffset

    let bay = bassAmplitude * Math.cos(x * bassFrequency) + yOffset
    canvasCtx.moveTo(0, bay);

    for (let i = 0; i < canvas.width; i += 20) {
      const y = subBassAmplitude * Math.cos((i + x) * bassFrequency) + yOffset
      canvasCtx.lineTo(i, y)
    }
    canvasCtx.stroke()

    //lowmid
    drawFunction(2.5, "rgb(0, 0, 128)")

    lowMidAmplitude = 0
    for (let i = lowerMidArea[0]; i < lowerMidArea[1]; i++ )
      if (dataArray[i] > lowMidAmplitude)
      lowMidAmplitude = (dataArray[i] / 255 ) * yOffset

    let ly = lowMidAmplitude * Math.sin(x * lowMidFrequency) + yOffset
    canvasCtx.moveTo(0, ly);

    for (let i = 0; i < canvas.width; i += 15) {
      const y = lowMidAmplitude * Math.sin((i + x) * lowMidFrequency) + yOffset
      canvasCtx.lineTo(i, y)
    }
    canvasCtx.stroke()

    //mid
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = "rgb(255, 0, 0)";
    canvasCtx.beginPath();  

    midAmplitude = 0
    for (let i = midArea[0]; i < midArea[1]; i++ )
      if (dataArray[i] > midAmplitude)
      midAmplitude = (dataArray[i] / 255 ) * yOffset

    let my = midAmplitude * Math.cos(x * midFrequency) + yOffset
    canvasCtx.moveTo(0, my);

    for (let i = 0; i < canvas.width; i += 10) {
      const y = midAmplitude * Math.cos((i + x) * midFrequency) + yOffset
      canvasCtx.lineTo(i, y)
    }
    canvasCtx.stroke()

    //highmid
    canvasCtx.lineWidth = 1.5;
    canvasCtx.strokeStyle = "rgb(0, 255, 0)";
    canvasCtx.beginPath();  

    higherMidAmplitude = 0
    for (let i = higherMidArea[0]; i < higherMidArea[1]; i++ )
      if (dataArray[i] > higherMidAmplitude)
      higherMidAmplitude = (dataArray[i] / 255 ) * yOffset

    let hy = higherMidAmplitude * Math.sin(x * higherMidFrequency) + yOffset
    canvasCtx.moveTo(0, hy);

    for (let i = 0; i < canvas.width; i += 5) {
      const y = higherMidAmplitude * Math.sin((i + x) * higherMidFrequency) + yOffset
      canvasCtx.lineTo(i, y)
    }
    canvasCtx.stroke()

    //presence
    canvasCtx.lineWidth = 1;
    canvasCtx.strokeStyle = "rgb(0, 0, 255)";
    canvasCtx.beginPath();  

    presenceAmplitude = 0
    for (let i = presenceArea[0]; i < presenceArea[1]; i++ )
      if (dataArray[i] > presenceAmplitude)
        presenceAmplitude = (dataArray[i] / 255 ) * yOffset

    let py = presenceAmplitude * Math.cos(x * presenceFrequency) + yOffset
    canvasCtx.moveTo(0, py);

    for (let i = 0; i < canvas.width; i += 3) {
      const y = presenceAmplitude * Math.cos((i + x) * presenceFrequency) + yOffset
      canvasCtx.lineTo(i, y)
    }
    canvasCtx.stroke()

    //brilliance
    canvasCtx.lineWidth = 0.5;
    canvasCtx.strokeStyle = "rgb(255, 255, 255)";
    canvasCtx.beginPath();  

    brillianceAmplitude = 0
    for (let i = brillianceArea[0]; i < brillianceArea[1]; i++ )
      if (dataArray[i] > brillianceAmplitude)
      brillianceAmplitude = (dataArray[i] / 255 ) * yOffset

    let by = brillianceAmplitude * Math.sin(x * brillainceFrequency) + yOffset
    canvasCtx.moveTo(0, by);

    for (let i = 0; i < canvas.width; i += 1) {
      const y = brillianceAmplitude * Math.sin((i + x) * brillainceFrequency) + yOffset
      canvasCtx.lineTo(i, y)
    }
    canvasCtx.stroke()

    x += 1;

    requestAnimationFrame(draw);
  }

  draw()

