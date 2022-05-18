import fetch from "./lib/fetch.min.js";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.type) {
    case "postText":
      postDataFunc(request.data);
      break;
    case "ruleMatch":
      sendResponse(ruleMatch(request.data))
      break;
    case "syncData":
      syncData()
      sendResponse(blacklist)
      break;
  }
});
var blacklist = []
function ruleMatch(url) {
  if (blacklist.length == 0) {
    return true
  }
  var flg = true
  blacklist.forEach(
    item => {
      if (item.enable) {
        item.rules.split('\n').forEach(r => {
          if (r.length==0){
            return
          }
          var reg
          if (item.match_pattern == 1) {
            reg = new RegExp(r.replace(/\*/g, "[^]*"));
          } else {
            reg = new RegExp(r);
          }
          if (reg.test(url)) {
            return item.mode == 1 ? flg = false : flg = true
          }
        })
      }
    }
  )
  return flg
}
function postDataFunc(data) {
  chrome.storage.sync.get(['data']).then((val) => {
    if (val.data!=undefined&&val.data.host != undefined) {
      if (ruleMatch(data.url)) {
        fetch.fetch(val.data.host + "/api/v1/trace/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "token": val.data.token,
          },
          body: JSON.stringify(data),
        });
      }
    }
  });
}

async function syncData() {
  await chrome.storage.sync.get(['data']).then((val) => {
    //黑名单配置
    if (val.data!=undefined&&val.data.host != undefined) {
      fetch.fetch(val.data.host + "/api/v1/blacklist/list", {
        method: "GET",
        headers: {
          "token": val.data.token,
        }
      }).then(response => {
        if (response.ok) {
          response.json().then(json => {
            val.data.blacklist = json.data
            chrome.storage.sync.set({
              "data": val.data
            });
            blacklist = json.data
          })
        }
      });
    }
  });
}
chrome.alarms.onAlarm.addListener(function (alarmInfo) {
  if (alarmInfo.name == 'sync-trace-data') {
    syncData()
  }
})
chrome.alarms.create('sync-trace-data', {
  when: 10 * 1000,
  periodInMinutes: 60
});
