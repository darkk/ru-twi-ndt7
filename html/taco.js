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
        $('#boringFrame').attr('src', 'https://speed.gulag.link/ndt7.html');
      } else if (seen === 2) {
        $('#seal').text('✅');
      }
    }

  console.log(e);
  });

})();
