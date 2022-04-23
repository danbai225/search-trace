var oldHref = document.location.href;
var oldText = "";
//去除重复
function replace(str, substr, newstr) {
  var p = -1; // 字符出现位置
  var s = 0; // 下一次起始位置

  while ((p = str.indexOf(substr, s)) > -1) {
    s = p + newstr.length; // 位置 + 值的长度
    str = str.replace(substr, newstr);
  }

  return str;
}
/**
 * 相似度对比
 * @param s 文本1
 * @param t 文本2
 * @param f 小数位精确度，默认2位
 * @returns {string|number|*} 百分数前的数值，最大100. 比如 ：90.32
 */
function similar(s, t, f) {
  if (!s || !t) {
    return 0;
  }
  if (s === t) {
    return 100;
  }
  var l = s.length > t.length ? s.length : t.length;
  var n = s.length;
  var m = t.length;
  var d = [];
  f = f || 2;
  var min = function (a, b, c) {
    return a < b ? (a < c ? a : c) : b < c ? b : c;
  };
  var i, j, si, tj, cost;
  if (n === 0) return m;
  if (m === 0) return n;
  for (i = 0; i <= n; i++) {
    d[i] = [];
    d[i][0] = i;
  }
  for (j = 0; j <= m; j++) {
    d[0][j] = j;
  }
  for (i = 1; i <= n; i++) {
    si = s.charAt(i - 1);
    for (j = 1; j <= m; j++) {
      tj = t.charAt(j - 1);
      if (si === tj) {
        cost = 0;
      } else {
        cost = 1;
      }
      d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
    }
  }
  let res = (1 - d[n][m] / l) * 100;
  return res.toFixed(f);
}
//获取页面内容
function getText() {
  var contentStr = document.documentElement.innerText;
  contentStr = replace(contentStr, "\n", "");
  contentStr = replace(contentStr, "\t", "");
  contentStr = replace(contentStr, "\r", "");
  contentStr = replace(contentStr, " ", "");
  contentStr = replace(contentStr, " ", "");
  return contentStr;
}
//提交页面数据
function postText(text) {
  oldText = text;
  if (text.length > 0) {
    chrome.runtime.sendMessage({
      type: "postText",
      data: {
        title: document.title,
        content: text,
        url: document.URL,
      },
    });
  }
}
function myChange() {
  text = getText();
  if (similar(oldText, text) < 80) {
    postText(text);
  }
}
//监听url变化
function ListeningUrlChanges() {
  var bodyList = document.querySelector("body");
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (oldHref != document.location.href) {
        oldHref = document.location.href;
        myChange();
      }
    });
  });
  var config = {
    childList: true,
    subtree: true,
  };
  observer.observe(bodyList, config);
}

//页面加载后事件
window.onload = function(){
  ListeningUrlChanges();
  postText(getText());
}