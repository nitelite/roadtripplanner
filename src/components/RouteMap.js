import React, { Component } from 'react';
import autobind from 'react-autobind';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import RoutesOnMap from './RoutesOnMap';
import MarkersOnMap from './MarkersOnMap';

class RouteMap extends Component {
	constructor() {
		super();
		autobind(this);
	}

	handleAddMarker(props, map, e) {
		this.props.onAddMarker({
			lat: e.latLng.lat(),
			lng: e.latLng.lng()
		});
	}

	handleRemoveMarker(key) {
		this.props.onRemoveMarker(key);
	}

	render() {
		return (
			<div className="map-container">
				<Map 
					google={this.props.google} 
					onClick={this.handleAddMarker}
					gestureHandling="cooperative"
				>
					<RoutesOnMap destinations={this.props.destinations} />
					<MarkersOnMap markers={this.props.markers} onRemove={this.handleRemoveMarker} />
				</Map>
			</div>
		);
	}
}


export default GoogleApiWrapper({ 
	apiKey: "AIzaSyB0fX5qweZTMa1GA7uZps4ADEN_7zV80XA",
	version: '3.28'
})(RouteMap);