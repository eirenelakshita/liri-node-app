//Code to read and set any environment variables with the dotenv package:
require("dotenv").config();

// Add the code required to import the keys.js file and store it in a variable.
var fs = require("fs");
var keys = require("./keys.js");
var input = process.argv[3];

function useTwitter() {
var Twitter = require("twitter");
var twitter = new Twitter(keys.twitter);
twitter.get('statuses/user_timeline', function(error, tweets, response) {
  if (!error) {
    for (var i=0; i<tweets.length; i++) {
    console.log(tweets[i].text);
  };
  }
});
}

function useSpotify() {
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
spotify.search({ type: 'track', query: input, limit: 10 }, function(err, response) {
  if ( err ) {
      console.log('Error occurred: ' + err);
      return;
  }
    for (var i=0; i<response.tracks.items.length; i++) {
    console.log("Artist: " + response.tracks.items[i].album.artists[0].name + "\nAlbum: " + response.tracks.items[1].album.name
    + "\nSong title: " + response.tracks.items[i].name
        + "\nPreview Link: " + response.tracks.items[i].preview_url
        + "\n------------------------------------\n"
        );
}}
);
}

// OMDB Command

function useOmdb() {
var request = require("request");
var movieName = "";
movieName = input.replace(/ /g, "+");
// console.log(movieName);

if (movieName === undefined) {
    request("http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy", function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(JSON.parse(body));
        }
    });
} else {
    
    var queryURL = "http://www.omdbapi.com/?t="+movieName+"&y=&plot=short&apikey=trilogy";
request(queryURL, function(error, response, body) {
    if (!error && response.statusCode === 200) {
        console.log("Title: " + JSON.parse(body).Title
      + "\nYear: " +  JSON.parse(body).Year
      + "\nIMDB Rating: " + JSON.parse(body).Ratings[0].Value
      + "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value
      + "\nCountry: " + JSON.parse(body).Country
      + "\nLanguage: " + JSON.parse(body).Language
      + "\nPlot: " + JSON.parse(body).Plot
      + "\nActor: " + JSON.parse(body).Actors);
    }
})
};
}


var operand = process.argv[2];

switch(operand) {
  case 'my-tweets' :
  useTwitter();
  break;
  case 'spotify-this-song':
  useSpotify();
  break;
  case `movie-this` :
  useOmdb();
  break;
  case 'do-what-it-says' :
  justDoIt();
  break;
}

function justDoIt() {
  fs.readFile("random.txt", "utf-8", function(err, data) {
    if (err) {
      console.log(error);
    }
    // console.log(data);
    var dataArray = data.split(",");
    // console.log(dataArray);
    var operand = dataArray[0];
    // console.log(operand);
    input = dataArray[1];
    // console.log(input);
    useSpotify();
  });
}

fs.readFile("log.txt", "utf-8", function(err, data) {
  if (err) {
    console.log(error);
  } else if (data.charAt[data.length - 1] === ", ") {
    console.log ("Begins with comma");
    fs.appendFile("log.txt", ", " + operand + ", " + input, function(err) {
      if (err) {
        console.log(error);
      } else {
        console.log("Command added!")
        fs.readFile("log.txt", "utf-8", function(err, data) {
          if (err) {
            console.log(error);
          } console.log(data);
        })
      }
    })
  } else {
    console.log("Doesn't begin with comma");
    fs.appendFile("log.txt", operand + ", " + input + ", ", function(err) {
      if (err) {
        console.log(error);
      } else {
        console.log("Command added!")
        fs.readFile("log.txt", "utf-8", function(err, data) {
          if (err) {
            console.log(error);
          } console.log(data);
        })
      }
    })
  }
});
