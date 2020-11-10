/**
 * IDEES
 * 
 * séparer fichiers : map.js, iss_movement (pas vraiment ça mais t'as l'idée), init.js?, etc
 * 
 * promises pour attendre le résultat de la requête avant de faire le reste
 * 
 * Laisser le premier marker
 * juste cacher les marker précédents et les afficher quand on passe la souris sur la position
 * 
 * afficher l'heure également, genre pour montrer la vitesse
 * 
 * drawline et tout se font toujours
 * juste le setview qui bouge pas
 * checkbox.setclickable(false)
 * 
 * */

var Lat;
var Long;
var oldLatlng;
var latlngsArray = [];

var marker;
var layerGroup = L.layerGroup();

var photo = false;

var current_zoom = 10;

// Init function
function init() {
    getValue();
    // adapte la taille de la carte à la taille de l'écran
    var height = window.innerHeight;
    var width = window.innerWidth;
    //console.log($('#content').outerHeight());
    var map_height = height-$('#content').outerHeight()/* +$('#info_speech').outerHeight() */-16;
    $('#map').css('height', map_height);
    
/*     var info_X = width/2-$('#info_speech').outerWidth()/2;
    info_X = parseInt(info_X) + "px";
    console.log("info_X = " + info_X);
    
    var info_Y = height/2-$('#content').outerHeight()/2;
    info_Y = parseInt(info_Y) + "px";
    console.log("info_Y = " +info_Y);
    $('#info_speech').css('top',info_Y);
    $('#info_speech').css('right',info_X); */
    

    init_map()

    //$('info_speech').css();

    // Mettre le truc de rafraichissement de la fonction ici comme ça ça se lance direct
    // et lancer une première fois, ça marcherait


    while (Lat === null) {
        if (Lat === null) {
            getValue();
        } else {
            console.log(Lat);
            var latlng = L.latLng(Lat,Long);
            console.log(latlng);
            map.setView(latlng,current_zoom);
        
            // Ajoutez un marker à la posi.on récupérée (créez une icône personnalisée de votre choix)
            addmarker(latlng)
        
            // Ajoutez également quelque part la la.tude/longitude en mode texte
            showLatLng();
        }
    }
        // La position du marker doit être mise à jour, le texte latitude/longitude également
    window.setInterval("gui()","3000");  

    //window.setInterval("gui()","10000");  
    
}

window.onload = init();



// Map Management
// create and initiate map
var map;

function init_map() {
    map = L.map('map').setView([43, 4], current_zoom);

    // La clef d'api mapbox sert à accéder à l'affichage de la carte, ainsi qu'aux calculs d'itinéraires
    var mapboxToken = 'pk.eyJ1Ijoic21lcm1ldCIsImEiOiJjaXRwamcwc3UwMDBiMm5xb21yMWdra25yIn0.vF2GPPTa0bDqjJmJZpIl7g'
    // Génération du fond de carte mapbox via leaflet
    var mapbox_tilelayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        minZoom: 2,
        id: 'mapbox/satellite-v9',
        maxZoom: 13,
        zoom: 10,
        accessToken: mapboxToken
    });
    
    mapbox_tilelayer.addTo(map);

    layerGroup.addTo(map);
}

// Get and returns value of current iss location
function getValue() {
    //console.log("Latitude : "+Lat);
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

                //console.log("Lat : "+Lat+", Long : "+Long);
            }
        }
    });
    
    //console.log(typeof(Lat));
    return Lat,Long
}

//http://www.geonames.org/export/web-services.html#findNearbyPlaceName
// Get and returns value of current iss location
function get_text(url,name) {
    //console.log(Lat);
    var response_name

    
    console.log(name);
    return name
    
}


/**
 * gui = graphical user interface
 * 
 * cette fonction change de la carte en fonction de la valeur récupérée 
 */

function gui() {
    // •Empêchez le comportement par défaut (envoi des données au serveur)

    // regarder promises pour faire attendre la réponse au reste de la fonction
    
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


    if (photo == false) {
        //console.log(oldLatlng);

        // Ajoutez également quelque part la latitude/longitude en mode texte
        showLatLng();

        /* Ajoutez également un contrôle permettant de mettre à jour la position de la carte automatiquement. 
        Par exemple: case cochée, la carte suit la positon de l’ISS; case non cochée, le déplacement est libre */
        if (checkbox == true) {
            map.setView(latlng, current_zoom);
        }

    } else {
        
    }

    getValue();
    
}




/* Ajoutez également un contrôle permettant de me@re à jour la position de la carte automa.quement. 
Par exemple: case cochée, la carte suit la position de l’ISS case non cochée, le déplacement est libre */
var checkbox = true;

function checkbox_click() {
    
    checkbox = !checkbox;
    console.log("checkbox.value = "+checkbox);
}




/** Ensuite, créez un formulaire contenant:
 * •3 boutons radio correspondants à des niveaux de zoom différents
 * Par exemple: «smartphone», «réflex» et «téléobjectif», respectivement niveau de zoom 7, 10 et 13
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
*/
function form_validation(event) {

    var inf_speech_dialog = $('#info_speech')
    
    // •Empêchez le comportement par défaut (envoi des données au serveur)
    event.preventDefault();
    photo = true;
    //console.log("photo = " + photo);

    
    inf_speech_dialog.empty();

    var text_url = "http://api.geonames.org/findNearbyPlaceNameJSON?lat="+oldLatlng.lat+"&lng="+oldLatlng.lng+"&username=iamvdo";
    //console.log(text_url);
    var p = '<p id="char_left">You have 144 characters left</p>';
    var name;
    var population;
    var countryName;
    var paragraph = "<textarea name='infos' id='textarea_toname'></textarea>";
    inf_speech_dialog.append(p);
    inf_speech_dialog.append(paragraph);
    //var paragraph = "<p id='p_toname'>Coordonnées :<br>Lat : " + oldLatlng.lat + ", Long : " + oldLatlng.lng +"</br></p>";
    //$("#info_speech").append(paragraph);
    $.ajax({
        type: 'GET',
        dataType: 'jsonp',
        url: text_url,
        async: false,
        crossDomain: true,
        complete: function (data) {
            if (data.readyState === 4 && data.status === 200) {
                var reponse = data.responseJSON;
                console.log(reponse.geonames.length);
                if(reponse.geonames.length != 0) {
                    name = reponse.geonames[0].name;
                    countryName = reponse.geonames[0].countryName;
                }
                //console.log(name);

                // if name === null alors on affiche pas le nom du lieu évidemment
                if (name !==null && typeof(name) !== 'undefined') {
                    $('#textarea_toname').val("Bonjour "+name+", "+countryName+" !\nCoordonnées :\nLat : " + oldLatlng.lat + ", Long : " + oldLatlng.lng);
                    
                } else {
                    $('#textarea_toname').val("Coordonnées :\nLat : " + oldLatlng.lat + ", Long : " + oldLatlng.lng);
                }

            
                // Mise à jour du textArea
                text_area_MAJ_function();
            
                $('#textarea_toname').keyup(function(){
                    text_area_MAJ_function()
            })
        }
    }
    });



    /* •Création de la photo: pour cela, nous allons utiliser un service de carte statique, par exemple celui de Mapbox: voir cette URL pour en comprendre le fonctionnement: https://docs.mapbox.com/playground/static/
        Générez donc la bonne URL 
        -latitude, 
        -longitude de l’ISS
        -zoom souhaité par l’utilisateur!
        -une orientation aléatoire (entre 0 et 360°) ce qui dans notre cas peut rajouter un coté véridique à notre prise de vue
        Utilisez cette URL comme src d’une image HTML ou en image d’arrière-plan CSS  
    */
    var img_size = "450x300";
    var mapbox_image_basemap = "satellite-v9"
/*     console.log("mapbox_image_basemap : "+ mapbox_image_basemap);
    console.log("oldLat : "+ oldLatlng.lat +", oldLng : "+ oldLatlng.lng);
    console.log("current_zoom : "+current_zoom);
    console.log("img_size : " + img_size); */
    var mapbox_key = "pk.eyJ1Ijoic21lcm1ldCIsImEiOiJjaXRwamcwc3UwMDBiMm5xb21yMWdra25yIn0.vF2GPPTa0bDqjJmJZpIl7g"; //celle de vincent
    var img = create_image("https://api.mapbox.com/styles/v1/mapbox/"+mapbox_image_basemap+"/static/"+ oldLatlng.lng +","+ oldLatlng.lat +","+current_zoom+"/"+img_size+"?access_token="+mapbox_key);
    inf_speech_dialog.append(img);

    var option1,option2 = append_options();
    inf_speech_dialog.append(option1);
    console.log(option1);
    inf_speech_dialog.append(option2);

    inf_speech_dialog.css('opacity',1);
    inf_speech_dialog.show();

    /**
     * ajouter un marker à l'endroit de la photo
     * avec un bouton
     * grace auquel tu peux tweeter à nouveau la photo
     */

    // on desactive les boutons pour valider le formulaire et le verouillage de la vue
    $('#validate_button').prop("disabled", true);
    $('#checkbox_input').attr("checked", false);
    $('#checkbox_input').prop("disabled", true);
    
}

function text_area_MAJ_function() {
    var max = 144;
    //console.log($('#textarea_toname'));
    var textChar = $('#textarea_toname').val().length;
    var charLeft = max - textChar;
    console.log(charLeft);
    $('#char_left').text('You have ' + charLeft + ' characters left');
    
    if (charLeft <= 0) {
        $('#textarea_toname').attr('disabled', true);
    } else {
        $('#textarea_toname').attr('disabled', false);
    }
}

/**
 * génère l'élément image qui sera ensuite ajouté  
 * @param {string} img_src source de l'image, c'est la photo tirée de l'url
 */
function create_image(img_src) {
    
    var img = '<img id="img_toname" src='+img_src+'>'; // ça ça marche 
    //console.log("img_src = " + img_src);

    return img
}

// •Création du texte: pour cela, nous allons encore une fois utiliser un service, celui de geonames nommé findNearbyPlaceNameJSON, ici: http://www.geonames.org/export/web-services.html#findNearbyPlaceName 

function generate_text(url) {


}

function append_options() {
    var option1= $('<button id="close_button" onclick="photo_false()">Fermer</button>');
    var option2= $('<button id="tweet_button" onclick="photo_false()">Tweet</button>');
    console.log(option1);

    return option1,option2;
}




// bouton pour fermet la 
function photo_false() {
    photo = false;
    console.log("photo = " + photo);
    // on cache la boite de dialogue
    $("#info_speech").hide();
    // on réactive les boutons pour valider le formulaire et le verouillage de la vue
    $('#validate_button').prop("disabled", false);
    $('#checkbox_input').attr("checked", true);
    $('#checkbox_input').prop("disabled", false);
}

// Une ligne entre le point précédent et le nouveau point doit se créer afin de voir le déplacement de l’ISS
function drawline(latlng) {
    
    if (oldLatlng != null) {
        latlngsArray.push(oldLatlng);
        latlngsArray.push(latlng);
        var polyline = L.polyline(latlngsArray, {color: '#FFE000'}).addTo(map);
    }
}

// Ajoutez un marker à la position récupérée (créez une icône personnalisée de votre choix)
function addmarker(latlng) {
    marker = L.marker(latlng);
    layerGroup.addLayer(marker);
    var popup = L.popup()
        .setContent('ISS Position<br>Latitude : ' + Lat + ', Longitude : ' + Long)
    marker.bindPopup(popup);
}

// Ajoutez également quelque part la la.tude/longitude en mode texte
function showLatLng() {
    var paragraph = document.getElementById("coordinates");
    paragraph.innerHTML = "<p>Coordonnées :<br>Lat : " + Lat + ", Long : " + Long+"</p>";

/*     $("#coordinates").empty();
    var paragraph = "<p>Coordonnées :<br>Lat : " + Lat + ", Long : " + Long+"</p>";
    $("#coordinates").append(paragraph); */


    /* var paragraph = document.getElementById("coordinates");
    var text = document.createTextNode("Lat : " + Lat + ", Lng : " + Long);
    paragraph.appendChild(text); */
}

function close_info_speech() {
    $('#info_speech').hide();
}



/**
 * Dans map_init()
 * 
 */

    /*
    var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        minZoom: 7,
        maxZoom: 19,
    });
    
    Esri_WorldImagery.addTo(map); */


/*     map = L.map('map').setView([-33.87, 150.77], current_zoom);
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
    }); */