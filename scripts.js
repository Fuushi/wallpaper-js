//document.addEventListener("DOMContentLoaded", function() {
//    // Select an element with the ID "myHeading"
//    const heading = document.getElementById("text_box_1");
//    // Change the text content of the heading
//    heading.textContent = "Hello, World!";
//});
import epoch_f_time from "./functions.js"

let playing = true;
let down = false;

function query() {
    //gets the current expected state from API

    // API at 172.16.1.91:3000/api.php
    // Fetch the current state from the API
    
    // update album cover
    fetch("http://localhost:3010/get_playback")
    .then(response => response.json())
    .then(data => {

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

setInterval(query, 1000); //query every second

function updateClocks() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12

  const timeString = `${hours}:${minutes}${ampm}`;
  console.log(timeString);

  document.getElementById("sysClock").textContent=timeString;
  document.getElementById("smallClock").textContent=timeString;
};

setInterval(updateClocks, 250); //update every quarter second


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

document.addEventListener("keydown", slideDownPageWrapper);
