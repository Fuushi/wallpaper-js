//document.addEventListener("DOMContentLoaded", function() {
//    // Select an element with the ID "myHeading"
//    const heading = document.getElementById("text_box_1");
//    // Change the text content of the heading
//    heading.textContent = "Hello, World!";
//});
import epoch_f_time from "./functions.js"

let playing = true;

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
            slideDownPageWrapper()
        } else {
            
            //load elements, then slide page up
            
            document.getElementById("album_cover_img").src = data.album_cover_url;

            document.getElementById("title").textContent = data.title

            document.getElementById("author").textContent = data.author

            document.getElementById("progress_time").textContent = epoch_f_time(data.progress, false, true, true, false, false);

            document.getElementById("duration_time").textContent = epoch_f_time(data.duration, false, true, true, false, false);

            slideUpPageWrapper();
        }

    })

}

setInterval(query, 1000);


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
