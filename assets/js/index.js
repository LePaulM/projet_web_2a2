/**
 * IDEES
 * 
 * juste cacher les marker précédents et les afficher quand on passe la souris sur la position
 * 
 * afficher l'heure également, genre pour montrer la vitesse
 * 
 * */





var Lat = 0;
var Long = 0;
var oldLatlng;
var latlngsArray = [];

var marker;
var layerGroup = L.layerGroup();

var photo = false;

var retour = false;
var current_zoom = 7;

// Map Management
// create and initiate map
var map;

function initiate_map() {
    map = L.map('map').setView([43, 4], current_zoom);

    // La clef d'api mapbox sert à accéder à l'affichage de la carte, ainsi qu'aux calculs d'itinéraires
    var mapboxToken = 'pk.eyJ1Ijoic21lcm1ldCIsImEiOiJjaXRwamcwc3UwMDBiMm5xb21yMWdra25yIn0.vF2GPPTa0bDqjJmJZpIl7g'
    // Génération du fond de carte mapbox via leaflet
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        maxZoom: 19,
         zoom: 10,
        accessToken: mapboxToken
    }).addTo(map);
    
    layerGroup.addTo(map);
}

// Get and returns value of current iss location
function getValue() {
    console.log(Lat);
    if (Lat !== null) {
        //console.log(Lat);
        var oldLat = Lat;
        var oldLng = Long;
        oldLatlng = L.latLng(oldLat,oldLng);
         //console.log(oldLatlng);      
    }


    $.ajax({
        type: 'GET',
        dataType: 'jsonp',
        url: 'http://api.open-notify.org/iss-now.json',
        async: false,
        crossDomain: true,
        complete: function (data) {
            if (data.readyState === 4 && data.status === 200) {
                Lat = parseFloat(data.responseJSON.iss_position.latitude);
                Long = parseFloat(data.responseJSON.iss_position.longitude);

                retour = true;
                console.log(Lat,Long);
            }
        }
    });
    
    //console.log(typeof(Lat));
    return Lat,Long
}

function gui() {
    if (photo == false) {
        //console.log(oldLatlng);
        getValue();
        var latlng = L.latLng(Lat,Long);
        //console.log(latlng);
        // Ajoutez un marker à la posi.on récupérée (créez une icône personnalisée de votre choix)
        layerGroup.removeLayer(marker);
        addmarker(latlng)

        // Une ligne entre le point précédent et le nouveau point doit se créer afin de voir le déplacement de l’ISS
        drawline(latlng);

        // Ajoutez également quelque part la la.tude/longitude en mode texte
        showLatLng();

        /* Ajoutez également un contrôle perme@ant de me@re à jour la posi.on de la carte automa.quement. 
        Par exemple:ocase cochée, la carte suit la posi.on de l’ISSocase non cochée, le déplacement est libre */
        if (checkbox == true) {
            map.setView(latlng, current_zoom);
        }

    } else {
        
    }
    
}

// La posi.on du marker doit être mise à jour, le texte latitude/longitude également

    window.setInterval("gui()","3000");  

//window.setInterval("gui()","10000");  


/* Ajoutez également un contrôle permettant de me@re à jour la position de la carte automa.quement. 
Par exemple: case cochée, la carte suit la position de l’ISS case non cochée, le déplacement est libre */
var checkbox = true;

function checkbox_click() {
    
    checkbox = !checkbox;
    console.log(checkbox);
}




/* Ensuite, créez un formulaire contenant:
•3 boutons radio correspondants à des niveaux de zoom différentsPar exemple: «smartphone», «réflex» et «téléobjectif», respectivement niveau de zoom 7, 10 et 13
*/
function change_zoom(new_level) {
    var latlng = L.latLng(Lat,Long);
    map.setView(latlng,new_level);
    current_zoom = new_level;
}
/*
•Un bouton de validation «Tweet comme Pesquet»


Lors de la validation de ce formulaire:

•Empêchez le comportement par défaut (envoi des données au serveur)
•Création de la photo: pour cela, nous allons utiliser un service de carte statique, par exemple celui de Mapbox: voir cette URL pour en comprendre le fonctionnement: https://docs.mapbox.com/playground/static/
Générez donc la bonne URL 
-latitude, 
-longitude de l’ISS
-zoom souhaité par l’utilisateur!
-une orientation aléatoire (entre 0 et 360°) ce qui dans notre cas peut rajouter un coté véridique à notre prise de vue
Utilisez cette URL comme src d’une image HTML ou en image d’arrière-plan CSS 
Cette API a toutefois besoin d’une clé, il faut donc s’inscrire (gratuit) sur le site. 
Ou utilisez celle de Vincent pk.eyJ1IjoiaWFtdmRvIiwiYSI6IkI1NGhfYXMifQ.2FD2Px_Fh2gAZCFTxdrL7g
•Création du texte: pour cela, nous allons encore une fois utiliser un service, celui de geonames nommé findNearbyPlaceNameJSON, ici: http://www.geonames.org/export/web-services.html#findNearbyPlaceName 
*/
// pourquoi est-ce que ça ça valide le formulaire ?
function form_validation() {
    photo = true;
    img_size = "500x400";
    img_src = "https://api.mapbox.com/styles/v1/mapbox/light-v10/static/" + Lat + ","+ Long + ","+current_zoom+"/"+img_size+"?access_token=pk.eyJ1IjoibGVwb2xsdXgiLCJhIjoiY2s5ZTR1bnVkMDF0bzNsbXczdDNhdnJ6YyJ9.GFqQztJamr3JyKGlaWt6dA"
    $('result').append('<img src=img_src alt="Map of the Edmund Pettus Bridge in Selma, Alabama."></img>');
}



// Init function
function init() {
    var height = window.innerHeight;
    console.log($('#content').outerHeight());
    map_height = height-$('#content').outerHeight()-16;
    $('#map').css('height', map_height);

    initiate_map()

    getValue();

    console.log(Lat);
    var latlng = L.latLng(Lat,Long);
    console.log(latlng);
    map.setView(latlng);

    // Ajoutez un marker à la posi.on récupérée (créez une icône personnalisée de votre choix)
    addmarker(latlng)

    // Ajoutez également quelque part la la.tude/longitude en mode texte
    showLatLng();

    // alert('Bienvenue sur le site "Tweet comme Thomas Pesquet !" blablabla') peut-être une bonne idée mais pas une bonne piste pas une bonne piste
}
window.onload = init();

// Une ligne entre le point précédent et le nouveau point doit se créer afin de voir le déplacement de l’ISS
function drawline(latlng) {
    
    if (oldLatlng != null) {
        latlngsArray.push(oldLatlng);
        latlngsArray.push(latlng);
        var polyline = L.polyline(latlngsArray, {color: 'red'}).addTo(map);
    }
}

// Ajoutez un marker à la position récupérée (créez une icône personnalisée de votre choix)
function addmarker(latlng) {
    marker = L.marker(latlng);
    layerGroup.addLayer(marker);
    var popup = L.popup()
        .setContent('<p>Hello world!<br />This is a nice popup.</p>')
    marker.bindPopup('ISS Position<br>Latitude : ' + Lat + ', Longitude : ' + Long);
}

// Ajoutez également quelque part la la.tude/longitude en mode texte
function showLatLng() {
    
    var paragraph = document.getElementById("coordinates");
    paragraph.innerHTML = "<p>Coordonnées :<br>Lat : " + Lat + ", Long : " + Long+"</p>";


    /* var paragraph = document.getElementById("coordinates");
    var text = document.createTextNode("Lat : " + Lat + ", Lng : " + Long);
    paragraph.appendChild(text); */
}
