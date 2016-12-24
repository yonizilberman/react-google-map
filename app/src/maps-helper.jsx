(function() {
	"use strict";

	var __this = {};

	var mapsHelper = {
        mapObject: null,
        map: {},
        geocoder: {},
        service: {},

		init (googleMapsObject) {
			__this.setMapObject(googleMapsObject);

			__this.showAppMap();

            __this.setGeocoder();
            __this.setService();
            __this.setInfoWindow();

            /* show user location if user allow share his location */
            userLocationOnMap();
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
        setGeocoder() {
            __this.geocoder = new __this.mapObject.Geocoder;
        },
        /*   set google service         */
        setService () {
            __this.service = new __this.mapObject.places.PlacesService(__this.map);
        },
        /*   set google InfoWindow      */
        setInfoWindow: function () {
            __this.infoWindow = new __this.mapObject.InfoWindow();
        },
	};

    /*
     *      local function
     *
     *
     *      show user location if user allow share his location
     */

    function userLocationOnMap () {
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

    function handleLocationError (browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
    }

	module.exports = __this = mapsHelper;

})();
