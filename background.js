chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      "id": "sampleContextMenu",
      "title": "Sample Context Menu",
      "contexts": ["selection"]
    });
  });
  console.log("1232")