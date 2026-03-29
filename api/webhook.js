const crypto = require('crypto');

const CHANNEL_SECRET = '0f319a7e28e23f35566dcb6db2797e5f';
const CHANNEL_ACCESS_TOKEN = 'hXdbAjqsLrRQdjmePJPmQgyt5JcAS2T4H1E4B2cHKMjADYbGTrD1EKKVLPUHv4QhgtQQ3vTHpe5da8l51P5etpu4xZkx0oDmjrotXU4EcNRrQJ8fY7TB0N8dhgxJHb2TcunFuK2Vht0nKX0RRLnaKQdB04t89/1O/w1cDnyilFU=';
const SUPA_URL = 'https://lubaxbzmwvzcxtxdfjzo.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1YmF4Ynptd3Z6Y3h0eGRmanpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MjQ2NzMsImV4cCI6MjA5MDMwMDY3M30.uVEPCWxgOf4x1Z-Q4MgM4Z3aVMZ495SD5uv_00PYRbc';

const CATS = {
  salary:'salary',bonus:'salary',freelance:'freelance',invest:'investment',
  stock:'investment',dividend:'investment',gift:'gift',
  food:'food',eat:'food',lunch:'food',dinner:'food',breakfast:'food',
  coffee:'food',cafe:'food',restaurant:'food',snack:'food',
  transport:'transport',taxi:'transport',grab:'transport',bts:'transport',
  mrt:'transport',bus:'transport',uber:'transport',fuel:'transport',petrol:'transport',
  shop:'shopping',buy:'shopping',clothes:'shopping',mall:'shopping',
  electric:'utilities',water:'utilities',internet:'utilities',bill:'utilities',phone:'utilities',
  health:'health',doctor:'health',hospital:'health',medicine:'health',gym:'health',
  movie:'entertainment',game:'entertainment',netflix:'entertainment',
  spotify:'entertainment',concert:'entertainment',
  rent:'rent',condo:'rent',house:'rent',housing:'rent',
};

const CAT_LABELS = {
  salary:'Salary 💼',freelance:'Freelance 🖥️',investment:'Investment 📈',
  gift:'Gift 🎁',other_income:'Other Income 💰',
  food:'Food & Dining 🍜',transport:'Transport 🚗',shopping:'Shopping 🛍️',
  utilities:'Utilities 💡',health:'Health 🏥',entertainment:'Entertainment 🎬',
  rent:'Rent/Housing 🏠',other_expense:'Other Expense 📦',
};

function parseMessage(text) {
  const low = text.toLowerCase();
  let type = low.match(/\b(income|salary|receive|got|freelance|invest|bonus|dividend|sell|sold|receive|ขาย|ได้รับ|รับ)\b/) ? 'income' : 'expense';
  const m = text.match(/[\d,]+(\.\d+)?/);
  const amount = m ? parseFloat(m[0].replace(/,/g,'')) : null;
  let category = null;
  for (const [k,v] of Object.entries(CATS)) {
    if (low.includes(k)) { category = v; break; }
  }
  if (!category) category = type === 'income' ? 'other_income' : 'other_expense';
  const detail = text.replace(/[\d,]+(\.\d+)?/g,'').replace(/\b(baht|thb)\b/gi,'').trim() || text;
  return { type, amount, category, detail };
}

const fmt = n => Number(n).toLocaleString('th-TH');

async function getSupabase(query) {
  const r = await fetch(`${SUPA_URL}/rest/v1/${query}`, {
    headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY }
  });
  return r.json();
}

async function insertSupabase(row) {
  const r = await fetch(`${SUPA_URL}/rest/v1/transactions`, {
    method: 'POST',
    headers: {
      'apikey': SUPA_KEY,
      'Authorization': 'Bearer ' + SUPA_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(row)
  });
  return r.json();
}

async function getSummary() {
  const data = await getSupabase('transactions?select=type,amount');
  const income  = data.filter(t=>t.type==='income') .reduce((s,t)=>s+Number(t.amount),0);
  const expense = data.filter(t=>t.type==='expense').reduce((s,t)=>s+Number(t.amount),0);
  const balance = income - expense;
  const savings = income > 0 ? ((balance/income)*100).toFixed(1) : 0;
  return { income, expense, balance, savings, count: data.length };
}

async function replyToLine(replyToken, message) {
  await fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      replyToken,
      messages: [{ type: 'text', text: message }]
    })
  });
}

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    return res.status(200).send('FinanceFlow LINE Bot is running! 🚀');
  }

  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers['x-line-signature'];
    const hash = crypto.createHmac('sha256', CHANNEL_SECRET).update(rawBody).digest('base64');

    if (signature !== hash) {
      return res.status(403).send('Invalid signature');
    }

    const body = JSON.parse(rawBody);
    const events = body.events || [];

    for (const event of events) {
      if (event.type !== 'message' || event.message.type !== 'text') continue;

      const text = event.message.text.trim();
      const replyToken = event.replyToken;
      const low = text.toLowerCase();

      if (low === 'summary' || low === 'สรุป' || low === 'balance' || low === 'ยอด') {
        const s = await getSummary();
        const msg =
          `📊 Your Summary\n` +
          `──────────────\n` +
          `💚 Income:  ฿${fmt(s.income)}\n` +
          `🔴 Expense: ฿${fmt(s.expense)}\n` +
          `⚖️ Balance: ฿${fmt(s.balance)}\n` +
          `💰 Savings: ${s.savings}%\n` +
          `📝 Total:   ${s.count} transactions`;
        await replyToLine(replyToken, msg);
        continue;
      }

      if (low === 'help' || low === 'ช่วย') {
        const msg =
          `🤖 FinanceFlow Bot\n` +
          `──────────────\n` +
          `Log income:\n` +
          `• salary 50000\n` +
          `• freelance 5000 design\n\n` +
          `Log expense:\n` +
          `• food 350 lunch\n` +
          `• grab 45 to office\n` +
          `• rent 8500\n\n` +
          `Commands:\n` +
          `• summary - see totals\n` +
          `• help - show this menu`;
        await replyToLine(replyToken, msg);
        continue;
      }

      const parsed = parseMessage(text);
      if (!parsed.amount) {
        await replyToLine(replyToken,
          `❓ I couldn't find an amount.\n\nTry:\n• food 350 lunch\n• salary 50000\n\nType "help" for commands.`
        );
        continue;
      }

      try {
        await insertSupabase({
          type: parsed.type,
          amount: parsed.amount,
          category: parsed.category,
          detail: parsed.detail,
          date: new Date().toISOString()
        });

        const s = await getSummary();
        const emoji = parsed.type === 'income' ? '💚' : '🔴';
        const catLabel = CAT_LABELS[parsed.category] || parsed.category;

        const msg =
          `${emoji} ${parsed.type === 'income' ? 'Income' : 'Expense'} saved!\n` +
          `──────────────\n` +
          `💵 Amount:   ฿${fmt(parsed.amount)}\n` +
          `📁 Category: ${catLabel}\n` +
          `📝 Note:     ${parsed.detail}\n` +
          `──────────────\n` +
          `⚖️ Balance:  ฿${fmt(s.balance)}`;

        await replyToLine(replyToken, msg);
      } catch(e) {
        await replyToLine(replyToken, `❌ Save failed. Please try again.`);
      }
    }

    res.status(200).send('OK');
  } catch(e) {
    console.error(e);
    res.status(200).send('OK');
  }
};
