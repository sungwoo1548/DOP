var express = require('express');
var router = express.Router();
var ibmdb = require("ibm_db");
var dsn1 = require("../DBconfig");

router.get('/signup', function (req, res, next) {
    res.render('signup', {
        user_id: req.session.user_id,
        loginState: req.session.loginState
    });
});

router.post('/signup', (req, res, next) => {
    const result = {
        signupID: req.body.checkedID,
        signupPW: req.body.checkedPW,
        signupEmail: req.body.signupEmail,
        phoneNumber: req.body.phoneNumber,
        companyIdenNumber: req.body.companyIdenNumber,
        companyName: req.body.companyName,
        companyLocation: req.body.companyLocation,
        companyURL: req.body.companyURL,
        catVal: req.body.catVal
    };
    // db2 연결
    ibmdb.open(dsn1, function (err, conn) {
        // sql 구문_1
        conn.prepare("insert into company_user ( \
            company_id, company_pw, \
            company_email, company_tel, \
            company_idennum, company_name, \
            company_location, company_url, \
            company_category \
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", function (err, stmt) {
            if (err) { //에러처리
                console.log(err);
                return conn.closeSync();
            }
            // sql 구문_2
            // var test_json = { DataType: "BLOB", "Data": JSON.stringify({ name: escape('한글'), age: '11' }) };  // ibm DB2에 json 형식 insert 문법.
            stmt.execute([result.signupID, result.signupPW,
            result.signupEmail, result.phoneNumber,
            result.companyIdenNumber, result.companyName,
            result.companyLocation, result.companyURL,
            result.catVal
            ], function (err, results) {
                if (err) {
                    console.error(err.message);
                    res.json(JSON.stringify(results));
                } else {    //  query문이 정상일 경우 수행
                    result.txt = `회원 가입을 축하드립니다. ${req.body.checkedID}님`;
                    res.json(JSON.stringify(result));
                }
                // 연결 종료
                conn.close(function (err) { });
            });
        });
    });
});


router.get('/login', function (req, res, next) {
    res.render('login', {
        user_id: req.session.user_id,
        loginState: req.session.loginState
    });
});

router.post('/login', function (req, res, next) {
    const result = { msg: '' };

    ibmdb.open(dsn1, function (err, conn) {
        if (err) { //에러처리
            console.log(err);
            return conn.closeSync();
            result.msg = '다시 로그인해주세요';
            res.json(JSON.stringify(result.msg));
        }
        // sql 구문_2
        const sql = `select * from company_user where company_id=?`
        conn.query(sql, [req.body.id], (err, rs, fields) => {
            // console.log(rs[0].COMPANY_ID);
            if (err) {
                console.error(err.message);
                result.msg = '다시 로그인해주세요';
                res.json(JSON.stringify(result));
            } else {
                if (rs[0] && rs[0].COMPANY_ID) {
                    if (rs[0].COMPANY_PW == req.body.pw) {
                        req.session.regenerate(function (err) { console.log("세션ID=", req.sessionID) });
                        req.session.loginState = true;
                        req.session.user_id = req.body.id;
                        result.msg = `${req.body.id}님 로그인되셨습니다.`
                        res.json(JSON.stringify(result.msg));
                    } else {
                        result.msg = '다시 로그인해주세요';
                        res.json(JSON.stringify(result));
                    }
                } else {
                    result.msg = '다시 로그인해주세요';
                    res.json(JSON.stringify(result));
                }
            }
            // 연결 종료
            conn.close(function (err) { });
            console.log("DB연결 해제");
        });
    });
});

router.get('/logout', function (req, res, next) {
    console.log("로그아웃 처리", req.session.user_id);
    if (req.session.user_id) {

        req.session.destroy(function (err) {
            console.log("세션 디스트로이 완료");
            res.redirect('/');
        });
    }
});


router.get('/findid', function (req, res, next) {
    res.render('findid', {
        user_id: req.session.user_id,
        loginState: req.session.loginState
    });
});

router.get('/findpw', function (req, res, next) {
    res.render('findpw', {
        user_id: req.session.user_id,
        loginState: req.session.loginState
    });
});

module.exports = router;
