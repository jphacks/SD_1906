var admin = require("firebase-admin");

// 1. サービスアカウント鍵を生成しserviceAccountKey.jsonでリネームしてfirebaseフォルダ直下に配置
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // 2. Realtime DatabaseのページでdatabaseURLを確認して反映
    databaseURL: "https://jphacks2019-fae83.firebaseio.com/"
});

var db = admin.database();
// protoout/studio/obnizに保存すると決める
var ref = db.ref("protoout/studio/obniz");
// さらにsensorにぶらさげる
var sensorRef = ref.child("sensor");
ref.on("value", function (snapshot) {
    console.log("value Changed!!!");
    console.log(snapshot.val());
    },
    function (errorObject) {
        console.log("failed: " + errorObject.code);
    }
);

// obnizの処理
var Obniz = require("obniz");
var obniz = new Obniz("1552-7989");
obniz.onconnect = async function () {
    obniz.display.clear();
    obniz.display.print("Firebase - Obniz Switch");
    obniz.switch.onchange = function (state) {
        obniz.display.clear();
        obniz.display.print("state : " + state);
        // スイッチを押した情報が送られる
        sensorRef.set({
            "type":"switch",
            "state":state
        });
    }
}