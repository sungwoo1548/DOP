var express = require('express');
var router = express.Router();
var ibmdb = require("ibm_db");
var dsn1 = require("../DBconfig");

router.get('/', function (req, res, next) {
  let result = {};

  ibmdb.open(dsn1, function (err, conn) {
    if (err) { //에러처리
      console.log(err);
      return conn.closeSync();
    }
    // sql 구문_2
    const sql = `select postNumber, title, missionUserNum, dateTime, startDate, endDate, adState from missions_form where company_id= '${req.session.user_id}'`;

    conn.query(sql, (err, rs, fields) => {
      console.log("result :"+JSON.stringify(rs[0]));
      res.render('board', {
        user_id: req.session.user_id,
        loginState: req.session.loginState,
        result: rs
      });
    });
    // 연결 종료
    conn.close(function (err) { });
    console.log("DB연결 해제");
  });
});

// Mission 신청
router.post('/', function (req, res, next) {
  const timestamp =+ new Date();
  // const startDate = new Date(req.body.startDate).toLocaleDateString();
  // const endDate = new Date(req.body.endDate).toLocaleString();

  var test_json = escape(req.body.inputGroupFile);  // ibm DB2에 json 형식 insert 문법.

  const result = {
    company_id: req.session.user_id,
    title: req.body.title,
    managerName: req.body.managerName,
    managerEmail: req.body.managerEmail,
    missionCondition: req.body.missionCondition,
    missionUserNum: req.body.missionUserNum,
    content: req.body.content,
    tag: req.body.tag,
    inputGroupFile: test_json,
    dataTime: timestamp,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    survey: req.body.survey,
    survey2: req.body.survey2,
    survey3: req.body.survey3
  };

  ibmdb.open(dsn1, function (err, conn) {
    // sql 구문_1
    conn.prepare("insert into missions_form ( \
      company_id, title, \
      managerName, managerEmail, \
      missionCondition, missionUserNum, \
      content, tag, \
      inputGroupFile, \
      startDate, endDate, \
      survey, survey2, survey3) \
      values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", function (err, stmt) {
      if (err) { //에러처리
        console.log(err);
        return conn.closeSync();
      }
      console.log(result);

      // sql 구문_2
      stmt.execute([result.company_id, result.title,
      result.managerName, result.managerEmail,
      result.missionCondition, result.missionUserNum,
      result.content, result.tag,
      result.inputGroupFile,
      result.startDate, result.endDate,
      result.survey, result.survey2, result.survey3
      ], function (err, results) {
        if (err) {
          console.error(err.message);
          res.json(JSON.stringify(results));
        } else {    //  query문이 정상일 경우 수행
          result.txt = `${req.body.title} 등록성공했습니다.`;
          res.json(JSON.stringify(results));
        }
        // 연결 종료
        conn.close(function (err) { });
      });
    });
  });
});


module.exports = router;