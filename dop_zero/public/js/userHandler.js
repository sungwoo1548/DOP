$(document).ready(() => {
    $('#IDdupCheck').click(() => {
        alert('xxxxx');
    });
});

const missionInsert = async () => {
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