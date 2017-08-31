import { Component } from 'react';
import autobind from 'react-autobind';
import { withBus } from 'react-suber';
import _ from 'lodash';

class RoutesOnMap extends Component {
	constructor() {
		super();
		autobind(this);

		this.directionsService = null;
		this.directionsDisplays = {};
		this.debouncedMoveBounds = _.debounce(this.moveBounds, 500);
	}

	moveBounds() {
		const google = this.props.google;
		const newBounds = new google.maps.LatLngBounds();

		_.forEach(this.directionsDisplays, dr => {
			newBounds.union(dr.getDirections().routes[0].bounds);
		});

		this.props.map.fitBounds(newBounds);
	}

	shouldComponentUpdate(nextProps, nextState) {
	    return !_.isEqual(nextProps.destinations, this.props.destinations);
	}

	componentDidUpdate(prevProps, prevState) {
		if(_.isNil(this.props.google) || _.isNil(this.props.map) || _.isNil(this.props.destinations)) {
			return;
		}

		const google = this.props.google;
		const map = this.props.map;
		const dest = this.props.destinations;

	    if(!this.directionsService) {
	    	this.directionsService = new google.maps.DirectionsService();
	    }

	    if(this.directionsService) {
			const legs = dest.length - 1;
			if(legs === -1) {
				return;
			}
	    	
	    	const currentKeys = [];

	    	for(let i = 0; i < legs; i++) {
	    		const legKey = dest[i].name + "-" + dest[i+1].name;
	    		currentKeys.push(legKey);

	    		if(this.directionsDisplays[legKey]) {
	    			continue;
	    		}

	    		const nextMonday = new Date();
	    		nextMonday.setDate(nextMonday.getDate() + (7 - nextMonday.getDay()) % 7 + 1);

		    	const request = {
					origin: dest[i].name,
					destination: dest[i+1].name,
					travelMode: 'DRIVING',
					provideRouteAlternatives: false,
					drivingOptions: {
						departureTime: nextMonday,
						trafficModel: 'optimistic'
  					}
				};

				this.directionsService.route(request, (response, status) => {
					if (status === 'OK') {
						console.log("Setting route for direction display " + legKey);
						const details = response.routes[0].legs[0];

						this.props.bus.send('DISTANCE_AVAILABLE', {
							legKey,
							distance: details.distance,
							duration: details.duration
						});

						this.directionsDisplays[legKey] = new google.maps.DirectionsRenderer({
							suppressMarkers: true,
							preserveViewport: true,
							map,
							directions: response
						});

	    				this.debouncedMoveBounds();

					} else if(status === "NOT_FOUND") {
						const missingPoint = _.findIndex(response.geocoded_waypoints, w => (w.geocoder_status === "ZERO_RESULTS"));
						if(missingPoint === -1) {
							console.log("Unknown reason for geocoder failure", response);
							return;
						}

						const place = (missingPoint === 0) ? response.request.origin : response.request.destination;
						console.log("Unable to resolve search for: ", place);
						this.props.bus.send('UNABLE_TO_RESOLVE', {
							name: place
						});

					} else {
						console.warn("Route request failed", status, response);
					}
				});
	    	}

	    	_.forEach(this.directionsDisplays, (val, key) => {
	    		if(currentKeys.indexOf(key) === -1) {
	    			console.log("Cleaning up no longer needed route " + key);
	    			this.directionsDisplays[key].setMap(null);
	    			delete this.directionsDisplays[key];
	    		}
	    	});
	    }
	}

	render() {
		return null;
	}
}

export default withBus(RoutesOnMap);