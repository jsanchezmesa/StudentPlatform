require("dotenv").config();
const express = require('express');
const router  = express.Router();
const Event = require("../models/Event");

const googleMapsClient = require('@google/maps').createClient({
  key: process.env.MAPSAPI,
  Promise: Promise
});

router.post("/new", (req, res, next) => {
  const {title, description, date, address} = req.body;
  let lat,lng;

  googleMapsClient.geocode({ address }).asPromise()
  .then( data => {
    lat = data.json.results[0].geometry.viewport.northeast.lat;
    lng = data.json.results[0].geometry.viewport.northeast.lng;

    const location = {
      type: "Point",
      coordinates: [lat, lng]
    }
  
    const newEvent = new Event({title,description,date,location});
  
    newEvent.save()
    .then(()=>res.redirect("/"))
    .catch( err => next(err) );
  })
  .catch( err => next(err) );
})

module.exports = router;