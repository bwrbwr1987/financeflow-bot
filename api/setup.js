const https = require('https');

const ACCESS_TOKEN = 'hXdbAjqsLrRQdjmePJPmQgyt5JcAS2T4H1E4B2cHKMjADYbGTrD1EKKVLPUHv4QhgtQQ3vTHpe5da8l51P5etpu4xZkx0oDmjrotXU4EcNRrQJ8fY7TB0N8dhgxJHb2TcunFuK2Vht0nKX0RRLnaKQdB04t89/1O/w1cDnyilFU=';

const richMenuBody = {
  size: { width: 2500, height: 1686 },
  selected: true,
  name: "FinanceFlow Menu",
  chatBarText: "📊 Finance Menu",
  areas: [
    { bounds: { x: 0,    y: 0,    width: 1250, height: 562 }, action: { type: "message", text: "this month" } },
    { bounds: { x: 1250, y: 0,    width: 1250, height: 562 }, action: { type: "message", text: "summary month" } },
    { bounds: { x: 0,    y: 562,  width: 1250, height: 562 }, action: { type: "message", text: "summary" } },
    { bounds: { x: 1250, y: 562,  width: 1250, height: 562 }, action: { type: "message", text: "category" } },
    { bounds: { x: 0,    y: 1124, width: 1250, height: 562 }, action: { type: "message", text: "cancel" } },
    { bounds: { x: 1250, y: 1124, width: 1250, height: 562 }, action: { type: "message", text: "help" } }
  ]
};

function lineRequest(method, path, data, contentType = 'application/json') {
  return new Promise((resolve, reject) => {
    const body = contentType === 'application/json' ? JSON.stringify(data) : data;
    const options = {
      hostname: 'api.line.me',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': contentType,
        ...(body && { 'Content-Length': Buffer.byteLength(body) })
      }
    };
    const req = https.request(options, res => {
      let out = '';
      res.on('data', d => out += d);
      res.on('end', () => { try { resolve(JSON.parse(out)); } catch { resolve(out); } });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

module.exports = async (req, res) => {
  const log = [];
  try {
    log.push('1. Creating rich menu...');
    const menu = await lineRequest('POST', '/v2/bot/richmenu', richMenuBody);
    log.push('Result: ' + JSON.stringify(menu));

    if (!menu.richMenuId) {
      return res.status(500).send('<pre>' + log.join('\n') + '\n❌ No richMenuId returned</pre>');
    }

    log.push('2. Reading image from GitHub...');
    const imgRes = await fetch('https://raw.githubusercontent.com/bwrbwr1987/financeflow-bot/main/richmenu.png');
    const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
    log.push('Image size: ' + imgBuffer.length + ' bytes');

    log.push('3. Uploading image...');
    const upload = await lineRequest('POST', `/v2/bot/richmenu/${menu.richMenuId}/content`, imgBuffer, 'image/png');
    log.push('Upload result: ' + JSON.stringify(upload));

    log.push('4. Setting as default...');
    const def = await lineRequest('POST', `/v2/bot/setDefaultRichMenu/${menu.richMenuId}`, null);
    log.push('Default result: ' + JSON.stringify(def));

    log.push('✅ Done! Rich menu is live.');
    res.status(200).send('<pre>' + log.join('\n') + '</pre>');
  } catch(e) {
    log.push('❌ Error: ' + e.message);
    res.status(500).send('<pre>' + log.join('\n') + '</pre>');
  }
};
