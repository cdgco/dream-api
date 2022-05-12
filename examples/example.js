const WomboDream = require('dream-api');

async function main() {
    await WomboDream.printStyles();
    console.log(await WomboDream.generateImage(1, "cat"));
}

main();