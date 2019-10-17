var express = require('express');
var router = express.Router();
var ibmdb = require("ibm_db");

var dsn1 = require("../DBconfig");
var dsn2 = require("../DBconfig_2");


router.post('/checkId', (req, res, next) => {
    console.log(req.body);
    res.send({
        userId: req.body.userId,
        msg: "사용가능한 아이디 입니다."
    });
});

router.post('/certPhone', (req, res, next) => {
    console.log(req.body);
    res.send({
        personPhoneNum: req.body.personPhoneNum,
        msg: "로 인증번호가 발송 되었습니다."
    });
});

router.post('/checkCertNum', (req, res, next) => {
    const masterNum = '123456';

    console.log(req.body);
    if (masterNum == req.body.personCertNum) {
        res.send({
            isCerted: true,
            msg: "인증되었습니다."
        });
    } else {
        res.send({
            isCerted: false,
            msg: "인증번호가 틀렸습니다."
        });
    }
});

router.post('/resister', (req, res, next) => {
    console.log(req.body);
    ibmdb.open(dsn2, function (err, conn) {
        conn.prepare("insert into PERSONAL_INFO (person_name, person_birth, person_tel) VALUES (?, ?, ?)", function (err, stmt) {
            if (err) { //에러처리
                console.log(err);
                return conn.closeSync();
            }
            var person_name = escape(req.body.personName);
            var person_birth = req.body.personBirthDay;
            var person_tel = req.body.personPhoneNum;
            // var geodata_json = { DataType: "BLOB", "Data": JSON.stringify(req.body.gps) };  // ibm DB2에 json 형식 insert 문법.
            stmt.execute([person_name, person_birth, person_tel], function (err, result) {
                if (err) console.log(err); // 에러처리
                else {
                    console.log("[1]개인정보 등록 완료.")
                    // console.log(req.body);
                    // req.body.msg = "가입이 완료되었습니다.";
                    // res.json(req.body);
                    // result.closeSync();
                }
                //Close the connection
                // conn.close(function (err) { });
            });
        });
        conn.prepare("insert into USER_INFO (person_name, user_id, user_pw) VALUES (?, ?, ?)", function (err, stmt2) {
            if (err) { //에러처리
                console.log(err);
                return conn.closeSync();
            }
            var person_name = escape(req.body.personName);
            var user_id = escape(req.body.userId);
            var user_pw = req.body.userPassword;
            stmt2.execute([person_name, user_id, user_pw], function (err, result) {
                if (err) console.log(err); // 에러처리
                else {
                    console.log("[2]계정정보 등록 완료.");
                    req.body.msg = "가입이 완료되었습니다.";
                    res.json(req.body);
                    result.closeSync();
                }
                conn.close(function (err) { });
            });
        });
    });
});


router.post('/login', (req, res, next) => {
    console.log(req.body);
    ibmdb.open(dsn2, function (err, conn) {
        ibmdb.open(dsn2, function (err, connection) {
            if (err) { // 에러처리
                console.log(err);
                return;
            }
            // 특정 id data 불러올 때 : "select * from geotest where userid='321'"
            connection.query(`select * from USER_INFO where user_id='${escape(req.body.userId)}'`, function (err1, readData) {
                if (err1) console.log(err1); // 에러처리
                else {
                    if (readData[0]) {

                        if (escape(req.body.userPassword) == readData[0].USER_PW) {

                            console.log(unescape(readData[0].PERSON_NAME));
                            res.send({
                                msg: "로그인되었습니다.",
                                personName: unescape(readData[0].PERSON_NAME),
                                isLogin: true,
                            });
                        } else {
                            res.send({
                                msg: "비밀번호가 틀렸습니다.",
                                personName: unescape(readData[0].PERSON_NAME),
                                isLogin: false,
                            });
                        }
                        
                    } else {
                        res.send({
                            msg: "가입정보가 없습니다.",
                            personName: "",
                            isLogin: false,

                        });
                    }
                }
                connection.close(function (err2) {
                    if (err2) console.log(err2); // 에러처리
                    console.log("성우_db해제");
                });
            });
        });
    });
});
router.post('/getdata', (req, res, next) => {
    console.log(req.body);
    ibmdb.open(dsn1, function (err, conn) {
        if (err) { //에러처리
          console.log(err);
          return conn.closeSync();
        }
        // sql 구문
        const sql = `select * from missions_form`;
    
        conn.query(sql, (err, rs, fields) => {
          console.log("rs :"+rs);
          res.send({
            msg: rs
          });
        });
        // 연결 종료
        conn.close(function (err) { });
        console.log("희자_ DB연결 해제");
      });
});
module.exports = router;