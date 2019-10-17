$(document).ready(function() {
    $('button[name=approval]').click(function () {
        var test = $(this).attr('id');
        let approval;
        $.post('/admin', {approval : 'approval', test}, (data, status)=>{
            alert('승인되었습니다.');
            alert(data, status);
            location.href = '/admin';
        });
    });

    $('button[name=refusal]').click(function () {
        var test = $(this).attr('id');
        let refusal;
        $.post('/admin', {refusal : 'refusal', test}, (data, status)=>{
            alert('거절되었습니다.');
            alert(data, status);
            location.href = '/admin';
        });
    });
});