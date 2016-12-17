(function() {
	"use strict";

	var __this = {};

	var mapsHelper = {
        mapObject: null,
        map: {},

		init (googleMapsObject) {
			__this.setMapObject(googleMapsObject);

			__this.showAppMap();

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
        }

	};



	module.exports = __this = mapsHelper;

})();
