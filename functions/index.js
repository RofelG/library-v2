const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const app = express();

const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);

//Get database data
// fucntion getFacts() {
//     const ref = firebaseApp.database().ref('facts');
//     return ref.once('value').then(snap => snap.val());
// }

app.get('/timestamp', (request, response) => {
    response.send(`${Date.now()}`);
});

app.get('/timestamp-cached', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    response.send(`${Date.now()}`);
});

app.get('/', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    // render index with data facts
    // getFacts().then(facts => {
    //     response.render('index', {facts});
    // })
})

exports.app = functions.https.onRequest(app);
