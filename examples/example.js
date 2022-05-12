const WomboDream = require('../dist/app');

async function main() {
    await WomboDream.printStyles();
    let styles = await WomboDream.getStyles();
    let token = await WomboDream.signUp();
    console.log(await WomboDream.generateImage(token.idToken, 1, "dog"));
}

main();