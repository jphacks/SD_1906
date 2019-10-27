const functions = require('firebase-functions');
const admin = require('firebase-admin');
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: "https://jphacks2019-lifeleaf.firebaseio.com/",
    });
}

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.getIsSitting = functions.https.onRequest((request, response) => {
    const firestore = admin.firestore();

    const docRef = firestore.collection('data').doc('values');
    docRef.get()
        .then(documentSnapshot => {
            if (documentSnapshot.exists) {
                var isSitting = documentSnapshot.data();
                response.send({isSitting: isSitting})
            } else {
                var errmsg = "Invalid parameter: isSitting is not found in the database.";
                console.error(errmsg);
                response.send({error: errmsg});
            }
        })
        .catch(error => {
                console.error(error);
                response.end();
            })
});

exports.postIsSitting = functions.https.onRequest((request, response) => {
    const
        isSitting = request.body.isSitting,
        firestore = admin.firestore();

    const docRef = firestore.collection('data').doc('values');
    docRef.get()
        .then(documentSnapshot => {
            docRef.set({isSitting: isSitting})
        })
        .catch(error => {
            console.error(error);
            response.end();
        })
});
