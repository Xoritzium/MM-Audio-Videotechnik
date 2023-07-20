
class AudioPlayer {


    constructor() {
        if (!window.AudioContext) {
            alert("Web audio API not supported!");
        }
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
        this.analyserNode.getByteFrequencyData(this.frequencyDataArray);

        const audioFile = droppedFile;
        const reader = new FileReader();
        reader.readAsArrayBuffer(audioFile);


        reader.onloadend = () => {
            this.audioBuffer = reader.result;
            this.audioContext.decodeAudioData(this.audioBuffer).then(
                this.setBuffer.bind(this))
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

        if (!this.audioBuffer) return;
        console.log("play");

        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        } else {
            this.buildNodeTree();
            this.audioBufferSource.start();
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
        this.crossFaderGainNode.connect(this.audioContext.destination);

    }

    pauseAudio() {
        if (this.audioContext.state === 'running') {
            this.audioContext.suspend();
        }
    }

    changeVolume(value) {
        this.audioVolume = value / 100;
        this.audioVolumeGainNode.gain.value = this.audioVolume;
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
    }

    skipBackward(amount) {
/*
        let time = this.audioContext.currentTime;
        this.audioBufferSource.stop();
        this.buildNodeTree();
        if (time - amount >= 0) {
            this.audioBufferSource.start(0, time - amount);
        } else {
            this.audioBufferSource.start(0);
        }
*/
        this.skipToSpecificLocation(0.5);
    }
    /**
     * 
     * @param {float} amount normalized value between 0,1
     */
    skipToSpecificLocation(amount) {
        if (amount < 0 || amount > 1) {
            throw new Error("Amount has to be between [0,1]!")
        } else {
            if (this.audioBuffer) {
                this.audioBufferSource.stop();
                this.buildNodeTree();
                this.audioBufferSource.start(0, amount * this.audioBuffer.duration);
                console.log("song duration: " + this.audioBuffer.duration);
                console.log("entered Position: " +amount * this.audioBuffer.duration);
            }

        }

    }



    // returns the frequency of the current playing song.
    //make sure to call it every frame !
    // each array index has a value between 0 and 255.
    getAudioFrequencyData() {
        return this.frequencyDataArray;
    }
}
export default AudioPlayer;