//Map component
var nlmap = L.map('map').setView([48.56024979174329, -55.92041015625], 6);

//Map Layer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoidGhhbmdoYWltZW93IiwiYSI6ImNrN2MydzFzeTAwNDQzZW1jZDEzNjhwb2QifQ.nD9ibuY2wFeARFb97sgleA'
}).addTo(nlmap);

//Putting icons on map
var marker = L.marker([47.30903424774781, -53.173828125]).addTo(nlmap);