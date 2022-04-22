loginFalg=false
chrome.storage.sync.get(['data']).then((val)=>{
    if (val.data.token!=undefined&&val.data.name==undefined){
        loginFalg=true
    }else if(val.data.token!=undefined&&val.data.name!=undefined){
        loginFalg=true
    }
});

$(function(){
    $("#login-bt").click(login);
    if(loginFalg){
        $("#login-page").hide();
    }else{
        $("#start-page").hide();
    }
});


function login(){
    host=$("#input-server").val();
    username=$("#input-username").val();
    pass=$("#input-pass").val();
    $.ajax({
        type: "post",
        dataType: 'json',
        url: host+"/api/get_token",
        contentType: 'application/json',
        data: JSON.stringify({
            "name": username,
            "pass": pass
        }),
        success: function (result,status,xhr) {
            if (result.code==0){
                new $.zui.Messager("登录成功", {
                    type: 'success'
                }).show();
                chrome.storage.sync.set({"data":{
                    "host":host,
                    "token":result.data
                }});
                chrome.storage.sync.get(['data'],function(val){
                    console.log(val);
                });
            }else{
                new $.zui.Messager("账号或密码不正确", {
                    type: 'warning'
                }).show();
            }
        },
        error:function(xhr,status,error){
            new $.zui.Messager(error, {
                type:"danger"
            }).show();
        }
    });
}
