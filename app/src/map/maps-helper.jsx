(function() {
	"use strict";

	var __this = {};

	var mapsHelper = {
        mapObject: null,
        map: {},
        geocoder: {},
        service: {},

        marker: null,

		init (googleMapsObject) {
			__this.setMapObject(googleMapsObject);

			__this.showAppMap();

            __this.setGeocoder();
            __this.setService();
            __this.setInfoWindow();

            /* set search field so user can search */
            __this.setSearchField();
            __this.searchPlace();

            /* show user location if user allow share his location */
            userLocationOnMap();

            // This event listener will call addMarker() when the map is clicked.
            this.map.addListener('click', (event) => {
                if (__this.marker != null) {
                    _clearMarkerObject(__this.marker);
                }
                __this.addMarker(event.latLng, 'click');
            });
		},
        /*
         *
         *   set google maps map in the application
         *
         */
        showAppMap () {
            __this.map = new __this.mapObject.Map(
            	document.querySelector('#googleMap'), {
            		center: {lat: 40.7754689, lng: -74.0031746},
            		zoom: 10,
            		clickableIcons: false
            	});
        },
		/*   set google maps object     */
        setMapObject (googleMaps) {
            __this.mapObject = googleMaps;
        },
        /*   set google geocoder        */
        setGeocoder () {
            __this.geocoder = new __this.mapObject.Geocoder;
        },
        /*   set google service         */
        setService () {
            __this.service = new __this.mapObject.places.PlacesService(__this.map);
        },
        /*   set google InfoWindow      */
        setInfoWindow () {
            __this.infoWindow = new __this.mapObject.InfoWindow();
        },
        /*   add marker to map          */
        addMarker (location, mouseEvent) {
            __this.geocoder.geocode({'location': location}, function (results, status) {
                var locationText = 'Unavailable';
                var flag = false;
                if (status === __this.mapObject.GeocoderStatus.OK) {
                    if (results[1]) {
                        __this.service.getDetails({
                            placeId: results[0].place_id
                        }, function (place, status) {
                            if (status === __this.mapObject.places.PlacesServiceStatus.OK) {
                                locationText = place.formatted_address;
                                flag = true;
                            }
                        });
                    } else {
                        console.log('No results found');
                        console.log('location: ', location);
                        flag = true;
                    }
                } else {
                    console.log('Geocoder failed due to: ' + status);
                    console.log('location: ', location);
                    flag = true;
                }
                var locationIntervalTime = setInterval(function () {
                    if (flag) {
                        clearInterval(locationIntervalTime);
                        flag = false;

                        var options = {
                            position: location,
                            draggable: true
                        };
                        if (mouseEvent == 'click') {
                            options.animation = __this.mapObject.Animation.DROP;
                            __this.marker = _appMarker(options);
                        } else if (mouseEvent == 'dragend') {
                            __this.marker.setOptions(options);
                        }

                        __this.setMarkerOptions(
                            _addLocation({address: ('<div data-lat="' + location.lat() + '" data-lng="' + location.lng() + '">' + locationText + '</div>')})
                        );
                    }
                }, 300);
            });
        },
        /*   set google Marker Options      */
        setMarkerOptions (addLocation) {
            __this.marker.setVisible(true);

            __this.infoWindow.setContent(addLocation);
            __this.infoWindow.open(__this.map, __this.marker);

            // This event listener will call addMarker() when the map is drag end.
            _addMapEventListener(__this.marker, 'dragend', function (event) {
                __this.addMarker(event.latLng, 'dragend');
            });

            // then, remove the info windows name from the array
            _addMapEventListener(__this.infoWindow, 'closeclick', function () {
                __this.removerMarker(__this.marker, __this.infoWindow);
            });
        },
        /*   clear marker's infoWindow from map      */
        removerMarker (marker, infoWindow) {
            _clearMarkerObject(marker);
            window.setTimeout(function () {
                __this.mapObject.event.clearListeners(infoWindow, 'closeclick'); // delay a bit to allow the other 'closeclick' event (that changes URL) to occur
            }, 100);
        },
        /*   set google Search Field    */
        setSearchField () {
            var input = document.getElementById('mapSearchAddress');

            __this.autoComplete = new __this.mapObject.places.Autocomplete(input);
            __this.autoComplete.bindTo('bounds', __this.map);

            __this.map.controls[__this.mapObject.ControlPosition.RIGHT_BOTTOM].push(input);

            //__this.infoWindow = new __this.mapObject.InfoWindow();
        },
        searchPlace () {
            __this.autoComplete.addListener('place_changed', function () {
                // remove marker for map to set new one
                _clearMarkerObject(__this.marker);

                var place = __this.autoComplete.getPlace();
                if (!place.geometry) {
                    return;
                }

                var locationCoords = place.geometry.location;

                if (place.geometry.viewport) {
                    __this.map.fitBounds(place.geometry.viewport);
                } else {
                    __this.map.setCenter(locationCoords);
                }

                __this.marker = _appMarker({
                    zoom: 17,
                    animation: __this.mapObject.Animation.DROP
                });

                // Set the position of the marker using the place ID and location.
                __this.marker.setPlace({
                    placeId: place.place_id,
                    location: locationCoords
                });

                __this.setMarkerOptions(
                    _addLocation({
                        address: place.formatted_address,
                        lat: locationCoords.lat(),
                        lng: locationCoords.lng()
                    })
                );
            });
        }
	};

    /*
     *      local function
     *
     *
     *      show user location if user allow share his location
     */

    var userLocationOnMap = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                __this.infoWindow.setPosition(pos);
                __this.map.setCenter(pos);
            }, function () {
                handleLocationError(true, __this.infoWindow, __this.map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, __this.infoWindow, __this.map.getCenter());
        }
    }

    var handleLocationError = (browserHasGeolocation, infoWindow, pos) => {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
    }

    var _appMarker = (markerOptions) => {
        markerOptions.map = __this.map;

        return new __this.mapObject.Marker(markerOptions);
    }

    var _addLocation = (location) => {
        /*
         * address - $newLocation.find('.textArea div').text()
         * label - $newLocation.find('input').val()
         * thumbnail_file_id -
         * latitude - $newLocation.find('.textArea > div').data('lat')
         * longitude - $newLocation.find('.textArea > div').data('lng')
         */
        return (
            '<div id="newLocation" class="marker-iw locationMarkerInfo">' +
            '<div class="textArea">' +
            location.address +
            '</div>' +
            '</div>'
        );
    }

    /*   clear marker from map      */
    var _clearMarkerObject = (marker) => {
        if (marker) {
            marker.setMap(null);
            marker = null;
        }
        return;
    }

    var _addMapEventListener = (element, event, callBack) => {
        return __this.mapObject.event.addListener(element, event, callBack);
    }

	module.exports = __this = mapsHelper;

})();
