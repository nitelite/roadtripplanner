import React, { Component } from 'react';
import { FloatingActionButton, FlatButton, Dialog, TextField } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';
import autobind from 'react-autobind';
import fire from '../util/fire';

class NewTrip extends Component {
	constructor() {
		super();
		autobind(this);

		this.state = {
			dialogVisible: false,
			tripname: ""
		};

		this.db = fire.database().ref();
	}

	hideDialog() {
		this.setState({ 
			dialogVisible: false,
			tripname: ""
		});
	}

	showDialog() {
		this.setState({ dialogVisible: true });
	}

	onChange(e, val) {
		this.setState({
			tripname: val
		});
	}

	createTrip() {
		const trip = {
			name: this.state.tripname,
			created: new Date().toISOString()
		};

		const newKey = this.db.child('roadtrips').push().key;

		const updates = {};
		updates[`/roadtrips/${newKey}`] = trip;
		updates[`/available_roadtrips/${newKey}`] = this.state.tripname;
		this.db.update(updates);

		this.hideDialog();
	}

	renderDialog() {
		if(!this.state.dialogVisible) {
			return null;
		}

		const actions = [
			<FlatButton
				label="Ok"
				primary={true}
				onClick={this.createTrip}
			/>,
			<FlatButton
				label="Cancel"
				primary={false}
				onClick={this.hideDialog}
			/>,
		];

		return (
			<Dialog
				title="Create new road trip"
				actions={actions}
				modal={false}
				open={this.state.dialogVisible}
				onRequestClose={this.hideDialog}
			>
				<TextField hintText="Scenic drive with John" value={this.state.tripname} floatingLabelText="Name of road trip" onChange={this.onChange}/>
			</Dialog>
		);
	}

	render() {
		return (
			<div>
				{this.renderDialog()}
				<FloatingActionButton className="lower-right" onClick={this.showDialog}>
					<ContentAdd />
				</FloatingActionButton>
			</div>
		);
	}
}

export default NewTrip;