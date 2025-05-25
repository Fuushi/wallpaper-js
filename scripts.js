//document.addEventListener("DOMContentLoaded", function() {
//    // Select an element with the ID "myHeading"
//    const heading = document.getElementById("text_box_1");
//    // Change the text content of the heading
//    heading.textContent = "Hello, World!";
//});
import { epoch_f_time, clientSideDateTimeInterpolater } from "./functions.js"

let playing = true;
let down = false;
let gb_data = null;

function query() {
    //gets the current expected state from API

    // API at 172.16.1.91:3000/api.php
    // Fetch the current state from the API
    
    // update album cover
    fetch("http://localhost:3010/get_playback")
    .then(response => response.json())
    .then(data => {

        gb_data = data; // store the data globally for use in other functions

        //playing
        playing = data.is_playing;

        if (!playing) {
            //TODO check if page is already down
            if (!down) {
              down = true;
              slideDownPageWrapper()
            }
        } else {
            
            //load elements, then slide page up
            
            document.getElementById("album_cover_img").src = data.album_cover_url;

            document.getElementById("title").textContent = data.title

            document.getElementById("author").textContent = data.author

            document.getElementById("progress_time").textContent = epoch_f_time(data.progress, false, true, true, false, false);

            document.getElementById("duration_time").textContent = epoch_f_time(data.duration, false, true, true, false, false);

            //if playing, and page down, bring page up
            if (down) {
                slideUpPageWrapper();
                down=false;
            }

        }

    })

}

setInterval(query, 500); //query every half second

function updateClocks() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12

  const timeString = `${hours}:${minutes}${ampm}`;

  document.getElementById("sysClock").textContent=timeString;
  document.getElementById("smallClock").textContent=timeString;
};

setInterval(updateClocks, 250); //update every quarter second

function updateProgressBar() {
  if (gb_data === null) {return;}

  if (gb_data.is_playing) {
    const currentTime = Date.now(); // Get current time in Unix milliseconds
    const progress = ((currentTime - gb_data.doi)+gb_data.progress) / gb_data.duration * 100; // Calculate progress percentage
    document.getElementById("progress_bar").style.width = `${progress}%`; // Update progress bar width
  }
}

setInterval(updateProgressBar, 33.33); // Update progress bar every 33.33 milliseconds (30 FPS)


//animation tests below
function slideDownPageWrapper() {
  const wrapper = document.getElementById("listener_page");
  const idle_wrapper = document.getElementById("idle_page");
  wrapper.style.transform = "translateY(100vh)"; // slides it down one full viewport height
  idle_wrapper.style.transform = "translateY(100vh)";
}

function slideUpPageWrapper() {
  const wrapper = document.getElementById("listener_page");
  const idle_wrapper = document.getElementById("idle_page");
  wrapper.style.transform = "translateY(0)";
  idle_wrapper.style.transform = "translateY(0)";
}