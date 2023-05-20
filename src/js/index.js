import * as audioController from "./audioController.js"

// -------------------------------------- buttons audio A
const buttonPlayAudioA = document.querySelector('.buttonPlayAudioA');
const buttonPauseAudioA = document.querySelector('.buttonPauseAudioA');

const buttonSkipBackwardAudioA = document.querySelector(".buttonSkipBackwardAudioA");
const buttonSkipForwardAudioA = document.querySelector(".buttonSkipForwardAudioA");

const dropdownAudioA = document.querySelector('.dropdownAudioA');
const dropdownContentAudioA = document.querySelector('.dropdownContentAudioA');
const buttonPlaybackSpeedAudioA = document.querySelector('.buttonPlaybackSpeedAudioA');
const playbackSpeedAudioA = dropdownContentAudioA.querySelectorAll('a');

export const volumeSliderAudioA = document.querySelector('.volumeSliderAudioA');

// -------------------------------------- buttons audio B
const buttonPlayAudioB = document.querySelector('.buttonPlayAudioB');
const buttonPauseAudioB = document.querySelector('.buttonPauseAudioB');

const buttonSkipBackwardAudioB = document.querySelector(".buttonSkipBackwardAudioB");
const buttonSkipForwardAudioB = document.querySelector(".buttonSkipForwardAudioB");

const dropdownAudioB = document.querySelector('.dropdownAudioB');
const dropdownContentAudioB = document.querySelector('.dropdownContentAudioB');
const buttonPlaybackSpeedAudioB = document.querySelector('.buttonPlaybackSpeedAudioB');
const playbackSpeedAudioB = dropdownContentAudioB.querySelectorAll('a');

export const volumeSliderAudioB = document.querySelector('.volumeSliderAudioB');

// -------------------------------------- cossfader, buttonFX, fx menu
export const crossfader = document.querySelector(".crossfader");
const buttonFX = document.querySelector(".buttonFX");
const fxMenu = document.querySelector(".fxMenu");

// -------------------------------------- event listeners for buttons audio A
buttonPlayAudioA.addEventListener('click', audioController.playAudioA);
buttonPauseAudioA.addEventListener('click', audioController.pauseAudioA);
buttonSkipBackwardAudioA.addEventListener('click', audioController.skipBackwardAudioA);
buttonSkipForwardAudioA.addEventListener('click', audioController.skipForwardAudioA);
buttonPlaybackSpeedAudioA.addEventListener('click', toggleDropdownAudioA);
volumeSliderAudioA.addEventListener('input', audioController.changeVolumeAudioA);

// -------------------------------------- event listeners for buttons audio B
buttonPlayAudioB.addEventListener('click', audioController.playAudioB);
buttonPauseAudioB.addEventListener('click', audioController.pauseAudioB);
buttonSkipBackwardAudioB.addEventListener('click', audioController.skipBackwardAudioB);
buttonSkipForwardAudioB.addEventListener('click', audioController.skipForwardAudioB);
buttonPlaybackSpeedAudioB.addEventListener('click', toggleDropdownAudioB);
volumeSliderAudioB.addEventListener('input', audioController.changeVolumeAudioB);

// -------------------------------------- event listeners for crossfader, button fx
crossfader.addEventListener("input", audioController.crossfade);
buttonFX.addEventListener("click", openFXMenu);

// -------------------------------------- actions audio A
/**
 * Switches play and pause button for audio A.
 */
export function switchButtonPlayAudioA() {
    if (audioController.audioAPlaying == false) {
        buttonPlayAudioA.classList.toggle("visible");
        buttonPauseAudioA.classList.toggle("visible");
    } else {
        buttonPlayAudioA.classList.toggle("visible");
        buttonPauseAudioA.classList.toggle("visible");
    }
}
/**
 * Toggles the dropdown menu for audio A.
 */
function toggleDropdownAudioA() {
    dropdownContentAudioA.classList.toggle('show');
}
/* 
* Adds an event listener for all links of the dropdown menu for audio A.
* Retrieves the clicked playback speed for audio A
* and changes the current playback speed indicator.
*/
playbackSpeedAudioA.forEach(
    function (link) {
        link.addEventListener('click', function () {
            const playbackSpeed = link.getAttribute('data-playbackSpeed');
            buttonPlaybackSpeedAudioA.textContent = playbackSpeed + 'x';
            audioController.changePlaybackSpeedAudioA(playbackSpeed);
            toggleDropdownAudioA();
        });
    }
);
// Event listener for clicks outside of dropdown/menu.
document.addEventListener('click', closeMenus);
/**
 * Closes dropdown or menu if clicked outside.
 * @param {*} event 
 */
function closeMenus(event) {
    const target = event.target;
    if (!dropdownAudioA.contains(target)) {
        dropdownContentAudioA.classList.remove('show');
    }
    if (!dropdownAudioB.contains(target)) {
        dropdownContentAudioB.classList.remove('show');
    }
    if (!fxMenu.contains(target) && target !== buttonFX) {
        fxMenu.style.display = "none";
    }
}
/**
 * Opens the FX menu.
 */
function openFXMenu() {
    fxMenu.style.display = "block";
}
/**
 * Closes the FX menu.
 */
export function closeFXMenu() {
    fxMenu.style.display = "none";
}

// -------------------------------------- actions audio B
/**
 * Switches play and pause button for audio B.
 */
export function switchButtonPlayAudioB() {
    if (audioController.audioBPlaying == false) {
        buttonPlayAudioB.classList.toggle("visible");
        buttonPauseAudioB.classList.toggle("visible");
    } else {
        buttonPlayAudioB.classList.toggle("visible");
        buttonPauseAudioB.classList.toggle("visible");
    }
}
/**
 * Toggles the dropdown menu for audio B.
 */
function toggleDropdownAudioB() {
    dropdownContentAudioB.classList.toggle('show');
}
/* 
* Adds an event listener for all links of the dropdown menu for audio B.
* Retrieves the clicked playback speed for audio B
* and changes the current playback speed indicator.
*/
playbackSpeedAudioB.forEach(
    function (link) {
        link.addEventListener('click', function () {
            const playbackSpeed = link.getAttribute('data-playbackSpeed');
            buttonPlaybackSpeedAudioB.textContent = playbackSpeed + 'x';
            audioController.changePlaybackSpeedAudioB(playbackSpeed);
            toggleDropdownAudioB();
        });
    }
);