import React from 'react';
import NewTrip from './NewTrip';
import PickExistingTrip from './PickExistingTrip';

const Home = () => (
	<div className="row">
		<div className="col"></div>
		<div className="col" style={{ maxWidth: "400px" }}>
			<PickExistingTrip />
			<NewTrip/>
		</div>
		<div className="col"></div>
	</div>
);

export default Home;