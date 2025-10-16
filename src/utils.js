function isSolanaAddress(text) {
return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(text);
}


module.exports = { isSolanaAddress };
