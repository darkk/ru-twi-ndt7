(async function () {
  const resp = await fetch('https://stat.ripe.net/data/whats-my-ip/data.json?sourceapp=speed.gulag.link');
  if (!resp.ok) {
    throw new Error(`HTTP error, status: ${resp.status}`);
  }

  const bodyChunks = [];
  for (let chunk, reader = resp.body.getReader(); chunk = await reader.read(), !chunk.done; ) {
    const { value } = chunk; // Uint8Array
    bodyChunks.push(value);
  }
  const bodyBlob = new Uint8Array(bodyChunks.reduce((ax, el) => ax + el.length, 0));
  for (let dst = 0, n = 0; n < bodyChunks.length; dst += bodyChunks[n].length, n += 1) {
    bodyBlob.set(bodyChunks[n], dst)
  }
  bodyChunks.splice(0, bodyChunks.length); // free()

  const doc = JSON.parse((new TextDecoder('UTF-8')).decode(bodyBlob), 'text/html');
  $('#userip').text(doc.data.ip);

  $('#now').text((new Date()).toString());
})();

(function () {
  const eventMethod = window.addEventListener
      ? "addEventListener"
      : "attachEvent";
  const eventer = window[eventMethod];
  const messageEvent = eventMethod === "attachEvent"
    ? "onmessage"
    : "message";

  var seen = 0;

  eventer(messageEvent, function (e) {
    if (e.data === "ndt7done" || e.message === "ndt7done") {
      seen += 1;
      if (seen === 1) {
        $('#boringFrame').attr('src', 'https://speed-linode.gulag.link/ndt7.html');
      } else if (seen === 2) {
        $('#seal').text('☑ "Термометр работает, температура обнаружена". Если "замедленный" адрес выдаёт меньше 0.15 Mbit/s, а обычный больше 1.5 Mbit/s, то можно говорить о "замедлении". Если обе цифры больше 1.5 Mbit, то "замедления" не заметно, а большая разница между ними не важна – просто термометр плавится от нагрузки.');
      }
    }

  console.log(e);
  });

})();
