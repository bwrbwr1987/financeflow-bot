const crypto = require('crypto');

const CHANNEL_SECRET = '0f319a7e28e23f35566dcb6db2797e5f';
const CHANNEL_ACCESS_TOKEN = 'hXdbAjqsLrRQdjmePJPmQgyt5JcAS2T4H1E4B2cHKMjADYbGTrD1EKKVLPUHv4QhgtQQ3vTHpe5da8l51P5etpu4xZkx0oDmjrotXU4EcNRrQJ8fY7TB0N8dhgxJHb2TcunFuK2Vht0nKX0RRLnaKQdB04t89/1O/w1cDnyilFU=';
const SUPA_URL = 'https://lubaxbzmwvzcxtxdfjzo.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1YmF4Ynptd3Z6Y3h0eGRmanpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MjQ2NzMsImV4cCI6MjA5MDMwMDY3M30.uVEPCWxgOf4x1Z-Q4MgM4Z3aVMZ495SD5uv_00PYRbc';

const BUILT_IN_CATS = {
  // ── Income (English) ──
  salary:'salary',bonus:'salary',wage:'salary',paycheck:'salary',
  freelance:'freelance',commission:'freelance',
  invest:'investment',stock:'investment',dividend:'investment',fund:'investment',
  gift:'gift',present:'gift',sell:'other_income',sold:'other_income',
  receive:'other_income',received:'other_income',

  // ── Income (Thai) ──
  'เงินเดือน':'salary',
  'โบนัส':'salary',
  'ค่าจ้าง':'salary',
  'ฟรีแลนซ์':'freelance',
  'งานฟรี':'freelance',
  'ค่านายหน้า':'freelance',
  'ลงทุน':'investment',
  'หุ้น':'investment',
  'กองทุน':'investment',
  'ปันผล':'investment',
  'ของขวัญ':'gift',
  'ขาย':'other_income',
  'ได้รับ':'other_income',
  'รับเงิน':'other_income',

  // ── Food (English) ──
  food:'food',eat:'food',lunch:'food',dinner:'food',breakfast:'food',
  coffee:'food',cafe:'food',restaurant:'food',snack:'food',
  pizza:'food',sushi:'food',drink:'food',beverage:'food',

  // ── Food (Thai) ──
  'อาหาร':'food',
  'ข้าว':'food',
  'กับข้าว':'food',
  'ข้าวเช้า':'food',
  'ข้าวกลางวัน':'food',
  'ข้าวเย็น':'food',
  'อาหารเช้า':'food',
  'อาหารกลางวัน':'food',
  'อาหารเย็น':'food',
  'กาแฟ':'food',
  'ชา':'food',
  'ขนม':'food',
  'ของกิน':'food',
  'ร้านอาหาร':'food',
  'เบียร์':'food',
  'เครื่องดื่ม':'food',
  'ชาบู':'food',
  'หมูกะทะ':'food',

  // ── Transport (English) ──
  transport:'transport',taxi:'transport',grab:'transport',bts:'transport',
  mrt:'transport',bus:'transport',uber:'transport',fuel:'transport',
  petrol:'transport',gas:'transport',parking:'transport',toll:'transport',
  flight:'transport',train:'transport',

  // ── Transport (Thai) ──
  'แท็กซี่':'transport',
  'รถแท็กซี่':'transport',
  'แกร็บ':'transport',
  'รถเมล์':'transport',
  'รถไฟฟ้า':'transport',
  'บีทีเอส':'transport',
  'เอ็มอาร์ที':'transport',
  'ค่ารถ':'transport',
  'น้ำมัน':'transport',
  'ค่าน้ำมัน':'transport',
  'ค่าทางด่วน':'transport',
  'ที่จอดรถ':'transport',
  'ค่าจอดรถ':'transport',
  'วินมอเตอร์ไซค์':'transport',
  'มอเตอร์ไซค์':'transport',
  'เครื่องบิน':'transport',
  'ตั๋วเครื่องบิน':'transport',

  // ── Shopping (English) ──
  shop:'shopping',buy:'shopping',clothes:'shopping',mall:'shopping',
  market:'shopping',fashion:'shopping',shoes:'shopping',bag:'shopping',

  // ── Shopping (Thai) ──
  'ซื้อ':'shopping',
  'ช้อปปิ้ง':'shopping',
  'เสื้อผ้า':'shopping',
  'เสื้อ':'shopping',
  'กางเกง':'shopping',
  'รองเท้า':'shopping',
  'กระเป๋า':'shopping',
  'ห้างสรรพสินค้า':'shopping',
  'ตลาด':'shopping',
  'ของใช้':'shopping',

  // ── Utilities (English) ──
  electric:'utilities',water:'utilities',internet:'utilities',
  bill:'utilities',phone:'utilities',mobile:'utilities',wifi:'utilities',

  // ── Utilities (Thai) ──
  'ค่าไฟ':'utilities',
  'ค่าน้ำ':'utilities',
  'ค่าไฟฟ้า':'utilities',
  'ค่าประปา':'utilities',
  'ค่าอินเทอร์เน็ต':'utilities',
  'ค่าโทรศัพท์':'utilities',
  'ค่าโทร':'utilities',
  'ค่าเน็ต':'utilities',
  'ค่าวายฟาย':'utilities',
  'ค่าบิล':'utilities',

  // ── Health (English) ──
  health:'health',doctor:'health',hospital:'health',
  medicine:'health',pharmacy:'health',gym:'health',dental:'health',

  // ── Health (Thai) ──
  'หมอ':'health',
  'โรงพยาบาล':'health',
  'คลินิก':'health',
  'ยา':'health',
  'ค่ายา':'health',
  'ค่าหมอ':'health',
  'ทันตกรรม':'health',
  'ฟิตเนส':'health',
  'ออกกำลังกาย':'health',
  'ร้านขายยา':'health',

  // ── Entertainment (English) ──
  movie:'entertainment',game:'entertainment',netflix:'entertainment',
  spotify:'entertainment',concert:'entertainment',travel:'entertainment',

  // ── Entertainment (Thai) ──
  'หนัง':'entertainment',
  'ดูหนัง':'entertainment',
  'คอนเสิร์ต':'entertainment',
  'เกม':'entertainment',
  'ท่องเที่ยว':'entertainment',
  'เที่ยว':'entertainment',
  'ท่องเที่ยว':'entertainment',
  'สวนสนุก':'entertainment',
  'ร้องคาราโอเกะ':'entertainment',
  'คาราโอเกะ':'entertainment',

  // ── Rent/Housing (English) ──
  rent:'rent',condo:'rent',house:'rent',housing:'rent',
  mortgage:'rent',dormitory:'rent',

  // ── Rent/Housing (Thai) ──
  'ค่าเช่า':'rent',
  'ค่าคอนโด':'rent',
  'ค่าห้อง':'rent',
  'ค่าบ้าน':'rent',
  'หอพัก':'rent',
  'อพาร์ตเมนต์':'rent',
  'ผ่อนบ้าน':'rent',
  'ผ่อนคอนโด':'rent',
};

const CAT_LABELS = {
  salary:'Salary 💼',freelance:'Freelance 🖥️',investment:'Investment 📈',
  gift:'Gift 🎁',other_income:'Other Income 💰',
  food:'Food & Dining 🍜',transport:'Transport 🚗',shopping:'Shopping 🛍️',
  utilities:'Utilities 💡',health:'Health 🏥',entertainment:'Entertainment 🎬',
  rent:'Rent/Housing 🏠',other_expense:'Other Expense 📦',
};

const INCOME_CATS = ['salary','freelance','investment','gift','other_income'];
const EXPENSE_CATS = ['food','transport','shopping','utilities','health','entertainment','rent','other_expense'];

const fmt = n => Number(n).toLocaleString('th-TH');

// ── Supabase helpers ──────────────────────────────────────
async function dbGet(query) {
  const r = await fetch(`${SUPA_URL}/rest/v1/${query}`, {
    headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY }
  });
  return r.json();
}

async function dbPost(table, row) {
  const r = await fetch(`${SUPA_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
    body: JSON.stringify(row)
  });
  return r.json();
}

async function dbPatch(table, filter, row) {
  await fetch(`${SUPA_URL}/rest/v1/${table}?${filter}`, {
    method: 'PATCH',
    headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(row)
  });
}

async function dbDelete(table, filter) {
  await fetch(`${SUPA_URL}/rest/v1/${table}?${filter}`, {
    method: 'DELETE',
    headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY }
  });
}

// ── Session helpers ───────────────────────────────────────
async function getSession(userId) {
  const rows = await dbGet(`bot_sessions?user_id=eq.${userId}`);
  return rows && rows.length > 0 ? rows[0] : null;
}

async function setSession(userId, state, data) {
  const existing = await getSession(userId);
  if (existing) {
    await dbPatch('bot_sessions', `user_id=eq.${userId}`, { state, data, updated: new Date().toISOString() });
  } else {
    await dbPost('bot_sessions', { user_id: userId, state, data, updated: new Date().toISOString() });
  }
}

async function clearSession(userId) {
  await dbDelete('bot_sessions', `user_id=eq.${userId}`);
}

// ── Custom category helpers ───────────────────────────────
async function getCustomCategories() {
  return dbGet('custom_categories?select=*');
}

async function saveCustomCategory(name, type, keywords) {
  await dbPost('custom_categories', { name, type, keywords });
}

// ── Parser ────────────────────────────────────────────────
async function parseMessage(text) {
  const low = text.toLowerCase();

  // Check custom categories first
  const customCats = await getCustomCategories();
  for (const cc of (customCats || [])) {
    const keywords = (cc.keywords || '').split(',').map(k => k.trim().toLowerCase());
    for (const kw of keywords) {
      if (kw && low.includes(kw)) {
        const m = text.match(/[\d,]+(\.\d+)?/);
        const amount = m ? parseFloat(m[0].replace(/,/g, '')) : null;
        const detail = text.replace(/[\d,]+(\.\d+)?/g, '').replace(/\b(baht|thb)\b/gi, '').trim() || text;
        return { type: cc.type, amount, category: cc.name, detail, confident: true };
      }
    }
  }

  // Check built-in keywords
  let type = (low.includes('เงินเดือน') || low.includes('โบนัส') || low.includes('ขาย') || low.includes('ได้รับ') || low.includes('รับเงิน') || low.includes('ฟรีแลนซ์') || low.includes('หุ้น') || low.includes('ปันผล') || low.includes('ของขวัญ') || low.match(/\b(income|salary|receive|got|freelance|invest|bonus|dividend|sell|sold)\b/)) ? 'income' : 'expense';
  const m = text.match(/[\d,]+(\.\d+)?/);
  const amount = m ? parseFloat(m[0].replace(/,/g, '')) : null;
  let category = null;
  let confident = false;

  for (const [k, v] of Object.entries(BUILT_IN_CATS)) {
    if (low.includes(k)) { category = v; confident = true; break; }
  }

  if (!category) {
    category = type === 'income' ? 'other_income' : 'other_expense';
    confident = false; // not sure!
  }

  const detail = text.replace(/[\d,]+(\.\d+)?/g, '').replace(/\b(baht|thb)\b/gi, '').trim() || text;
  return { type, amount, category, detail, confident };
}

async function getSummary(period = 'all') {
  let query = 'transactions?select=type,amount,date';
  const now = new Date();

  if (period === 'this_month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
    query += `&date=gte.${start}&date=lte.${end}`;
  } else if (period === 'last_month') {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();
    query += `&date=gte.${start}&date=lte.${end}`;
  }

  const data = await dbGet(query);
  const income  = data.filter(t => t.type === 'income') .reduce((s, t) => s + Number(t.amount), 0);
  const expense = data.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
  const balance = income - expense;
  const savings = income > 0 ? ((balance / income) * 100).toFixed(1) : 0;
  return { income, expense, balance, savings, count: data.length };
}

async function replyToLine(replyToken, message) {
  await fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ replyToken, messages: [{ type: 'text', text: message }] })
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

// ── Main handler ──────────────────────────────────────────
module.exports = async (req, res) => {
  if (req.method === 'GET') return res.status(200).send('FinanceFlow Bot running! 🚀');
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers['x-line-signature'];
    const hash = crypto.createHmac('sha256', CHANNEL_SECRET).update(rawBody).digest('base64');
    if (signature !== hash) return res.status(403).send('Invalid signature');

    const body = JSON.parse(rawBody);
    const events = body.events || [];

    for (const event of events) {
      if (event.type !== 'message' || event.message.type !== 'text') continue;

      const text = event.message.text.trim();
      const replyToken = event.replyToken;
      const userId = event.source.userId;
      const low = text.toLowerCase();

      // ── Check if user is in a conversation session ──
      const session = await getSession(userId);

      if (session) {
        const state = session.state;
        const data = session.data;

        // State: waiting for income/expense choice
        if (state === 'ask_type') {
          if (text === '1') {
            await setSession(userId, 'ask_category', { ...data, type: 'income' });
            const customCats = await getCustomCategories();
            const customIncome = customCats.filter(c => c.type === 'income');
            let menu = `💚 Income selected!\n\nChoose category:\n`;
            INCOME_CATS.forEach((c, i) => { menu += `${i+1}. ${CAT_LABELS[c]||c}\n`; });
            customIncome.forEach((c, i) => { menu += `${INCOME_CATS.length+i+1}. ${c.name} ⭐\n`; });
            menu += `${INCOME_CATS.length+customIncome.length+1}. ✨ Create new category`;
            await replyToLine(replyToken, menu);
          } else if (text === '2') {
            await setSession(userId, 'ask_category', { ...data, type: 'expense' });
            const customCats = await getCustomCategories();
            const customExpense = customCats.filter(c => c.type === 'expense');
            let menu = `🔴 Expense selected!\n\nChoose category:\n`;
            EXPENSE_CATS.forEach((c, i) => { menu += `${i+1}. ${CAT_LABELS[c]||c}\n`; });
            customExpense.forEach((c, i) => { menu += `${EXPENSE_CATS.length+i+1}. ${c.name} ⭐\n`; });
            menu += `${EXPENSE_CATS.length+customExpense.length+1}. ✨ Create new category`;
            await replyToLine(replyToken, menu);
          } else {
            await replyToLine(replyToken, 'Please reply 1 for Income 💚 or 2 for Expense 🔴');
          }
          continue;
        }

        // State: waiting for category choice
        if (state === 'ask_category') {
          const type = data.type;
          const baseCats = type === 'income' ? INCOME_CATS : EXPENSE_CATS;
          const customCats = await getCustomCategories();
          const customTyped = customCats.filter(c => c.type === type);
          const allCats = [...baseCats, ...customTyped.map(c => c.name)];
          const newCatIndex = allCats.length + 1;
          const choice = parseInt(text);

          if (choice === newCatIndex || low === 'new' || low === 'create') {
            await setSession(userId, 'ask_new_category_name', data);
            await replyToLine(replyToken, '✨ What should I call this new category?\n\nJust type the name e.g. "Vehicle Sale" or "Pet Food"');
          } else if (choice >= 1 && choice <= allCats.length) {
            const chosenCat = allCats[choice - 1];
            await saveAndReply(replyToken, userId, data, type, chosenCat);
          } else {
            await replyToLine(replyToken, `Please choose a number between 1 and ${newCatIndex}`);
          }
          continue;
        }

        // State: waiting for new category name
        if (state === 'ask_new_category_name') {
          const categoryName = text;
          const type = data.type;

          // Save the new category with the original keywords
          const keywords = data.detail || '';
          await saveCustomCategory(categoryName, type, keywords);
          await saveAndReply(replyToken, userId, data, type, categoryName, true);
          continue;
        }
      }

      // ── No session — handle fresh messages ──

      // Cancel last transaction
      if (low === 'cancel' || low === 'ยกเลิก' || low === 'ลบ') {
        try {
          const rows = await dbGet('transactions?select=id&order=id.desc&limit=1');
          if (rows && rows.length > 0) {
            await dbDelete('transactions', `id=eq.${rows[0].id}`);
            await replyToLine(replyToken, '✅ Last transaction deleted!');
          } else {
            await replyToLine(replyToken, '❌ No transactions to delete.');
          }
        } catch { await replyToLine(replyToken, '❌ Could not delete.'); }
        continue;
      }
      
// Show categories
if (low === 'category' || low === 'categories' || low === 'show category' || low === 'show categories' || low === 'หมวด' || low === 'ประเภท') {
  const customCats = await getCustomCategories();
  const customIncome = (customCats || []).filter(c => c.type === 'income');
  const customExpense = (customCats || []).filter(c => c.type === 'expense');

  let msg = `📁 Your Categories\n──────────────\n`;
  msg += `💚 INCOME:\n`;
  INCOME_CATS.forEach(c => { msg += `  • ${CAT_LABELS[c]||c}\n`; });
  customIncome.forEach(c => { msg += `  • ${c.name} ⭐\n`; });

  msg += `\n🔴 EXPENSE:\n`;
  EXPENSE_CATS.forEach(c => { msg += `  • ${CAT_LABELS[c]||c}\n`; });
  customExpense.forEach(c => { msg += `  • ${c.name} ⭐\n`; });

  msg += `\n⭐ = your custom categories`;
  await replyToLine(replyToken, msg);
  continue;
}

      // Summary - all time
if (low === 'summary' || low === 'สรุป' || low === 'balance' || low === 'ยอด') {
  const s = await getSummary('all');
  await replyToLine(replyToken,
    `📊 All Time Summary\n──────────────\n💚 Income:  ฿${fmt(s.income)}\n🔴 Expense: ฿${fmt(s.expense)}\n⚖️ Balance: ฿${fmt(s.balance)}\n💰 Savings: ${s.savings}%\n📝 Total:   ${s.count} transactions`
  );
  continue;
}

// This month summary
if (low === 'this month' || low === 'เดือนนี้' || low === 'monthly' || low === 'month') {
  const s = await getSummary('this_month');
  const now = new Date();
  const monthName = now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  await replyToLine(replyToken,
    `📅 ${monthName}\n──────────────\n💚 Income:  ฿${fmt(s.income)}\n🔴 Expense: ฿${fmt(s.expense)}\n⚖️ Balance: ฿${fmt(s.balance)}\n💰 Savings: ${s.savings}%\n📝 Total:   ${s.count} transactions`
  );
  continue;
}

// Last month summary
if (low === 'last month' || low === 'เดือนที่แล้ว') {
  const s = await getSummary('last_month');
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const monthName = lastMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  await replyToLine(replyToken,
    `📅 ${monthName}\n──────────────\n💚 Income:  ฿${fmt(s.income)}\n🔴 Expense: ฿${fmt(s.expense)}\n⚖️ Balance: ฿${fmt(s.balance)}\n💰 Savings: ${s.savings}%\n📝 Total:   ${s.count} transactions`
  );
  continue;
}

      // Help
      if (low === 'help' || low === 'ช่วย') {
        await replyToLine(replyToken,
          `🤖 FinanceFlow Commands:\n──────────────\n• food 350 lunch → log expense\n• salary 50000 → log income\n• summary → all time totals\n• this month → this month totals\n• last month → last month totals\n• category → show all categories\n• cancel → delete last entry\n• help → this menu`
        );
        continue;
      }

      // Parse transaction
      const parsed = await parseMessage(text);

      if (!parsed.amount) {
        await replyToLine(replyToken, `❓ I couldn't find an amount.\n\nTry:\n• food 350 lunch\n• salary 50000\n\nType "help" for commands.`);
        continue;
      }

      // Confident — save directly
      if (parsed.confident) {
        await saveAndReply(replyToken, userId, parsed, parsed.type, parsed.category);
        continue;
      }

      // Not confident — ask user
      await setSession(userId, 'ask_type', {
        amount: parsed.amount,
        detail: parsed.detail,
        originalText: text
      });

      await replyToLine(replyToken,
        `🤔 Not sure about this one!\n\n💵 Amount: ฿${fmt(parsed.amount)}\n📝 "${parsed.detail}"\n\nIs this:\n1️⃣ Income 💚\n2️⃣ Expense 🔴`
      );
    }

    res.status(200).send('OK');
  } catch(e) {
    console.error(e);
    res.status(200).send('OK');
  }
};

// ── Save transaction and reply ────────────────────────────
async function saveAndReply(replyToken, userId, data, type, category, isNewCat = false) {
  try {
    await dbPost('transactions', {
      type,
      amount: data.amount,
      category,
      detail: data.detail,
      date: new Date().toISOString()
    });

    await clearSession(userId);
    const s = await getSummary();
    const emoji = type === 'income' ? '💚' : '🔴';
    const newCatMsg = isNewCat ? '\n🧠 New category saved! I\'ll remember this next time.' : '';

    await replyToLine(replyToken,
      `${emoji} ${type === 'income' ? 'Income' : 'Expense'} saved!\n──────────────\n💵 Amount:   ฿${Number(data.amount).toLocaleString('th-TH')}\n📁 Category: ${category}\n📝 Note:     ${data.detail}\n──────────────\n⚖️ Balance:  ฿${Number(s.balance).toLocaleString('th-TH')}${newCatMsg}`
    );
  } catch(e) {
    await clearSession(userId);
    await replyToLine(replyToken, `❌ Save failed. Please try again.`);
  }
}
