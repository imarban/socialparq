function getLocation() {
    if (navigator.geolocation) {
        return navigator.geolocation.getCurrentPosition(initialize);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

var posicionesFijas = [[19.426592800000037, -99.17825685999998], [19.428898540000034, -99.17725241999995], [19.42661914000007, -99.176368], [19.428582, -99.175806]]

function initialize() {

    var location = new google.maps.LatLng(19.440525, -99.181594);
    //var location = new google.maps.LatLng(position.coords.latitude,position.coords.altitude);

    var mapOptions = {
        zoom: 17,
        center: location,
        disableDefaultUI: true
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

function getZonas() {
    $.get("/zonas", function (data) {
        zonasId = [];
        $.each(data.zonas, function (key, value) {
            zonasId.push(value.id);
        });

        return zonasId;
    });
}

function drawPolygon(polygons) {
    var location = new google.maps.LatLng(19.440525, -99.181594);

    var mapOptions = {
        zoom: 17,
        center: location,
        disableDefaultUI: true
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var colores = ['#FF0000', '#2288AA', '#6644BB',
        '#FFDDAA', '#33FFAA', '#88CCCC', '#A0A0A0',
        '#B0B0B0', '#A9D5F1', '#9A8D3E', 'EAE1E1', '#FDFDFD', '#D8D7D6'];

    var polygonDrawArray = [];

    for (var i = 0; i < polygons.length; i++) {
        var randomColor = colores[i];

        var polygonDraw = new google.maps.Polygon({
            paths: polygons[i],
            strokeColor: randomColor,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: randomColor,
            fillOpacity: 0.35
        });


        polygonDrawArray.push(polygonDraw)
    }

    for (var i = 0; i < polygonDrawArray.length; i++) {
        polygonDrawArray[i].setMap(map);
    }
}

function drawMultiMarkers(markers) {
    var location = new google.maps.LatLng(19.380652711000018, -99.18149056299995);

    var mapOptions = {
        zoom: 17,
        center: location,
        disableDefaultUI: true

    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    var iconBase = 'http://23.253.252.190/static/socialparq/images/';


    var markerDrawArray = [];

    for (var i = 0; i < markers.length; i++) {

        var markerDraw = new google.maps.Marker({
            position: markers[i],
            map: map,
            title: "",
            icon: iconBase + "pin-parking.png"
        });

        markerDrawArray.push(markerDraw)
    }

    for (var i = 0; i < markerDrawArray.length; i++) {
        markerDrawArray[i].setMap(map);
    }

}


function drawMarkers(latitude, longitude, imageName) {
    var myLatlng = new google.maps.LatLng(latitude, longitude);
    var mapOptions = {
        zoom: 17,
        center: myLatlng,
        disableDefaultUI: true
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

// To add the marker to the map, use the 'map' property
    var iconBase = 'http://23.253.252.190/static/socialparq/images/';

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: "",
        icon: iconBase + imageName

    });

    marker.setMap(map);
}


function getPoligonoZona(idZona) {
    $.get("/poligono-zona?zona=" + idZona, function (data) {
        var polygon = [];
        $.each(data.puntos, function (key, value) {
            polygon.push(new google.maps.LatLng(value.latitud, value.longitud));
        });
        drawPolygon(polygon);
    });
}

function getPoligonos() {
    $.get("/poligonos", function (data) {
        var polygons = [];
        $.each(data.zonas, function (key, value) {
            polygon = [];
            $.each(value.points, function (key, value) {
                console.log(value.latitud, value.longitud);
                polygon.push(new google.maps.LatLng(value.latitud, value.longitud));
            });
            polygons.push(polygon);
        });
        drawPolygon(polygons);
    });
}

function getParquimetrosCoordenada(latitud, longitud) {
    $.get("/poligono-coordenada?latitud=" + latitud + "&longitud=" + longitud, function (data) {
        var puntos = [];
        $.each(data.zona.equipos, function (key, value) {
            puntos.push(new google.maps.LatLng(value.latitud, value.longitud));
        });
        drawMultiMarkers(puntos);

    });
}

function getEquiposZona(idZona) {
    $.get("/equipos-zona?zona=" + idZona, function (data) {
        $.each(data.puntos, function (key, value) {
            //console.log(value.latitud, value.longitud);

        });
        drawMarkers(data.puntos[0].latitud, data.puntos[0].longitud, 'pin-parking.png');
    });
}

function locateMe() {

    drawMarkers(19.440525, -99.181594, 'pin.png');
}

function getCercano(latitud, longitud) {
    $.get("/cercano?latitud=" + latitud + "&longitud=" + longitud, function (data) {
        drawMarkers(data.latitud, data.longitud, 'pin-parking.png');
    });
}

function getLugarDisponible() {
    var lugar = posicionesFijas[Math.floor(Math.random() * posicionesFijas.length)]

    var location = new google.maps.LatLng(lugar[0], lugar[1]);
    var mapOptions = {
        zoom: 17,
        center: location,
        disableDefaultUI: true
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var iconBase = 'http://23.253.252.190/static/socialparq/images/';

    var infowindow = new google.maps.InfoWindow({
        //content: "<a id='hay_lugar' class='tooltips' href='#'><span><p class='' style='text-transform:uppercase;'>Aquí hay un lugar</p>	<p"

        content: "<a href='#' class='tooltips'"
        + "><span><p style='text-transform:uppercase;'>Aquí hay un lugar</p>"
        + "<p>RodOrozc te espera</p><p>Auto gris</p></span></a>'"
    });

    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: "Estás aquí",
        icon: iconBase + 'pin.png'

    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker);
    });

    marker.setMap(map);

}

$(document).on('click', '.btn-operacion', function () {
    getPoligonos();
});


$(document).on('click', '.pointer', function () {
    locateMe();
});

$(document).on('click', '.btn-cercano', function () {
    getParquimetrosCoordenada(19.380652711000018, -99.18149056299995);
});

$(document).on('click', '.btn-busco', function () {
    getLugarDisponible();
});


