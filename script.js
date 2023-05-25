// Initialize and add the map
let map;

async function initMap() {

    // Court and state in Binghamton
    const mapCenter = { lat: 42.098716, lng: -75.912528 };
    const courtBridgeMosaic = {lat:42.098575 , lng:-75.915483 };
    // Request needed libraries.
    //@ts-ignore
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    // The map, centered at Uluru
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

initMap();