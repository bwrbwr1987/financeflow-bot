const fs = require('fs');
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

function lineRequest(method, path, data, isBuffer = false) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.line.me',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': isBuffer ? 'image/png' : 'application/json',
        ...(data && { 'Content-Length': Buffer.byteLength(isBuffer ? data : JSON.stringify(data)) })
      }
    };
    const req = https.request(options, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch { resolve(body); }
      });
    });
    req.on('error', reject);
    if (data) req.write(isBuffer ? data : JSON.stringify(data));
    req.end();
  });
}

async function setup() {
  console.log('1. Creating rich menu...');
  const menu = await lineRequest('POST', '/v2/bot/richmenu', richMenuBody);
  console.log('Menu ID:', menu.richMenuId);

  if (!menu.richMenuId) {
    console.error('Failed:', menu);
    return;
  }

  console.log('2. Uploading image...');
  const img = fs.readFileSync('./richmenu.png');
  const upload = await lineRequest('POST', `/v2/bot/richmenu/${menu.richMenuId}/content`, img, true);
  console.log('Upload:', upload);

  console.log('3. Setting as default...');
  const def = await lineRequest('POST', `/v2/bot/setDefaultRichMenu/${menu.richMenuId}`, null);
  console.log('Default:', def);

  console.log('✅ Done! Rich menu is live.');
}

setup().catch(console.error);
