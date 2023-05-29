// Initialize map variable
let map;

// Request needed libraries.
//@ts-ignore
const { Map } = await google.maps.importLibrary("maps");
const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

async function initMap() {
    // Position objects
    const mapCenter = { lat: 42.098716, lng: -75.912528 };
    const courtBridgeMosaic = {lat:42.098575 , lng:-75.915483 };

    // The map, centered at Court and state, downtown Binghamton
    map = new Map(document.getElementById("map"), {
    zoom: 8,
    center: mapCenter,
    mapId: "DEMO_MAP_ID",
    });

    // Marker dropped at mosaic by court bridge skate spot
    const marker = new AdvancedMarkerElement({
    map: map,
    position: courtBridgeMosaic,
    title: "Court St. Bridge Mosaic",
    });
    console.log('Map init function called',map)
}

async function addSpot(){ //Callback function for submit button
    //Get latitude and longitude from input fields
    let latitude = parseFloat(document.getElementById('lat').value)
    let longitude = parseFloat(document.getElementById('lng').value)
    let spotName = document.getElementById('spot-name').value

    //Create marker and add to map
    const spotMarker = new AdvancedMarkerElement({
        map: map,
        position: {lat: latitude,lng: longitude},
        title: spotName,
        });
    console.log('addSpot function called',spotMarker)
}

document.getElementById('spot-submit').addEventListener('click',addSpot)

//Call function to intitialize the map
initMap();