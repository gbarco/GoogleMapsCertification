function displayAllLocations() {
    // all Globant offices
    var shape = {
        coords: [0, 0, 0, 32, 16, 24, 0, 0],
        type: 'poly'
    };
    var image = {
        url: 'globant.png',
        size: new google.maps.Size(24, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 32),
        shape: shape
    };

    map.data.loadGeoJson('mustHave1.json');
    map.data.setStyle(function(feature) {
        return {
            icon: image
        };
    });
}

function displayNearestLocations() {
    nearestLocationsPanel.innerHTML = "Nearest locations from current location:<br/>";
    var distanceToLocation = new Array();
    map.data.forEach(function(feature) {
        var distance = google.maps.geometry.spherical.computeDistanceBetween(currentPosition, feature.getGeometry().get()) / 1000;
        distanceToLocation.push({ distance: distance, feature: feature.getGeometry().get() });
    });
    showNearestLocations(distanceToLocation);
}

function showNearestLocations(distanceToLocation) {
    distanceToLocation.sort(function(a, b) { return a.distance - b.distance });
    nearestLocations = distanceToLocation.splice(0, distanceToLocation.length > 10 ? 10 : distanceToLocation.length);
    nearestLocations.forEach(function(element) {
        addStringToDivInnerHTML(nearestLocationsPanel,
            "To " + element.feature.lat() + "," + element.feature.lng() + " " +
            element.distance.toFixed(2) + "km<br/>");
    });
}