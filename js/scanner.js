// ルール判定関数（必要に応じて書き換えてください）
function isValidQR(text) {
  // const rule = /^XXX-[0-9A-Z]+$/;
  // return rule.test(text.trim());
  return true;
}

window.addEventListener("DOMContentLoaded", () => {
  const readerElemId = "reader";
  const html5QrCode = new Html5Qrcode(readerElemId);

  const config = {
    fps: 10,
    qrbox: 250,
    videoConstraints: { facingMode: "user" }  // フロントカメラ優先
  };

  // QR 読み取り成功時
  const onSuccess = (decodedText, decodedResult) => {
    html5QrCode.stop().then(() => {
      // 判定を行わず、常に ok.html に遷移する
      // URLにQRコードのデータ（?code=...）を含めない
      setTimeout(() =>
        location.href = "./ok.html", 300);
    });
  };

  // スキャン中のエラー
  const onError = err => {
    const msgElem = document.getElementById("msg");
    if (msgElem) msgElem.textContent = "読み取りエラー：" + err;
  };

  // カメラ取得 & 開始
  Html5Qrcode.getCameras()
    .then(cameras => {
      if (cameras && cameras.length) {
        html5QrCode.start(
          { deviceId: { exact: cameras[0].id } },
          config,
          onSuccess,
          onError
        ).then(() => {
          const msgElem = document.getElementById("msg");
          if (msgElem) msgElem.textContent = "スキャン中…";
        });
      } else {
        const msgElem = document.getElementById("msg");
        if (msgElem) msgElem.textContent = "カメラが検出できません";
      }
    })
    .catch(err => {
      const msgElem = document.getElementById("msg");
      if (msgElem) msgElem.textContent = "カメラ取得失敗：" + err;
    });
});
