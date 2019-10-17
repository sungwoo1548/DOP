$(document).ready(() => {
    $('#IDdupCheck').click(() => {
        alert('xxxxx');
    });
});

const missionInsertTest = async () => {
    const missionTitle = document.getElementById("title");
    const companyName = document.getElementById("companyName");
    const companyAddrs = document.getElementById("companyAddress");
    const companyUrl = document.getElementById("companyURL");
    const managerName = document.getElementById("managerName");
    const managerEmail = document.getElementById("managerEmail1").value+'@'+document.getElementById("managerEmail2").value;
    const missionRule = document.getElementById("missionRule");
    const missionUserNum = document.getElementById("missionUserNum");
    const content = document.getElementById("content");
    const tag = document.getElementById("tag");
    const inputGroupFile = document.getElementById("inputGroupFile");
    const startDate = document.getElementById("startDate");
    const endDate = document.getElementById("endDate");
    const survey1 = document.getElementById("survey1");
    const survey2 = document.getElementById("survey2");
    const survey3 = document.getElementById("survey3");

    axios.post('/mission/insert',
        {
            'creator': companyName.value,
            'title': missionTitle.value,
            'companynum': "0000-0000-000",
            'companyAddrs': companyAddrs.value,
            'companyUrl': companyUrl.value,
            'creatorName': managerName.value,
            'creatorEmail': managerEmail,
            'missionRule': missionRule.value,
            'missionUserNum': missionUserNum.value,
            'content': content.value,
            'tag': tag.value,
            'inputGroupFile': inputGroupFile.value,
            'startDate': startDate.value,
            'endDate': endDate.value,
            'survey1': survey1.value,
            'survey2': survey2.value,
            'survey3': survey3.value
        })
        .then(res => {
            console.log(res);
        })
}

$(document).ready(() => {
    /* 회원가입 */
    let signupID = $('#signupID').val();
    let signupPW = $('#signupPassword').val();
    let PWFlag = false;

    // 사업자 등록 file 받는 Code 6 ~ 58
    var fileTarget = $('.filebox .upload-hidden');

    fileTarget.on('change', function(){
        if(window.FileReader){
            // 파일명 추출
            var filename = $(this)[0].files[0].name;
        } 

        else {
            // Old IE 파일명 추출
            var filename = $(this).val().split('/').pop().split('\\').pop();
        };

        $(this).siblings('.upload-name').val(filename);
    });

    //preview image 
    var imgTarget = $('.preview-image .upload-hidden');

    imgTarget.on('change', function(){
        var parent = $(this).parent();
        parent.children('.upload-display').remove();

        if(window.FileReader){
            //image 파일만
            if (!$(this)[0].files[0].type.match(/image\//)) return;
            
            var reader = new FileReader();
            reader.onload = function(e){
                var src = e.target.result;
                parent.prepend('<div class="upload-display"><div class="upload-thumb-wrap"><img src="'+src+'" class="upload-thumb"></div></div>');
            }
            reader.readAsDataURL($(this)[0].files[0]);
        }

        else {
            $(this)[0].select();
            $(this)[0].blur();
            var imgSrc = document.selection.createRange().text;
            parent.prepend('<div class="upload-display"><div class="upload-thumb-wrap"><img class="upload-thumb"></div></div>');

            var img = $(this).siblings('.upload-display').find('img');
            img[0].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enable='true',sizingMethod='scale',src=\""+imgSrc+"\")";        
        }
    });

    $('#IDdupCheck').click(() => {
        signupID = $('#signupID').val();;
        const checkedID = $('#signupID').val();
        // DB에서 checkedID 검색 후 중복값이 없으면 true로 만들기
        // checkedIDFlag = true; 
    });
    
    $('#passwordCheckBtn').click(() => {
        signupPW = $('#signupPassword').val();
        let regex = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
        const checkedPW = $('#signupPassword').val();
        const confirmPW = $('#passwordCheck').val();

        if(!regex.exec(checkedPW)) {
            alert('비밀번호 형식을 지켜주시기 바랍니다. ');
        } else {
            PWFlag = true;
            alert('비밀번호 형식에 맞습니다. ');
        }
        
        if(checkedPW != confirmPW) {
            alert('사용 가능한 비밀번호입니다. ');
        }
    });

    $('#signupBtn').click(() => {
        const checkedID = $('#signupID').val();
        const checkedPW = $('#signupPassword').val();
        const emailID = $('#signupEmailID1').val();
        const emailDomain = $('#signupEmailID2').val(); 
        const phoneNumber1 = $('#phoneNumber1').val();
        const phoneNumber2 = $('#phoneNumber2').val();
        const phoneNumber3 = $('#phoneNumber3').val();
        const companyIdenNumber1 = $('#companyidenNumber1').val();
        const companyIdenNumber2 = $('#companyidenNumber2').val();
        const companyIdenNumber3 = $('#companyidenNumber3').val();
        const signupEmail = emailID + emailDomain;
        const phoneNumber = phoneNumber1 + "-" + phoneNumber2 + "-" + phoneNumber3;
        const companyIdenNumber = companyIdenNumber1 + "-" + companyIdenNumber2 + "-" + companyIdenNumber3;
        const companyName = $('#companyName').val();
        const companyLocation = $('#companyLocation').val();
        const companyURL = $('#companyURL').val();
        let values = document.getElementsByName('category');
        let catVal ="";

        for(let i = 0; i < values.length; i++) {
            if(values[i].checked) {
                catVal += values[i].value + " ";
            }
        }

        alert(signupEmail);

        const send_params = {
            checkedID, checkedPW, signupEmail, 
            phoneNumber, companyIdenNumber,
            companyName, companyLocation, companyURL, catVal
        }

        if(signupID != checkedID) {
            alert('ID 중복 확인 버튼을 눌러주세요. ');
        } else if(!PWFlag) {
            alert('비밀번호 형식을 지켜주시기 바랍니다. ');
        } else if(signupPW != checkedPW) {
            alert('비밀번호 검증 확인 버튼을 눌러주세요. ');
        } else if(!(emailID && emailDomain)) {
            alert('Email 주소를 확인해주십시오. ');
        } else if(!(phoneNumber1 && phoneNumber2 && phoneNumber3)) {
            alert('연락처를 입력해주세요. ');
        } else if(!(companyIdenNumber1 && companyIdenNumber2 && companyIdenNumber3)) {
            alert('사업자 등록 번호를 입력해주세요. ');
        } else if(!companyName) {
            alert('회사명을 입력해주세요. ');
        } else if(!companyLocation) {
            alert('회사 주소를 입력해주세요. ');
        } else if(!companyURL) {
            alert('회사 URL를 입력해주세요. ');
        } else if(!catVal) {
            alert('업종을 선택해주세요. ');
        } else {
            $.post('/user/signup', send_params, (data, status) => {
                alert('회원가입이 완료되었습니다. 로그인을 하시기 바랍니다. ');
                console.log(data);
                location.href='/user/login';
            });
        }
        fileTarget.val();
    });


    /* 로그인 */
    $("#loginBtn").click(() => {
        const id = $("#loginID").val();
        const pw = $("#loginPassword").val();
        const send_params = {
            id,
            pw
        };

        $.post("/user/login", send_params, (data, status) => {
            window.location = '/';
            alert(data, status);        
        });
    });
});