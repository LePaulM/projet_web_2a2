<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Tweet comme Pesquet !</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   		integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
           crossorigin=""/>
    <link rel="stylesheet" href="index.css"/>
</head>
<body>
    

    <div id='content'>
        <!-- Map -->
        <div id='map'></div>

        
        <form name='form' id='form'>

            <!-- Niveau de zoom -->
            <div id='radio'>
                <label>Vue :</label><br>
                <label>Smartphone<input type="radio" class='radio' name="form" value="7" onclick="change_zoom(7)" checked></label>
                <label>Réflex<input type="radio" class='radio' name="form" onclick="change_zoom(10)" value="10"></label>
                <label>Téléobjectif<input type="radio" class='radio' name="form" onclick="change_zoom(13)" value="13"></label>
            </div>
            <!-- div pour afficher les coordonnées de l'ISS -->
            <div id="coordinates">Coordonnées<br></div>

            <!-- Checkbox. Si true la carte suit l'ISS -->
            <div id='checkbox'>
                <input onclick="checkbox_click()" type="checkbox" checked/>
                <label>Checkbox</label>
            </div>
            <!-- valide comme Pesquet ! -->

            <div id='submit'>
                <button onclick="form_validation()">Tweet comme Pesquet !</button>
                <!-- <label for='submit'></label><input  type="submit" name="submit"  value="Tweet comme Pesquet !"> -->
            </div>
        </form>
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
        <!-- Leaflet Map -->
        <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
        integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
        crossorigin=""></script>
        <!-- Main JS -->
        <script src="assets/js/index.js"></script>
</body>
</html>