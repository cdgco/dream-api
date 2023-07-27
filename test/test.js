const WomboDream = require('../dist/app');
const fs = require('fs');
const assert = require('assert');
var should = require('chai').should();

describe('dream-api tests', async function() {
    this.timeout(60000);
    this.retries(2);
    before(async function() {
        this.token = process.env.DREAM_API_KEY;
        this.image = null;
    });
    it('getStyles() responds with array of styles', async function() {
        console.log("Running Test 1");
        const styles = await WomboDream.getStyles();
        styles.should.be.an('array');
        console.log(styles)
        console.log("Finished Test 1");
    });
    it('generateImage() (prompt only) responds with image object', async function() {
        console.log("Running Test 2");
        this.image = await WomboDream.generateImage(1, "dog", this.token, null, "MEDIUM", 256, 256);
        this.image.should.have.property('result');
        console.log(this.image)
        console.log("Finished Test 2");
    });
    it('generateImage() (prompt + upload) responds with image object', async function() {
        console.log("Running Test 3");
        this.image = await WomboDream.generateImage(1, "dog", this.token,'./test/test.jpg', "MEDIUM", 256, 256);
        this.image.should.have.property('result');
        console.log(this.image)
        console.log("Finished Test 3");
    });
});