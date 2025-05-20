//document.addEventListener("DOMContentLoaded", function() {
//    // Select an element with the ID "myHeading"
//    const heading = document.getElementById("text_box_1");
//    // Change the text content of the heading
//    heading.textContent = "Hello, World!";
//});

function query() {
    //gets the current expected state from API

    // API at 172.16.1.91:3000/api.php
    // Fetch the current state from the API
    
    // update album cover
    fetch("http://localhost:3010/get_album_cover_url")
    .then(response => response.json())
    .then(data => {
        // Update the src attribute of the image with ID "album_cover"
        document.getElementById("album_cover_img").src = data.album_cover_url;
    })

}

setInterval(query, 1000);