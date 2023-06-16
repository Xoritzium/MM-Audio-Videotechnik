

class AudioPlayer {

    // url will be the file dropped in later
    constructor(url) {

        //setup web Audio API
        this.audioContext = new AudioContext();
        this.audioVolumeGainNode = this.audioContext.createGain();
        this.crossFaderGainNode = this.audioContext.createGain();
        this.audioVolume = 10;
        
        this.analyserNode = this.audioContext.createAnalyser();
        this.analyserNode.fftSize =2048;
        this.audioFrequencyDataArrayLength = this.analyserNode.frequencyBinCount;
        this.frequencyDataArray = new Uint8Array(this.audioFrequencyDataArrayLength);
        this.analyserNode.getByteFrequencyData(this.frequencyDataArray);

        this.timeStemp = 0;

        if (!window.AudioContext) {
            alert("Web audio API not supported!");
        }
        // static read of a Sample audio from given Filepath
        /*
                this.request = new XMLHttpRequest();
                this.request.open('GeT', url, true);
              this.request.responseType = 'arraybuffer';
                this.request.onload = () => {
        
                    this.recieveAudio();
                }
        
                this.request.send();
        */
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
        // this.playAudio();
    }

    setNewAudio(droppedFile) {

        // this.pauseAudio();
        const audioFile = droppedFile;
        const reader = new FileReader();
        reader.readAsArrayBuffer(audioFile);
        // reader.responseType = 'arraybuffer';

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
        if(!this.audioBuffer) return;
        console.log("play");
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        } else {
            this.audioBufferSource = this.audioContext.createBufferSource();
            this.audioBufferSource.buffer = this.audioBuffer;
            
            this.audioBufferSource.disconnect();
            //disconnect
            //build node tree
            this.audioBufferSource.connect(this.audioVolumeGainNode);
            this.audioVolumeGainNode.connect(this.crossFaderGainNode);
            this.crossFaderGainNode.connect(this.audioContext.destination);

            this.audioBufferSource.start(0);
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
    getAudioFrequencyData(){
        return this.frequencyDataArray;
    }




}
export default AudioPlayer;