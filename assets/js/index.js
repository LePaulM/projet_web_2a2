/**
 * IDEES
 * 
 * Laisser le premier marker
 * juste cacher les marker précédents et les afficher quand on passe la souris sur la position
 * 
 * afficher l'heure également, genre pour montrer la vitesse
 * 
 * */

var Lat;
var Long;
var oldLatlng;
var latlngsArray = [];

var marker;
var layerGroup = L.layerGroup();

var photo = false;

var current_zoom = 7;

// Init function
function init() {
    getValue();
    // adapte la taille de la carte à la taille de l'écran
    var height = window.innerHeight;
    var width = window.innerWidth;
    console.log($('#content').outerHeight());
    var map_height = height-$('#content').outerHeight()+$('#info_speech').outerHeight()-16;
    $('#map').css('height', map_height);
    
/*     var info_X = width/2-$('#info_speech').outerWidth()/2;
    info_X = parseInt(info_X) + "px";
    console.log("info_X = " + info_X);
    
    var info_Y = height/2-$('#content').outerHeight()/2;
    info_Y = parseInt(info_Y) + "px";
    console.log("info_Y = " +info_Y);
    $('#info_speech').css('top',info_Y);
    $('#info_speech').css('right',info_X); */
    

    initiate_map()

    //$('info_speech').css();

    while (Lat === null) {
        if (Lat === null) {
            getValue();
        } else {
            console.log(Lat);
            var latlng = L.latLng(Lat,Long);
            console.log(latlng);
            map.setView(latlng);
        
            // Ajoutez un marker à la posi.on récupérée (créez une icône personnalisée de votre choix)
            addmarker(latlng)
        
            // Ajoutez également quelque part la la.tude/longitude en mode texte
            showLatLng();
        }
    }
    
}

window.onload = init();



// Map Management
// create and initiate map
var map;

function initiate_map() {
 //    map = L.map('map').setView([43, 4], current_zoom);

/*     // La clef d'api mapbox sert à accéder à l'affichage de la carte, ainsi qu'aux calculs d'itinéraires
    var mapboxToken = 'pk.eyJ1Ijoic21lcm1ldCIsImEiOiJjaXRwamcwc3UwMDBiMm5xb21yMWdra25yIn0.vF2GPPTa0bDqjJmJZpIl7g'
    // Génération du fond de carte mapbox via leaflet
    var mapbos_tilelayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        minZoom: 7,
        id: 'mapbox/satellite-v9',
        maxZoom: 19,
         zoom: 10,
        accessToken: mapboxToken
    }) */
    
    var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        minZoom: 7,
        maxZoom: 19,
    });
    
/*     Esri_WorldImagery.addTo(map); */


    map = L.map('map').setView([-33.87, 150.77], 10);
    var layer = L.esri.basemapLayer('Imagery').addTo(map);
    var layerLabels;
  
    function setBasemap (basemap) {
      if (layer) {
        map.removeLayer(layer);
      }
  
      layer = L.esri.basemapLayer(basemap);
  
      map.addLayer(layer);
  
      if (layerLabels) {
        map.removeLayer(layerLabels);
      }
  
      if (
        basemap === 'ShadedRelief' ||
        basemap === 'Oceans' ||
        basemap === 'Gray' ||
        basemap === 'DarkGray' ||
        basemap === 'Terrain'
      ) {
        $('#teleobjectif_label').hide();
        if (current_zoom === 7) {
            $('#teleobjectif_radio_reflex').click();
            //map.setZoom(10);
        }
        
        
        Esri_WorldImagery.removeFrom(map);
        layerLabels = L.esri.basemapLayer(basemap + 'Labels');
        map.addLayer(layerLabels);
      } else if (basemap.includes('Imagery')) {
        $('#teleobjectif_label').show();
        Esri_WorldImagery.addTo(map);
      } else {
        $('#teleobjectif_label').show();
      }
    }
  
    document
      .querySelector('#basemaps')
      .addEventListener('change', function (e) {
        var basemap = e.target.value;
        setBasemap(basemap);
      });
 
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

                //console.log(Lat,Long);
            }
        }
    });
    
    //console.log(typeof(Lat));
    return Lat,Long
}

function gui() {
    // •Empêchez le comportement par défaut (envoi des données au serveur)
    if (photo == false) {
        //console.log(oldLatlng);
        getValue();
        var latlng = L.latLng(Lat,Long);
        //console.log(latlng);

        // Ajoutez un marker à la position récupérée (créez une icône personnalisée de votre choix)
        //console.log(layerGroup.hasLayer(marker));
        if (layerGroup.hasLayer(marker) === true) {
            layerGroup.removeLayer(marker);
        }
        
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

    window.setInterval("gui()","5000");  

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
var r= $('<button onclick="photo_false()" style="width : 200px;border : solid;padding : 10px;border-radius: 10px;background-color:#06389B;border-color: #1A1D22;color : wheat;">Fermer</Button>');
function form_validation(event) {
    // •Empêchez le comportement par défaut (envoi des données au serveur)
    event.preventDefault();
    photo = true;
    console.log("photo = " + photo);
    img_size = "500x400";
    img = $("<img src=https://api.mapbox.com/styles/v1/mapbox/light-v10/static/"+Lat+","+Long+","+current_zoom+"/"+img_size+"?access_token=pk.eyJ1IjoibGVwb2xsdXgiLCJhIjoiY2s5ZTR1bnVkMDF0bzNsbXczdDNhdnJ6YyJ9.GFqQztJamr3JyKGlaWt6dA alt='Map of the Edmund Pettus Bridge in Selma, Alabama.'></img>");
    $("result").append(img);
    
    $("form").append(r);
}

function photo_false() {
    photo = false;
    console.log("photo = " + photo);
    r.remove();
}



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

function close_info_speech() {
    $('#info_speech').hide();
}