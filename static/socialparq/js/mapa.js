function getLocation() {
    if (navigator.geolocation) {
        return navigator.geolocation.getCurrentPosition(initialize);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
function initialize() {

    var location = new google.maps.LatLng(19.4405637, -99.1827162);
    //var location = new google.maps.LatLng(position.coords.latitude,position.coords.altitude);

    var mapOptions = {
        zoom: 17,
        center: location
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    //getZonas();
    //getPoligonoZona('54fbf5b8264a467c44d1f97b');
    //getParquimetrosCoordenada('-99.18149056299995', '19.38065271100001')
    getEquiposZona('54fbf5b8264a467c44d1f97b');
}

function getZonas() {
    $.get("/zonas", function (data) {
        $.each(data.zonas, function (key, value) {
            console.log(value.nombre);
            console.log(value.id);
        })
    });
}

function drawPolygon(polygon) {
    var location = new google.maps.LatLng(19.4405637, -99.1827162);
    //var location = new google.maps.LatLng(position.coords.latitude,position.coords.altitude);

    var mapOptions = {
        zoom: 17,
        center: location
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    polygonDraw = new google.maps.Polygon({
        paths: polygon,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
    });

    polygonDraw.setMap(map);
}

function drawMarkers(latitude, longitude) {
    console.log(latitude, longitude);
    var myLatlng = new google.maps.LatLng(latitude, longitude);
    var mapOptions = {
        zoom: 17,
        center: myLatlng
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

// To add the marker to the map, use the 'map' property
    var iconBase = 'http://localhost:8000/static/socialparq/images/';

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: "Hello World!",
        icon: iconBase + 'pin.png'

    });

    marker.setMap(map);
}


function getPoligonoZona(idZona) {
    $.get("/poligono-zona?zona=" + idZona, function (data) {
        var polygon = [];
        $.each(data.puntos, function (key, value) {
            console.log(value.latitud, value.longitud);
            polygon.push(new google.maps.LatLng(value.latitud, value.longitud));
        });
        drawPolygon(polygon);
    });
}

function getParquimetrosCoordenada(longitud, latitud) {
    $.get("/poligono-coordenada?latitud=" + latitud + "&longitud=" + longitud, function (data) {
        console.log(data.zona.nombre, data.zona.id);
        $.each(data.zona.equipos, function (key, value) {
            console.log(value.latitud, value.longitud);
        });
    });
}

function getEquiposZona(idZona) {
    $.get("/equipos-zona?zona=" + idZona, function (data) {
        $.each(data.puntos, function (key, value) {
            //console.log(value.latitud, value.longitud);

        });
        drawMarkers(data.puntos[0].latitud, data.puntos[0].longitud);
    });
}


