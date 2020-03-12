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

//Company Class
class Company {
    constructor(shortName, name, city, image, facebook, linkedin, website, coordinates) {
        this.shortName = shortName;
        this.name = name;
        this.city = city;
        this.image = image;
        this.facebook = facebook;
        this.linkedin = linkedin;
        this.coordinates = coordinates;
        this.website = website;
    }
}

//Company list
const apiKey = "fe4e67f7008701edf3ef49fe0bb35b08";
const companyLocation = "newfoundland";
companyNames = ["colab", "rally", "mysa", "breathsuite", "verafin", "clearrisk", "heyorca", "vision33", "Mentic", "celtx","radient360"];
companies = []
for(let i = 0; i <= companyNames.length; i++) {
    let crunchbaseData = "https://api.crunchbase.com/v3.1/odm-organizations?user_key=" + apiKey + "&name=" + companyNames[i] + "&locations=" + companyLocation;
        fetch(crunchbaseData)
        .then(response => response.json())
        .then(function(data) {
            let properties = data.data.items[0].properties;
            const shortName = companyNames[i];
            const name = properties.name;
            const city = properties.city;
            const image = properties.profile_image_url;
            const facebook = properties.facebook_url;
            const linkedin = properties.linkedin_url;
            const website = properties.domain;
            companies.push(new Company(shortName, name, city, image, facebook, linkedin, website));
        });
    
}

console.log(companies);
