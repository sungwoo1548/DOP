var express = require('express');
var router = express.Router();
var ibmdb = require("ibm_db");
var dsn = require("../DBconfig");

router.get('/', (req, res, next) => {
  let result = {
    rs: '자료 검색 오류'
  }

  ibmdb.open(dsn, function (err, conn) {
    if (err) { // 에러처리
      console.log(err);
      return;
    } else { // connect good
      console.log('DB 연결 완료');
      const sql = `select * from missions_form`;
      console.log(sql);
      conn.query(sql, (err, rs, fields) => {
        console.log('xxxxxxxxxxxxxx');
        console.log(JSON.stringify(rs[0]));
        res.render('admin', {
          user_id: req.session.user_id,
          loginState: req.session.loginState,
          result: rs
        });
      });
    }
    conn.close(function (err) { });
    console.log("DB연결 해제");
  });
});

router.post('/', function (req, res, next) {
  console.log(req.body);
  ibmdb.open(dsn, function (err, conn) {
    if (err) { // 에러처리
      console.log(err);
      return;
    }
    if (req.body.approval == 'approval') {
      console.log(req.body);
      console.log('-------------approval----------------');
      const sql = `update missions_form set "ADSTATE"= 'approval' where "POSTNUMBER" = '${req.body.test}'`
      conn.query(sql, (err, results, fields) => {
        if (err) {
          console.error(err.message);
          res.json(JSON.stringify(results));
          //  query문이 정상일 경우 수행
        } else {
          console.log(results, fields);
          res.json(JSON.stringify(results));
        }
        // 연결 종료
        conn.close(function (err) { });
        console.log("DB연결 해제");
      });
    } else if (req.body.refusal == 'refusal') {
      console.log('-------------refusal----------------');
      const sql = `update missions_form set "ADSTATE" = 'refusal' where "POSTNUMBER" = '${req.body.test}'`

      conn.query(sql, (err, results, fields) => {
        if (err) {
          console.error(err.message);
          res.json(JSON.stringify(results));
          //  query문이 정상일 경우 수행
        } else {
          console.log(results, fields);
          res.json(JSON.stringify(results));
        }

        conn.close(function (err2) {
          if (err2) console.log(err2); // 에러처리
        });
      });
    }
  });
});

module.exports = router;