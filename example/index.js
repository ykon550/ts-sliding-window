const ws = require('ws');
const moment = require('moment');
const BigNumber = require('bignumber.js');

const opts = {
    tsProp: 'timestamp',
    propsForId: ['takerSide'],
    targetProp: 'amount',
    windowSize: 20000,  // in milliseconds
    refleshRate: 10,    // in milliseconds
}

const SW = require('../lib/ts-sliding-window');
const sw = new SW.SlidingWindow(opts);

const url = 'wss://stream.binance.com:9443/ws/btcusdt@trade';
const socket = new ws(url);

socket.on('open', () => console.log(`Binance Exchange's websocket connected`));
socket.on('err', (err) => console.log(`${err}`));
socket.on('close', () => console.log(`websocket closed`));
socket.on('message', (message) => {
    const json = JSON.parse(message);
    const _timestamp = moment(json.T);
    const _price = new BigNumber(json.p);
    const _size = new BigNumber(json.q);
    const _amount = _price.times(_size);
    const _side = json.m == true ? 'sell' : 'buy';
    const data = {
        takerSide: _side,
        price: _price,
        size: _size,
        amount: _amount,               
        timestamp: _timestamp,
    }
    sw.push(data);
    const displayData = {
        takerSide: _side,
        price: _price,
        timestamp: _timestamp,
    }
    process.stdout.write(`\r ${JSON.stringify(sw.sum())}, ${JSON.stringify(displayData)}`);
})

const main = () => {
    sw.start();
}

main();