// ルール判定関数（必要に応じて書き換えてください）
// true を返せば OK、false なら NG。
function isValidQR(text) {
  // 例：文字列が ""XXX-"" で始まる → OK
  //const rule = /^XXX-[0-9A-Z]+$/;
  //return rule.test(text.trim());
  return true;
}

window.addEventListener(""DOMContentLoaded"", () => {
  const readerElemId = ""reader"";
  const html5QrCode = new Html5Qrcode(readerElemId);

  const config = {
    fps: 10,
    qrbox: 250,
    // フロントカメラを優先
    videoConstraints: { facingMode: ""user"" }
  };

  const onSuccess = (decodedText, decodedResult) => {
    // 一度読み取ったら停止
    html5QrCode.stop().then(() => {
      if (isValidQR(decodedText)) {
        // OK 音を鳴らして OK 画面に遷移
        const okSound = new Audio(""sound/ok.mp3"");
        okSound.play().catch(()=>{});   // モバイル自動再生制限対策
        setTimeout(() => location.href = ""ok.html?code="" + encodeURIComponent(decodedText), 300);
      } else {
        // NG 音を鳴らして NG 画面に遷移
        const ngSound = new Audio(""sound/ng.mp3"");
        ngSound.play().catch(()=>{});
        setTimeout(() => location.href = ""ng.html?code="" + encodeURIComponent(decodedText), 300);
      }
    });
  };

  const onError = err => {
    document.getElementById(""msg"").textContent = ""読み取りエラー："" + err;
  };

  // カメラ開始
  Html5Qrcode.getCameras().then(cameras => {
    if (cameras && cameras.length) {
      // 0番目のカメラを使う（実機でフロント/リアの切替が必要ならUI追加）
      html5QrCode.start(
        { deviceId: { exact: cameras[0].id } },
        config,
        onSuccess,
        onError
      ).then(() => {
        document.getElementById(""msg"").textContent = ""スキャン中…"";
      });
    }
  }).catch(err => {
    document.getElementById(""msg"").textContent = ""カメラ取得失敗："" + err;
  });

});
