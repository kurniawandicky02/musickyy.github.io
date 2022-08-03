/*
For some important blocks of code, search "NOTE"

Functions:
onLoad()
randomBgVideo()
randomThumbnail()
changeSong()
timeSliderInitiator()
timeSlider()
togglePlayPause()
previousSong()
nextSong()
toggleShuffleRepeat()
songsList()
toggleSongsList()
EVENT_LISTENER
*/

// it will call the function 'songsList()' when window resizes
window.onresize = songsList;

var timeSliderRestarter, isPlaying = false, isPlayOnesOn_forPlayPauseToggle = false, isShuffleOn = true, isPlayOnesOn = false, isRepeatOneOn = false, isPlayAllOn = false, previousSongBtnNos = [];
const TOTAL_SONGS = 14;

// after loading...
function onLoad() {
    
    // ...if the width of window is greater than 22cm,
    // then display 'songs-list' in RHS
    if(window.innerWidth > 831.5) {
        document.getElementById("songs-list").style.display = "block";
    }

    // else if the width of window is less than or equal to 22cm,
    // then hide 'songs-list'
    else {
        document.getElementById("songs-list").style.display = "none";
    }

    // to display a random thumbnail
    randomThumbnail();
}

// function to play a random background video when song changes
function randomBgVideo() {

    // returns a random integer between 1 to 5 (both inclusive)
    let randomBgVideoNo = Math.floor(Math.random() * 5) + 1;

    document.getElementById("bg-video").src = "assets/bg-videos/" + randomBgVideoNo + ".mp4";
}

// function to display a random thumbnail when song changes
function randomThumbnail() {

    // returns a random integer between 1 to 6 (both inclusive)
    let randomThumbnailImgNo = Math.floor(Math.random() * 7) + 1;

    document.getElementById("thumbnail").src = "assets/thumbnails/" + randomThumbnailImgNo + ".png";
}

// NOTE:
// if you want to set thumbnail according to song,
// then remove comment from 'thumbnailImage'
function changeSong(/* thumbnailImage, */ songName, artist, album, btnNo) {

    // to play a random background video
    randomBgVideo();

    // to set random thumbnail
    randomThumbnail();

    // if a song is playing/paused, then clear the interval to stop time-slider
    clearInterval(timeSliderRestarter);

    // add css-animation to thumbnail
    document.getElementById("thumbnail").style.animation = "";

    // add current chosen song in the array,
    // so that user can listen previous songs
    previousSongBtnNos.push(btnNo);

    // if user chosen current playing song once again,
    // then don't add it into the array i.e. remove it from the array
    if(previousSongBtnNos.length > 1 && previousSongBtnNos[previousSongBtnNos.length - 2] == previousSongBtnNos[previousSongBtnNos.length - 1]) {
        previousSongBtnNos.pop();
    }

    // theSong = 'audio' tag
    let theSong = document.getElementById("song");

    // chnage song
    theSong.src = "songs/" + songName;

    // NOTE:
    // if you want to set thumbnail according to song,
    // then remove comment from below two lines
    // change thumbnail
    // document.getElementById("thumbnail").src = "assets/thumbnails/" + thumbnailImage + ".png";

    // change song's name
    document.getElementById("song-name").innerText = document.getElementById("song-" + btnNo).innerText;
    
    // change song's makers
    document.getElementById("song-makers").innerText = artist + " | " + album;

    // assign 00:00 to 'song-current-time'
    document.getElementById("song-current-time").innerText = "00:00";

    // change the colour of chosen song's button
    // i.e. hightlight the chosen song's button
    let changeColor = document.getElementsByClassName("button-for-song");
    for(let i = 0; i < TOTAL_SONGS; i++) {
        changeColor[i].classList.remove("active-color");
    }
    changeColor[btnNo].classList.add("active-color");

    // start the song and time-slider
    theSong.onloadedmetadata = function() {
        
        // start playing the song
        theSong.play();

        // toggle play-pause icon
        document.getElementById("play-pause-btn").innerHTML = '<i class="bi bi-pause-fill"></i>';
        
        // change the state of 'isPlaying' to 'true'
        isPlaying = true;

        // if previous playing song was paused and then user changed the song,
        // then start rotating (i.e. animating) thumbnail-image of current song
        // and also play background video
        if(document.getElementById("thumbnail").classList[1] == "anm-paused") {
            document.getElementById("thumbnail").classList.toggle("anm-paused");
            document.getElementById("bg-video").play();
        }

        // assign duration of current song to the variable
        let songDuration = Math.floor(theSong.duration);

        // calculate song duration in minutes and seconds
        let songDurationInMinutes = Math.floor(songDuration / 60);
        let songDurationInSeconds = Math.floor(songDuration - songDurationInMinutes * 60);
    
        // add a zero to the single digit time values
        if(songDurationInMinutes < 10) {
            songDurationInMinutes = '0' + songDurationInMinutes;
        }
        if(songDurationInSeconds < 10) {
            songDurationInSeconds = '0' + songDurationInSeconds;
        }
    
        // display song duration
        document.getElementById("song-duration").innerText = songDurationInMinutes + ':' + songDurationInSeconds;

        // set 0 as current values for time-slider
        document.getElementById("time-slider").value = 0;

        // set 'songDuration' (in seconds) as max. value for time-slider
        document.getElementById("time-slider").max = songDuration;

        // initialize 'time-slider' and 'currentTime'
        timeSliderInitiator();
    }
}

function timeSliderInitiator() {

    // calling the function 'timeSlider' after every 1 second
    // to change 'song-current-time'
    timeSliderRestarter = setInterval(timeSlider, 1000);
}

function timeSlider() {

    // theSong = 'audio' tag
    let theSong = document.getElementById("song");

    // assign currentTime of current song to the variable
    let songCurrentTime = Math.floor(theSong.currentTime);

    // assign duration of current song to the variable
    // let songDuration = Math.floor(theSong.duration);

    let timeSlider = document.getElementById("time-slider");

    // calculate the time left in minutes and seconds
    let currentMinutes = Math.floor(songCurrentTime / 60);
    let currentSeconds = Math.floor(songCurrentTime - currentMinutes * 60);
 
    // add a zero to the single digit time values
    if(currentMinutes < 10) {
        currentMinutes = '0' + currentMinutes;
    }
    if(currentSeconds < 10) {
        currentSeconds = '0' + currentSeconds;
    }
 
    // display currentTime
    document.getElementById("song-current-time").innerText = currentMinutes + ':' + currentSeconds;

    // slide 'time-slider' to 'currentTime'
    timeSlider.value = songCurrentTime;

    // let songCurrentTimeInPercentage = Math.floor((songCurrentTime * 100) / songDuration);

    // timeSlider.style.backgroundImage = '-webkit-linear-gradient(to right, #000 ' + songCurrentTimeInPercentage + '%, #fff ' + (100 - songCurrentTimeInPercentage) + '%)';

    // if song ended, stop calling this function
    if(songCurrentTime == Math.floor(theSong.duration)) {

        clearInterval(timeSliderRestarter);

        // remove css-animation of thumbnail
        document.getElementById("thumbnail").style.animation = "none";

        // get button number (i.e. btnNo) of previously played song
        let currentSongBtnNo = previousSongBtnNos[previousSongBtnNos.length - 1];

        // reference: 'nextSong()' function
        if(isShuffleOn) {

            do {
                // returns a random integer from 0 to TOTAL_SONGS - 1 (both inclusive)
                var randomSongBtnNo =  Math.floor(Math.random() * TOTAL_SONGS);
            }
            while(randomSongBtnNo == currentSongBtnNo);

            document.getElementsByClassName("button-for-song")[randomSongBtnNo].click();
        }

        // reference: 'nextSong()' function
        else if (isRepeatOneOn) {

            // simulate click on the button of previously played song
            document.getElementsByClassName("button-for-song")[currentSongBtnNo].click();
        }

        // reference: 'nextSong()' function
        else if(isPlayAllOn) {

            // play next song in the sequence
            if(currentSongBtnNo < TOTAL_SONGS - 1) {
                document.getElementsByClassName("button-for-song")[currentSongBtnNo + 1].click();
            }

            // and if last song was playing, then play the first song
            else {
                document.getElementsByClassName("button-for-song")[0].click();
            }
        }
        
        else {

            // set 'song-current-time' to 00:00
            document.getElementById("song-current-time").innerText = "00:00";

            // reset current value of 'time-slider'
            document.getElementById("time-slider").value = 0;

            togglePlayPause();
            isPlayOnesOn_forPlayPauseToggle = true;
        }
    }
}

function togglePlayPause() {

    // theSong = 'audio' tag
    let theSong = document.getElementById("song");

    // to toggle play-pause icon
    let playPause = document.getElementById("play-pause-btn");

    // if user clicked the PLAY button before choosing any song,
    // then play a random song
    if(document.getElementById("song-name").innerText == "--") {

        // returns a random integer between 0 and TOTAL_SONGS - 1 (both inclusive)
        let randomSongBtnNo =  Math.floor(Math.random() * TOTAL_SONGS);

        // play a random song via simulating the button click
        document.getElementsByClassName("button-for-song")[randomSongBtnNo].click();

        isPlaying = true;
    }

    else if(isPlayOnesOn_forPlayPauseToggle) {

        // play background video
        document.getElementById("bg-video").play();

        isPlayOnesOn_forPlayPauseToggle = false;

        playPause.style.transform = "scale(0.5)";

        setTimeout(() => {
            // set PAUSE icon when song is playing
            playPause.innerHTML = '<i class="bi bi-pause-fill"></i>';

            playPause.style.transform = "scale(1)";
        }, 200);

        // reference: 'nextSong()' function
        // simulate click on the button of previously played song
        document.getElementsByClassName("button-for-song")[previousSongBtnNos[previousSongBtnNos.length - 1]].click();
    }

    else {

        // if song is playing, then pause it
        if(isPlaying) {
            
            // pause background video
            document.getElementById("bg-video").pause();

            theSong.pause();
            isPlaying = false;

            playPause.style.transform = "scale(0.5)";

            setTimeout(() => {
                // set PLAY icon when song is paused
                playPause.innerHTML = '<i class="bi bi-play-fill"></i>';
                
                playPause.style.transform = "scale(1)";
            }, 200);
        }

        // else play it
        else {

            // play background video
            document.getElementById("bg-video").play();

            theSong.play();
            isPlaying = true;

            playPause.style.transform = "scale(0.5)";

            setTimeout(() => {
                // set PAUSE icon when song is playing
                playPause.innerHTML = '<i class="bi bi-pause-fill"></i>';

                playPause.style.transform = "scale(1)";
            }, 200);
        }

        // toggle the rotating animation of thumbnail-image
        document.getElementById("thumbnail").classList.toggle("anm-paused");
    }
}

function previousSong() {

    // get previously played song
    let previousSongBtnNo  = previousSongBtnNos.shift();

    // remove previously played from the array
    previousSongBtnNos.shift();

    // simulate click on the button of previously played song
    document.getElementsByClassName("button-for-song")[previousSongBtnNo].click();

    // animate 'prev-song-btn' on click
    let prevSongBtn = document.getElementById("prev-song-btn");
    prevSongBtn.style.transform = "scale(0.5)";
    setTimeout(() => {
        prevSongBtn.style.transform = "scale(1)";
    }, 200);
}

function nextSong() {

    // get button number (i.e. btnNo) of previously played song
    let currentSongBtnNo = previousSongBtnNos[previousSongBtnNos.length - 1];

    // if shuffle is on, then play any random song
    if(isShuffleOn) {
        
        // returns a random integer from 0 to TOTAL_SONGS - 1 (both inclusive)
        let randomSongBtnNo =  Math.floor(Math.random() * TOTAL_SONGS);

        // if returned random integer is equal to 'btnNo' of current song,
        // then recall the current function
        if(randomSongBtnNo == currentSongBtnNo) {
            nextSong();
        }

        // else play that random song via simulating the button click for that song
        else {
            document.getElementsByClassName("button-for-song")[randomSongBtnNo].click();
        }
    }

    else {

        // else play next song in the sequence
        if(currentSongBtnNo < TOTAL_SONGS - 1) {
            document.getElementsByClassName("button-for-song")[currentSongBtnNo + 1].click();
        }

        // and if last song was playing, then play the first song
        else {
            document.getElementsByClassName("button-for-song")[0].click();
        }
    }

    // animate 'next-song-btn' on click
    let nextSongBtn = document.getElementById("next-song-btn");
    nextSongBtn.style.transform = "scale(0.5)";
    setTimeout(() => {
        nextSongBtn.style.transform = "scale(1)";
    }, 200);
}

function toggleShuffleRepeat() {
    
    // animate 'shuffle-repeat-toggler' on click
    let shuffleRepeatToggler = document.getElementById("shuffle-repeat-toggler");

    shuffleRepeatToggler.style.transform = "scale(0.5)";

    // toggling 'shuffle-repeat-toggler' after 200ms on click,
    // so that background color of this button will change when
    // scale is becoming 1 from 0.5
    setTimeout(() => {

        if(isShuffleOn) {
            isShuffleOn = false;
            isPlayOnesOn = true;

            shuffleRepeatToggler.innerHTML = '<i class="bi bi-arrow-right"></i>';
        }

        else if(isPlayOnesOn) {
            isPlayOnesOn = false;
            isRepeatOneOn = true;

            shuffleRepeatToggler.innerHTML = '<i class="bi bi-arrow-clockwise"></i>';
        }

        else if (isRepeatOneOn) {
            isRepeatOneOn = false;
            isPlayAllOn = true;

            shuffleRepeatToggler.innerHTML = '<i class="bi bi-arrow-repeat"></i>';
        }
        
        else {
            isPlayAllOn = false;
            isShuffleOn = true;

            shuffleRepeatToggler.innerHTML = '<i class="bi bi-shuffle"></i>';
        }

        shuffleRepeatToggler.style.transform = "scale(1)";
    }, 200);

    /* let shuffleOrRepeat = document.getElementById("shuffle-repeat-toggler");

    shuffleOrRepeat.style.transformOrigin = "right";
    shuffleOrRepeat.style.transform = "scale(0)";

    setTimeout(() => {
        shuffleOrRepeat.innerHTML = '<i class="bi bi-skip-forward-fill"></i>';

        shuffleOrRepeat.style.transformOrigin = "left";
        shuffleOrRepeat.style.transform = "scale(1)";
    }, 200);

    // if shuffle is off, then on it
    if(!isShuffleOn) {
        isShuffleOn = true;
    }
    // else off it
    else {
        isShuffleOn = false;
    } */
}

// when window size changes, then this function will be called
function songsList() {

    // if window size is greater than 22cm
    // and display property of 'song-list' is set to none,
    // then set it to block
    if(window.innerWidth > 831.5 && (document.getElementById("songs-list").style.display == "none")) {
        document.getElementById("songs-list").style.display = "block";
    }

    // if window size is less than or equal to 22cm
    // and display property of 'song-list' is set to block,
    // then set it to none
    else if(window.innerWidth <= 831.5 && document.getElementById("songs-list").style.display == "block") {
        document.getElementById("songs-list").style.display = "none";
    }

    // if display property of 'song-list' is set to block
    // and user is resizing the window,
    // then stop highlighting the 'songs-list-button'
    document.getElementById("songs-list-btn").style.backgroundColor = "transparent";
}

// toggle 'songs-list' if window size is less than or equal to 22cm (i.e. 831.5px)
function toggleSongsList() {

    let toggleSongList = document.getElementById("songs-list");
    let songsListButton = document.getElementById("songs-list-btn");

    // animate 'shuffle-toggler' on click
    songsListButton.style.transform = "scale(0.5)";

    // if display property of 'song-list' is set to none,
    // then set it to block with animation
    if(toggleSongList.style.display == "none") {

        toggleSongList.style.transform = "scale(0)"
        toggleSongList.style.display = "block";

        setTimeout(() => {
            toggleSongList.style.transform = "scale(1)";
        }, 1);

        // changing background color of 'songs-list-button' after 200ms on click,
        // so that background color of this button will change when
        // scale is becoming 1 from 0.5
        setTimeout(() => {
            // highlight the 'songs-list-button'
            songsListButton.style.backgroundColor = "#ddd";

            songsListButton.style.transform = "scale(1)";
        }, 200);
    }
    
    // else set it to none with animation
    else {

        toggleSongList.style.transform = "scale(0)"

        setTimeout(() => {
            toggleSongList.style.display = "none";
            toggleSongList.style.transform = "scale(1)";
        }, 251);
        
        // changing background color of 'songs-list-button' after 200ms on click,
        // so that background color of this button will change when
        // scale is becoming 1 from 0.5
        setTimeout(() => {
            // stop highlighting the 'songs-list-button'
            songsListButton.style.backgroundColor = "transparent";

            songsListButton.style.transform = "scale(1)";
        }, 200);
    }
}

// toggle 'songs-list' if window size is less than or equal to 22cm (i.e. 831.5px)
window.addEventListener('click', function(e) {
    if(!document.getElementById("songs-list-btn").contains(e.target) && !document.getElementById("songs-list").contains(e.target) && window.innerWidth <= 831.5 && document.getElementById("songs-list").style.display == "block") {
        toggleSongsList();
    }
})
