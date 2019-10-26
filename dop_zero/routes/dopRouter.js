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
router.post('/insertDB', (req, res, next) => {
    ibmdb.open(dsn, function (err, conn) {
        conn.prepare("insert into geotest (userid, geodata) VALUES (?, ?)", function (err, stmt) {
            if (err) { //에러처리
                console.log(err);
                return conn.closeSync();
            }

            var userid = req.body.userid;
            var geodata_json = { DataType: "BLOB", "Data": JSON.stringify(req.body.gps) };  // ibm DB2에 json 형식 insert 문법.
            stmt.execute([userid, geodata_json], function (err, result) {
                if (err) console.log(err); // 에러처리
                else {
                    console.log(req.body);
                    req.body.msg = "잘 전송됨";
                    res.json(req.body);
                    result.closeSync();
                }
                //Close the connection
                conn.close(function (err) { });
            });
        });
    });
})


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
                // console.log(JSON.parse(readData[15].GEODATA));
                res.render('showdata', { data: readData }) // showdata 페이지 렌더
            }
            connection.close(function (err2) {
                if (err2) console.log(err2); // 에러처리
            });
        });
    });
});

// user map
router.get('/usermap', (req, res, next) => {
    res.render('usermap');
});


router.post('/usermap', (req, res, next) => {
    var userid = req.body.userid;
    console.log(userid);
    ibmdb.open(dsn, function (err, connection) {
        if (err) { // 에러처리
            console.log(err);
            return;
        }
        // 특정 id data 불러올 때 : "select * from geotest where userid='321'"
        connection.query(`select geodata from geotest where userid='${userid}'`, function (err1, readData) {
            if (err1) console.log(err1); // 에러처리
            else {
                console.log(JSON.stringify(readData[0]));
                res.json(readData);
            }
            connection.close(function (err2) {
                if (err2) console.log(err2); // 에러처리
            });
        });
    });
});


module.exports = router;