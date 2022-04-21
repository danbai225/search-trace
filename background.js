import fetch from "./fetch.min.js";
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.type) {
    case "postText": {
      postDataFunc(request.data);
      break;
    }
  }
});

function postDataFunc(data) {
  fetch.fetch("http://127.0.0.1:49492/trace/add", {
    mode: "no-cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: data,
  });
}
