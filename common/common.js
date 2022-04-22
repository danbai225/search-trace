window.db = {
    g: function (name) {
        return document.querySelector(name);
    },
    ga: function (name) {
        return document.querySelectorAll(name);
    },
}
function post(api,data,success,error){
    chrome.storage.sync.get(['data'],function(val){
        host=val.data.host;
        token=val.data.token;
        $.ajax({
            type: "post",
            dataType: 'json',
            url: host+api,
            headers: {
                "token": token
            },
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: success,
            error:error
        });
    });
}
function get(api,data,success,error){
    chrome.storage.sync.get(['data'],function(val){
        host=val.data.host;
        token=val.data.token;
        $.ajax({
            type: "get",
            url: host+api,
            headers: {
                "token": token
            },
            dataType: 'json',
            data: data,
            success: success,
            error:error
        });
    });
}