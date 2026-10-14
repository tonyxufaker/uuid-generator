(function () {
  var texts = {
    en: {
      copied: "Copied!",
      failed: "Copy failed. Please select the text and copy it manually."
    },
    zh: {
      copied: "已复制！",
      failed: "复制失败，请手动选中后复制。"
    }
  };

  var lang = document.documentElement.lang.indexOf("zh") === 0 ? "zh" : "en";
  var output = document.getElementById("uuid-output");
  var status = document.getElementById("status");
  var timer;

  // 生成 UUID v4：优先用浏览器自带方法，旧浏览器用备用方法
  function makeUUID() {
    if (window.crypto && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    var b = crypto.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 0x0f) | 0x40; // 版本 4
    b[8] = (b[8] & 0x3f) | 0x80; // 变体
    var h = Array.prototype.map.call(b, function (x) {
      return ("0" + x.toString(16)).slice(-2);
    }).join("");
    return h.slice(0, 8) + "-" + h.slice(8, 12) + "-" + h.slice(12, 16) + "-" +
           h.slice(16, 20) + "-" + h.slice(20);
  }

  function showStatus(message) {
    status.textContent = message;
    clearTimeout(timer);
    timer = setTimeout(function () { status.textContent = ""; }, 2000);
  }

  function generate() {
    output.value = makeUUID();
  }

  function fallbackCopy() {
    output.select();
    try {
      var ok = document.execCommand("copy");
      showStatus(ok ? texts[lang].copied : texts[lang].failed);
    } catch (e) {
      showStatus(texts[lang].failed);
    }
  }

  function copy() {
    var text = output.value;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showStatus(texts[lang].copied);
      }, fallbackCopy);
    } else {
      fallbackCopy();
    }
  }

  document.getElementById("btn-generate").addEventListener("click", generate);
  document.getElementById("btn-copy").addEventListener("click", copy);

  generate(); // 打开页面时自动生成一个
})();
