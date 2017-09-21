import firebase from 'firebase'

var config = {
  apiKey: "AIzaSyD8XIotLIk0GpqKXStvumqmUr9Zig-TDWE",
  authDomain: "touristguide-f3f2a.firebaseapp.com",
  databaseURL: "https://touristguide-f3f2a.firebaseio.com",
  projectId: "touristguide-f3f2a",
  storageBucket: "touristguide-f3f2a.appspot.com",
  messagingSenderId: "851345489605"
};
firebase.initializeApp(config);

export const auth = firebase.auth();
export const database = firebase.database();