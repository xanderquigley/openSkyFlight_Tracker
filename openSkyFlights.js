// const { marker, layerGroup } = require("leaflet");

(function(){ // start iife

    //create map in leaflet and tie it to the div called 'theMap'
    const map = L.map('theMap').setView([42, -60], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

    // Create variable to hold the API Link
    const apiURL = 'https://prog2700.onrender.com/opensky';
    
    // Create a layer to add points to, so we can then clear the layer of marker points easier later
    let markerLayer = undefined;

    // FETCH DATA
    const fetchFlights = () => {
    fetch(apiURL)
        .then((response) => response.json())
        .then((json) => {
            // Starting with an end task - we need to first clear the map layer if it has any current markers 
            // we do this so on refresh - the map is cleared of previous markers
            
            // Looking at the plain JSON - what we want is stored in the states property
            // when looking at the json - the 2 index of the states array (we named flights) holds the origin country
            let flights = json.states
            .filter((flights) => {
                return flights[2] === 'Canada';
                // console.log(flights);
            })
            // Now we can map the filtered information into geoJSON format so we can then add to the map
            // now format to geoJSON
            .map((flights) => {
                return {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [flights[5], flights[6]]     // long, lat of the JSON 
                    },
                    "properties": {
                        callSign: flights[1],
                        originCountry: flights[2],
                        baroAlt: flights[3],
                        velocity: flights[9],
                        geoAlt: flights[13],
                        spi: flights[15],
                        category: flights[17],
                        bearing: flights[10]                       
                    }
                }
            }) 

            // Now we need to check if the markerLayer we created has anything in it - because on each refresh, if it does have markers,
            // we want to clear those, and place new markers
            if(markerLayer != undefined){
                map.removeLayer(markerLayer);
            }

            // add this new cleared layer back to the map
            markerLayer = L.layerGroup().addTo(map);

            // Now we can add the formatted geoJSON to the map
            L.geoJSON(flights, {
                // Use pointToLayer (https://leafletjs.com/examples/geojson/) function 
                pointToLayer: function(feature, latlng) {
                    // Create the plane icon to be displayed as a marker
                    let planeIcon = L.icon({
                        iconUrl: 'plane2.png',
                        iconSize: [20, 20],
                    });
                    
                    // this function now will return the L.marker method that includes the plane icon, and the direction the plane is headed (bearing)
                    return L.marker(latlng, {icon: planeIcon, rotationAngle: feature.properties.bearing})
                    .bindPopup(
                        // Now we can add the properties we want to display in the HTML
                        'Plane CallSign: ' + feature.properties.callSign + '</br>' +
                        'Origin Country: ' + feature.properties.originCountry + '</br>' +
                        'Barometric Altitude: ' + feature.properties.baroAlt + '</br>' +
                        'Plane Velocity: ' + feature.properties.velocity + '</br>' +
                        'Plane Bearing: ' + feature.properties.bearing + '</br>'
                    );
                }
                // Lastly - add all this to the map
            }).addTo(markerLayer);
        }); // END OF FETCH 
        }

        // Now the task is to have the information refresh every 15 seconds
        // and have the layer cleared prior to inputting new information
        // to do this we can place the entire fetch method in a function and use the timeout and interval methods
        fetchFlights();
        setInterval(fetchFlights, 15000);


})() // END OF IIFE