const audioCtx = new window.AudioContext || window.webkitAudioContext;
const canvas = document.getElementById("visualizer")
const canvasCtx = canvas.getContext("2d");

const element = document.getElementById('VisualizerWindow');
const computedStyle = window.getComputedStyle(element);
const color = computedStyle.getPropertyValue('background');

console.log(color);

const audio = document.getElementById("audio");
const track = audioCtx.createMediaElementSource(audio);

let analyser = audioCtx.createAnalyser();
 
analyser.fftSize = 128;
let bufferLength = analyser.frequencyBinCount;
console.log(bufferLength);
let dataArray = new Uint8Array(bufferLength);

//analyser.getByteFrequencyData(dataArray);
//analyser.getByteTimeDomainData(dataArray);

track.connect(analyser).connect(audioCtx.destination);


function draw() {
    requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);
    //analyser.getByteTimeDomainData(dataArray);

    //canvasCtx.globalAlpha = 0.05;
    canvasCtx.fillStyle = color;
    //canvasCtx.fillStyle = "rgb(70, 70, 70)";
    console.log(canvasCtx.fillStyle);
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 1;
    canvasCtx.strokeStyle = "rgb(0, 0, 0)";

    canvasCtx.beginPath();

    let sliceWidth = canvas.width * 1.0 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        let v = dataArray[i] / 128.0;
        let y = v * canvas.height - 100;
        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width+100, canvas.height / 4);
    canvasCtx.stroke();


    /**
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
    **/

}

draw();