
class AudioPlayer {

    
    constructor() {

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


        if (!window.AudioContext) {
            alert("Web audio API not supported!");
        }
       
    }


    recieveAudio() {
        this.audioBuffer = this.request.response;
        //this.request.response
        this.audioContext.decodeAudioData(this.audioBuffer).then(
            this.setBuffer.bind(this)
        )
    }

    setBuffer(decodedBuffer) {
        this.audioBuffer = decodedBuffer;
        this.isReady = true;
        this.audioBuffer.loop = true;


    }

    setNewAudio(droppedFile) {


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
    /**
     * actual audio stuff
     */
    playAudio() {

        if (!this.audioBuffer) return;
        console.log("play");

        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        } else {
            this.audioBufferSource = this.audioContext.createBufferSource();
            this.audioBufferSource.buffer = this.audioBuffer;


            this.audioBufferSource.disconnect();

            //disconnect
            this.audioBufferSource.disconnect();
            //build node tree
            this.audioBufferSource.connect(this.audioVolumeGainNode);
            this.audioVolumeGainNode.connect(this.crossFaderGainNode);
            this.crossFaderGainNode.connect(this.audioContext.destination);

            this.audioBufferSource.start();
        }
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

    }
    // returns the frequency of the current playing song.
    //make sure to call it every frame !
    // each array index has a value between 0 and 255.
    getAudioFrequencyData() {
        return this.frequencyDataArray;
    }

}
export default AudioPlayer;