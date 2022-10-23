const WomboDream = require('../dist/app');
const fs = require('fs');
const assert = require('assert');
var should = require('chai').should();

describe('dream-api tests', async function() {
    this.timeout(60000);
    this.retries(2);
    before(async function() {
        this.auth = null;
        this.image = null;
    });
    it('signUp() responds with token object', async function() {
        this.auth = await WomboDream.signUp();
        this.auth.should.have.property('idToken');
    });
    it('refresh() responds with token object', async function() {
        const refresh = await WomboDream.refresh(this.auth.refreshToken);
        refresh.should.have.property('id_token');
    });
    it('getStyles() responds with array of styles', async function() {
        const styles = await WomboDream.getStyles();
        styles.should.be.an('array');
    });
    it('generateImage() (prompt only) responds with image object', async function() {
        this.image = await WomboDream.generateImage(1, "dog", this.auth.idToken, null, "MEDIUM", false, { "name": "", "public": false, "visible": true }, function() {});
        this.image.should.have.property('result');
    });
    it('generateImage() (prompt + buffer) responds with image object', async function() {
        const buffer = fs.readFileSync('./test/test.jpg');
        const image = await WomboDream.generateImage(1, "dog", this.auth.idToken, buffer, "MEDIUM", false, { "name": "", "public": false, "visible": true }, function() {});
        image.should.have.property('result');
    });
    it('responds with URL string', async function() {
        const card = await WomboDream.getTradingCardURL(this.auth.idToken, this.image.id);
        card.should.be.a('string');
    });
    it('responds with object', async function() {
        const shop = await WomboDream.getTaskShopURL(this.auth.idToken, this.image.id);
        shop.should.be.a('object');
    });


});