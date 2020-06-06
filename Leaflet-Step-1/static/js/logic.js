// Url for the Geojson earthquake data from the past week which will be used to plot
var earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Creating a basic light map for the markers to be plooted on
var lightmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: 'mapbox/light-v10',
        accessToken: API_KEY
});

// plot the basic map using leaflet
var myMap = L.map("map",{
    // center:[37.09,-95.71],
    center:[0,0],
    zoom : 3,
    
});

// Adding the light map layer to the basic map
lightmap.addTo(myMap);

// Creating legend to be situated at the bottom right corner of the map
var mapLegend = L.control({
    position: "bottomright"
});

// Creating the Div element in html to add the required text and style for the legend
mapLegend.onAdd = function(){
    var div = L.DomUtil.create("div","legend");
    div.innerHTML = "<p class = 'legend green'> Magnitude < 1.0 </p> <p class = 'legend yellowgreen'> Magnitude < 2.0 </p> <p class = 'legend greenyellow'> Magnitude < 3.0 </p> <p class = 'legend yellow'> Magnitude < 4.0 </p> <p class = 'legend orange'> Magnitude < 5.0 </p> <p class = 'legend red'> Magnitude > 5.0 </p>";
    return div;
};

// Adding the legend to the map
mapLegend.addTo(myMap);

// Creating a function which will take the co-ordinated and the magnitude to plot on the map
function markerColor(feature,coordinates){

    // Collecting the place, time and magnitude of the earthquake and storing it in variables
    var magnitude = feature.properties.mag;
    var place = feature.properties.place;
    var time = feature.properties.time;

    // creating a if statement to change the marker color based on the magnitude of the earthquake
    if (magnitude < 1.0){
        var color = "green";
    }
    else if (magnitude <= 2.0){
        var color = "yellowgreen"
    }
    else if (magnitude <= 3.0){
        var color = "greenyellow"
    }
    else if (magnitude <= 4.0) {
        var color = "yellow"
    }
    else if (magnitude <= 5.0) {
        var color = "orange"
    }
    else if (magnitude > 5.0){
        var color = "red"
        
    }

    // Creating a variable for the size and color of the marker based on the magnitude of the earthquake
    var markerSize = {
        radius: magnitude * 5,
        color : color,
        weight : 1,
        fillOpacity : 0.6,
    }

    // Returning the markers in the form of circles for each data point along with a popup with the relevant info
    return L.circleMarker(coordinates,markerSize).bindPopup("<h3>"+ place + "<h3><hr><p>"+ new Date(time)+"</p>"+
    "<h3><hr><p> Magnitude = "+ magnitude + "</p>");

};

// Extracting the json data and adding it to the layers on the map
d3.json(earthquake_url,function(data) {
    var markerLayer = L.geoJson(data, {
        pointToLayer : markerColor
    });
    markerLayer.addTo(myMap);
    
    var overlayMaps = {
        Earthquakes : markerLayer
    };

    L.control.layers(lightmap,overlayMaps).addTo(myMap);
    
});

