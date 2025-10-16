require('dotenv').config();
const { Telegraf } = require('telegraf');
const { fetchSolToken } = require('./solFetcher');


const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);


bot.start(ctx => ctx.reply('👋 Paste a Solana token address and I’ll fetch live token data.'));


bot.on('text', async (ctx) => {
const address = ctx.message.text.trim();
try {
await ctx.replyWithChatAction('typing');
const info = await fetchSolToken(address);
const msg = `*${info.name || 'Unknown'} (${info.symbol || ''})*
💰 *Price:* $${Number(info.price).toFixed(6)}
💧 *Liquidity:* $${info.liquidity || 'N/A'}
📊 *24h Volume:* $${info.volume24h || 'N/A'}
🔗 [View on Solscan](${info.explorer})`;
await ctx.reply(msg, { parse_mode: 'Markdown', disable_web_page_preview: true });
} catch (err) {
console.error(err);
ctx.reply('⚠️ Could not fetch that token info. Make sure it’s a valid Solana address.');
}
});


bot.launch();
console.log('Solana trading info bot started');


process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
