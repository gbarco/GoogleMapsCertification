function buildMap() {
    var buenosAires = {
        lat: -34.5681375,
        lng: -58.4544698
    };
    var map = new google.maps.Map(document.getElementById('map'), {
        center: buenosAires,
        zoom: 14,
        mapTypeId: 'roadmap',
        styles: getMapStyle(),
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        }
    });

    window.directionsService = new google.maps.DirectionsService;
    window.directionsDisplay = new google.maps.DirectionsRenderer;

    initDirectionsDisplay();

    return map;
}

function initDirectionsDisplay() {
    directionsDisplay.setMap(null);
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(null);
    directionsDisplay.setPanel(document.getElementById("directions"));
}

function onMarkerClick(event, map) {
    infoWindow.setPosition(event.feature.getGeometry().get());
    infoWindow.setOptions({ pixelOffset: new google.maps.Size(0, -30) });
    getInfoFromMarker(event);
    infoWindow.open(map);
    showDirectionsFromFeatureToUserLocation(event.feature);
}

function getInfoFromMarker(marker) {
    var latlng = { lat: parseFloat(marker.latLng.lat()), lng: parseFloat(marker.latLng.lng()) };
    geocoder.geocode({ 'location': latlng }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                infoWindow.setContent(
                    '<div><b>Globant ' +
                    buildGlobantLocation(results[0]) +
                    '</b></div>');
            }
        }
    });
}

function buildGlobantLocation(location) {
    return extractShortNameFrom(location.address_components, "locality") + '/' + extractShortNameFrom(location.address_components, "country");
}

function extractShortNameFrom(addressComponents, component) {
    for (var i = 0; i < addressComponents.length; i++) {
        if (addressComponents[i].types[0] == component) {
            return addressComponents[i].short_name;
        }
    }
    return '';
}

function showCurrentPosition(latLng) {
    currentPositionMarker = new google.maps.Marker({
        position: latLng,
        map: map,
        animation: google.maps.Animation.DROP
    });
    google.maps.event.addListener(currentPositionMarker, 'click',
        function() {
            infoWindow.setContent("You are here!");
            infoWindow.open(map, currentPositionMarker);
        });
}

function onPlaceChanged() {
    infoWindow.close();
    if (currentPositionMarker) {
        currentPositionMarker.setVisible(false);
    }
    if (autocomplete) {
        var place = autocomplete.getPlace();
        if (place) {
            if (!place.geometry) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                window.alert("No details available for input: '" + place.name + "'");
                return;
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(14); // Why 14? Because it looks good.
            }
            showCurrentPosition(place.geometry.location);
            currentPositionMarker.setVisible(true);
        }
    }
}