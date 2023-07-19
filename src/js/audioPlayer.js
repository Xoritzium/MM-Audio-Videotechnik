
class AudioPlayer {


    // url will be the file dropped in later
    constructor() {
        
        console.log("setup audio player");
        //setup web Audio API
        try {
            this.audioContext = new AudioContext();
        } catch (error) {
            console.log(error);
        }

       // console.log("audiocontext: " + audioContext);
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
    

    setBuffer(decodedBuffer) {
       
        sourceNode.buffer = decodedAudioBuffer;
        sourceNode.connect(audioContext.destination);
        sourceNode.start();

        
        //this.audioBuffer = decodedBuffer;
        //this.isReady = true;
        //this.audioBuffer.loop = true;


    }

    setNewAudio(droppedFile) {

        
        console.log("set new Buffer");
        const audioFile = droppedFile;
        const reader = new FileReader();
        reader.readAsArrayBuffer(audioFile);
        

        reader.onload = function(event) {
            // Handle successful file reading
            const fileContent = event.target.result;
            
            console.log("audioContext: " + audioContext);
            
            console.log('File content:', fileContent);
          };

        /**
        reader.onloadend = () => {
            const audioData = reader.result;
            console.log("audio context" + audioContext);
            if (this.audioContext == 'undefined') {
                    console.log("audio context missing");
                }
            this.audioContext.decodeAudioData(audioData).then(decodedAudioBuffer => {
                
                const sourceNode = audioContext.createBufferSource();
                sourceNode.buffer = decodedAudioBuffer;
                sourceNode.connect(audioContext.destination);
                sourceNode.start();
                
                //this.setBuffer(decodedAudioBuffer);
            });
        };
        */

        /**
        reader.onloadend = () => {
            this.audioBuffer = reader.result;
            this.audioContext.decodeAudioData(this.audioBuffer).then(
                this.setBuffer.bind(this))
        }
        */

        return audioFile.name;
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
            this.audioBufferSource = this.audioContext.createBufferSource();
            this.audioBufferSource.buffer = this.audioBuffer;


            this.audioBufferSource.disconnect();

            //disconnect
            this.audioBufferSource.disconnect();
            //build node tree
            this.audioBufferSource.connect(this.audioContext.destination);
            //this.audioBufferSource.connect(this.audioVolumeGainNode);
            //this.audioVolumeGainNode.connect(this.crossFaderGainNode);
            //this.crossFaderGainNode.connect(this.audioContext.destination);

            this.audioBufferSource.start();
        }

        console.log(this.audioContext.state);

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