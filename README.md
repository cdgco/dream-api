# Wombo Dream API

Proof of concept NodeJS wrapper for Wombo Dream API. Currently takes input string only.

# Installation

`npm i dream-api`

# Functions
`getStyles()` - Promise that returns an array of styles.

`printStyles()` - Promise that prints the styles in a formatted table.

`generateImage(style, prompt [, imageBuffer])` - Promise that generates an image based on the style and prompt.

- `style` must be the number corresponding to the desired style.
- `prompt` must be a string of up to 100 characters.
- `imageBuffer` is the optional buffer of a jpg/jpeg image to influence the generated image. This function is not implemented yet.


# Usage

```
const WomboDream = require('dream-api');

async function main() {
    await WomboDream.printStyles(); // print styles to console
    let styles = await WomboDream.getStyles(); // store styles in variable
    let final = await WomboDream.generateImage(1, "dog"); // store URL of photo with style 1 and prompt "dog" to variable
}
```
