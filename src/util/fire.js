import firebase from 'firebase';

const config = {
	apiKey: "AIzaSyB11uY4FytVsoAM6AM5YLsWI-JzJxKlJYc",
	authDomain: "roadtripplanner-bf7a1.firebaseapp.com",
	databaseURL: "https://roadtripplanner-bf7a1.firebaseio.com",
	projectId: "roadtripplanner-bf7a1",
	storageBucket: "roadtripplanner-bf7a1.appspot.com",
	messagingSenderId: "946276701198"
};

const fire = firebase.initializeApp(config);

export default fire;