import React, { Component } from 'react';
import './App.css';
import { AppBar, IconButton } from 'material-ui';
import Home from './Home';
import Planner from './Planner';
import { Route } from 'react-router-dom';
import ActionHome from 'material-ui/svg-icons/action/home';
import { withRouter } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div>
        <AppBar 
          title="Road Trip Planner" 
          iconElementLeft={<IconButton><ActionHome/></IconButton>} 
          onLeftIconButtonTouchTap={() => this.props.history.push('/')} 
        />
        <div className="container" style={{ position: "absolute", top: "60px", bottom: 0 }}>
          <Route path="/trip/:tripid" component={Planner} />
          <Route exact path="/" component={Home} />
        </div>
      </div>
    );
  }
}

export default withRouter(App);
