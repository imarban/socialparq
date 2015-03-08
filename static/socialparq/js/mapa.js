
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

            /*var ctaLayer = new google.maps.KmlLayer({
             url: 'http://datos.labcd.mx/dataset/a3778da2-45b7-49ae-a2d5-335f8c03f356/resource/b6b76ccf-b880-49e6-86d3-df8481c2e4d1/download/poligonoecoparqenoperacion.kml'
             }, {preserveViewport: true});
             ctaLayer.setMap(map);
             */
        }

        //google.maps.event.addDomListener(window, 'load', initialize);
