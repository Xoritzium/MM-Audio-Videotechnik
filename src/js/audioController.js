import * as userInterface from "./index.js";
import AudioPlayer from "./audioPlayer.js";

export let audioAPlaying = false;
export let audioAPlaybackSpeed = 1;
export let audioAVolume = 50;

export let audioBPlaying = false;
export let audioBPlaybackSpeed = 1;
export let audioBVolume = 50;

//setup web Audio API
let audioA = new AudioPlayer("Technobase - Mutter der Mann mit dem Koks ist da .mp3");
let audioB = new AudioPlayer("Hardwell - Bella Ciao (Hardwell & Maddix Remix).mp3");

if (!window.AudioContext) {
    alert("Web audio API not supported!");
}


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
}
/**
 * Skips forwad audio A.
 */
export function skipForwardAudioA() {
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
    audioAPlaybackSpeed = newPlaybackSpeedAudioA;
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
    console.log("volume audio a changed to: " + audioAVolume / 100);
}


/**
 * Crossfades between audio A and B.
 * 
 * @param {*} event 
 */
export function crossfade(event) {
    const value = event.target.value / 2;
    // audio control
    console.log("crossfader position: " + userInterface.crossfader.value)
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
}
/**
 * Skips forwad audio B.
 */
export function skipForwardAudioB() {
    // audio control
    console.log('skip forward audio b');
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
    console.log("volume audio b changed to: " + audioBVolume);
    audioB.changeVolume(value);
}


export function allowDropForAudio(event) {
    event.preventDefault();
}



// get drop from audio A
export function getAudioForA(event) {
    let data = null;
    console.log("something has been dropped.");
    event.preventDefault();
    data = event.dataTransfer.items;

    if (data.length > 1) {
        alert("Drop only one File please.");
        data = null;
        return;
    }
    data = event.dataTransfer.items[0];
    console.log("kind: " + data.kind);
    console.log("tpye: " + data.type);
    audioA = new AudioPlayer(data);
    /** -> rumprobiere.
     * 
    let xhr = new XMLHttpRequest();
    xhr.open("POST", 'URL');
    xhr.onreadystatechange = () =>{
        console.log("in onReadyStateChange"); 
            if(xhr.readyState == 4){ //complete
                if(xhr.status == 200){ // success
                    audioA = new AudioPlayer(request.response);
                }else{
                    console.log("upload failed");
                }
            }else{
                console.log("readyStatus =" + xhr.readyState);
            }
        }
        */

}


/**
 * get drop from audio B
 */
export function getAudioForB(event) {

}