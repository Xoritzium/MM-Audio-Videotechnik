import * as audioController from "./audioController.js";


    // setup canvas context 
    let canvas = document.getElementById("visualizer")
    let canvasCtx = canvas.getContext("2d")

    // get same Color of the Window behind the canvas, in order to let the canvas appear transparent except for the drawing 
    const visualizerWindow = document.getElementById('VisualizerWindow')
    const backgroundColor = window.getComputedStyle(visualizerWindow).getPropertyValue('background')

    // setup audio context for testing
    let audioCtx = new window.AudioContext()
    let audio = document.getElementById("audioTest")
    let track = audioCtx.createMediaElementSource(audio)
    let analyser = audioCtx.createAnalyser()
    analyser.fftSize = 4096
    let bufferLength = analyser.frequencyBinCount
    let dataArray = new Uint8Array(bufferLength)
    analyser.getByteTimeDomainData(dataArray)
    track.connect(analyser).connect(audioCtx.destination)
    
    let subBass = [0,60]
    let bass = [61,250]
    let lowerMid = [250, 500]
    let mid = [500, 2000]
    let higherMid = [2000, 4000]
    let presence = [4000, 6000]
    let brilliance = [6000, 20000]

    let subBassArea = [subBass[0], Math.trunc((subBass[1]/20000) * bufferLength)]
    let bassArea = [subBassArea[1] +1, (subBassArea[1] +1) + (Math.trunc( ( (bass[1] - bass[0]) / 20000) * bufferLength ))]
    let lowerMidArea = [bassArea[1] +1, (bassArea[1] +1) + (Math.trunc( ((lowerMid[1] - lowerMid[0]) /20000 ) * bufferLength))]
    let midArea = [lowerMidArea[1] +1, (lowerMidArea[1] +1) + (Math.trunc( ((mid[1] - mid[0])/ 20000) * bufferLength))]
    let higherMidArea = [midArea[1] +1, (midArea[1] +1) + (Math.trunc( ((higherMid[1] - higherMid[0]) / 20000) * bufferLength))]
    let presenceArea = [higherMidArea[1] +1, (higherMidArea[1] +1) + (Math.trunc( ( (presence[1] - presence[0]) / 20000) * bufferLength))]
    let brillianceArea = [presenceArea[1] +1, bufferLength]

    console.log(bufferLength)
    console.log(subBassArea)
    console.log(bassArea)
    console.log(lowerMidArea)
    console.log(midArea)
    console.log(higherMidArea)
    console.log(presenceArea)
    console.log(brillianceArea)

    let playerA;
    let playerB;
  

    let x = 0;
    let amplitude = 0; // Controls the height of the wave
    let frequency = 0.03; // Controls the speed of the wave
    const yOffset = canvas.height / 2; // Vertical center of the canvas

  let subBassFrequency = 0.005;
  let bassFrequency = 0.01;
  let lowMidFrequency = 0.02;
  let midFrequency = 0.04;
  let higherMidFrequency = 0.06; 
  let presenceFrequency = 0.08;
  let brillainceFrequency = 0.1;


  let subBassAmplitude;
  let bassAmplitude;
  let lowMidAmplitude;
  let midAmplitude;
  let higherMidAmplitude;
  let presenceAmplitude;
  let brillianceAmplitude;

  function setPlayerA(audioPlayer) { playerA = audioPlayer }

  function setPlayerB(audioPlayer) { playerB = audioPlayer }

  function clearCanvas() { canvasCtx.clearRect(0, 0, canvas.width, canvas.height) }

  function draw() {
    
    analyser.getByteFrequencyData(dataArray);
    canvasCtx.fillStyle = backgroundColor;
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  
    //sub bass
    canvasCtx.lineWidth = 3.5;
    canvasCtx.strokeStyle = "rgb(128, 0, 0)";
    canvasCtx.beginPath();  

    subBassAmplitude = 0
    for (let i = subBassArea[0]; i < subBassArea[1]; i++ )
      if (dataArray[i] > subBassAmplitude)
        subBassAmplitude = (dataArray[i] / 255 ) * yOffset

    let sy = subBassAmplitude * Math.cos(x * subBassFrequency) + yOffset
    canvasCtx.moveTo(0, sy);

    for (let i = 0; i < canvas.width; i += 5) {
      const y = subBassAmplitude * Math.cos((i + x) * subBassFrequency) + yOffset
      canvasCtx.lineTo(i, y)
    }
    canvasCtx.stroke()

    //bass
    canvasCtx.lineWidth = 3;
    canvasCtx.strokeStyle = "rgb(0, 128, 0)";
    canvasCtx.beginPath();  

    bassAmplitude = 0
    for (let i = bassArea[0]; i < bassArea[1]; i++ )
      if (dataArray[i] > bassAmplitude)
      bassAmplitude = (dataArray[i] / 255 ) * yOffset

    let bay = bassAmplitude * Math.cos(x * bassFrequency) + yOffset
    canvasCtx.moveTo(0, bay);

    for (let i = 0; i < canvas.width; i += 5) {
      const y = subBassAmplitude * Math.cos((i + x) * bassFrequency) + yOffset
      canvasCtx.lineTo(i, y)
    }
    canvasCtx.stroke()

    //lowmid
    canvasCtx.lineWidth = 2.5;
    canvasCtx.strokeStyle = "rgb(0, 0, 128)";
    canvasCtx.beginPath();  

    lowMidAmplitude = 0
    for (let i = lowerMidArea[0]; i < lowerMidArea[1]; i++ )
      if (dataArray[i] > lowMidAmplitude)
      lowMidAmplitude = (dataArray[i] / 255 ) * yOffset

    let ly = lowMidAmplitude * Math.cos(x * lowMidFrequency) + yOffset
    canvasCtx.moveTo(0, ly);

    for (let i = 0; i < canvas.width; i += 5) {
      const y = lowMidAmplitude * Math.cos((i + x) * lowMidFrequency) + yOffset
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

    for (let i = 0; i < canvas.width; i += 5) {
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

    let hy = higherMidAmplitude * Math.cos(x * higherMidFrequency) + yOffset
    canvasCtx.moveTo(0, hy);

    for (let i = 0; i < canvas.width; i += 5) {
      const y = higherMidAmplitude * Math.cos((i + x) * higherMidFrequency) + yOffset
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

    for (let i = 0; i < canvas.width; i += 5) {
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

    let by = brillianceAmplitude * Math.cos(x * brillainceFrequency) + yOffset
    canvasCtx.moveTo(0, by);

    for (let i = 0; i < canvas.width; i += 5) {
      const y = brillianceAmplitude * Math.cos((i + x) * brillainceFrequency) + yOffset
      canvasCtx.lineTo(i, y)
    }
    canvasCtx.stroke()

    x += 1;

    requestAnimationFrame(draw);
  }

  draw()

