const WomboDream = require('../dist/app');

// Wrapper so we can use async/await
async function main() {

    ////////////////////////////////
    //////// AUTHENTICATION ////////
    ////////////////////////////////

    // Wombo Dream API Key
    let token = "<API-KEY-HERE>";

    ////////////////////////////////
    //////////// STYLES ////////////
    ////////////////////////////////

    // Print formatted table of styles to console
    await WomboDream.printStyles();

    // Get styles
    let styles = await WomboDream.getStyles();

    ////////////////////////////////
    /////// IMAGE GENERATION ///////
    ////////////////////////////////

    // Generate image from prompt only
    let image1 = await WomboDream.generateImage(1, "dog", token);

    // Generate image from prompt and image
    let image2 = await WomboDream.generateImage(1, "dog", token, "../test/test.jpg");

    // Generate image from prompt and image with influence level specified
    let image3 = await WomboDream.generateImage(1, "dog", token, "../test/test.jpg", "LOW");

    // Generate image from prompt with callback function
    let image4 = await WomboDream.generateImage(1, "dog", token, null, null, null, null, console.log);

    // Generate image from prompt and image with callback function and influence level specified
    let image5 = await WomboDream.generateImage(1, "dog", token, "../test/test.jpg", "HIGH", null, null, console.log);

    // Generate image manually from prompt
    let task1 = await WomboDream.createTaskID(token);
    let result1 = await WomboDream.createTask(token, task1.id, "dog", 1);
    result1 = await WomboDream.checkStatus(token, task1.id, 1000);

    // Generate image manually from prompt and input image
    let task2 = await WomboDream.createTaskID(token, "../test/test.jpg");
    await WomboDream.uploadPhoto("../test/test.jpg", task2.target_image_url);
    let result2 = await WomboDream.createTask(token, task2.id, "dog", 1, "LOW");
    result2 = await WomboDream.checkStatus(token, task2.id, 1000);

}

main();