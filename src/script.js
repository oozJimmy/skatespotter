// Initialize map variable
var map;

//Add the Google map window
async function initMap() {
    //Import map and marker 
    const { Map } =  await google.maps.importLibrary("maps");

    // Position objects
    const mapCenter = { lat: 42.098716, lng: -75.912528 };

    // The map, centered at Court and state, downtown Binghamton
    map = new Map(document.getElementById("map"), {
    zoom: 8,
    center: mapCenter,
    mapId: "aeb05cd88240c11c",
    });

    console.log('Map init function called',map)
}

async function addMarker(latitude,longitude,name){
    const { AdvancedMarkerElement } =  await google.maps.importLibrary("marker");

    const spotMarker = new AdvancedMarkerElement({
        map: map,
        position: {lat: parseFloat(latitude),lng: parseFloat(longitude)},
        title: name,
        });
    //console.log('addMarker function called',spotMarker)
}

//Add spot to the db and map
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

//Gets list of spots from database calls displaySpotJSON
function loadSpots(){
    //Loads the spot list 
    fetch('http://localhost:5000/spotlist',{
    method:'GET'})
    .then((response) => response.json())
    .then((json) => displaySpotJSON(json))
    .catch((error)=>console.error(error))
}

//Displays HTML list given obj list of skate spots
function displaySpotJSON(obj){
    console.log(`from parseSpotJSON:`,obj)
    var append = '<h4>List of all spots</h4><ol>'
    for(var i = 0; i<obj.length;i++){
        append += `<li>${obj[i].name}<br>Latitude:${obj[i].latitude}<br>Longitude:${obj[i].longitude}</li>`

        //Add spots to map
        addMarker(obj[i].latitude,obj[i].longitude,obj[i].name)
    }
    append += '</ol>'
    document.getElementById('spotlist').innerHTML = append
}

//Logs user in
async function logIn(){
    var username = document.getElementById('usr').value
    var password = document.getElementById('pwd').value

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
    if(response.status === 202)
        loggedIn(username)
}

//Signs a new user up
async function signUp(){
    var username = document.getElementById('newusr').value
    var password = document.getElementById('newpwd').value

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
    if(response.status === 201)
        loggedIn(username,true)
}

//Makes UI changes for logging in - called upon successful signup/login
function loggedIn(username, newUser = false){

    console.log('loggedIn called')
    console.log(username, newUser)

    //Hide signup/login modal
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
}

//Attach listener callbacks to submit buttons
document.getElementById('spot-submit').addEventListener('click',addSpot)
document.getElementById('login-submit').addEventListener('click',logIn)
document.getElementById('signup-submit').addEventListener('click',signUp)
document.getElementById('logout').addEventListener('click',logOut)

//Call logout to set UI elements
//logOut()

//Call function to intitialize the map
initMap()

//Load list of spots from database and create list and add markers to map
loadSpots()
