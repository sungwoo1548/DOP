const express = require('express');
const router = express.Router();
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

// DB2 Connect
var ibmdb = require("ibm_db");
var dsn = require("../DBconfig")//;

/* GET home page. */
router.post('/insert', async (req, res, next) => {

  // DB2 mission 입력
  // let missions = [];
  // ibmdb.open(dsn, function (err, connection) {
  //   if (err) { // 에러처리
  //     console.log(err);
  //     return;
  //   }
  //   // 특정 id data 불러올 때 : "select * from geotest where userid='321'"
  //   connection.query("select * from geotest", function (err1, readData) {
  //     if (err1) console.log(err1); // 에러처리
  //     else {
  //       let transDate = (JSON.parse(readData[0].GEODATA).timestamp);
  //       let fDate = new Date(transDate+(1000*60*60*9));
  //       let idx = 0;

  //       missions.push({
  //         idx: String(idx),
  //         userid: readData[0].USERID,
  //         timestamp: fDate.toLocaleString(),
  //         timestamp_original: JSON.stringify(JSON.parse(readData[0].GEODATA).timestamp),
  //         longitude: JSON.stringify(JSON.parse(readData[0].GEODATA).coords.longitude),
  //         latitude: JSON.stringify(JSON.parse(readData[0].GEODATA).coords.latitude),
  //       });
  //     }
  //     connection.close(function (err2) {
  //       if (err2) console.log(err2); // 에러처리
  //     });
  //   });
  // });

  //블록체인 에 미션 저장 
  try {
    console.log(req.body);
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

    await contract.submitTransaction('createMission',
      req.body.creator,
      req.body.title,
      req.body.companynum,
      req.body.companyAddrs,
      req.body.companyUrl,
      req.body.creatorName,
      req.body.creatorEmail,
      req.body.missionRule,
      req.body.missionUserNum,
      req.body.content,
      req.body.tag,
      req.body.inputGroupFile,
      req.body.startDate,
      req.body.endDate,
      req.body.survey1,
      req.body.survey2,
      req.body.survey3
    );

    console.log('미션 BlockChain 저장 완료');

  } catch (e) {
    console.log(e);

  }
  res.render('index', { title: 'Express' });
});

module.exports = router;
