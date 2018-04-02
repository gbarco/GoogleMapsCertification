function centerOnUserLocation() {
    navigator.geolocation.getCurrentPosition(function(position) {
        map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
        showCurrentPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    });
}

function showFeatureDistanceFromUserLocation(divName) {
    navigator.geolocation.getCurrentPosition(function(position) {
        userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var distanceToArray = new Array();
        var limit = 0;
        map.data.forEach(function(feature) {
            distanceToArray.push(feature.getGeometry().get());
            limit++;
        });
        addDistancesFromLatLng(divName, userLocation, distanceToArray);
    });
};

function addDistancesFromLatLng(divName, origin, positions) {
    var div = document.getElementById(divName);
    var service = new google.maps.DistanceMatrixService();

    do {
        var positionSplice = positions.splice(0, positions.length > 25 ? 25 : positions.length);
        console.log(positionSplice);
        service.getDistanceMatrix({
            origins: [origin],
            destinations: positionSplice,
            travelMode: 'DRIVING',
            //transitOptions: TransitOptions,
            //drivingOptions: DrivingOptions,
            //unitSystem: UnitSystem,
            //avoidHighways: Boolean,
            //avoidTolls: Boolean,
        }, callback);
    } while (positions.length > 0);

    function callback(response, status) {
        var div = document.getElementById("distances"); //TODO: Como se extrae esto de un async?
        var row;
        var originIndex = 0;
        for (row of response.rows) {
            var element;
            var destinationIndex = 0;
            if (isDivInnerHTMLEmpty(div)) { //TODO: Does not work. How to extract state from async?
                addStringToDivInnerHTML(div, "Distance from " + response.originAddresses[originIndex] + ": <br/>");
            }
            for (element of row.elements) {
                var duration, distance;
                try {
                    distance = element.distance.text;
                } catch (e) {
                    distance = 'unknown';
                }
                try {
                    duration = element.duration.text;
                } catch (e) {
                    duration = 'unknown';
                }

                addStringToDivInnerHTML(div, "To " + response.destinationAddresses[destinationIndex] + ", " + distance + " can drive in " + duration + "<br/>");

                destinationIndex++;
            }
            originIndex++; //support multiple for future implementation
        }
    }

    function isDivInnerHTMLEmpty(div) {
        return div.innerHTML == '';
    }

    function addStringToDivInnerHTML(div, string) {
        div.innerHTML = div.innerHTML + string;
    }
}