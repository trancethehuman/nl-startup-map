class CompanyDirectory {
    constructor() {
    }
    static companyNames() {
        return [
            {name: "colab", address: "251 E White Hills Rd, St. John's, NL A1A 5N8", type:"company"}, 
            {name: "mysa", address: "34 Harvey Rd #302, St. John's, NL A1C 2G1", type:"company"},
            {name: "verafin", address: "18 Hebron Way, St. John's, NL A1A 0L9", type:"company"},
            {name: "clearrisk", address: "5 Hallett Crescent, St. John's, NL A1B 4C4", type:"company"},
            {name: "heyorca", address: "261 Kenmount Rd, St. John's, NL A1B 3P9", type:"company"},
            {name: "mentic", address: "Memorial University, Genesis, Box 4200, St. John's, NL A1C 5S7", type:"company"},
            {name: "celtx", address: "354 Water St, St. John's, NL A1C 1C4", type:"company"},
            {name: "radient360", address: "99 Airport Rd, St. John's, NL A1A 4Y3", type:"company"},
            {name: "subc", address: "327 Memorial Dr, Clarenville, NL A5A 1R8", type:"company"},
            {name: "kraken", address: "189 Glencoe Dr, Mount Pearl, NL A1N 4S8", type:"company"},
            {name: "genesis", address: "100 Signal Hill Rd, St. John's, NL A1A 1B3", type:"incubator", members: ["breathsuite", "rally", "totaliQ", "milk moovement", "fytics", "castr"]},
            {name: "vision33", address: "210 Water St #400, St. John's, NL A1C 1A9", type:"company"},
            
        ];
    }
    static companyLocation() {
        return "newfoundland";
    }
};

class Api {
    constructor() {
    }
    static crunchbaseAPI() {
        return "fe4e67f7008701edf3ef49fe0bb35b08";
    }
    static hereAPI() {
        return "qbko57hPdv-u1RzIiS90A3FrgpELCH-DzjG7E3MbJNg";
    }
};

class CompanyInfo {
    constructor() {
        this.companyList = [];
    }
    static apiDataGenerating(companyNames, companies, companyLocation, crunchbaseAPI, hereAPI) {
        for(let i = 0; i < companyNames.length; i++) {
            let crunchbaseData = "https://api.crunchbase.com/v3.1/odm-organizations?user_key=" + crunchbaseAPI + "&name=" + companyNames[i].name + "&locations=" + companyLocation;
            fetch(crunchbaseData)
                .then(response => response.json())
                .then(function(data) {
                    if(data.data.paging.total_items == 0){
                        let hereData = "https://geocoder.ls.hereapi.com/6.2/geocode.json?apiKey=" + hereAPI + "&searchtext=" + companyNames[i].address; 
                        fetch(hereData)
                        .then(response => response.json())
                        .then(function(data) {
                            const coordinatesObject = data.Response.View[0].Result[0].Location.NavigationPosition[0];
                            const companyCords = [coordinatesObject.Latitude, coordinatesObject.Longitude];
                            if(companyNames[i].type == "company"){
                                companies.push(new Company(companyNames[i].name, companyNames[i].name, null, null, null, null, null, companyNames[i].address, companyCords, null));
                            } else {
                                companies.push(new Incubator(companyNames[i].name, companyNames[i].name, null, null, null, null, null, companyNames[i].address, companyCords, null, companyNames[i].members));
                            }
                        });
                    } else {
                        const properties = data.data.items[0].properties;
                        const shortName = companyNames[i].name;
                        const name = properties.name;
                        const city = properties.city_name;
                        const image = properties.profile_image_url;
                        const facebook = properties.facebook_url;
                        const linkedin = properties.linkedin_url;
                        const website = properties.domain;
                        const address = companyNames[i].address;
                        const description = properties.short_description;
                        
                        let hereData = "https://geocoder.ls.hereapi.com/6.2/geocode.json?apiKey=" + hereAPI + "&searchtext=" + companyNames[i].address; 
                        fetch(hereData)
                        .then(response => response.json())
                        .then(function(data) {
                            const coordinatesObject = data.Response.View[0].Result[0].Location.NavigationPosition[0];
                            const companyCords = [coordinatesObject.Latitude, coordinatesObject.Longitude];
                            if(companyNames[i].type == "company"){
                                companies.push(new Company(shortName, name, city, image, facebook, linkedin, website, address, companyCords, description));    
                            } else {
                                companies.push(new Incubator(shortName, name, city, image, facebook, linkedin, website, address, companyCords, description, companyNames.members));
                            }
                            
                        });
                    }
                    
        
                });
        }
    }

};

class Company {
    constructor(shortName, name, city, image, facebook, linkedin, website, address, coordinates, description) {
        this.shortName = shortName;
        this.name = name;
        this.city = city;
        this.image = image;
        this.facebook = facebook;
        this.linkedin = linkedin;
        this.website = website;
        this.address = address;
        this.coordinates = coordinates;
        this.description = description;
    }
    // putOnMap(map) {
    //     return L.marker(this.coordinates).addTo(map);
    // }
};

class Incubator extends Company {
    constructor(shortName, name, city, image, facebook, linkedin, website, address, coordinates, members) {
        super(shortName, name, city, image, facebook, linkedin, website, address, coordinates);
        this.members = members;
    }
}

function generateCompanyProfiles() {
    let companies = new CompanyInfo;
    CompanyInfo.apiDataGenerating(CompanyDirectory.companyNames(), companies.companyList, CompanyDirectory.companyLocation(), Api.crunchbaseAPI(), Api.hereAPI());
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(companies.companyList);
        }, 500);
    });
}

function getIndividualCompany(companies, i) {
    return companies[i];
}

async function markingMap() {
    companiesList = await generateCompanyProfiles();
    console.log(companiesList)
    for (let i = 0; i < companiesList.length; i++) {
        console.log(getIndividualCompany(companiesList, i));
        L.marker(getIndividualCompany(companiesList, i).coordinates).addTo(nlmap);
    } 
}

//Map component
var nlmap = L.map('map').setView([47.669086647137576, -53.3331298828125], 8);

//Map Layer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoidGhhbmdoYWltZW93IiwiYSI6ImNrN2MydzFzeTAwNDQzZW1jZDEzNjhwb2QifQ.nD9ibuY2wFeARFb97sgleA'
}).addTo(nlmap);

markingMap();



