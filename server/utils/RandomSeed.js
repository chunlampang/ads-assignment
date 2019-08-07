module.exports = class RandomSeed {

    constructor(seed = Math.random()) {
        this.seed = seed;
        this.cursor = seed;
    }

    random() {
        let x = Math.sin(this.cursor++) * 10000;
        return x - Math.floor(x);
    }
};