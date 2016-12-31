"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
/*
 * react object (class)
 * */
 var GoogleMaps = require('./map/google-maps');

var AppClass = React.createClass({
    mixins: [],
    shouldComponentUpdate (nextProps, nextState) {
        return true;
    },
    componentWillMount () {
    },
    getInitialState () {
        return {};
    },
    componentDidMount () {},
    render () {
        return (
            <GoogleMaps />
        );
    }
});


ReactDOM.render(<AppClass />, document.getElementById('body'));
