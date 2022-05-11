# Wombo Dream API
NodeJS API for Wombo Dream

Proof of concept. Takes input string only. No option to upload images or perform user functions at the moment.

# Installation

`npm i dream-api`

# Usage

```
const WomboDream = require('dream-api');

async function main() {
    await WomboDream.printStyles(); // print styles to console
    let styles = await WomboDream.getStyles(); // store styles in variable
    let final = await WomboDream.generateImage(1, "dog"); // store URL of photo with style 1 and prompt "dog" to variable
}
```
