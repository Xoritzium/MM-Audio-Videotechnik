
class AudioPlayer {

    // url will be the file dropped in later
    constructor(url) {

        //setup web Audio API
        this.audioContext = new window.AudioContext();
        this.audioVolumeGainNode = this.audioContext.createGain();
        this.crossFaderGainNode = this.audioContext.createGain();
        this.audioVolume = 10;


        if (!window.AudioContext) {
            alert("Web audio API not supported!");
        }


        this.request = new XMLHttpRequest();
        this.request.open('GeT', url, true);
        this.request.responseType = 'arraybuffer';
        this.request.onload = () => {

            this.recieveAudio();
        }

        this.request.send();

    }


    recieveAudio() {
        this.audioBuffer = this.request.response;
        this.audioContext.decodeAudioData(this.audioBuffer).then(
            this.setBuffer.bind(this)
        )
    }

    setBuffer(decodedBuffer) {
        this.audioBuffer = decodedBuffer;
        this.isReady = true;
        this.audioBuffer.loop = true;
    }


    /*
     constructor(audioData){
         console.log("audioData recieved AudioPlayer: " + audioData);
          //setup web Audio API
          this.audioContext = new window.AudioContext();
          this.audioVolumeGainNode = this.audioContext.createGain();
          this.crossFaderGainNode = this.audioContext.createGain();
         // this.audioVolume = 10;
         this.audioBufferSource = this.audioContext.createBufferSource();
 
             
             this.audioContext.decodeAudioData(audioData,function(buffer){
                 audioBuffer.buffer = buffer;
             });
         
 
 
 
     }
 
 */

    /**
     * actual audio stuff
     */
    playAudio() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        } else {
            this.audioBufferSource = this.audioContext.createBufferSource();
            this.audioBufferSource.buffer = this.audioBuffer;

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


}
export default AudioPlayer;