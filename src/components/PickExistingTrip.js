import React, { Component } from 'react';
import { List, ListItem, Subheader, RefreshIndicator, Avatar } from 'material-ui';
import autobind from 'react-autobind';
import fire from '../util/fire';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';

class PickExistingTrip extends Component {
	constructor() {
		super();
		autobind(this);
		
		this.state = {
			trips: {},
			loading: true
		};

		this.db = fire.database().ref('available_roadtrips');
		this.db.on('value', snapshot => {
			this.setState({ 
				trips: snapshot.val(),
				loading: false
			});
		});
	}

	componentWillUnmount() {
		this.db.off();
	}

	navigateTo(id) {
		this.props.history.push(`/trip/${id}`);
	}

	render() {
		return (
			<div className="trip-list">
				<Subheader>Existing road trips</Subheader>
				{this.state.loading && <RefreshIndicator size={40} left={50} top={50} status="loading" />}
				<List>
					{_.map(this.state.trips, (name, id) => (
						<ListItem 
							key={id} 
							leftAvatar={<Avatar>{name[0].toUpperCase()}</Avatar>} 
							onClick={() => this.navigateTo(id)} 
							primaryText={name} />
					))}
				</List>
			</div>
		);
	}
}

export default withRouter(PickExistingTrip);