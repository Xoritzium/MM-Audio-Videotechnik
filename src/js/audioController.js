import * as userInterface from "./index.js";
import AudioPlayer from "./audioPlayer.js";
import * as audioVisualizer from "./audioVisualizer.js"

export let audioAPlaying = false;
export let audioAPlaybackSpeed = 1;
export let audioAVolume = 50;

export let audioBPlaying = false;
export let audioBPlaybackSpeed = 1;
export let audioBVolume = 50;

//skip Forward/Backward in seconds
let skipAmount = 5;

//setup web Audio API
let audioA = new AudioPlayer("A");
let audioB = new AudioPlayer("B");

const dropBox = document.getElementById('dragBoxA');


// -------------------------------------- audio A
/**
 * Plays audio A.
*/
export function playAudioA() {
    // audio control
    audioAPlaying = true;
    userInterface.switchButtonPlayAudioA();
    console.log('play audio a ' + audioAPlaying);
    audioA.playAudio();
    getAudioSpectrumAudioA();
}
/**
 * Pauses audio A.
 */
export function pauseAudioA() {
    // audio control
    audioAPlaying = false;
    userInterface.switchButtonPlayAudioA();
    console.log('pause audio a ' + audioAPlaying);
    audioA.pauseAudio();
   
  
}
/**
 * Skips backward audio A.
 */
export function skipBackwardAudioA() {
    // audio control
    console.log('skip backward audio a');
    audioA.skipBackward(skipAmount);
}
/**
 * Skips forwad audio A.
 */
export function skipForwardAudioA() {
    audioA.skipForward(skipAmount);

    // audio control
    console.log('skip forward audio a');

}
/**
 * Changes the playback speed for audio A.
 * 
 * @param {number} newPlaybackSpeedAudioA The new playback Speed for audio A.
 */
export function changePlaybackSpeedAudioA(newPlaybackSpeedAudioA) {
    // audio control
    console.log("new speed: " + newPlaybackSpeedAudioA);
    audioAPlaybackSpeed = newPlaybackSpeedAudioA;
    audioA.applyNewPlayRate(audioAPlaybackSpeed);
    console.log("playback speed audio a changed to: " + audioAPlaybackSpeed);
}
/**
 * Changes the volume for audio A.
 * 
 * @param {*} event 
 */
export function changeVolumeAudioA(event) {
    let value = event.target.value;
    // audio control
    let audioAVolume = value / 2;
    audioA.changeVolume(audioAVolume);
    // console.log("volume audio a changed to: " + audioAVolume / 100);
}

/*
Gets the Spectrum as an array
 fftsize/2 (2048/2) = 1024 => array.length
 values between 0,255
*/
export function getAudioSpectrumAudioA() {
    let data = audioA.getAudioFrequencyData();
    dataArray.set(data); // Update dataArray with audioA data
    if (audioAPlaying) {
        requestAnimationFrame(getAudioSpectrumAudioA);
    }
}


/**
 * Crossfades between audio A and B.
 * 
 * @param {*} event 
 */
export function crossfade(event) {
    const value = event.target.value / 2;
    // audio control
    //    console.log("crossfader position: " + userInterface.crossfader.value)
    audioA.changeVolume(-1 * value + 50);
    audioB.changeVolume(value);
}

// -------------------------------------- audio B
/**
 * Plays audio B.
 */
export function playAudioB() {
    // audio control
    audioBPlaying = true;
    userInterface.switchButtonPlayAudioB();
    console.log('play audio b ' + audioBPlaying);
    audioB.playAudio();
    getAudioSpectrumAudioB();
}
/**
 * Pauses audio B.
 */
export function pauseAudioB() {
    // audio control
    audioBPlaying = false;
    userInterface.switchButtonPlayAudioB();
    console.log('pause audio b ' + audioBPlaying);
    audioB.pauseAudio();
}
/**
 * Skips backward audio B.
 */
export function skipBackwardAudioB() {
    // audio control
    console.log('skip backward audio b');
    audioB.skipBackward(skipAmount);
}
/**
 * Skips forwad audio B.
 */
export function skipForwardAudioB() {
    // audio control
    console.log('skip forward audio b');
    audioB.skipForward(skipAmount);
}
/**
 * Changes the playback speed for audio B.
 * 
 * @param {number} newPlaybackSpeedAudioB The new playback Speed for audio B.
 */
export function changePlaybackSpeedAudioB(newPlaybackSpeedAudioB) {
    // audio control
    audioBPlaybackSpeed = newPlaybackSpeedAudioB;
    console.log("playback speed audio b changed to: " + audioBPlaybackSpeed);
    audioB.applyNewPlayRate(audioBPlaybackSpeed);
}
/**
 * Changes the volume for audio B.
 * 
 * @param {*} event 
 */
// audio control                
export function changeVolumeAudioB(event) {
    const value = event.target.value // because gainNode expects values between 0,1
    audioBVolume = value / 2;
    //   console.log("volume audio b changed to: " + audioBVolume);
    audioB.changeVolume(value);
}

/*
Gets the Spectrum as an array
 fftsize/2 (2048/2) = 1024 => array.length
 values between 0,255
*/
export function getAudioSpectrumAudioB() {
    let data = audioB.getAudioFrequencyData();
    dataArrayB.set(data); // Update dataArrayB with audioB data
    if (audioBPlaying) {
        requestAnimationFrame(getAudioSpectrumAudioB);
    }
}




export function allowDropForAudio(event) {
    event.preventDefault();
    //  event.stopPropagation();
}



// get drop from audio A
export function getAudioForA(event) {
    
    event.preventDefault();
    const files = event.dataTransfer.files;

    console.log("files dropped audio A: " + files.length);

    /*
    if (typeof file != 'undefined') {
        audioA.setNewAudio(file);
    }
    */
    
    if (files.length > 0) {
        let title = audioA.setNewAudio(files[0]);
        userInterface.changeTitleAudioA(title);

    } else {
        alert("no audio given");
    }
    

}


/**
 * get drop from audio B
 */
export function getAudioForB(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    console.log("files dropped audio B: " + files.length);
    if (files.length > 0) {
        let title = audioB.setNewAudio(files[0]);
        userInterface.changeTitleAudioB(title);

    } else {
        alert("no audio given");
    }
}
//change
// audio A postion changer
const canvasPositionAudioA = document.getElementById("canvasPositionIndicatorAudioA");
canvasPositionAudioA.addEventListener('click', handlePositionChangeAudioA);

function handlePositionChangeAudioA(event) {
    const rect = canvasPositionAudioA.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const positionPercentage = clickX / canvasPositionAudioA.clientWidth;
    audioA.skipToSpecificLocation(positionPercentage);
}

// audio B postion changer
const canvasPositionAudioB = document.getElementById("canvasPositionIndicatorAudioB");
canvasPositionAudioB.addEventListener('click', handlePositionChangeAudioB);

function handlePositionChangeAudioB(event) {
    const rect = canvasPositionAudioB.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const positionPercentage = clickX / canvasPositionAudioB.clientWidth;
    audioB.skipToSpecificLocation(positionPercentage);
}
//change end
