(function(){ // start iife

    //create map in leaflet and tie it to the div called 'theMap'
    const map = L.map('theMap').setView([42, -60], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

    // Create variable to hold the Buses API 
    const apiURL = 'https://prog2700.onrender.com/hrmbuses';

    // Create a global layer
    let markerLayer = undefined;

    // Create a function to hold our fetch
    const fetchBuses = () => {
        // Fetch the data
        fetch(apiURL)
        .then(response => response.json())
        .then((json) =>{
            // console.log(json);
            const routes = json.entity
            .filter((route) => {
                return route.vehicle.trip.routeId <= 10;
            })
            .map((route) => {
                return {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates":[route.vehicle.position.longitude, route.vehicle.position.latitude]    // long, lat of the JSON 
                    },
                    "properties": {
                        "Bus Route: ": route.vehicle.trip.routeId,
                        "Bus Speed: ": route.vehicle.position.speed,
                        "Bus Label: ": route.vehicle.vehicle.label
                    }
                };
            });
            
            // Check if the markerLayer has any markers, if it does, remove the markers
            if(markerLayer != undefined){
                map.removeLayer(markerLayer);
            }

            // Now add the markerLayer to the map
            markerLayer = L.layerGroup().addTo(map);

            // Now plot the geoSON on the markerLayer
            L.geoJSON(routes, {
                pointToLayer: function(feature, latlng) {
                    // Create the plane icon to be displayed as a marker
                    let planeIcon = L.icon({
                        iconUrl: 'plane2.png',
                        iconSize: [20, 20],
                    });

            })

            
        }) // End of Fetch



    } // End of Fetch Function
    
    fetchBuses();



})() // END OF IIFE