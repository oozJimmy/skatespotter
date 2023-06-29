//Declare constants
const mapCenter = { lat: 42.098716, lng: -75.912528 };

// Declare map variables
var map;
var submitMap;

//Declare new spot LatLng object
var newSpotLocation;

//Add the Google map window
async function initMap() {
    //Import map and marker 
    const { Map } =  await google.maps.importLibrary("maps");

    // The map, centered at Court and state, downtown Binghamton
    map = new Map(document.getElementById("map"), {
    zoom: 8,
    center: mapCenter,
    mapId: "aeb05cd88240c11c",
    streetViewControl: false,
    });

    console.log('Map init function called',map)
}

async function addMarker(spot){
    const { AdvancedMarkerElement, PinElement } =  await google.maps.importLibrary("marker");
    const { InfoWindow } = await google.maps.importLibrary("maps");

    const pinCustom = new PinElement({
        background: "#28bfb8",
        borderColor: "#c71c6f",
        glyphColor:"#451978"
    });

    const spotMarker = new AdvancedMarkerElement({
        map,
        position: {lat: parseFloat(spot.latitude),lng: parseFloat(spot.longitude)},
        title: spot.name,
        content:pinCustom.element
    });

    const spotInfo = new InfoWindow({
        content: `<div class="container-fluid text-dark">
                    <h3>${spot.name}</h3>
                    <p>Latitude: ${spot.latitude}<br>
                    Longitude: ${spot.longitude}</p>
                    <p>Category: ${spot.category}</p>
                    <p>Description: ${spot.description}</p>
                    </div>`,
        ariaLabel: spot.name,
    });

    spotMarker.addListener("click", () => {
        spotInfo.open({
            anchor: spotMarker,
            map,
        });
    });
}

//Add spot to the db and map
async function addSpot(){ //Callback function for submit button
    //Get spot data from input fields
    var categoryElement = document.getElementById('category-select')

    var spotObj = {
        name:document.getElementById('spot-name').value,
        /* latitude:parseFloat(document.getElementById('lat').value),
        longitude:parseFloat(document.getElementById('lng').value), */
        latitude:newSpotLocation.lat,
        longitude:newSpotLocation.lng,
        description:document.getElementById('spot-description').value,
        category:categoryElement.options[categoryElement.selectedIndex].text
    }

    //Create marker and add to map
    addMarker(spotObj)

    //Create database entry for data
    fetch('http://localhost:5000/spot',{
        'method':'POST',
        'headers':{
            "Content-Type": "application/json",
        },
        'body':JSON.stringify(spotObj)
    })
        .then((response) => response.json())
        .then((json) => {
            loadSpots()
            console.log(json)})
        .catch((error)=>console.error(error))
}

//Gets list of spots from database calls displaySpotJSON
async function loadSpots(){
    //Loads the spot list 
    fetch('http://localhost:5000/spotlist',{
    method:'GET'})
    .then((response) => response.json())
    .then((json) => displaySpotJSON(json))
    .catch((error)=>console.error(error))
}

async function loadSortedSpots(){
    const categoryElement = document.getElementById('category-sort')
    const category = categoryElement.options[categoryElement.selectedIndex].text

    if(category === 'All')
        return loadSpots()
    
    //Loads the spot list 
    fetch('http://localhost:5000/spotlist/' + category,{
        method:'POST'},)
        .then((response) => response.json())
        .then((json) => displaySpotJSON(json))
        .catch((error)=>console.error(error))
}

//Displays HTML list given obj list of skate spots
function displaySpotJSON(spotlist){
    var append = `<h4 class="text-light">All Submitted Spots ( ${spotlist.length} )</h4>`
    for(var i = 0; i<spotlist.length;i++){
        //append += `<li>${spotlist[i].name}<br>Latitude:${spotlist[i].latitude}<br>Longitude:${spotlist[i].longitude}<br><p>Description: ${spotlist[i].description}</p></li>`

        append += `<div class="accordion-item">
        <h2 class="accordion-header" id="heading${i+1}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i+1}" aria-expanded="true" aria-controls="collapse${i+1}">
            ${i+1}. ${spotlist[i].name}
          </button>
        </h2>
        <div id="collapse${i+1}" class="accordion-collapse collapse" aria-labelledby="heading${i+1}" data-bs-parent="#spotlist">
          <div class="accordion-body">
            <ul>
                <li>Latitude: ${spotlist[i].latitude}</li>
                <li>Longitude: ${spotlist[i].longitude}</li>
                <li>Category: ${spotlist[i].category}</li>
            </ul>
            
            <p>Description: ${spotlist[i].description}</p>
          </div>
        </div>
        </div>`

        //Add spots to map
        addMarker(spotlist[i])
    }
    document.getElementById('spotlist').innerHTML = append
}

//Logs user in
async function logIn(){
    var username = document.getElementById('usr').value
    var password = document.getElementById('pwd').value
    var msgElement = document.getElementById('login-message')

    console.log('logIn function called')
    
    const response = await fetch('http://localhost:5000/users/login',
    {
        method:'POST',
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            username:username,
            password:password
        })
    })

    console.log(`Server response status: ${response.status}`)
    
    
    //If response status is successful call loggedIn
    if(response.status === 202){
        loggedIn(username)
        msgElement.innerText = ""
    }
    else if(response.status === 404 || response.status === 400)
        msgElement.innerText = 'Username or password incorrect'
    else if(response.status === 406)
        msgElement.innerText = 'Please fill out all fields'
    else 
        msgElement.innerText = 'Request went wrong... :('
}

//Signs a new user up
async function signUp(){
    var username = document.getElementById('newusr').value
    var password = document.getElementById('newpwd').value
    var msgElement = document.getElementById('signup-message')

    console.log('signUp function called')
    
    const response = await fetch('http://localhost:5000/users',
        {
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                username:username,
                password:password
            })
        })

    console.log(`Server response status: ${response.status}`)

    //Call loggedIn function to edit the buttons and log new user in
    if(response.status === 201){
        loggedIn(username,true)
        msgElement.value = ""
    }else if(response.status === 406)
        msgElement.innerText = 'Please fill out all fields'
    else if(response.status === 400)
        msgElement.innerText = 'Username taken, select a new one.'
    else   
        msgElement.innerText = 'Request went wrong... :('
}

//Makes UI changes for logging in - called upon successful signup/login
function loggedIn(username, newUser = false, bypass = false){

    console.log('loggedIn called')
    console.log('Username: ',username, 'newUser(bool):',newUser)

    //Hide signup/login modal
    if(!bypass)
        $(newUser ? '#signup-modal' : '#login-modal').modal('hide')

    //Hide login button
    document.getElementById('login-cell').style.display= 'none';

    //Hide signup button
    document.getElementById('signup-cell').style.display= 'none';

    //Display logout button
    document.getElementById('logout-cell').style.display= 'initial';

    //Display welcome message
    welcome = document.getElementById('welcome')
    welcome.style.display = 'initial'
    welcome.innerHTML = `<p>Welcome ${username}, now drop a spot poser.</p>`

    //Show add spot section (available to users only)
    document.getElementById('add-spot').style.display = 'initial'
}

//Makes UI changes for Logout - Called when the user hits the logout button
function logOut(){
    console.log('logOut called')
    
    //Hide logout button
    document.getElementById('logout-cell').style.display = 'none'

    //Hide welcome message
    document.getElementById('welcome').style.display = 'none'

    //Show signup button
    document.getElementById('signup-cell').style.display = 'initial'

    //Show login button
    document.getElementById('login-cell').style.display = 'initial'

    //Hide add spot section (available to users only)
    document.getElementById('add-spot').style.display = 'none'
}

async function initSubmitMap() {
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  
    submitMap = new Map(document.getElementById("submit-spot-map"), {
      zoom: 4,
      center: mapCenter,
      mapId: "c09d32cdb6318bac",
      fullscreenControl: false,
      streetViewControl: false,
    });
    
    const info = new InfoWindow()

    const marker = new AdvancedMarkerElement({
      map: submitMap,
      position: mapCenter,
      title: "Drag this marker to your spot!",
      gmpDraggable:true
    });
  
    marker.addListener("dragend", (event) => {
        const position = marker.position;
    
        info.close();
        info.setContent(
          `Pin dropped at: ${position.lat}, ${position.lng}`
        );
        info.open(marker.map, marker);
        newSpotLocation = position
      });

    console.log('Submit Map initialized',submitMap)
}

//Switches site theme (light/dark)
function changeTheme(){
    var state = document.body.getAttribute('data-bs-theme')
    console.log(state)

    if(state === 'dark')
        document.body.setAttribute('data-bs-theme','light')
    else
        document.body.setAttribute('data-bs-theme','dark')
}

function submitScreening(){
    if(newSpotLocation != undefined)
        addSpot()
    else
        document.getElementById('submit-message').innerText = 'Move the marker to your spot before submitting'
}
  
//Attach listener callbacks to submit buttons
document.getElementById('spot-submit').addEventListener('click',submitScreening)
document.getElementById('login-submit').addEventListener('click',logIn)
document.getElementById('signup-submit').addEventListener('click',signUp)
document.getElementById('logout').addEventListener('click',logOut)
document.getElementById('outer-add-spot-button').addEventListener('click',initSubmitMap)
document.getElementById('category-sort').addEventListener('change',loadSortedSpots)
document.getElementById('sort-reset').addEventListener('click',loadSpots)

//Call function to intitialize the map
initMap()

//Load list of spots from database and create list and add markers to map
loadSpots()

//TESTING BYPASS LOGIN REMOVE
loggedIn('admin',false,true)