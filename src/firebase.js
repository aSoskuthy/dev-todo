import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyALa3rJoHbfZGlHXfLfK19g7x8J1X7kj14",
    authDomain: "po-tracker-3a3d9.firebaseapp.com",
    databaseURL: "https://po-tracker-3a3d9.firebaseio.com",
    projectId: "po-tracker-3a3d9",
    storageBucket: "",
    messagingSenderId: "577471119760"
  };
const fireStoreSettings = {timestampsInSnapshots: true}
const firebaseApp = firebase.initializeApp(config)

const fireStore = firebaseApp.firestore()
fireStore.settings(fireStoreSettings)

export default fireStore