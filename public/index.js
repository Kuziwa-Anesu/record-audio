const recordingsHolder = document.querySelector('#recordings-holder')
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
    startRecording()
       
  }
  if(nowrecording && e.code =='KeyT'){
    stopRecording(recHolder[0])
  } 

}

const startRecBtn = document.querySelector('#startRecBtn')
const stopRecBtn = document.querySelector('#stopRecBtn')
startRecBtn.addEventListener('click',()=>{
  if(!nowrecording ){
    startRecording()
       
  }
  
})
stopRecBtn.addEventListener('click',()=>{
 
  if(nowrecording ){
    stopRecording(recHolder[0])
  } 
})
async function startRecording(){
  statusdiv.innerHTML= 'starting recording'
    const recorder = await recordAudio();
    recHolder[0] = recorder
    nowrecording = true;
    recorder.start();
    statusdiv.innerHTML= 'recording now 🔴 press T to stop recording'
}

async function stopRecording(recorder){
  statusdiv.innerHTML= 'stopping recording..'
  const audio = await recorder.stop();
  recordings.push(audio)
  audio.play();
  statusdiv.innerHTML= 'now playing...'
  nowrecording = false;
  sleep(300)
  createHTMLelementforThisRecording()
}

function createHTMLelementforThisRecording(){  
  let audioElement = document.createElement('button')
  let indexOfThisRec = parseInt(recordings.length)-1
  audioElement.onclick=() =>{recordings[indexOfThisRec].play()}
  audioElement.innerText = `play recording ${indexOfThisRec+1}`
  let delete_btn = document.createElement('button')
  delete_btn.onclick = () =>{recordings.splice(indexOfThisRec,1); refreshRecordings()}
  delete_btn.innerText = "Delete rec "
  recordingsHolder.appendChild(audioElement)
  recordingsHolder.appendChild(delete_btn)
  let convert_to_str_btn = document.createElement('button');
  recordingsHolder.appendChild(convert_to_str_btn)
  convert_to_str_btn.onclick = () => {alert("your str is : \n" + makeStrOfAudio(recordings[indexOfThisRec])) }
  recordingsHolder.appendChild(document.createElement('br'))
}



//  every time user finishes a recording you need to make a new button or like an html element that the user can use to play his recording again 

function refreshRecordings(){
  recordingsHolder.innerHTML =""
  recordings.forEach((audiorec,index)=>{
    let audioElement = document.createElement('button')
    let indexOfThisRec = index
    audioElement.onclick=() =>{recordings[indexOfThisRec].play()}
    audioElement.innerText = `play recording ${indexOfThisRec+1}`
  let delete_btn = document.createElement('button')
  delete_btn.onclick = () =>{recordings.splice(indexOfThisRec,1); refreshRecordings()}
  delete_btn.innerText = "Delete rec "
  recordingsHolder.appendChild(audioElement)
  recordingsHolder.appendChild(delete_btn)
  recordingsHolder.appendChild(document.createElement('br'))
  })
}



function makeStrOfAudio(recording){
  let b ="";
  recording.audioBlob.arrayBuffer()
  .then(a =>{
    console.log(a); 
    b = a
    b = ab2str(b)
    alert(b)
    console.log(b)
  })
  
}

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}


function makeAudioOfString(audiostr){
  let d = str2ab(audiostr)
  let audio2 = document.createElement("audio");
  const blob = new Blob([d], { type: "audio/wav" });
  audio2.src = window.URL.createObjectURL(blob);
  audio2.play()
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length); // 2 bytes for each char
  var bufView = new Uint8Array(buf);
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}