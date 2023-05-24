import * as userInterface from "./index.js";

export let audioAPlaying = false;
export let audioAPlaybackSpeed = 1;
export let audioAVolume = 100;

export let audioBPlaying = false;
export let audioBPlaybackSpeed = 1;
export let audioBVolume = 100;

// -------------------------------------- audio A
/**
 * Plays audio A.
 */
export function playAudioA() {
    // audio control
    audioAPlaying = true;
    userInterface.switchButtonPlayAudioA();
    console.log('play audio a ' + audioAPlaying);
}
/**
 * Pauses audio A.
 */
export function pauseAudioA() {
    // audio control
    audioAPlaying = false;
    userInterface.switchButtonPlayAudioA();
    console.log('pause audio a ' + audioAPlaying);
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
    const value = event.target.value;
    // audio control
    audioAVolume = value;
    console.log("volume audio a changed to: " + audioAVolume);
}
/**
 * Crossfades between audio A and B.
 * 
 * @param {*} event 
 */
export function crossfade(event) {
    const value = event.target.value;
    // audio control
    console.log("crossfader position: " + userInterface.crossfader.value)
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
}
/**
 * Pauses audio B.
 */
export function pauseAudioB() {
    // audio control
    audioBPlaying = false;
    userInterface.switchButtonPlayAudioB();
    console.log('pause audio b ' + audioBPlaying);
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
export function changeVolumeAudioB(event) {
    const value = event.target.value;
    // audio control                
    audioBVolume = value;
    console.log("volume audio b changed to: " + audioBVolume);
}