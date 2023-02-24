const player = document.querySelector("#player")
const nowPlayingImage = document.querySelector("#nowPlaying")
const nextUp1 = document.querySelector("#nextUp1")
const nextUp2 = document.querySelector("#nextUp2")
const nextUp3 = document.querySelector("#nextUp3")
const nextUp4 = document.querySelector("#nextUp4")
const nextUp5 = document.querySelector("#nextUp5")
const backgroundImage = document.querySelector("#background")
const seriesDescription = document.querySelector("#description")
const seriesTitle = document.querySelector("#title")
const logo = document.querySelector("#logo")



function checkSearchResults(name){
  fetch("https://api.consumet.org/meta/tmdb/" + name.replace(/\s+/g, '-').toLowerCase())
  .then(response => response.json())
  .then(data => {
    console.log(name)
    console.log(data)
  } )
  .catch(error => console.error(error)
  );
}

var Anime = [
  ["Dragon Ball", "12609", "tv/watch-dragon-ball-39541"], 
  ["Naruto", "46260", "tv/watch-naruto-39456"],
  ["Spy X Family", "120089", "tv/watch-spy-x-family-79048"], 
  ["One Piece", "37854", "tv/watch-one-piece-39514"], 
  ["Dr Stone", "86031", "tv/watch-dr-stone-42231"], 
  ["kimetsu no yaiba", "85937", "tv/watch-demon-slayer-kimetsu-no-yaiba-42177"],
  ["Pokemon", "60572", "tv/watch-pokemon-39493"],
  ["One Punch Man", "63926", "tv/watch-onepunch-man-39463"]
  ]
var Disney = [
  ["Jessie", "38974", "tv/watch-jessie-37968"],
  ["Lab Rats", "38867", "tv/watch-lab-rats-36500"],
  ["Lab Rats", "38867", "tv/watch-lab-rats-36500"],
]

var Comedy = [
  ["Friends","1668","tv/watch-friends-39473"],
  ["Young Sheldon","71728","tv/watch-young-sheldon-39496"],
  ["Modern Family","1421","tv/watch-modern-family-39507"],
  ["Psych","1447","tv/watch-psych-39186"],
  ["How I Met Your Mother","1100","tv/watch-how-i-met-your-mother-39439"],
  ["New Girl","1420","tv/watch-new-girl-39364"],
]

var Cartoons = [
  ["Young Justice", "33217", "tv/watch-young-justice-39291"],
  ["Avatar The Last Airbender", "246", "tv/watch-avatar-the-last-airbender-38893"],
  ["Ben 10", "4686", "tv/watch-ben-10-37886"],
  ["Pokemon", "60572", "tv/watch-pokemon-39493"],
  ["Tom and Jerry", "676", "tv/watch-tom-and-jerry-tales-37606"],
  ["Scooby Doo", "18123", "tv/watch-scoobydoo-mystery-incorporated-38681"],
]


const show = {
  name: "",
  Title: "",
  ID: "",
  FlixID: "",
  Img: "",
  Cover: "",
  Season: "",
  Logo: "images/Logo.png",
  EpisodeID: "",
  EpisodeNo: "",
  EpisodeTitle: "",
  Description: "",
  Link: "",
  Subtitles: [],
  Length: ""
}

let shows = []
let icons = [nowPlayingImage, nextUp1, nextUp2, nextUp3, nextUp4, nextUp5]
let chosenChannel = "Comedy"

function createShowList(Channel){
  let channel = JSON.parse(JSON.stringify(Channel));
  //console.log(channel)
  for (let i = 0; i < 6; i ++){
    shows[i] = Object.create(show)
    
    let indexInChannel = Math.floor(Math.random()*(channel.length-1))
    shows[i].name = channel[indexInChannel][0].replace(/\s+/g, '-').toLowerCase()
    shows[i].FlixID = channel[indexInChannel][2]
    

    //Set IDS
    if(channel[indexInChannel][1] === ""){
      fetch("https://api.consumet.org/meta/tmdb/" + shows[i].name)
      .then(response => response.json())
      .then(data => {
        console.log(shows[i].name)
        for(let i = 0; i < data.results.length; i ++){
          console.log(data.results[i].title + " : " + data.results[i].id)
        }
        console.log("\n")
        shows[i].ID = String(data.results[0].id)
      } )
      .catch(error => console.error(error)
      );
    }
    else{
      shows[i].ID = channel[indexInChannel][1]
    }
    //IDS SET

    //Get Episode And Details
    fetch("https://api.consumet.org/meta/tmdb/info/" + shows[i].ID + "?type=tv")
    .then(response => response.json())
    .then(data => {

      // console.log(data)
      shows[i].Logo = data.logos[0].url;
      shows[i].Length = String(data.duration);
      shows[i].Title = data.title;
      logo.src = shows[0].Logo
    })


      fetch("https://api.consumet.org/movies/flixhq/" + shows[i].name)
      .then(response => response.json())
      .then(data => {
        //console.log(data)
        console.log(channel)
        console.log(channel.length)
        console.log(indexInChannel)
        console.log(channel[indexInChannel])
        if(channel[indexInChannel][2] === ""){
        for(let i = 0; i < data.results.length; i ++){
          console.log(data.results[i].id)
        }
        }
          

      } )
      .catch(error => console.error(error)
      );

      fetch("https://api.consumet.org/movies/flixhq/info?id=" + channel[indexInChannel][2])
      .then(response => response.json())
      .then(data => {
        
        //console.log("Show Details:")
        //console.log(data)
        shows[i].Cover = data.cover
        shows[i].Img = data.image
        shows[i].Description = data.description
        if(shows[i].Length == ""){
          shows[i].Length = data.duration;
          shows[i].Title = data.title;
        }
        let pickedEpisode = data.episodes[Math.floor(Math.random()*data.episodes.length)]
        shows[i].EpisodeID = pickedEpisode.id;
        shows[i].EpisodeTitle = pickedEpisode.title;
        shows[i].Season = pickedEpisode.season
        shows[i].EpisodeNo = pickedEpisode.number;
        


        //search for stream link
        fetch("https://api.consumet.org/movies/flixhq/watch?episodeId=" + shows[i].EpisodeID + "&mediaId=" + shows[i].FlixID)
          .then(response => response.json())
          .then(data => {
            //set stream link to the player
  
            //console.log(data.sources)
            // shows[i].Link = data.sources[data.sources.length-1].url
            shows[i].Link = data.sources[0].url

            // icons[i].style.animationPlayState = 'paused';
            icons[i].style.backgroundImage = `url(${shows[i].Cover})`
            icons[i].innerHTML = shows[i].Title
            
            fadeInElements([icons[i]]);
            setShows();
            if(i == 0){
            player.src = shows[0].Link
            }
            // player.play()

            console.log(shows[i])
            if(channel.length > 1){
            channel.splice(indexInChannel, 1)
            }

          } )
          .catch(error => console.error(error)
          );


      } )
      .catch(error => console.error(error)
      );





  }
}


function getOneShow(channel){
  shows[5] = Object.create(show)
  let indexInChannel = Math.floor(Math.random()*channel.length)
  shows[5].name = channel[indexInChannel][0].replace(/\s+/g, '-').toLowerCase()
  shows[5].FlixID = channel[indexInChannel][2]

  //Set IDS
  if(channel[indexInChannel][1] === ""){
    fetch("https://api.consumet.org/meta/tmdb/" + shows[i].name)
    .then(response => response.json())
    .then(data => {
      console.log(shows[i].name)
      for(let i = 0; i < data.results.length; i ++){
        console.log(data.results[i].title + " : " + data.results[i].id)
      }
      console.log("\n")
      shows[5].ID = String(data.results[0].id)
    } )
    .catch(error => console.error(error)
    );
  }
  else{
    shows[5].ID = channel[indexInChannel][1]
  }
  //IDS SET

  //Get Episode And Details
  fetch("https://api.consumet.org/meta/tmdb/info/" + shows[5].ID + "?type=tv")
  .then(response => response.json())
  .then(data => {

    shows[5].Logo = data.logos[0].url;
    shows[5].Length = String(data.duration);
    shows[5].Title = data.title;
    logo.src = shows[0].Logo
  })

    // if(shows[i][2] === ""){
    fetch("https://api.consumet.org/movies/flixhq/" + shows[5].name)
    .then(response => response.json())
    .then(data => {
      //console.log(data)
      if(channel[indexInChannel][2] === ""){
      for(let i = 0; i < data.results.length; i ++){
        console.log(data.results[i].id)
      }
      }
    } )
    .catch(error => console.error(error)
    );
  // }

    fetch("https://api.consumet.org/movies/flixhq/info?id=" + channel[indexInChannel][2])
    .then(response => response.json())
    .then(data => {
      
      //console.log("Show Details:")
      //console.log(data)
      shows[5].Cover = data.cover
      shows[5].Img = data.image
      shows[5].Description = data.description
      if(shows[5].Length == ""){
        shows[5].Length = data.duration;
        shows[5].Title = data.title;
      }
      let pickedEpisode = data.episodes[Math.floor(Math.random()*data.episodes.length)]
      shows[5].EpisodeID = pickedEpisode.id;
      shows[5].EpisodeTitle = pickedEpisode.title;
      shows[5].Season = pickedEpisode.season
      shows[5].EpisodeNo = pickedEpisode.number;
      


      //search for stream link
      fetch("https://api.consumet.org/movies/flixhq/watch?episodeId=" + shows[5].EpisodeID + "&mediaId=" + shows[5].FlixID)
        .then(response => response.json())
        .then(data => {
          //set stream link to the player

          //console.log(data.sources)
          // shows[i].Link = data.sources[data.sources.length-1].url
          shows[5].Link = data.sources[0].url
          
          icons[5].style.backgroundImage = `url(${shows[5].Cover})`
          icons[5].innerHTML = shows[5].Title
          fadeInElements([icons[5]]);


        } )
        .catch(error => console.error(error)
        );


    } )
    .catch(error => console.error(error)
    );

  console.log(shows[5])

}

function setShows(){
  seriesDescription.innerHTML = shows[0].Description
  seriesTitle.innerHTML = shows[0].EpisodeTitle.split(':').pop() + "<br>S " + shows[0].Season + " • Ep " + shows[0].EpisodeNo + " • " + shows[0].Length + " min"
  nowPlayingImage.innerHTML = shows[0].Title
  nowPlayingImage.style.backgroundImage = `url(${shows[0].Cover})`
  backgroundImage.style.backgroundImage = `url(${shows[0].Cover})`
  fadeInElements([nowPlayingImage, backgroundImage, seriesDescription, logo]);
}

createShowList(window[chosenChannel])
  

let baseUrl = "https://api.consumet.org/movies/flixhq/watch?episodeId="
let showName = "dragon-ball"
let currentShowTag = "tv/watch-dragon-ball-39541"

let seriesEpisodes
let chosenEpisode

function fadeInElements(elements) {
  elements.forEach(element => {
    element.style.opacity = 0;
    setTimeout(() => {
      element.style.transition = "opacity 0.5s ease-in-out";
      element.style.opacity = .7;
    }, 50);
  });
}



//fetch and store details of the selected series
function getDetails(seriesID){

//collects images, episode list, and descriptions
fetch("https://api.consumet.org/movies/flixhq/" + showName)
  .then(response => response.json())
  .then(data => {
    //search for gathered information

    console.log(data)

    let show = data.results[0]
    if(show.seasons == null || show.type == 'Movie'){
    show = data.results[1]
    
    }
    let showId = show.id
    
    console.log(showId)

    fetch("https://api.consumet.org/movies/flixhq/info?id=" + showId)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      //sets gathered information
      nowPlayingImage.style.backgroundImage = `url(${data.cover})`
      backgroundImage.style.backgroundImage = `url(${data.image})`
      chosenEpisode = data.episodes[Math.floor(Math.random()*data.episodes.length)]
      console.log(data.episodes)
      if(data.episodes.length > 1){
        seriesTitle.innerHTML = chosenEpisode.title.split(':').pop() + "<br>S " + chosenEpisode.season + " • Ep " + chosenEpisode.number + " • " + data.duration
      }
      else{
        seriesTitle.innerHTML = chosenEpisode.title.split(':').pop() + "<br>" + data.duration
      }
      seriesDescription.innerHTML = data.description
      nowPlayingImage.innerHTML = data.title
      fadeInElements([nowPlayingImage, backgroundImage, seriesDescription]);
      console.log(chosenEpisode)
      //retrieve stream link
      let url = new URL(baseUrl);
      url.searchParams.set("episodeId", chosenEpisode.id);
      url.searchParams.set("mediaId", showId);

      //search for stream link
      fetch(url)
        .then(response => response.json())
        .then(data => {
          //set stream link to the player
          player.src = data.sources[0].url
          console.log(data.sources)


        } )
        .catch(error => console.error(error)
        );
    } )
    .catch(error => console.error(error)
    );
  } )
  .catch(error => console.error(error)
  );
}

// getDetails(currentShowTag)


//function to set all 6
//loop 6 times for a channel call
//set variables for each of the 6 show objects (image desc link etc.)
//in the ended event listener loop thorugh a count of 6 and set i as the current playing

function playNext(){
  player.src = shows[1].Link
  seriesDescription.innerHTML = shows[1].Description
  seriesTitle.innerHTML = shows[1].EpisodeTitle.split(':').pop() + "<br>S " + shows[0].Season + " • Ep " + shows[0].EpisodeNo + " • " + shows[0].Length + " min"
  nowPlayingImage.innerHTML = shows[1].Title
  nowPlayingImage.style.backgroundImage = `url(${shows[1].Cover})`
  backgroundImage.style.backgroundImage = `url(${shows[1].Cover})`
  logo.src = shows[1].Logo
  fadeInElements([nowPlayingImage, backgroundImage, seriesDescription, logo, seriesTitle, seriesDescription]);
  shows.splice(0, 1)
  for(let i = 1; i < 5; i++){
    icons[i].style.backgroundImage = `url(${shows[i].Cover})`
    icons[i].innerHTML = shows[i].Title
    fadeInElements([icons[i]]);
  }
  icons[5].innerHTML = ""
  icons[5].style.backgroundImage = ""
  getOneShow(window[chosenChannel])
  player.play()
}

function show_hide() {  
  var mylist = document.getElementById("channelDetails");  
  chosenChannel = mylist.options[mylist.selectedIndex].text.substring(0, mylist.options[mylist.selectedIndex].text.indexOf(" >"));
  console.log(mylist.options[mylist.selectedIndex].text)
  createShowList(window[chosenChannel])
  for(let i = 0; i < icons.length; i ++){
    icons[i].style.backgroundImage = ""
    icons[i].innerHTML = ""
  }
  seriesDescription.innerHTML = ""
  seriesTitle.innerHTML = ""
  logo.src = "images/Logo.png"
  fadeInElements([nowPlayingImage, backgroundImage, seriesDescription, logo, seriesTitle, seriesDescription]);
}  

// player.play()

//when video fineshes
player.addEventListener('ended',myHandler,false);
  function myHandler(e) {
      playNext()
  }
