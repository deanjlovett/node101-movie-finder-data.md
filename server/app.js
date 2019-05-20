const express = require('express');
const logger = require("morgan");
const axios = require("axios");

// to  enable debug msgs: export my_debug=1
// to disable debug msgs: export my_debug=
const _debug_ = process.env.my_debug; 

const app = express();

// When making calls to the OMDB API make sure to append the '&apikey=8730e0e' parameter

const omdbapi = 'http://www.omdbapi.com/' ;
const apiKey = '&apikey=8730e0e';

var movieIDs = new Map();
var movieTitles = new Map();

app.use(logger('dev'));

app.get('/', (req, res) => {
    const movieID = req.query.i; // hey req, do you have something after "i"?
    const movieTitle = encodeURIComponent( req.query.t ); // hey req, do you have something after "j"? By-the-way, encode it.

    if( movieID ){
        if( movieIDs.has( movieID ) ){
            res.send( 
                movieIDs.get( movieID ) 
            );
        }
        else{
            axios
                .get( omdbapi + '?i=' + movieID + apiKey )
                .then( ax_res => {
                    res.send( ax_res.data ) ;
                    movieIDs.set( movieID, ax_res.data ); // cache it!
                })
                .catch( error => {
                    console.log('error: an error occurred handling Movie ID search.');
                    console.log('error',error);
                });
        }
    }
    else if( movieTitle ){
        if( movieTitles.has( movieTitle  )){
            res.send( 
                movieTitles.get( movieTitle ) 
            );
        }
        else{
            axios
                .get( omdbapi + '?t=' + movieTitle + apiKey )
                .then( ax_res => {
                    res.send( ax_res.data );
                    movieTitles.set( movieTitle, ax_res.data ); // cache it
                })
                .catch( error => {
                    console.log('error: an error occurred handling Movie Title search.')
                    console.log('error', error );
                });
        }
    }
});

module.exports = app;