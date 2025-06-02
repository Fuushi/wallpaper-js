//includes
import { epoch_f_time, clientSideDateTimeInterpolater } from "./includes/functions.js"
import { hsvToRgb, rgbToHsv } from "./includes/hsv-utils.js";

// // Global variables
let playing = true;
let down = false;
let gb_data = null;
let device_connected = false; //depreciate?

// Load configuration from config.json
let config = {};
fetch('./config.json')
  .then(response => response.json())
  .then(json => { config = json; })
  .catch(err => { console.error('Failed to load config.json', err); });

//query function for spotify api
function query() {

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

//function for updating (all) clocks to current datetime
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

//function for progress bar 
function updateProgressBar() {
  if (gb_data === null) {return;}

  if (gb_data.is_playing) {
    const currentTime = Date.now(); // Get current time in Unix milliseconds
    const progress = ((currentTime - gb_data.doi)+gb_data.progress) / gb_data.duration * 100; // Calculate progress percentage
    document.getElementById("progress_bar").style.width = `${progress}%`; // Update progress bar width
  }
}

//animation for sliding page down
function slideDownPageWrapper() {
  const wrapper = document.getElementById("listener_page");
  const idle_wrapper = document.getElementById("idle_page");
  wrapper.style.transform = "translateY(100vh)"; // slides it down one full viewport height
  idle_wrapper.style.transform = "translateY(100vh)";
}

//... animation for sliding page up
function slideUpPageWrapper() {
  const wrapper = document.getElementById("listener_page");
  const idle_wrapper = document.getElementById("idle_page");
  wrapper.style.transform = "translateY(0)";
  idle_wrapper.style.transform = "translateY(0)";
}

//scroll animation for title
// --- Disable scroll animation for #title if its width is less than 800px ---
function updateTitleAnimation() {
  const title = document.getElementById('title');
  if (!title) return;
  // Remove animation to measure natural width
  title.style.animation = '';
  // Use scrollWidth for actual text width
  const width = title.scrollWidth;
  if (width > 800) {
    title.style.animation = 'scroll-text 10s linear infinite';
  } else {
    title.style.animation = 'none';
  }
}
window.addEventListener('DOMContentLoaded', updateTitleAnimation);
window.addEventListener('resize', updateTitleAnimation);

//style controller (global)
function style_controller() {
  // here will by style customizations for 'modes'

  //get element
  const noise_tex = document.getElementsByClassName("noise_tex")[0];
  const clock_tex = document.getElementsByClassName("big_clock")[0];


  // query api
  fetch("http://localhost:3015/device_status")
  .then(response => response.json())
  .then(data => {
    //
    console.log(data.device_status)
    //data.device_status
    if (data.device_status) {
      //hide static
      noise_tex.style.visibility='hidden';
      clock_tex.style.color = 'white'; // reset clock color to white
    } else {
      //show static
      noise_tex.style.visibility='visible';
      
      
      //randomize color
      const randomColor = `rgb(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)})`;

      //convert random color to hsv
      const rgbValues = randomColor.match(/\d+/g).map(Number); // Extract RGB values
      const randomColorHsv = rgbToHsv(rgbValues[0], rgbValues[1], rgbValues[2]); // Convert to HSV

      //offset by 90 degrees
      const hueOffset = 180; // Offset in degrees
      const newHue = (randomColorHsv.h + hueOffset) % 360; // Ensure hue wraps around

      //convert new value to rgb
      const newRgb = hsvToRgb(newHue, randomColorHsv.s, randomColorHsv.v); // Convert back to RGB

      //convert to style format
      const randomColor2 = `rgb(${newRgb.r}, ${newRgb.g}, ${newRgb.b})`; // Create new RGB string

      //assign to elements
      noise_tex.style.backgroundColor = randomColor;
      clock_tex.style.color = randomColor2; // Assign the new color to the clock text
    }
  })
}



// define update conditions

// Wait for config to load before starting intervals and observers
function initializeApp() {
  // Also update when title text changes
  const titleObserver = new MutationObserver(updateTitleAnimation);
  titleObserver.observe(document.getElementById('title'), { childList: true, characterData: true, subtree: true });

  setInterval(query, 500); //query every half second

  setInterval(updateProgressBar, 33.33); // Update progress bar every 33.33 milliseconds (30 FPS)

  setInterval(updateClocks, 250); //update every quarter second

  console.log(config);
  if (config.low_power_device_tracking) {
    setInterval(style_controller, 1000); //every 1 seconds, check for style changes
  } else {
    const noise_tex = document.getElementsByClassName("noise_tex");
    for (let i = 0; i < noise_tex.length; i++) {
      noise_tex[i].style.visibility = 'hidden';
    }
  }
}

// Wait for config to be loaded before initializing
fetch('./config.json')
  .then(response => response.json())
  .then(json => {
    config = json;
    initializeApp();
  })
  .catch(err => {
    console.error('Failed to load config.json', err);
    // Optionally, still initialize with default config
    initializeApp();
  });
