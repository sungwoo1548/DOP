var express = require('express');
var router = express.Router();

// ibm db2 connect import
var ibmdb = require("ibm_db");
var dsn1 = require("../DBconfig");

router.get('/', (req, res, next) => {
  let result = {
    rs: '자료 검색 오류'
  }

  ibmdb.open(dsn1, function (err, conn) {
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

const fs = require('fs');
const path = require('path');

const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin, Gateway } = require('fabric-network');

const ccpPath = path.resolve(__dirname, '..', 'basic_articles', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

// Create a new CA client for interacting with the CA.
const caURL = ccp.certificateAuthorities['ca.example.com'].url;
const ca = new FabricCAServices(caURL);

// Create a new file system based wallet for managing identities.
const walletPath = path.join(process.cwd(), 'wallet');
const wallet = new FileSystemWallet(walletPath);
console.log(`Wallet path: ${walletPath}`);



router.post('/', function (req, res, next) {
  let sign;
  
  ibmdb.open(dsn, function (err, conn) {
    if (err) { // 에러처리
      console.log(err);
      conn.close(function (err) { });
      return;
    }

    if (req.body.approval == 'approval') {
      console.log('-------------approval----------------');
      const sql = `update missions_form set "ADSTATE"= 'approval' where "POSTNUMBER" = '${req.body.test}'`

      conn.query(sql, (err, rs1, fields) => {
        if (err) {
          console.error(err.message);
          res.json(JSON.stringify(rs1));
        } else {  //  query문이 정상일 경우 수행
          sign = true;
          conn.close(function (err) { });
          //res.json(JSON.stringify(rs1));

          if (sign == true) {
            ibmdb.open(dsn, function (err, conn) {
              // sql_v2
              const sql = `select * from missions_form where postnumber='${req.body.test}'`
              conn.query(sql, async (err, rs3, fields) => {
                if (err) {
                  console.error(err.message);
                  res.json(JSON.stringify(rs3));
                } else {  //  query문이 정상일 경우 수행
                  // Ledger Connect
                  try {
                    // console.log(
                    //   rs2.company_id + ":" +
                    //   rs2.title + ":" +
                    //   rs2.companynum + ":" +
                    //   rs2.companyAddrs + ":" +
                    //   rs2.companyUrl + ":" +
                    //   rs2.creatorName + ":" +
                    //   rs2.creatorEmail + ":" +
                    //   rs2.missionrule + ":" +
                    //   rs2.missionUsers + ":" +
                    //   rs2.content + ":" +
                    //   rs2.tag + ":" +
                    //   rs2.imgFile + ":" +
                    //   rs2.startDate + ":" +
                    //   rs2.endDate + ":" +
                    //   rs2.survey1 + ":" +
                    //   rs2.survey2 + ":" +
                    //   rs2.survey3 + ":" +
                    //   rs2.adstate
                    // );
                    const userExists = await wallet.exists('user1');
                    if (!userExists) {
                      console.log('An identity for the user "user1" does not exist in the wallet');
                      await res.json({ 'msg': '연결부터 해주세요' });
                      return;
                    }
                    // Create a new gateway for connecting to our peer node.
                    const gateway = new Gateway();
                    await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
        
                    // Get the network (channel) our contract is deployed to.
                    const network = await gateway.getNetwork('mychannel');
        
                    // Get the contract from the network.
                    const contract = network.getContract('missions');
        
                    console.log("렛저 저장 시작!")
                    await contract.submitTransaction('createMission',
                      rs3[0].POSTNUMBER.toString(),
                      rs3[0].TITLE,
                      rs3[0].COMPANY_ID,
                      rs3[0].MANAGERNAME,
                      rs3[0].MANAGEREMAIL,
                      rs3[0].MISSIONCONDITION,
                      rs3[0].MISSIONUSERNUM.toString(),
                      rs3[0].CONTENT,
                      rs3[0].TAG,
                      rs3[0].INPUTGROUPFILE,
                      rs3[0].STARTDATE,
                      rs3[0].ENDDATE,
                      rs3[0].SURVEY,
                      rs3[0].SURVEY2,
                      rs3[0].SURVEY3
                    );
                    console.log('미션 BlockChain 저장 완료');
                  }
                  catch (e) {
                    console.log(e);
                  }
                }
              });
              // 연결 종료
              conn.close(function (err) { 
                res.json(JSON.stringify(rs1));
              });
            });
          }
        }
      });
    } else if (req.body.refusal == 'refusal') {
      console.log('-------------refusal----------------');
      const sql = `update missions_form set "ADSTATE" = 'refusal' where "POSTNUMBER" = '${req.body.test}'`

      conn.query(sql, (err, rs2, fields) => {
        if (err) {
          console.error(err.message);
          res.json(JSON.stringify(rs2));
          //  query문이 정상일 경우 수행
        } else {
          //console.log(rs1, fields);
          res.json(JSON.stringify(rs2));
        }
        conn.close(function (err2) {
          if (err2) console.log(err2); // 에러처리
        });
      });
    }
  });
});

module.exports = router;