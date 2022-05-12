const WomboDream = require('dream-api');

async function main() {
    await WomboDream.printStyles();
    let styles = await WomboDream.getStyles();
    console.log(await WomboDream.generateImage(1, "dog"));
}

main();