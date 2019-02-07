import * as moment from 'moment';
import BigNumber from 'bignumber.js';

export type TOptions = {
    tsProp?: string | 'timestamp',
    propsForId: string[], //Property Names used to create unique Id for sum
    targetProp: string,
    windowSize: number,
    refleshRate: number,
}

export class SlidingWindow {
    queue: any[];
    timer: NodeJS.Timeout;
    _sums: { [key: string]: BigNumber };
    opts: TOptions;
    constructor(opts: TOptions) {
        this.opts = opts;
        this.opts.tsProp = opts.tsProp || 'timestamp';
        this.queue = [];
        this.timer;
        this._sums = {};
        if (this.opts.refleshRate > this.opts.windowSize) throw new Error(`'windowSize' should be larger than 'refleshRate'`);
    }

    public start() {
        this.timer = setInterval(() => this._slide(), this.opts.refleshRate);
    }

    public stop() {
        clearInterval(this.timer);
    }

    public push(item) {
        let idx;
        for (idx = this.queue.length - 1; idx >= 0; idx--) {
            if (item[this.opts.tsProp].isSameOrAfter(this.queue[idx][this.opts.tsProp])) break;
        }
        this.queue.splice(idx + 1, 0, item);

        const sumId = this._getSumId(item);
        if (this._sums.hasOwnProperty(sumId)) {
            this._sums[sumId] = this._sums[sumId].plus(new BigNumber(item[this.opts.targetProp]));
        } else {
            this._sums[sumId] = new BigNumber(0);
            this._sums[sumId] = this._sums[sumId].plus(new BigNumber(item[this.opts.targetProp]));
        }
    }

    public sum(): { [key: string]: BigNumber } {
        this._slide();
        return this._sums;
    }

    public show(prop: string) {
        return this[prop];
    }

    test(item) {
        const test1 = item.hasOwnProperty(this.opts.tsProp) && moment.isMoment(item[this.opts.tsProp]);
        const test2 = BigNumber.isBigNumber(new BigNumber(item[this.opts.targetProp]));
        const test3 = this.opts.propsForId.every((elem) => item.hasOwnProperty(elem));
        console.log(`Does item has the property specified in tsProp and Is it moment.Moment type?`, test1);
        console.log(`Does item has the target property which castable to BigNumber type?`, test2);
        console.log(`Does item has all properties specified in propsForId? `, test3);
    }

    private _getSumId(item): string {
        const propNames = this.opts.propsForId.map((elem) => item[elem]);
        return propNames.join('_');
    }

    private _slide() {
        const threshold = moment().subtract(this.opts.windowSize);
        let lastIndex = this.queue.length - 1;
        let idx;
        for (idx = 0; idx <= lastIndex; idx++) {
            if (this.queue[idx][this.opts.tsProp].isBefore(threshold)) {
                const sumId = this._getSumId(this.queue[idx]);
                this._sums[sumId] = this._sums[sumId].minus(this.queue[idx][this.opts.targetProp]);
            } else if (this.queue[idx][this.opts.tsProp].isSameOrAfter(threshold)) {
                break;
            }
        }
        this.queue.splice(0, idx);
    }
}