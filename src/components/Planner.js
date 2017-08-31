import React, { Component } from 'react';
import RouteMap from './RouteMap';
import DestinationList from './DestinationList';
import autobind from 'react-autobind';
import fire from '../util/fire';
import _ from 'lodash';

const prepareData = (val) => {
	return {
		...val,
		destinations: _.sortBy(_.map(val.destinations, (v, k) => ({ ...v, id: k })), 'order')
	}
};

const cleanObj = (obj) => _.pickBy(obj, (v, k) => k !== 'id');

class Planner extends Component {
	constructor() {
		super();
		autobind(this);

		this.state = {
			trip: null,
			markers: {}
		};

		this.dbTrip = null;
		this.dbMarkers = null;
	}

	componentDidMount() {
		this.loadData();
	}

	componentDidUpdate(prevProps, prevState) {
		if(_.get(prevProps, "match.params.tripid") !== _.get(this.props, "match.params.tripid")) {
			this.loadData();
		}
	}

	loadData() {
		const tripId = this.props.match.params.tripid;

		if(this.dbTrip) this.dbTrip.off();
		if(this.dbMarkers) this.dbMarkers.off();

	    this.dbTrip = fire.database().ref('roadtrips/' + tripId);
		this.dbTrip.on('value', snapshot => {
			this.setState({ 
				trip: prepareData(snapshot.val())
			});
		});

		this.dbMarkers = fire.database().ref('markers/' + tripId);
		this.dbMarkers.on('value', snapshot => {
			this.setState({
				markers: snapshot.val()
			});
		});
	}

	componentWillUnmount() {
	    this.dbTrip.off();
	    this.dbMarkers.off();
	}

	addDestination(name) {
		this.dbTrip.child('destinations').push({
			name,
			order: this.state.trip.destinations.length
		});
	}

	updateDestination(editId, name) {
		const { id, ...current } = this.state.trip.destinations.find(d => d.id === editId);

		this.dbTrip.child('destinations').child(editId).set({ 
			...current,
			name: name
		});
	}

	removeDestination(el) {
		this.dbTrip.child('destinations').child(el.id).set(null);
	}

	addMarker(pos) {
		this.dbMarkers.push(pos);
	}

	removeMarker(key) {
		this.dbMarkers.child(key).set(null);
	}

	moveUp(el) {
		if(el.order === 0) return;
		this.move(el, -1);
	}

	moveDown(el) {
		if(el.order === this.state.trip.destinations.length - 1) return;
		this.move(el, 1);
	}

	move(el, dir) {
		const other = this.state.trip.destinations.find(d => d.order === el.order + dir);

		if(_.isNil(other)) return;

		const updates = {};
  		updates['/destinations/' + el.id] = { 
  			...cleanObj(el),
  			order: el.order + dir 
  		};
  		updates['/destinations/' + other.id] = { 
  			...cleanObj(other),
  			order: el.order 
  		};
		this.dbTrip.update(updates);
	}

	render() {
		const destinations = _.get(this.state.trip, 'destinations', []);
		const markers = this.state.markers;

		return (
			<div className="row" style={{ height: "100%" }}>
				<div className="col large-400">
					<DestinationList 
						destinations={destinations} 
						moveUp={this.moveUp} 
						moveDown={this.moveDown} 
						remove={this.removeDestination}
						onAdd={this.addDestination} 
						onUpdate={this.updateDestination} 
					/>
				</div>
				<div className="col full-height">
					<RouteMap destinations={destinations} markers={markers} onAddMarker={this.addMarker} onRemoveMarker={this.removeMarker} />
				</div>
			</div>
		);
	}
}

export default Planner;