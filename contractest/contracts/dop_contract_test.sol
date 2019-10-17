pragma solidity ^0.5.8;

contract dop_contract_test {
    address owner;

    struct Users {
        uint timestamp;
        uint longitude;
        uint latitude;
    }

    mapping (address => Users) public users;

    constructor () public {
        owner = msg.sender;
    }

    modifier ownerOnly {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    function addUsers (address _address, uint _timestamp, uint _longitude, uint _latitude) public ownerOnly {    // 배포한 사용자만 사용해야 한다.
        users[_address] = Users(_timestamp, _longitude, _latitude);
    }

    // function eventAlram (string memory _candidate) public {  // owner만 후보자 등록 가능!
        
    // }

    function getUsersInfo (address _address) public view returns (uint, uint, uint) { // ownerOnly {    // 사용자만 볼 수 있다.
        return (users[_address].timestamp, users[_address].longitude, users[_address].latitude);
    }
}