console.log("load");
function replace(str, substr, newstr) {
  var p = -1; // 字符出现位置
  var s = 0; // 下一次起始位置

  while ((p = str.indexOf(substr, s)) > -1) {
    s = p + newstr.length; // 位置 + 值的长度
    str = str.replace(substr, newstr);
  }

  return str;
}
$(function () {
  var contentStr = $("body").text();
  contentStr = replace(contentStr, "\n", "");
  contentStr = replace(contentStr, "\t", "");
  contentStr = replace(contentStr, " ", "");
  if (contentStr.length > 0) {
    $.ajax({
      type: "post",
      url: "http://127.0.0.1:49492/trace/add",
      contentType: "application/json",
      data: JSON.stringify({
        title: document.title,
        content: contentStr,
        url: document.URL,
      }),
    });
  }
});
