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
        zonasId = [];
        $.each(data.zonas, function (key, value) {
            zonasId.push(value.id);
        });

        return zonasId;
    });
}

function drawPolygon(polygons) {
    var location = new google.maps.LatLng(19.4405637, -99.1827162);
    //var location = new google.maps.LatLng(position.coords.latitude,position.coords.altitude);

    var mapOptions = {
        zoom: 17,
        center: location
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

function drawMarkers(latitude, longitude) {
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

function locateMe() {
    var location = new google.maps.LatLng(19.4405637, -99.1827162);

    var mapOptions = {
        zoom: 17,
        center: location
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

function getCercano(latitud, longitud) {
    $.get("/cercano?latitud=" + latitud + "&longitud=" + longitud, function (data) {
        drawMarkers(data.latitud, data.longitud);
    });
}

$(document).on('click', '.btn-operacion', function () {
    getPoligonos();
});


$(document).on('click', '.pointer', function () {
    locateMe();
});

$(document).on('click', '.btn-cercano', function () {
    getCercano(19.383629, -99.180945);
});

