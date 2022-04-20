import fetch from "./fetch.min.js"
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch(request.type){
    case "postText":
       fetch.fetch('http://127.0.0.1:49492/trace/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: request.data
      });
      break
  }
});

