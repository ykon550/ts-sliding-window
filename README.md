# ts-sliding-window
Simple implementation of Time Series Sliding Window.

## Install
```
npm install ts-sliding-window
```

## Example Application
![capture](https://github.com/ya9do/ts-sliding-window/blob/images/images/example%20app%20screen%20capture.gif)
This repository has internal NPM package for example application. Example app uses cryptocurrency exchange market, Binance. This app will fetch market data via WebSocket and `ts-sliding-window` calculates both of Buy/Sell volume in last 20 seconds.
### Example Application Install & Execution
```
$ cd example
$ npm install
$ node index.js
Binance Exchange's websocket connected
 {"sell":"1383.19499268","buy":"844.17605107"}, {"takerSide":"sell","price":"3656.34","timestamp":"2019-02-09T07:27:37.130Z"}
```