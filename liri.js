// Set up the environment variables //
require("dotenv").config();

let log = console.log;
// requiring needed packages
let keys = require("./keys.js");
let Spotify = require("node-spotify-api");
let request = require('request');
let fs = require("fs");
let spotifyClient = new Spotify(keys.spotify);
let moment = require("moment");
let axios = require("axios");

// Deciding which functions to call, based on the user input //

function runLiri(commandOne, commandTwo) {

    switch (commandOne) {

        case "concert-this":

        console.log("concert-this :" + commandTwo);

            concert(commandTwo);

            break;

        case "spotify-this-song":

            console.log("Your chosen song info: " + commandTwo);

            getSpotify(commandTwo);

            break;

        case "movie-this":

            console.log("Your chosen movie info: " + commandTwo);

            getMovie(commandTwo);

            break;

        case "do-what-it-says":

            console.log("Do what it says: ");

            doIt();

            break;

        default:

            console.log("Sorry, LIRI doesn't know that. Please enter a command such as 'concert-this', 'spotify-this-song', 'movie-this', or 'do-what-it-says'");

    }

};

runLiri(process.argv[2], process.argv[3]);

// delcaring each function
function concert(band) {
    axios.get("https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp")
        .then(function (response) {
            log("Name of the venue: ", response.data[0].venue.name);
            log("Venue location:", response.data[0].venue.city + ",", response.data[0].venue.country);
            log("Date of the Event :", moment((response.data[0].datetime)).format("MM/DD/YYYY"));
        })
        .catch(function (error) {
            log(error);
        })
};

// Spotify Functionality //

function getSpotify(songName) {

    if (songName === null) {

        songName = "the sign"

    }

    spotifyClient.search({

            type: 'track',

            query: songName,

            limit: 1

        },

        function (err, data) {

            if (err) {

                return console.log("There was an error: " + err);

            } else {

                console.log(data);

                let songTitle = data.tracks.items[0].name;

                let songArtist = data.tracks.items[0].artists[0].name;

                let songAlbum = data.tracks.items[0].album.name;

                let previewURL = data.tracks.items[0].preview_url;

                console.log("------------*Spotify Results*------------");

                console.log("Artists: " + JSON.stringify(songArtist));

                console.log("Album: " + songAlbum);

                console.log("Song Title: " + songTitle);

                console.log("Spotify Preview: " + previewURL);

                console.log("-----------------------------------------");

            }

        }
    )
};
// OMDB Functionality //

function getMovie(movieName) {

    var omdbURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(omdbURL, function (error, response, body) {

        if (!error) {

            console.log("The movie's rating is: " + JSON.parse(body).imdbRating);

            console.log("The title of the movie is: " + JSON.parse(body).Title);

            console.log("The IMDB Rating of the movie is: " + JSON.parse(body).imdbRating);

            console.log("The Rotten Tomatoes Rating of the movie is: " + JSON.parse(body).Ratings[1].Value);

            console.log("The country where the movie was produced is: " + JSON.parse(body).Country);

            console.log("The language of the movie is " + JSON.parse(body).Language);

            console.log("This is the plot of the movie: " + JSON.parse(body).Plot);

            console.log("The actors in the movie are: " + JSON.parse(body).Actors);
        };
    });
};

function doIt() {

    fs.readFile('random.txt', 'utf8', function (err, data) {

        data = data.split(",");

        userInput = data[0];

        songTitle = data[1];

        if (userInput === "spotify-this-song" && songTitle === "undefined") {

            getSpotify("Thriller")

        } else if (userInput === "spotify-this-song") {

            getSpotify(songTitle);

        }

    });

};