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


const body = document.querySelector('body');
let recordings = []
body.onkeydown =  async (e) => {
  if(!nowrecording && e.code =='KeyR'){
    console.log('starting recording')
    const recorder = await recordAudio();
    nowrecording = true;
    recorder.start();
    console.log('recording now')
    await sleep(7000)
    console.log('stopping recording..')
    const audio = await recorder.stop();
    recordings.push(audio)
    audio.play();
    console.log('now playing...')
    nowrecording = false;
  }
}

  
