 /*datapicker(달력) form*/
 $(function(){
    $('.input-group.date').datepicker({
        calendarWeeks: false,
        todayHighlight: true,
        autoclose: true,
        format: "yyyy/mm/dd",
        language: "kr"
    });
});
 /*survey form(설문)*/
function checkable(frm)
{
    if( frm.surveyCheck.checked == true ){
	   frm.survey.disabled = false;
	} else 
	{
	   frm.survey.disabled = true;
    }
    
}function checkable2(frm)
{
    if( frm.surveyCheck2.checked == true ){
	   frm.survey2.disabled = false;
	} else 
	{
	   frm.survey2.disabled = true;
    }
    
}function checkable3(frm)
{
    if( frm.surveyCheck3.checked == true ){
	   frm.survey3.disabled = false;
	} else 
	{
	   frm.survey3.disabled = true;
    }
    
}
/*adform 광고관리 */
$(document).ready(function() {
    $('').click(function() {


});
});

/*Adform 광고등록*/
$(document).ready(function() {
    $('#btnSave').click(function () {
        
        const title = $('#title').val();
        const managerName = $('#managerName').val();
        const managerEmail1 = $('#managerEmail1').val();
        const managerEmail2 = $('#managerEmail2').val();
        const managerEmail = managerEmail1+managerEmail2;
        const missionCondition = $('#missionCondition').val();
        const missionUserNum = $('#missionUserNum').val();
        const content = $('#content').val();
        const tag = $('#tag').val();
        const inputGroupFile = $('#inputGroupFile').val(); //주의
        const startDate = $('#startDate').val();
        const endDate = $('#endDate').val();
        const survey = $('#survey').val();
        const survey2 =$('#survey2').val();
        const survey3 =$('#survey3').val();
        const send_params = {
            title,
            managerName,
            managerEmail,
            missionCondition,
            missionUserNum,
            content,
            tag,
            inputGroupFile,
            startDate,
            endDate,
            survey,
            survey2,
            survey3
        };
        alert('success');
        console.log(send_params);
        $.post('/board', send_params, (data, status)=>{
            alert('등록이 끝났습니다.');
            alert(data, status);
            location.href = '/';
        });

    });
});