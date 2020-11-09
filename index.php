<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Tweet comme Pesquet !</title>
    <link rel="stylesheet" href="index.css"/>
    <!-- Load Leaflet from CDN -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
    integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
    crossorigin=""/>
</head>
<body>
    

    <div id='content'>
        <!-- Map -->
        <div id='map'></div>

        <div id='info_speech'> 
            <h1 id='speech_title'>Bienvenue sur le site "Tweet comme Thomas Pesquet !".</h1><p id='speech_p'>Veuillez patienter pendant que nous récupérons la position de la Station Spatiale Internationale.</p>
            <button id="close_info_speech_button" onclick="close_info_speech()" >Fermer</button>
        </div>
        
        
        <form name='form' id='form'>

            <!-- Niveau de zoom -->
            <div id='radio'>
                <label>Vue :</label><br>
                <label>Smartphone<input type="radio" class='radio' name="form" value="7" onclick="change_zoom(7)" ></label>
                <label>Réflex<input type="radio" class='radio' id='teleobjectif_radio_reflex'  name="form" onclick="change_zoom(10)" value="10" checked></label>
                <label id='teleobjectif_label'>Téléobjectif<input type="radio"  class='radio' name="form" onclick="change_zoom(13)" value="13"></label>
            </div>

<!--             <div id="basemaps-wrapper" class="leaflet-bar">
                <select id="basemaps">
                    <option value="Imagery">Imagery</option>
                    <option value="Streets">Streets</option>
                    <option value="NationalGeographic">National Geographic</option>
                    <option value="Oceans">Oceans</option>
                    <option value="Gray">Gray</option>
                    <option value="DarkGray">Dark Gray</option>
                    <option value="Topographic">Topographic</option>
                    <option value="ImageryClarity">Imagery (Clarity)</option>
                    <option value="ImageryFirefly">Imagery (Firefly)</option>
                    <option value="ShadedRelief">Shaded Relief</option>
                    <option value="Physical">Physical</option>
                </select>
            </div> -->

            <!-- div pour afficher les coordonnées de l'ISS -->
            <div id="coordinates">Coordonnées<br></div>

            <!-- Checkbox. Si true la carte suit l'ISS -->
            <div id='checkbox'>
                <input id='checkbox_input' onclick="checkbox_click()" type="checkbox" checked/>
                <label>Verrouiller vue</label>
            </div>
            <!-- valide comme Pesquet ! -->

            <div id='validate'>
                <button id="validate_button" onclick="form_validation(event)">Tweet comme Pesquet !</button>
                <!-- <label for='submit'></label><input  type="submit" name="submit"  value="Tweet comme Pesquet !"> -->
            </div>
        </form>



        <div></div>
    </div>
<!-- Retrieve a map at -87.0186 longitude, 32.4055 latitude, -->
<!-- zoom 14, bearing 0. Pitch will default to 0. -->
<!-- The map will be 500 pixels wide and 300 pixels high. -->
<!-- <img src="https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-87.0186,32.4055,14/500x400?access_token=pk.eyJ1IjoibGVwb2xsdXgiLCJhIjoiY2s5ZTR1bnVkMDF0bzNsbXczdDNhdnJ6YyJ9.GFqQztJamr3JyKGlaWt6dA" alt="Map of the Edmund Pettus Bridge in Selma, Alabama.">
  -->   
    <div id="result"></div>

    <!-- Scripts -->



        <!-- JQuery -->
        <script src="assets/js/jquery.min.js"></script>
        <script src="assets/js/jquery.poptrox.min.js"></script>
        <!-- Load Leaflet from CDN -->
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
            integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
            crossorigin=""></script>

        <!-- Load Esri Leaflet from CDN -->
        <script src="https://unpkg.com/esri-leaflet@2.5.0/dist/esri-leaflet.js"
            integrity="sha512-ucw7Grpc+iEQZa711gcjgMBnmd9qju1CICsRaryvX7HJklK0pGl/prxKvtHwpgm5ZHdvAil7YPxI1oWPOWK3UQ=="
            crossorigin=""></script>
        <!-- Main JS -->
        <script src="assets/js/index.js"></script>
</body>
</html>