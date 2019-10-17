var express = require('express');
var router = express.Router();
var ibmdb = require("ibm_db");

// var dsn12 = "DATABASE=BLUDB;HOSTNAME=dashdb-txn-sbox-yp-dal09-03.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=bjr81526;PWD=qsl^240pblh3qnmx;";
var dsn1 = require("../DBconfig");

const crypto = require('crypto');

var app = express();

// main page render
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/mission', (req, res, next) => {
  res.render('mission');
});

module.exports = router;

// DB 저장 (inser into)
router.get('/insertDB', (req, res, next) => {
  ibmdb.open(dsn1, function (err, conn) {
    // conn.prepare("insert into geotest (userid, geodata) VALUES (?, ?)", function (err, stmt) {
    conn.prepare("insert into COMPANYS (COMPANY_ID, COMPANY_BNUM, COMPANY_TEL) VALUES (?, ?, ?)", function (err, stmt) {
      if (err) { //에러처리
        console.log(err);
        return conn.closeSync();
      }

      var test_json = { DataType: "BLOB", "Data": JSON.stringify({name:escape('한글'),age:'11'}) };  // ibm DB2에 json 형식 insert 문법.
      stmt.execute(['manamna', test_json, '000-0000-0000'], function (err, result) {
        if (err) console.log(err); // 에러처리
        else {
          res.send("good");
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
  ibmdb.open(dsn1, function (err, connection) {
    if (err) { // 에러처리
      console.log(err);
      return;
    }
    // Query문
    connection.query("select * from companys", function (err1, readData) {
      if (err1) console.log(err1); // 에러처리
      else {
        console.log(readData);
        console.log(unescape(JSON.parse(readData[3].COMPANY_BNUM).name)); // 한글 출력
      }
      connection.close(function (err2) {
        if (err2) console.log(err2); // 에러처리
      });
    });
  });
});

router.get('/setUser', (req, res, next) => {
  var setId = req.query.id;

  ibmdb.open(dsn1, function (err, connection) {
    if (err) { // 에러처리
      console.log(err);
      return;
    }
    // 특정 id data 불러올 때 : "select * from geotest where userid='321'"
    connection.query("select * from geotest where USERID='" + setId + "'", function (err1, readData) {
      if (err1) console.log(err1); // 에러처리
      else {
        let prams = [];
        let idx = 0;

        prams.push([setId]);
        prams.push([]);
        console.log(prams);
        // Date 함수 생성자 호출을 하여 사용해야 입력한 값의 시간을 출력한다.
        for (let i = 0; i < readData.length; i++) {
          let transDate = (JSON.parse(readData[i].GEODATA).timestamp);
          let fDate = new Date(transDate);
          idx += 1;

          prams[1].push({
            //prams.push({
            idx: String(idx),
            timestamp: JSON.stringify(JSON.parse(readData[i].GEODATA).timestamp),
            longitude: JSON.stringify(JSON.parse(readData[i].GEODATA).coords.longitude),
            latitude: JSON.stringify(JSON.parse(readData[i].GEODATA).coords.latitude),
          });
        }
        //console.log(prams);

        res.json(prams);
        //res.render('showdata', { data: readData }) // showdata 페이지 렌더
      }
      connection.close(function (err2) {
        if (err2) console.log(err2); // 에러처리
      });
    });
  });

});

// map page
router.get('/map', function(req, res, next) { 
  ibmdb.open(dsn1, function (err, connection) {
      if (err) {
          console.log(err);
          return;
      }
      connection.query("select * from geotest", function (err1, readData) {
          if(err1) console.log(err1);
              else {
              var lat = [];
              var lon = [];
              var list = [];
              var useridList = [];
              var userid = [];
              var timestamp = [];

              for(var i=0; i<readData.length; i++){
              userid[i] =readData[i].USERID;
              //console.log(userid[i]); undefined..
              timestamp[i] = new Date(JSON.parse(readData[i].GEODATA).timestamp).
                                      toLocaleString('ko-KR', {timeZone: 'Asia/Seoul'});
              lat[i] = JSON.parse(readData[i].GEODATA).coords.latitude;
              lon[i] = JSON.parse(readData[i].GEODATA).coords.longitude; 
              list[i] = [userid[i],timestamp[i],lat[i],lon[i]];
              }
              console.log(timestamp);
              //console.log(readData);
              //console.log(list);
              //res.render('map', { data: list, useridList: useridList })
              connection.query("select distinct userid from geotest", (err3, readUserid) => {
                  if (err3) console.log(err3);
                  else {
                      for (var i in readUserid) {
                          useridList.push(String(Object.values(readUserid[i])));
                      }
                      useridList.forEach((ele, idx) => {
                          var strList = ele.split(' ');
                          //useridList[idx] = strList[0];
                          console.log(useridList[idx]);
                      })
                      
                      //console.log('useridList', useridList);
                      //console.log('useridList Length', useridList.length);
                      //console.log(useridList[0], useridList[1]);
                      res.render('map', {
                          data: [
                              { geodata: list },
                              { useridList: useridList }
                          ]
                      });
                  }
              });
          }


          connection.close(function (err2) {
              if (err2) console.log(err2); // 에러처리
          });
      })
  })       
});

// import Sha256 from '//cdn.jsdelivr.net/gh/chrisveness/crypto@latest/sha256.js';

// document.addEventListener('DOMContentLoaded', function (event) {
//    document.querySelector('#message').oninput = function () {
//       var t1 = performance.now();
//       var hash = Sha256.hash(this.value);
//       var t2 = performance.now();

//       document.querySelector('#digest').value = hash;
//       // document.querySelector('#time').value = (t2 - t1).toFixed(3) + 'ms';
//    };

//    document.querySelector('#message').focus();
//    document.querySelector('#message').select();

//    document.querySelector('#message').oninput(); // initial hash call

//    // show source code
//    // fetch('//cdn.jsdelivr.net/gh/chrisveness/crypto@latest/sha256.js')
//    //     .then(function (res) { return res.ok ? res.text() : res.status + ' ' + res.statusText; })
//    //     .then(function (txt) { document.querySelector('#src-code').textContent = txt; prettyPrint(); })
//    //     .catch(function (err) { document.querySelector('#error').textContent = err.message; });
// });

