// ルール判定関数（必要に応じて書き換えてください）
// true を返せば OK、false なら NG。
function isValidQR(text) {
  // 例：文字列が "XXX-" で始まる → OK
  // const rule = /^XXX-[0-9A-Z]+$/;
  // return rule.test(text.trim());
  return true;
}

window.addEventListener("DOMContentLoaded", () => {
  const readerElemId = "reader";
  const html5QrCode = new Html5Qrcode(readerElemId);
  const msgElem = document.getElementById("msg");
  if (msgElem) msgElem.textContent = "読み取りエラー：" + err;

  const config = {
    fps: 10,
    qrbox: 250,
    // フロントカメラを優先
    videoConstraints: { facingMode: "user" }
  };

  const onSuccess = (decodedText, decodedResult) => {
    // 一度読み取ったら停止
    html5QrCode.stop().then(() => {
      if (isValidQR(decodedText)) {
        // OK 画面に遷移（音は一旦無視）
        setTimeout(() => location.href = "ok.html?code=" + encodeURIComponent(decodedText), 300);
      } else {
        // NG 画面に遷移
        setTimeout(() => location.href = "ng.html?code=" + encodeURIComponent(decodedText), 300);
      }
    });
  };

  const onError = err => {
    document.getElementById("msg").textContent = "読み取りエラー：" + err;
  };

  // カメラ開始
  Html5Qrcode.getCameras().then(cameras => {
    if (cameras && cameras.length) {
      // 0 番目のカメラを使う
      html5QrCode.start(
        { deviceId: { exact: cameras[0].id } },
        config,
        onSuccess,
        onError
      ).then(() => {
        document.getElementById("msg").textContent = "スキャン中…";
      });
    }
  }).catch(err => {
    document.getElementById("msg").textContent = "カメラ取得失敗：" + err;
  });
});

