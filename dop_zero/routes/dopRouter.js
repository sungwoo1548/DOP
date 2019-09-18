var express = require('express');
var router = express.Router();
var ibmdb = require("ibm_db");

// var dsn2 = "DATABASE=BLUDB;HOSTNAME=dashdb-txn-sbox-yp-dal09-03.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=bjr81526;PWD=qsl^240pblh3qnmx;";
var dsn = require("../DBconfig");

// var app = express();

// main page render
router.get('/', (req, res, next) => {
    res.render('index');
});

// DB 저장 (inser into)
// app.post('/insertDB', (req, res, next) => {
//     ibmdb.open(cn, function (err, conn) {
//         conn.prepare("insert into geotest (userid, geodata) VALUES (?, ?)", function (err, stmt) {
//             if (err) { //에러처리
//                 console.log(err);
//                 return conn.closeSync();
//             }

//             var geodata_json = { DataType: "BLOB", "Data": JSON.stringify(req.body) };  // ibm DB2에 json 형식 insert 문법.
//             stmt.execute(['321', geodata_json], function (err, result) {
//                 if (err) console.log(err); // 에러처리
//                 else {
//                     res.send("good");
//                     result.closeSync();
//                 }

//                 //Close the connection
//                 conn.close(function (err) { });
//             });
//         });
//     });
// })


// DB 읽기 (select)
router.get('/readDB', (req, res, next) => {
    ibmdb.open(dsn, function (err, connection) {
        if (err) { // 에러처리
            console.log(err);
            return;
        }
        // 특정 id data 불러올 때 : "select * from geotest where userid='321'"
        connection.query("select * from geotest", function (err1, readData) {
            if (err1) console.log(err1); // 에러처리
            else {
                let prams = [];
                let idx=0;

                // Date 함수 생성자 호출을 하여 사용해야 입력한 값의 시간을 출력한다.
                for (let i = 0; i < readData.length; i++) {
                    let transDate = (JSON.parse(readData[i].GEODATA).timestamp);
                    let fDate = new Date(transDate);
                    idx += 1;

                    prams.push({
                        idx: String(idx),
                        userid: readData[i].USERID,
                        timestamp: fDate.toLocaleString(),
                        timestamp_orignal: JSON.parse(readData[i].GEODATA).timestamp,
                        longitude: JSON.stringify(JSON.parse(readData[i].GEODATA).coords.longitude),
                        latitude: JSON.stringify(JSON.parse(readData[i].GEODATA).coords.latitude),
                    });
                }
                
                res.json(prams);
                // res.render('showdata', { data: readData }) // showdata 페이지 렌더
            }
            connection.close(function (err2) {
                if (err2) console.log(err2); // 에러처리
            });
        });
    });
});

router.get('/setUser', (req, res, next) => {
    var setId = req.query.id;
    
    ibmdb.open(dsn, function (err, connection) {
        if (err) { // 에러처리
            console.log(err);
            return;
        }
        // 특정 id data 불러올 때 : "select * from geotest where userid='321'"
        connection.query("select * from geotest where USERID='"+setId+"'", function (err1, readData) {
            if (err1) console.log(err1); // 에러처리
            else {
                let prams = [];
                let idx=0;

                // Date 함수 생성자 호출을 하여 사용해야 입력한 값의 시간을 출력한다.
                for (let i = 0; i < readData.length; i++) {
                    let transDate = (JSON.parse(readData[i].GEODATA).timestamp);
                    let fDate = new Date(transDate);
                    idx += 1;

                    prams.push({
                        idx: String(idx),
                        userid: readData[i].USERID,
                        timestamp: fDate.toLocaleString(),
                        timestamp_orignal: JSON.parse(readData[i].GEODATA).timestamp,
                        longitude: JSON.stringify(JSON.parse(readData[i].GEODATA).coords.longitude),
                        latitude: JSON.stringify(JSON.parse(readData[i].GEODATA).coords.latitude),
                    });
                }
                
                res.json(prams);
                //res.render('showdata', { data: readData }) // showdata 페이지 렌더
            }
            connection.close(function (err2) {
                if (err2) console.log(err2); // 에러처리
            });
        });
    });

});



module.exports = router;