import React, { useState, useEffect } from 'react';
import './App.css';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [video2, setVideo2] = useState();
  const [gif, setGif] = useState();
  const [videoOut, setvideoOut] = useState();
  const [frames, setFrames] = useState([]);
  let loadedImages = [];
  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    load();
    let loadedImages = []
  }, [])
  function myFunction(item, index, arr) {
    if (index > 1){
    var new_file = ffmpeg.FS('readFile', './frames/'+item);
    
    loadedImages.push(URL.createObjectURL(new Blob([new_file.buffer], { type: 'image/jpg' })));
    }
  }
  const convertToGif = async () => {
    // Write the file to memory 
    ffmpeg.FS('mkdir','./frames');
    console.log(ffmpeg.FS('readdir', '/frames'));
    ffmpeg.FS('writeFile', 'in1.mp4', await fetchFile(video));
    ffmpeg.FS('writeFile', 'in2.mp4', await fetchFile(video2));
    // Run the FFMpeg command
    await ffmpeg.run( '-i', 'in1.mp4', '-i', 'in2.mp4', '-filter_complex', "[1:v]format=yuva444p,lut=c3=128,negate[video2withAlpha],[0:v][video2withAlpha]overlay[out]", '-map','[out]', '-c:v', 'libx264', '-crf', '18', '-c:a', 'copy', "out.mp4");
    //await ffmpeg.run('-i', 'test.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'out.gif');
  
    //-vf "select=gt(scene\,0.5)" -frames:v 5 -vsync vfr  out%02d.png
   // ffmpeg -i original.mkv -i encoded.mkv \
//-filter_complex "blend=all_mode=difference" \
//-c:v libx264 -crf 18 -c:a copy output.mkv
    //await ffmpeg.run("-i", "in1.mp4", "out.mp4");
    // Read the result
   // const data =  ffmpeg.FS('readFile', 'out.mp4');
  

await ffmpeg.run(
  
    '-i', 'out.mp4',
    
    '-vf', "select='gt(scene\,0.01)',scale='min(100\, iw):-1'",
    
    'frames/frame_%d.jpg'
);


   // await ffmpeg.run(   '-i', 'in1.mp4', '-vf' ,"select=gt(scene\,0.5)", '-vsync', 'vfr', 'out%02d.jpg');
    // Create a URL
    
   //const url = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
   // setvideoOut(url)
    console.log(ffmpeg.FS('readdir', './frames'));
    let lastFrame = 0;
    await ffmpeg.FS('readdir', './frames').forEach(myFunction);
    setFrames(loadedImages);
    /*for (let i = 1; i < ffmpeg.FS('readdir', './frames').length-1; i++) {
     
    var new_file = ffmpeg.FS('readFile', './frames/frame_'+i+'.jpg');
    console.log(new Blob([new_file.buffer], { type: 'image/jpg' }));
    }*/
  }

  return ready ? (
    
    <div className="App" class="flex">
      { video && <video
        controls
        width="250"
        src={URL.createObjectURL(video)}>

      </video>}

      { video2 && <video
        controls
        width="250"
        src={URL.createObjectURL(video2)}>

      </video>}


      <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />
      <input type="file" onChange={(e) => setVideo2(e.target.files?.item(0))} />
      <h3>Result</h3>

      <button onClick={convertToGif}>Convert</button>

      { gif && <img src={gif} width="250" />}
      { videoOut && <video
        controls
        width="250"
        src={videoOut}>

      </video>}
      <div class="flex w-screen" > 
      {frames.map((img, index) => (
        
        <img key={index} src={img} class="rounded-lg"></img>
      
      ))}
      </div>
    </div>
  )
    :
    (
      <p class="bg-green-800">Loading...</p>
    );
}

export default App;
