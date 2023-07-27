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
        const styles = await WomboDream.getStyles();
        styles.should.be.an('array');
    });
    it('generateImage() (prompt only) responds with image object', async function() {
        this.image = await WomboDream.generateImage(1, "dog", this.token, null, "MEDIUM", null, null, function() {});
        this.image.should.have.property('result');
    });
    it('generateImage() (prompt + upload) responds with image object', async function() {
        this.image = await WomboDream.generateImage(1, "dog", this.token,'./test/test.jpg', "MEDIUM", null, null, function() {});
        this.image.should.have.property('result');
    });
});