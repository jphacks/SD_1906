const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({
    origin: true
});
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
    return cors(request, response, () => {
        const firestore = admin.firestore();

        const docRef = firestore.collection('data').doc('values');
        docRef.get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    var isSitting = documentSnapshot.data();
                    response.send({isSitting: isSitting});
                } else {
                    var errmsg = "Invalid parameter: isSitting is not found in the database.";
                    console.error(errmsg);
                    response.send({error: errmsg});
                }
            })
            .catch(error => {
                console.error(error);
                response.send(error);
            })
    })
});

exports.postIsSitting = functions.https.onRequest((request, response) => {
    return cors(request, response, () => {
        const
            isSitting = request.body.isSitting,
            firestore = admin.firestore();

        let FieldValue = require('firebase-admin').firestore.FieldValue;

        const docRef = firestore.collection('data').doc('values');

        let removeIsSitting = docRef.update({
            isSitting: FieldValue.delete()
        });
        removeIsSitting
            .then(res => {
                docRef.set({isSitting: isSitting})
                    .then(res => {
                        console.log(res);
                        response.end();
                    })
                    .catch(error => {
                        console.error(error);
                        response.end();
                    });

            })
            .catch(error => {
                console.error(error);
                response.end();
            });
    })
});
