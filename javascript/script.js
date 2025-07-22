

let songs;
let currFolder;

function formatSecondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.ceil(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}


let currentSong = new Audio();
//  fetching the song

async function getsongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text()
    console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    console.log(as);

    songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }

    //  Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> <img src="images/music-note-01-Stroke-Rounded.png" alt="">
                         
                                 <div class="info">
 
                                     <div>${song.replaceAll("%20", " ")}</div>
                                     <div>Song Artist</div>
                                 </div>
                                 <div class="playnow">
                                 <span>Play Now</span>
                                 <img class="playstroke" src="images/play-circle-Stroke-Rounded.png" alt="">
                             </div> </li>`

    }
    //  attach an eventlistener to each song
    let mylink = document.querySelector(".songList").getElementsByTagName("li")
    Array.from(mylink).forEach((e) => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)

        })

    })
return songs


}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {

        currentSong.play()
        play.src = "images/pause.png"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/song/`)
    let response = await a.text()
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")


    let array = Array.from(anchors)

    for (let index = 0; index < array.length; index++) {
        const e = array[index];


        if (e.href.includes("/song")) {
            let folder = e.href.split('/').slice(-2)[0];

            //  get metadata of the folder

            let a = await fetch(`http://127.0.0.1:3000/song/${folder}/info.json`)
            let response = await a.json()
            console.log(response);
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                xmlns="https://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141834" fill="#000" stroke-width="1.5"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img src="/song/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.Discription}</p>
                    </div>`



        }
    }

    // Load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getsongs(`song/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])

        })
    });

}

async function main() {

    // Get the list of all songs
    await getsongs("song/parmish-verma")
    playMusic(songs[0], true)

    // Display all albums
    displayAlbums()


    //  attach an event listener to play,previous and next
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "images/pause.png"
        }
        else {
            currentSong.pause()
            play.src = "images/play-circle-Stroke-Rounded.png"
        }

    })


    //  Listen for timeupdate update

    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${formatSecondsToMinutes(currentSong.currentTime)}/${formatSecondsToMinutes(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"

    })

    //  add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    //  add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    })

    //  add an event listener for close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-150%";
    })

    // add an event listener to previous
    previous.addEventListener("click", () => {
        console.log("previous clicked");
        console.log(currentSong);
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(songs, index);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }


    })


    // add an event listener to next
    next.addEventListener("click", () => {
        console.log("next clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(songs, index);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }

    })

    //  add an event to volume
    document.querySelector(".range").addEventListener("change", (e) => {
        console.log("Setting value to :" + e.target.value);
        currentSong.volume = parseInt(e.target.value) / 100
        if(currentSong.volume>0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.png", "volume-up.png")

        }

    })

    //  add an event listener to mute the volume

    document.querySelector(".volume>img").addEventListener("click", (e) => {
        
        if (e.target.src.includes("volume-up.png")) {
            e.target.src = e.target.src.replace("volume-up.png" ,"mute.png")
            currentSong.volume = 0
            document.querySelector(".range").value = 0
            document.querySelector()
        }
        else{
            e.target.src = e.target.src.replace("mute.png", "volume-up.png")
            currentSong.volume = 1
            document.querySelector(".range").value = 100

        }


    })








}

main()

