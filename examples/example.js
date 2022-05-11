const readline = require('readline-sync');
const WomboDream = require('../dist/app');

async function main() {
    await WomboDream.printStyles();
    console.log(await WomboDream.generateImage(readline.question("Enter style number: "), readline.question("Enter prompt: ")));
}

main();