// Initialize map variable
let map;
console.log('script.js called')
// Request needed libraries.
//@ts-ignore
let mapConstructor, markerConstructor

async function initMap() {
    //Import map and marker 
    const { Map } =  await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } =  await google.maps.importLibrary("marker");
    mapConstructor = Map
    markerConstructor = AdvancedMarkerElement

    // Position objects
    const mapCenter = { lat: 42.098716, lng: -75.912528 };
    const courtBridgeMosaic = {lat:42.098575 , lng:-75.915483 };

    // The map, centered at Court and state, downtown Binghamton
    map = new mapConstructor(document.getElementById("map"), {
    zoom: 8,
    center: mapCenter,
    mapId: "DEMO_MAP_ID",
    });

    // Marker dropped at mosaic by court bridge skate spot
    /* const marker = new markerConstructor({
    map: map,
    position: courtBridgeMosaic,
    title: "Court St. Bridge Mosaic",
    }); */
    console.log('Map init function called',map)
}

function addMarker(latitude,longitude,name){
    const spotMarker = new markerConstructor({
        map: map,
        position: {lat: parseFloat(latitude),lng: parseFloat(longitude)},
        title: name,
        });
    console.log('addMarker function called',spotMarker)
}

async function addSpot(){ //Callback function for submit button
    //Get latitude and longitude from input fields
    let latitude = parseFloat(document.getElementById('lat').value)
    let longitude = parseFloat(document.getElementById('lng').value)
    let spotName = document.getElementById('spot-name').value

    //Create marker and add to map
    addMarker(latitude,longitude,spotName)

    //Create database entry for data
    fetch('http://localhost:5000/spot',{
        'method':'POST',
        'headers':{
            "Content-Type": "application/json",
        },
        'body':JSON.stringify(
            {name:spotName,
            latitude:latitude,
            longitude:longitude})
    })
        .then((response) => response.json())
        .then((json) => {
            displaySpotJSON(response)
            console.log(json)})
        .catch((error)=>console.error(error))
}

function loadSpots(){
    //Loads the spot list 
    fetch('http://localhost:5000/spotlist',{
    method:'GET'})
    .then((response) => response.json())
    .then((json) => displaySpotJSON(json))
    .catch((error)=>console.error(error))
}

function displaySpotJSON(obj){
    console.log(`from parseSpotJSON:`,obj)
    console.log(obj.length)
    var append = '<h4>List of all spots</h4><ol>'
    for(var i = 0; i<obj.length;i++){
        append += `<li>${obj[i].name}<br>Latitude:${obj[i].latitude}<br>Longitude:${obj[i].longitude}</li>`

        //Add spots to map
        addMarker(obj[i].latitude,obj[i].longitude,obj[i].name)
    }
    append += '</ol>'
    document.getElementById('spotlist').innerHTML = append
}

document.getElementById('spot-submit').addEventListener('click',addSpot)

//Call function to intitialize the map
initMap()

loadSpots()