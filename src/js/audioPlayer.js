// change
import analyzeFrequencySpectrum from "./frequencySpectrumAnalyzer.js";
//change end
class AudioPlayer {

    //change
    /**
     * 
     * @param {string} audioType "A" or "B"
     */
    constructor(audioType) {
        if (!window.AudioContext) {
            alert("Web audio API not supported!");
        }
        this.audioType = audioType;
        // initializing the current playback time to 0
        this.currentPlaybackTime = 0;
        // change end

    }


    setNewAudio(droppedFile) {

        if (this.audioContext) {
            if (this.audioContext.state === 'running') {
                this.audioBufferSource.stop();
            }
            this.audioContext.close();

        }


        //setup web Audio API
        this.audioContext = new AudioContext();
        this.audioVolumeGainNode = this.audioContext.createGain();
        this.crossFaderGainNode = this.audioContext.createGain();
        this.audioVolume = 10;

        this.analyserNode = this.audioContext.createAnalyser();
        this.analyserNode.fftSize = 2048;
        this.audioFrequencyDataArrayLength = this.analyserNode.frequencyBinCount;
        this.frequencyDataArray = new Uint8Array(this.audioFrequencyDataArrayLength);
        console.log("arraylength: " + this.audioFrequencyDataArrayLength)
        this.analyserNode.getByteFrequencyData(this.frequencyDataArray);

        const audioFile = droppedFile;
        const reader = new FileReader();
        reader.readAsArrayBuffer(audioFile);

        reader.onloadend = () => {
            this.audioBuffer = reader.result;
            this.audioContext.decodeAudioData(this.audioBuffer).then(
                this.setBuffer.bind(this));

            // change
            // creating a temporary object URL for the audio file to match the parameters
            // of analyzeFrequencySpectrum
            const audioElement = new Audio();
            audioElement.src = URL.createObjectURL(droppedFile);
            if (this.audioType == "A") {
                analyzeFrequencySpectrum(audioElement, "canvasFrequSpectrumAudioA");
            } else if (this.audioType == "B") {
                analyzeFrequencySpectrum(audioElement, "canvasFrequSpectrumAudioB");
            }
            //change end

        }

        return audioFile.name;

    }

    setBuffer(decodedBuffer) {
        this.audioBuffer = decodedBuffer;
        this.isReady = true;
        this.audioBuffer.loop = true;
    }

    /**
     * actual audio stuff
    */
    playAudio() {

        if (!this.audioBuffer) {
            return;
        }
        console.log("play");
        
        

        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();

        } else {
            this.buildNodeTree();
            // change
            // the new audio playback
            this.startTime = this.audioContext.currentTime;
            this.audioBufferSource.start(0, this.startTime);
            this.updatePlaybackIndicator();
            //change end
        }

    }

    buildNodeTree() {

        this.audioBufferSource = this.audioContext.createBufferSource();
        this.audioBufferSource.buffer = this.audioBuffer;


        //disconnect
        this.audioBufferSource.disconnect();
        //build node tree
        this.audioBufferSource.connect(this.audioVolumeGainNode);
        this.audioVolumeGainNode.connect(this.crossFaderGainNode);
        this.crossFaderGainNode.connect(this.analyserNode);
        this.analyserNode.connect(this.audioContext.destination);

    }

    pauseAudio() {
        if (this.audioContext.state === 'running') {
            this.audioContext.suspend();
        }
       
    }

    changeVolume(value) {
        this.audioVolume = value / 100;
        this.audioVolumeGainNode.gain.value = this.audioVolume;
        console.log("new gain: " + this.audioVolumeGainNode.gain.value);
    }

    handleCrossFader(val) {
        this.crossFaderGainNode.gain.value = val / 100;
    }

    applyNewPlayRate(val) {
        this.audioBufferSource.playbackRate.value = val;
    }


    skipForward(amount) {
        let time = this.audioContext.currentTime;
        this.audioBufferSource.stop();
        this.buildNodeTree();
        this.audioBufferSource.start(0, amount + time);

        this.updatePlaybackIndicator();
    }

    skipBackward(amount) {
        
                let time = this.audioContext.currentTime;
                this.audioBufferSource.stop();
                this.buildNodeTree();
                if (time - amount >= 0) {
                    this.audioBufferSource.start(0, time - amount);
                } else {
                    this.audioBufferSource.start(0);
                }
        
     
        this.updatePlaybackIndicator();
    }
    // orig:
    /**
     * 
     * @param {float} amount normalized value between 0,1
     */
    /*   skipToSpecificLocation(amount) {
          if (amount < 0 || amount > 1) {
              throw new Error("Amount has to be between [0,1]!")
          } else {
              if (this.audioBuffer) {
                  this.audioBufferSource.stop();
                  this.buildNodeTree();
                  this.audioBufferSource.start(0, amount * this.audioBuffer.duration);
                  console.log("song duration: " + this.audioBuffer.duration);
                  console.log("entered Position: " + amount * this.audioBuffer.duration);
                  
                  
                  this.updatePlaybackIndicator();
              }
  
          }
  
      } */
    /* change */
    skipToSpecificLocation(amount) {
        if (amount < 0 || amount > 1) {
            throw new Error("Amount has to be between [0,1]!");
        } else if (this.audioBufferSource && this.audioBuffer) {
            const newTime = amount * this.audioBuffer.duration;

            // save the current playback state
            const wasPlaying = this.audioContext.state === "running";

            // stop and reset the current audio
            this.audioBufferSource.stop();
/*
            // create a new buffer source and update the start time
            this.audioBufferSource = this.audioContext.createBufferSource();
            this.audioBufferSource.buffer = this.audioBuffer;
            */
            this.buildNodeTree();

            // the new audio playback
            this.startTime = this.audioContext.currentTime - newTime;
            this.audioBufferSource.start(0, newTime);

            // if it was playing before seeking, resume playback
            if (wasPlaying) {
                this.audioContext.resume();
            }

            // update the current playback time
            this.currentPlaybackTime = newTime;

            this.updatePlaybackIndicator();
        }
    }
    /* change end */


    // returns the frequency of the current playing song.
    //make sure to call it every frame !
    // each array index has a value between 0 and 255.
    getAudioFrequencyData() {
        this.analyserNode.getByteFrequencyData(this.frequencyDataArray);
        return this.frequencyDataArray;

    }
    /**
     * Animates a playback indicator of the currently played audio.
     * 
     */
    updatePlaybackIndicator() {
        
        const canvasId = this.audioType === "A" ? "canvasPositionIndicatorAudioA" : "canvasPositionIndicatorAudioB";
        const canvas = document.getElementById(canvasId);
        const canvasCtx = canvas.getContext('2d');

        if (canvasCtx && this.audioBufferSource) {
            const canvasWidth = canvasCtx.canvas.width;
            const canvasHeight = canvasCtx.canvas.height;
            const currentTime = this.audioContext.currentTime - this.startTime;
            const totalTime = this.audioBuffer.duration;
            const indicatorPosition = (currentTime / totalTime) * canvasWidth;


            canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);

            // playback indicator
            canvasCtx.fillStyle = "red"; 
            canvasCtx.fillRect(indicatorPosition, 0, 2, canvasHeight);
        }

        // updating the indicator
        requestAnimationFrame(this.updatePlaybackIndicator.bind(this));
    }


}
export default AudioPlayer;
