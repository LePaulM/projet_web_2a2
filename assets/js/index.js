/**
 * IDEES
 * 
 * afficher l'heure également, genre pour montrer la vitesse
 * 
 * drawline et tout se font toujours
 * juste le setview qui bouge pas
 * checkbox.setclickable(false)
 *     
 * ajouter un marker à l'endroit de la photo
 * avec un bouton
 * grace auquel tu peux tweeter à nouveau la photo
 * 
 * */



// passer dans variables de gui pour gérer l'affichage des marker 
// retour de init_map()
var map;
var marker;
var layerGroup = L.layerGroup();


//passer dans variables de gui, 
//initialisé dans init()
var current_zoom = 10;

var photo = false;

// Init function
window.onload = function() {
    var Lat;
    var Long;
    var oldLatlng;

    // récupération de la position de l'ISS au chargement de la page
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
                var latlng = L.latLng(Lat,Long);
                //console.log("Lat : "+Lat+", Long : "+Long);
                gui(latlng,oldLatlng);
            }
        }
    });

    //console.log(Lat);
    // adapte la taille de la carte à la taille de l'écran
    var height = window.innerHeight;
    var width = window.innerWidth;
    //console.log($('#content').outerHeight());
    var map_height = height-$('#content').outerHeight()-16;

    $('#map').css('height', map_height);

    //adapter la position de 'info_speech' et 'form' en fonction de l'écran (responsive)
    if ($('#map').width() < 1000) {
        console.log('Responsive Activé !');

        var styleObject = $('#form').prop('style'); 

        styleObject.removeProperty('top');



        $('#form').css({
            'z-index': '1', 
            position: 'absolute', 
            width : $('#map').width()-16,
            margin : '5',

            'background-color': 'white',
            opacity : '0.85',

            border :'solid',
            'border-color': '#AAB8C2',
            'border-radius': '10px',
            'border-width': '1px',

            'font-size' : '30px'
        });


        /*  form style base :

            z-index: 1;
            position: absolute;
            top: 0;
            right: 0;
            width : 350px;
            

            background-color: white;
            opacity : 1;

            border :solid;
            border-color: #AAB8C2;
            border-radius: 10px;
            border-width: 1px;
            */

        $('#info_speech').css({
            'z-index': '1', 
            position: 'absolute', 
            width : $('#map').width()-16,
            margin : '5',
            top : height/2,

            'background-color': 'white',
            opacity : '0.85',

            border :'solid',
            'border-color': '#AAB8C2',
            'border-radius': '10px',
            'border-width': '1px',

            'font-size' : '30px'
        });
        /*      info_speech style base :

            z-index: 1;
            position: absolute;

            width : 500px;
            margin: 10px;
            border-radius: 10px;

            box-shadow: 0 0 3px white;
            background-color: white;
            opacity : 1;

            border :solid;
            border-radius: 10px;
            border-width: 1px;
            border-color: #AAB8C2;

            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-auto-rows: minmax(50px, auto);
            align-items: center;
        */

        $('button').css({
            width : '250px',
            height : '65px',
            padding : '10px',
            margin: '10px',
            
            border : 'solid',
            'border-radius': '50em',
            'border-color': '#1DA1F2',

            'background-color':'#1DA1F2',
            color : 'white',

            'font-weight': 'bold',
            'font-size': '30px'
        });
        /* button style base :
            width : 200px;

            padding : 10px;
            margin: 10px;
            
            border : solid;
            border-radius: 50em;
            border-color: #1DA1F2;

            background-color:#1DA1F2;
            color : white;

            font-weight: bold;
         */
        
        


    }
 
    //initialisation de la map
    map_init();


    // Mettre le truc de rafraichissement de la fonction ici comme ça ça se lance direct
    // et lancer une première fois, ça marcherait

        // La position du marker doit être mise à jour, le texte latitude/longitude également
    window.setInterval(function() {
        if (Lat !== null) {
            //console.log(Lat);
            var oldLat = Lat;
            var oldLng = Long;
            oldLatlng = L.latLng(oldLat,oldLng);
            //console.log(oldLatlng);      
        }
    
    // •Empêchez le comportement par défaut (envoi des données au serveur)
    // j'aurais pu mettre le if (photo == false) ici mais je préfère garder le mouvement de l'ISS visible
        // récupération de la position de l'ISS
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
                    var latlng = L.latLng(Lat,Long);
                    //console.log("Lat : "+Lat+", Long : "+Long);
                    // on éxécute la fontcion gui quand on a récupéré la position latlng
                    // oldlatlng servira à tracer la ligne 
                    gui(latlng,oldLatlng);
                }
            }
        });
    // on refraichit la fonction toutes les 5 secondes
    },"5000");   
    
}



// Map Management
// create and initiate map mapbox://styles/lepollux/ckhchpfbj0b8u1aps50vdx668
function map_init() {
    map = L.map('map').setView([43, 4], current_zoom);

    // La clef d'api mapbox sert à accéder à l'affichage de la carte, ainsi qu'aux calculs d'itinéraires
    var mapboxToken = 'pk.eyJ1IjoiaWFtdmRvIiwiYSI6IkI1NGhfYXMifQ.2FD2Px_Fh2gAZCFTxdrL7g'
    // Génération du fond de carte mapbox via leaflet
    var mapbox_tilelayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        minZoom: 2,
        id: 'mapbox/satellite-v9',
        maxZoom: 13,
        zoom: 10,
        accessToken: mapboxToken
    });
	
	var CartoDB_VoyagerOnlyLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    });
    
    mapbox_tilelayer.addTo(map);
	CartoDB_VoyagerOnlyLabels.addTo(map);
    L.control.scale().addTo(map);
    layerGroup.addTo(map);
}

/**
 * gui = graphical user interface
 * 
 * cette fonction change la carte en fonction de la valeur de Lat et Long 
 * 
 */
/**
 * gui = graphical user interface
 * 
 * cette fonction change la carte en fonction de la valeur de Lat et Long 
 * 
 * @param {*} Lat 
 * @param {*} Long coordonnée longitude
 * @param {*} oldLatlng ancienne coordonnée, sert à tracer la ligne entre ce point et le suivant
 */
function gui(latlng,oldLatlng) {
    // •Empêchez le comportement par défaut (envoi des données au serveur)
    // j'aurais pu mettre le if (photo == false) ici mais je préfère garder le mouvement de l'ISS visible
    
    //console.log(latlng);

    // Ajoutez un marker à la position récupérée (créez une icône personnalisée de votre choix)
    //console.log(layerGroup.hasLayer(marker));
    if (layerGroup.hasLayer(marker) === true) {
        layerGroup.removeLayer(marker);
    }

    // Ajoutez un marker à la position récupérée (créez une icône personnalisée de votre choix)
    var satellite_icon = L.icon({
        iconUrl: 'assets/images/satellite.png',
    
        iconSize:     [75, 60], // size of the icon
        iconAnchor:   [37.5, 30], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
    });
    marker = L.marker(latlng, {icon: satellite_icon});
    layerGroup.addLayer(marker);
    var popup = L.popup()
        .setContent('ISS Position<br>Latitude : ' + latlng.lat + ', Longitude : ' + latlng.lng)
    marker.bindPopup(popup);

    // Une ligne entre le point précédent et le nouveau point doit se créer afin de voir le déplacement de l’ISS
    if (oldLatlng != null) {
        var latlngsArray = [];
        latlngsArray.push(oldLatlng);
        latlngsArray.push(latlng);
        var polyline = L.polyline(latlngsArray, {color: '#FFE000'}).addTo(map);
    }

    if (photo == false) {
        //console.log(latlng);

        // Ajoutez également quelque part la latitude/longitude en mode texte
        showLatLng(latlng);

        /* Ajoutez également un contrôle permettant de mettre à jour la position de la carte automatiquement. 
        Par exemple: case cochée, la carte suit la positon de l’ISS; case non cochée, le déplacement est libre */
        if (checkbox == true) {
            map.setView(latlng, current_zoom);
        }

    } else {
        
    }

}

// Ajoutez également quelque part la la.tude/longitude en mode texte
function showLatLng(latlng) {
    var paragraph = document.getElementById("coordinates");
    paragraph.innerHTML = "<p>Coordonnées :<br>Lat : " + latlng.lat + ", Long : " + latlng.lng+"</p>";
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
    map.setZoom(new_level);
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

prends une phot à la position de l'ISS au moment du clic, pas à l'endroit du marker au moment du clic
*/
function form_validation(event) {
    // •Empêchez le comportement par défaut (envoi des données au serveur)
    event.preventDefault();
    photo = true;
    //console.log("photo = " + photo);

    var inf_speech_dialog = $('#info_speech')
    var Lat;
    var Long;

    inf_speech_dialog.empty();

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

                // console.log("Lat : "+Lat+", Long : "+Long);
                var latlng = L.latLng(Lat,Long);

                // •Création du texte: pour cela, nous allons encore une fois utiliser un service, celui de geonames nommé findNearbyPlaceNameJSON, ici: http://www.geonames.org/export/web-services.html#findNearbyPlaceName 
                var text_url = "http://api.geonames.org/findNearbyPlaceNameJSON?lat="+latlng.lat+"&lng="+latlng.lng+"&username=iamvdo";
                //console.log(text_url);
                var p = '<p id="char_left">You have 144 characters left</p>';
                var name;
                var population;
                var countryName;
                var paragraph = "<textarea name='infos' id='textarea_toname' maxlength='144'></textarea>";
                inf_speech_dialog.append(p);
                inf_speech_dialog.append(paragraph);

                $.ajax({
                    type: 'GET',
                    dataType: 'jsonp',
                    url: text_url,
                    async: false,
                    crossDomain: true,
                    complete: function (data) {
                        if (data.readyState === 4 && data.status === 200) {
                            var reponse = data.responseJSON;
                            //console.log(reponse.geonames.length);
                            if(reponse.geonames.length != 0) {
                                name = reponse.geonames[0].name;
                                countryName = reponse.geonames[0].countryName;
                            }
                            console.log("city nearby name : "+name);

                            // ajoute un marker à l'endroit où l'ISS est pendant la photo
                            var satellite_icon = L.icon({
                                iconUrl: 'assets/images/camera.png',
                            
                                iconSize:     [64, 64], // size of the icon
                                iconAnchor:   [32, 32], // point of the icon which will correspond to marker's location
                                popupAnchor:  [0, -16] // point from which the popup should open relative to the iconAnchor
                            });
                            var marker = L.marker([Lat, Long], {icon: satellite_icon});
                            marker.addTo(map);

                            // if name === null alors on affiche pas le nom du lieu évidemment
                            if (name !==null && typeof(name) !== 'undefined') {
                                $('#textarea_toname').val("Hello "+name+", "+countryName+" !\nISS Coordinates :\nLat : " + latlng.lat + ", Long : " + latlng.lng);
                                
                                var popup = L.popup()
                                .setContent("Hello "+name+", "+countryName+" !<br>ISS Coordinates :<br>Lat : " + latlng.lat + ", Long : " + latlng.lng /* +'<br><button>Bouton</button>' */);
                                marker.bindPopup(popup);
                            } else {
                                $('#textarea_toname').val("ISS Coordinates :\nLat : " + latlng.lat + ", Long : " + latlng.lng);
                                
                                var popup = L.popup()
                                .setContent("ISS Coordinates :<br>Lat : " + latlng.lat + ", Long : " + latlng.lng /* +'<br><button>Bouton</button>' */);
                                marker.bindPopup(popup);
                            }
                            
                        
                            // Mise à jour du texte qui dit 'il vous reste X caractères'
                            text_area_MAJ_function();
                        
                            $('#textarea_toname').keydown(function(){
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
                    https://docs.mapbox.com/playground/static/
                */
                var img_size = "450x450";           //en pixels
                var mapbox_image_basemap = "satellite-v9"; /* "styles/lepollux/ckhchpfbj0b8u1aps50vdx668" */
                var bearing = Math.random() * 360;
                var mapbox_key = "pk.eyJ1IjoiaWFtdmRvIiwiYSI6IkI1NGhfYXMifQ.2FD2Px_Fh2gAZCFTxdrL7g"; //celle de vincent
                var img_src = "https://api.mapbox.com/styles/v1/mapbox/"+mapbox_image_basemap+"/static/"+ latlng.lng +","+ latlng.lat +","+current_zoom+","+bearing+"/"+img_size+"?access_token="+mapbox_key;
                var img = '<img id="img_toname" src='+img_src+'>'
                /*     
                console.log("mapbox_image_basemap : "+ mapbox_image_basemap);
                console.log("oldLat : "+ oldLatlng.lat +", oldLng : "+ oldLatlng.lng);
                console.log("current_zoom : "+current_zoom);
                console.log("img_size : " + img_size); 
                console.log("bearing : "+bearing);
                */
                
                inf_speech_dialog.append(img);

                var option1= $('<button id="close_button" onclick="photo_false()">Fermer</button>');
                var option2= $('<button id="tweet_button" onclick="photo_false()">Tweet</button>');
                inf_speech_dialog.append(option1);
                //console.log(option1);
                inf_speech_dialog.append(option2);

                // on gère le côté responsive à la création de ces buttons
                if ($('#map').width() < 1000) {
                    $('#close_button').css({
                        width : '250px',
                        height : '65px',
                        
                        'font-size': '30px'
                    });

                    $('#tweet_button').css({
                        width : '250px',
                        height : '65px',
                        
                        'font-size': '30px'
                    });

                    $('#textarea_toname').css({
   
                        margin: '5px',
                        width: '500px',
                        height: '100px',

                        'border-width' : '2px',
                    });
                }
         

                inf_speech_dialog.css('opacity',1);
                inf_speech_dialog.show();
            }
        }
    });
    
    // on desactive le verouillage de la vue et le bouton pour valider le formulaire 
    $('#validate_button').prop("disabled", true);
    $('#checkbox_input').attr("checked", false);
    $('#checkbox_input').prop("disabled", true);
    
}

/**
 * fonction qui sert à mettre à jour le nombre de caractères restants pour le tweet (144 caractères max)
 */
function text_area_MAJ_function() {
    var max = 144;
    //console.log($('#textarea_toname'));
    var textChar = $('#textarea_toname').val().length;
    var charLeft = max - textChar;
    //console.log(charLeft);
    $('#char_left').text('You have ' + charLeft + ' characters left');
    
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

function close_info_speech() {
    $('#info_speech').hide();
}