/** Class reprenting a pre-written directory of company's names
 * and addresses to start with. This list can be modifed to suit
 * needs.
 */
class CompanyDirectory {
    constructor() {
    }
    /**
     * 
     */
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
            {name: "kraken", address: "189 Glencoe Dr, Mount Pearl, NL A1N 4S8", type:"company"},
            {name: "genesis", address: "100 Signal Hill Rd, St. John's, NL A1A 1B3", type:"incubator", members: ["breathsuite", "rally", "totaliQ", "milk moovement", "fytics", "castr"]},
            {name: "vision33", address: "210 Water St #400, St. John's, NL A1C 1A9", type:"company"},
            {name: "mentic", address: "Memorial University, Genesis, Box 4200, St. John's, NL A1C 5S7", type:"company"},
            {name: "hatch", address: "80 Hebron Way #100, St. John's, NL A1A 0L9", type:"company"},
            {name: "bluedrop", address: "18 Prescott Street, St. John's, NL A1C 3S4", type:"company"},
            {name: "avalon", address: "240 Waterford Bridge Rd Suite 200, St. John's, NL A1E 1E2", type:"company"},
            {name: "compusult", address: "40 Bannister St, Mount Pearl, NL A1N 1W1", type:"company"},
            {name: "genoa", address: "15 Dundee Ave, Mount Pearl, NL A1N 4R6", type:"company"},
            {name: "nocland", address: "187 Kenmount Road St. John's, NL, Canada", type:"company"},
            {name: "skyhawk", address: "238 Torbay Road, St. John's, NL, A1A 2H4, Canada", type:"company"}
        ];
    }
    static companyLocation() {
        return "newfoundland";
    }
};

/**
 * Class representing a collection of API keys with getters
 */
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

/** Class representing collection of companies filled with info and coordinates
 * with a method to pull such info
 */
class CompanyInfo 
{
    /**
     * holds a list of companies & incubators with complete info and coordinates 
    */
    constructor() 
    {
        this.companyList = [];
    }
    /**
     * Pulling json data from crunchbase's and here's api, make company objects and push them to an array
     * @param   {Array}     companyNames Array of names and addresses that will be used
     * @param   {Array}     companyLocation Area of interest (in this case, it's newfoundland)
     * @param   {string}    crunchbaseAPI API string to access crunchbase
     * @param   {string}    hereAPI API string to access here.com to convert physical addresses to global coordinates
     * @return  none
     */
    static apiDataGenerating(companyNames, companies, companyLocation, crunchbaseAPI, hereAPI) {
        
        //Get info from crunchbase for every company in companyName array
        for(let i = 0; i < companyNames.length; i++) {
            let crunchbaseData = "https://api.crunchbase.com/v3.1/odm-organizations?user_key=" + crunchbaseAPI + "&name=" + companyNames[i].name + "&locations=" + companyLocation;
            fetch(crunchbaseData)
                .then(response => response.json())
                .then(function(data) {
                    if(data.data.paging.total_items == 0) //if there's no info from crunchbase, push a dummy company object to list
                    {
                        //get coordinates from here.com for current company
                        let hereData = "https://geocoder.ls.hereapi.com/6.2/geocode.json?apiKey=" + hereAPI + "&searchtext=" + companyNames[i].address; 
                        fetch(hereData)
                        .then(response => response.json())
                        .then(function(data) {

                            //format fetched coordinates in leaflet's preferred format
                            const coordinatesObject = data.Response.View[0].Result[0].Location.NavigationPosition[0];
                            const companyCords = [coordinatesObject.Latitude, coordinatesObject.Longitude];

                            if(companyNames[i].type == "company") //push dummy company objects into companies array, with special treatment for incubators
                            {
                                companies.push(new Company(companyNames[i].name, companyNames[i].name, null, null, null, null, null, companyNames[i].address, companyCords, null));
                            } else {
                                companies.push(new Incubator(companyNames[i].name, companyNames[i].name, null, null, null, null, null, companyNames[i].address, companyCords, null, companyNames[i].members));
                            }
                        });

                    // if there are info on current company from crunchbase
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
                        
                        //get coordinates from here.com for current company
                        let hereData = "https://geocoder.ls.hereapi.com/6.2/geocode.json?apiKey=" + hereAPI + "&searchtext=" + companyNames[i].address; 
                        fetch(hereData)
                        .then(response => response.json())
                        .then(function(data) {

                            //format fetched coordinates in leaflet's preferred format
                            const coordinatesObject = data.Response.View[0].Result[0].Location.NavigationPosition[0];
                            const companyCords = [coordinatesObject.Latitude, coordinatesObject.Longitude];
                            if(companyNames[i].type == "company") //push company objects into companies array, with special treatment for incubators
                            {
                                companies.push(new Company(shortName, name, city, image, facebook, linkedin, website, address, companyCords, description));    
                            } else {
                                companies.push(new Incubator(shortName, name, city, image, facebook, linkedin, website, address, companyCords, description, companyNames[i].members));
                            }
                            
                        });
                    }
                    
        
                });
        }
    }

};

/** Class representing a company object */
class Company {
    /**
     * Create an instance of a company
     * @param {string}  shortName name of a company/incubator that came from a pre-written list
     * @param {string}  name full name of a company
     * @param {string}  city city that the company is based in
     * @param {string}  image URL of company's logo
     * @param {string}  facebook URL of company's facebook page
     * @param {string}  linkedin URL of company's linkedin page
     * @param {string}  website URL of company's official website
     * @param {string}  address company's full address
     * @param {Array}   coordinates company's address coordinates
     * @param {string}  description description of the business
     */
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
};

/**
 * Class representing an incubator, which is similar to a company class but
 * includes a list of companies in it
 */
class Incubator extends Company {
    /**
     * create an instance of an incubator
     * @param {Array} members list of members of an incubator
     */
    constructor(shortName, name, city, image, facebook, linkedin, website, address, coordinates, description, members) {
        super(shortName, name, city, image, facebook, linkedin, website, address, coordinates, description);
        this.members = members;
    }
}
/**
 * Generate info for companies from APIs
 */
function generateCompanyProfiles() {
    let companies = new CompanyInfo;
    CompanyInfo.apiDataGenerating(CompanyDirectory.companyNames(), companies.companyList, CompanyDirectory.companyLocation(), Api.crunchbaseAPI(), Api.hereAPI());
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(companies.companyList);
        }, 3000);
    });
}

/**
 * return an individual company object from a list (with all info filled)
 * @param {Array} companies list of companies with info all filled in
 * @param {int} i integer
 * @returns {company} an individual company (full info)
 */
function getIndividualCompany(companies, i) {
    return companies[i];
}

/**
 * Putting companies on the map through markers and pop-ups using provided coordinates
 */
async function markingMap() {

    //Generating a list of companies with info
    companiesList = await generateCompanyProfiles();
    console.groupCollapsed("Companies successfully retrieved from API");
    console.table(companiesList, ["name", "website", "coordinates"]);
    console.groupEnd();
    console.groupCollapsed("Invidual companies/incubators currently on the map");
    
    //Putting each company on the map
    for (let i = 0; i < companiesList.length; i++) {
        individualCompany = getIndividualCompany(companiesList, i);
        console.log(individualCompany);
        //Set markers on the map
        let x = L.marker(individualCompany.coordinates).addTo(nlmap);
        //Declaring info variables to use in pop-up
        let name = "<h1>" + individualCompany.name + "</h1>";
        let description = "";
        let image = "";
        let facebook = "";
        let linkedin = "";
        let website = "";
        let address = "";
        let group = "<h3>Members in this incubator:</h3>";
        let info = "";
        
        if (individualCompany instanceof Incubator) //Separating incubators from companies
        {
            console.log("incubator spotted")
            for(let z = 0; z < individualCompany.members.length; z++) {
                group += ("<li>" + individualCompany.members[z] + "</li>");
                console.log("incubator member added successfully")
            }
        }

        //Handling null info
        if (individualCompany.address != null) {
            address = "<p>" + "Address: " + individualCompany.address + "<\p>";
        } else {
            address = "No address available.";
        }
        if (individualCompany.facebook != null) {
            facebook = "<a href='" + individualCompany.facebook + "'>Facebook</a>";
        } else {
            facebook = "No facebook available.";
        }
        if (individualCompany.linkedin != null) {
            linkedin = "<a href='" + individualCompany.linkedin + "'>LinkedIn</a>";
        } else {
            linkedin = "No LinkedIn available.";
        }
        if (individualCompany.website != null) {
            website =  "<a href='http://" + individualCompany.website + "'>Website</a>";
        } else {
            website = "No website available.";
        }
        if (individualCompany.image != null) {
            image = "<img src='" + individualCompany.image + "'alt='logo' width='80'>";
        } else {
            image = "No logo available.";
        }
        if(individualCompany.description != null) {
            description = "<p>" + individualCompany.description + "</p>";
        } else {
            description = "No descriptions available.";
        }

        if(individualCompany instanceof Incubator) //putting info onto pop-ups
        {
            info = name + image + description + group + address + website + "<br>" + facebook + "<br>" + linkedin;
        } else {
            info = name + image + description + address + website + "<br>" + facebook + "<br>" + linkedin;
        }
        x.bindPopup(info);
    } 
    console.groupEnd();
}

//Map component
var nlmap = L.map('map').setView([47.5626274374099, -52.75703430175781], 11);

//Map Layer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoidGhhbmdoYWltZW93IiwiYSI6ImNrN2MydzFzeTAwNDQzZW1jZDEzNjhwb2QifQ.nD9ibuY2wFeARFb97sgleA'
}).addTo(nlmap);

//Put them on the map
markingMap();



