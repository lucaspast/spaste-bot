let [botsAmount] = process.argv.slice(2);
if (!botsAmount) botsAmount = 2;

const index = require('./index.js');
index.run(botsAmount);