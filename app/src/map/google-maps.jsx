"use strict";

var React = require('react');

/*
 * react object (class)
 * */
 var MapsHelper = require('./maps-helper');

var GoogleMaps = React.createClass({
    mixins: [],
    shouldComponentUpdate (nextProps, nextState) {
        return true;
    },
    componentWillMount () {
         (function (d, s, id) {
             var js, fjs = d.getElementsByTagName(s)[d.getElementsByTagName(s).length - 1];
             if (d.getElementById(id)) {
                 MapsHelper.init(googleMapsObject);
                 return;
             }
             js = d.createElement(s);
             js.id = id;
             js.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyD_gq_TgoWh0Pjz_MNplrjdaPC0lG6Tm4c&libraries=places&callback=initMap";
             fjs.parentNode.insertBefore(js, fjs);
         }(document, 'script', 'google-map-sdk'));

         var initMap = window.initMap = () => {
             this.showAppMap(google.maps);
         };
    },
    showAppMap (googleMapsObject) {
    	MapsHelper.init(googleMapsObject);
    }
    ,getInitialState () {
        return {};
    },
    componentDidMount () {},
    render () {
        return (
            <div id="maps">
                <input id="mapSearchAddress"/>
                <div id="googleMap" />
            </div>
        );
    }
});

module.exports = GoogleMaps;
