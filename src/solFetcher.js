
const axios = require('axios');


const JUPITER = process.env.JUPITER_API_BASE || 'https://price.jup.ag';
const DEXSCREENER = process.env.DEXSCREENER_API_BASE || 'https://api.dexscreener.com';
const SOLSCAN = process.env.SOLSCAN_API_BASE || 'https://pro-api.solscan.io';


async function fetchSolToken(address) {
// Try Jupiter price API first
try {
const priceUrl = `${JUPITER}/v4/price?ids=${encodeURIComponent(address)}`;
const res = await axios.get(priceUrl, { timeout: 7000 });
const data = res.data?.data?.[address];
if (data) {
return {
name: data.name || '',
symbol: data.symbol || '',
price: data.price || 0,
explorer: `https://solscan.io/token/${address}`,
liquidity: null,
volume24h: null
};
}
} catch (e) {}


// Try DexScreener fallback
try {
const url = `${DEXSCREENER}/latest/dex/tokens/${address}`;
const res = await axios.get(url, { timeout: 7000 });
const token = res.data.pairs?.[0];
if (token) {
return {
name: token.baseToken.name,
symbol: token.baseToken.symbol,
price: token.priceUsd,
liquidity: token.liquidity?.usd || 0,
volume24h: token.volume?.h24 || 0,
explorer: `https://solscan.io/token/${address}`
};
}
} catch (e) {}


// Solscan fallback for metadata
try {
const res = await axios.get(`${SOLSCAN}/v2.0/token/meta?address=${address}`, {
headers: { 'x-api-key': process.env.SOLSCAN_API_KEY || '' }
});
const token = res.data?.data || {};
return {
name: token.name || '',
symbol: token.symbol || '',
price: 0,
explorer: `https://solscan.io/token/${address}`,
liquidity: null,
volume24h: null
};
} catch (e) {
throw new Error('Solana token not found');
}
}


module.exports = { fetchSolToken };
