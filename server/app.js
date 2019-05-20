const express = require('express');
const logger = require("morgan");
const axios = require("axios");

// to  enable debug msgs: export my_debug=1
// to disable debug msgs: export my_debug=
const _debug_ = process.env.my_debug; 

const app = express();

// When making calls to the OMDB API make sure to append the '&apikey=8730e0e' parameter

const omdbap = 'http://www.omdbapi.com/' ;
const apiKey = '&apikey=8730e0e';

var movieIDs = new Map();
var movieTitles = new Map();

app.use(logger('dev')); // logger

app.get('/', (req, res) => {
    var movieID = req.query.i; // hey req, do you have something after "i"
    var movieTitle = encodeURIComponent( req.query.t ); // hey req, do you have something after "j"
    if( movieID ){
        if(_debug_) {
            console.log('\t\t#### movieID  ##############################################');
            console.log(`\t\t  omdbap: ${omdbap}`);
            console.log('\t\t     ?i=');
            console.log(`\t\t movieID: ${movieID}`);
            console.log(`\t\t  apiKey: ${apiKey}` );
            console.log('\t\t===========================================');
            console.log('\t\t---- is this movie ID our map? (cache) ----');
        }
        if( movieIDs.has( movieID ) ){
            if(_debug_) {
                console.log('\t\t\t---- YES, give user...         the movie ----');
            }
            res.send( movieIDs.get( movieID ) );
        }else{
            if(_debug_) {
                console.log('\t\t\t----  NO, use axios to ...');
                console.log('\t\t\t-----                 get the movie ----');
                console.log('\t\t\t----            send user the movie ----');
                console.log('\t\t\t----                cache the movie ----');
            }

            axios.get( omdbap + '?i=' + movieID + apiKey )
                .then(ax_res => {
                    res.send( ax_res.data ) ;
                    movieIDs.set( movieID, ax_res.data ); // cache it!
                })
                .catch(error =>{
                    console.log('##################################################');
                    console.log('error: an error occurred handling Movie ID search.');
                    console.log('error',error);
                });
        }
    }else if( movieTitle ){
        if(_debug_) {
            console.log('\t\t#### movieTitle  ##############################################');
            console.log(`\t\t     omdbap: ${omdbap}`);
            console.log('\t\t        ?t=');
            console.log(`\t\t movieTitle: ${movieTitle}`);
            console.log(`\t\t     apiKey: ${apiKey}` );
            console.log('\t\t===========================================');
            console.log('\t\t---- is this movie ID our map? (cache) ----');
        }
        if( movieTitles.has( movieTitle )){
            if(_debug_) {
                console.log('\t\t\t---- YES, give user...         the movie ----');
            }
            res.send( movieTitles.get( movieTitle ) );
        }else{
            if(_debug_) {
                console.log('\t\t\t----  NO, use axios to ...');
                console.log('\t\t\t-----                 get the movie ----');
                console.log('\t\t\t----            send user the movie ----');
                console.log('\t\t\t----                cache the movie ----');
            }
            axios.get( omdbap + '?t=' + movieTitle + apiKey)
                .then( ax_res => {
                    res.send( ax_res.data );
                    movieTitles.set( movieTitle, ax_res.data); // cache it
                })
                .catch( error =>{
                    console.log('#####################################################');
                    console.log('error: an error occurred handling Movie Title search.')
                    console.log('error', error );
                });
        }
    }
});

module.exports = app;