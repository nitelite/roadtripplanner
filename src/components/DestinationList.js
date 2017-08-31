import React, { Component } from 'react';
import { FloatingActionButton, FlatButton, Dialog, TextField, Divider, Avatar, List, ListItem, IconMenu, MenuItem, IconButton, Drawer } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';
import AlertError from 'material-ui/svg-icons/alert/error';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { grey400 } from 'material-ui/styles/colors';
import autobind from 'react-autobind';
import { withBus } from 'react-suber';
import _ from 'lodash';

class DestinationList extends Component {
	constructor() {
		super();
		autobind(this);

		this.state = {
			newDialogVisible: false,
			editing: null,
			newDest: "",
			editDest: "",
			showDrawer: true,
			leg: {},
			errors: {}
		};
	}

	componentDidMount() {
	    this.stopDistance = this.props.bus.take('DISTANCE_AVAILABLE', (msg) => {
	    	this.setState({
	    		leg: {
	    			...this.state.leg,
	    			[msg.legKey]: msg	
	    		}
	    	});
	    });

	    this.stopErrors = this.props.bus.take("UNABLE_TO_RESOLVE", msg => {
	    	this.setState({
	    		errors: {
	    			...this.state.errors,
	    			[msg.name]: true
	    		}
	    	})
	    });
	}

	componentWillUnmount() {
	    this.stopDistance();
	    this.stopErrors();
	}

	hideDrawer() {
		this.setState({ showDrawer: true });
	}

	showDrawer() {
		this.setState({ showDrawer: false });
	}

	showNewDialog() {
		this.setState({ newDialogVisible: true });
	}

	hideNewDialog() {
		this.setState({ 
			newDialogVisible: false,
			newDest: ""
		});
	}

	showEditDialog(el) {
		this.setState({ 
			editing: el.id,
			editDest: el.name
		});
	}

	hideEditDialog() {
		this.setState({ 
			editing: null,
			editDest: ""
		});
	}

	onChangeNew(e, val) {
		this.setState({ newDest: val });
	}

	onChangeEdit(e, val) {
		this.setState({ editDest: val });
	}

	handleAdd() {
		this.props.onAdd(this.state.newDest);
		this.hideNewDialog();
	}

	handleSave() {
		this.props.onUpdate(this.state.editing, this.state.editDest);
		this.hideEditDialog();
	}

	getLegInfo(i) {
		if(i > this.props.destinations.length - 2) {
			return null;
		}
		const legKey = this.props.destinations[i].name + "-" + this.props.destinations[i + 1].name;

		if(!this.state.leg[legKey]) {
			return null;
		}
		const leg = this.state.leg[legKey];

		return leg.distance.text + " - " + leg.duration.text;
	}

	focusInputField(input) {
		if(input) {
			input.focus();	
		}
	}

	renderAvatar(place) {
		if(this.state.errors[place] !== true) {
			return <Avatar>{place[0].toUpperCase()}</Avatar>;

		} else {
			return <Avatar backgroundColor="red" color="white" icon={<AlertError/>}></Avatar>;
		}
	}

	renderNewDialog() {
		if(!this.state.newDialogVisible) {
			return null;
		}

		const actions = [
			<FlatButton
				label="Ok"
				primary={true}
				onClick={this.handleAdd}
			/>,
			<FlatButton
				label="Cancel"
				primary={false}
				onClick={this.hideNewDialog}
			/>,
		];

		return (
			<Dialog
				title="Add destination"
				actions={actions}
				modal={false}
				open={this.state.newDialogVisible}
				onRequestClose={this.hideNewDialog}
			>
				<TextField 
					hintText="Monaco" 
					value={this.state.newDest} 
					onKeyUp={e => e.keyCode === 13 ? this.handleAdd() : null} 
					floatingLabelText="Street or city name" 
					onChange={this.onChangeNew}
					ref={this.focusInputField}
				/>
			</Dialog>
		);
	}

	renderEditDialog() {
		if(this.state.editing === null) {
			return null;
		}

		const actions = [
			<FlatButton
				label="Ok"
				primary={true}
				onClick={this.handleSave}
			/>,
			<FlatButton
				label="Cancel"
				primary={false}
				onClick={this.hideEditDialog}
			/>,
		];

		return (
			<Dialog
				title="Change destination"
				actions={actions}
				modal={false}
				open={this.state.editing !== null}
				onRequestClose={this.hideEditDialog}
			>
				<TextField value={this.state.editDest} onKeyUp={e => e.keyCode === 13 ? this.handleSave() : null} floatingLabelText="Street or city name" onChange={this.onChangeEdit}/>
			</Dialog>
		);
	}

	render() {
		const iconButtonElement = (
			<IconButton
				touch={true}
			>
				<MoreVertIcon color={grey400} />
			</IconButton>
			);

		const rightIconMenu = (up, down, del) => (
			<IconMenu iconButtonElement={iconButtonElement}>
				<MenuItem onClick={up}>Move up</MenuItem>
				<MenuItem onClick={down}>Move down</MenuItem>
				<Divider />
				<MenuItem onClick={del}>Delete</MenuItem>
			</IconMenu>
		);

		const BuiltList = () => (
			<div>
				<List>
					{_.map(this.props.destinations, (d, i) => (
						<ListItem 
							key={d.id} 
							leftAvatar={this.renderAvatar(d.name)} 
							primaryText={d.name} 
							secondaryText={this.getLegInfo(i)}
							onClick={() => this.showEditDialog(d)} 
							rightIconButton={rightIconMenu(
								() => this.props.moveUp(d), 
								() => this.props.moveDown(d),
								() => this.props.remove(d)
							)}
						/>
					))}
				</List>
				<FloatingActionButton className="fab" onClick={this.showNewDialog}>
					<ContentAdd />
				</FloatingActionButton>
			</div>
		);

		return (
			<div>
				<Drawer 
					className="show-mobile" 
					onRequestChange={(showDrawer) => this.setState({showDrawer})} 
					containerStyle={{ overflow: "visible" }} 
					docked={false} 
					open={this.state.showDrawer}
				>
					<BuiltList />
				</Drawer>
				<div className="show-desktop">
					<BuiltList />
				</div>
				{this.renderNewDialog()}
				{this.renderEditDialog()}
				
			</div>
		);
	}
}

export default withBus(DestinationList);