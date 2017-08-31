const functions = require('firebase-functions');
const admin = require('firebase-admin');
const _ = require('lodash');

// Init application connection
admin.initializeApp(functions.config().firebase);

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.orderDestinations = functions.database.ref('/roadtrips/{tripId}/destinations').onWrite(event =>  {
	const dbObject = event.data.val();
	const tripId = event.params.tripId;

	const items = [];
	const asArr = _.map(dbObject, (v,k) => ({ key: k, order: v.order }));
	const sorted = _.sortBy(asArr, 'order');

	const updates = {};
	let runUpdate = false;
	let i = 0;

	for(let i = 0; i < sorted.length; i++) {
		let el = sorted[i];

		if(el.order !== i) {
			updates["/" + el.key + "/order"] = i;
			runUpdate = true;
		}
	}

	if(runUpdate) {
		console.log("Storing new ordering:", updates);		
		return event.data.ref.update(updates);

	} else {
		console.log("Ordering validated: OK");
	}
});
