const recordAudio = () =>
  new Promise(async resolve => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });

    const start = () => mediaRecorder.start();

    const stop = () =>
      new Promise(resolve => {
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          const play = () => audio.play();
          resolve({ audioBlob, audioUrl, play });
        });

        mediaRecorder.stop();
      });

    resolve({ start, stop });
  });

const sleep = time => new Promise(resolve => setTimeout(resolve, time));
let nowrecording = false

const statusdiv=  document.querySelector('.status')

const body = document.querySelector('body');
let recordings = []
let recHolder = []
body.onkeydown =  async (e) => {
  if(!nowrecording && e.code =='KeyR'){
    statusdiv.innerHTML= 'starting recording'
    const recorder = await recordAudio();
    recHolder[0] = recorder
    nowrecording = true;
    recorder.start();
    statusdiv.innerHTML= 'recording now press T to stop recording'
       
  }
  if(nowrecording && e.code =='KeyT'){
    stopRecording(recHolder[0])
  } 

}

async function stopRecording(recorder){
  statusdiv.innerHTML= 'stopping recording..'
  const audio = await recorder.stop();
  recordings.push(audio)
  audio.play();
  statusdiv.innerHTML= 'now playing...'
  nowrecording = false;
}
