
const fs = require('fs');
const path = require('path');
const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');


(async () =>{
    const ccpPath = path.resolve(__dirname , 'basic_articles', 'connection.json');
   //ccp란 common connection profile의 약자
    const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
    const ccp = JSON.parse(ccpJSON);

    // 인증기관과 통신할 수 있는 객체 생성
    const caURL = ccp.certificateAuthorities['ca.example.com'].url;
    const ca = new FabricCAServices(caURL);

    // 신원 증명서를 저장할 지갑 생성
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);    

    // admin신원 증명서가 있는지 확인
    const adminExists = await wallet.exists('admin');
    if (!adminExists) {
       // Enroll the admin user, and import the new identity into the wallet.
       const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
       const identity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
       wallet.import('admin', identity);
       console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
    }   
    
  })();
  
