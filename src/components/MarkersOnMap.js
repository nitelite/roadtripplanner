import { Component } from 'react';
import autobind from 'react-autobind';
import _ from 'lodash';

const addClickHandler = (marker, key, fn) => {
	marker.addListener('click', () => {
		fn(key);
	});
};

class MarkersOnMap extends Component {
	constructor(props) {
		super(props);
		autobind(this);

		this.markers = {};
	}

	onRemove(key) {
		this.props.onRemove(key);
	}

	componentDidUpdate(prevProps, prevState) {
		if(_.isNil(this.props.google) || _.isNil(this.props.map) || _.isNil(this.props.markers)) {
			this.cleanUpMarkers([]);
			return;
		}

		const google = this.props.google;
		const usedKeys = [];

		_.forEach(this.props.markers, (pos, markerKey) => {
			usedKeys.push(markerKey);

			if(!this.markers[markerKey]) {
				this.markers[markerKey] = new google.maps.Marker({
					map: this.props.map,
					animation: google.maps.Animation.DROP,
					position: pos
				});
				addClickHandler(this.markers[markerKey], markerKey, this.onRemove);
				
			}
		});

		this.cleanUpMarkers(usedKeys);
	}

	cleanUpMarkers(usedKeys) {
		_.forEach(this.markers, (marker, key) => {
			if(usedKeys.indexOf(key) === -1) {
				console.log("Removing marker " + key);
				this.markers[key].setMap(null);
				delete this.markers[key];
			}
		});
	}

	render() {
		return null;
	}
}

export default MarkersOnMap;