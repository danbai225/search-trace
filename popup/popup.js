function post(api, data, success, error) {
  chrome.storage.sync.get(["data"], function (val) {
    host = val.data.host;
    token = val.data.token;
    $.ajax({
      type: "post",
      dataType: "json",
      url: host + api,
      headers: {
        token: token,
      },
      contentType: "application/json",
      data: JSON.stringify(data),
      success: success,
      error: error,
    });
  });
}
function get(api, data, success, error) {
  chrome.storage.sync.get(["data"], function (val) {
    host = val.data.host;
    token = val.data.token;
    $.ajax({
      type: "get",
      url: host + api,
      headers: {
        token: token,
      },
      dataType: "json",
      data: data,
      success: success,
      error: error,
    });
  });
}
loginFalg = false;
userinfo = {};
taburl = "";
chrome.storage.sync.get(["data"]).then((val) => {
  if (
    val.data != undefined &&
    val.data.token != undefined &&
    val.data.name == undefined
  ) {
    loginFalg = true;
  } else if (val.data.token != undefined && val.data.name != undefined) {
    loginFalg = true;
  }
});
$(function () {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    ([currentTab]) => {
      taburl = currentTab.url;
      chrome.runtime.sendMessage(
        {
          type: "ruleMatch",
          data: taburl,
        },
        function (res) {
          if (!res) {
            $("#add-black").html("移除黑名单");
          }
        }
      );
    }
  );
  $("#login-bt").click(login);
  $("#add-black").click(addTabUrlBlacklist);
  $("#sync-data").click(syncData);
  if (loginFalg) {
    setPage("start");
    get(
      "/api/v1/user/info",
      {},
      function (res) {
        if (res.code == 0) {
          userinfo = res.data;
        }
      },
      function () {
        clear();
        loginFalg = false;
        setPage("login");
      }
    );
  } else {
    setPage("login");
  }
});

function setPage(pageName) {
  $("#start-page").hide();
  $("#login-page").hide();
  switch (pageName) {
    case "login":
      $("#login-page").show();
      break;
    case "start":
      $("#start-page").show();
  }
}

function clear() {
  chrome.storage.sync.set({ data: {} });
}
function login() {
  host = $("#input-server").val();
  username = $("#input-username").val();
  pass = $("#input-pass").val();
  $.ajax({
    type: "post",
    dataType: "json",
    url: host + "/api/get_token",
    contentType: "application/json",
    data: JSON.stringify({
      name: username,
      pass: pass,
    }),
    success: function (result, status, xhr) {
      if (result.code == 0) {
        chrome.storage.sync.set({
          data: {
            host: host,
            token: result.data,
          },
        });
        setPage("start");
      } else {
        new $.zui.Messager("账号或密码不正确", {
          type: "warning",
        }).show();
      }
    },
    error: function (xhr, status, error) {
      new $.zui.Messager(error, {
        type: "danger",
      }).show();
    },
  });
}
function addTabUrlBlacklist() {
  if (taburl.indexOf("http") == -1) {
    return;
  }
  var domain = taburl.split("/");
  if (domain[2]) {
    domain = domain[2];
  } else {
    domain = "";
  }
  if (domain != "") {
    post("/api/v1/blacklist/add", {
      enable: true,
      mode: 1,
      match_pattern: 1,
      rules: domain + "*",
    });
  }
}
function syncData() {
  chrome.runtime.sendMessage({
    type: "syncData",
  });
}
