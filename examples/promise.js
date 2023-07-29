const WomboDream = require('../dist/app');

////////////////////////////////
//////// AUTHENTICATION ////////
////////////////////////////////

// Wombo Dream API Key
var token = "<API-KEY-HERE>";

////////////////////////////////
//////////// STYLES ////////////
////////////////////////////////

// Print formatted table of styles to console
WomboDream.printStyles();

// Get styles
WomboDream.getStyles().then((styles) => {
    console.log(styles);
});

// ////////////////////////////////
// /////// IMAGE GENERATION ///////
// ////////////////////////////////

// Generate image from prompt only
WomboDream.generateImage(1, "dog", token).then((image) => {
    console.log(image);
});

// Generate image from prompt and image
WomboDream.generateImage(1, "dog", token, "../test/test.jpg").then((image) => {
    console.log(image);
});

// Generate image from prompt and image with influence level specified
WomboDream.generateImage(1, "dog", token, "../test/test.jpg", "LOW").then((image) => {
    console.log(image);
});

// Generate image from prompt with callback function
WomboDream.generateImage(1, "dog", token, null, null, null, null, console.log).then((image) => {
    console.log(image);
});

// Generate image from prompt and image with callback function and influence level specified
WomboDream.generateImage(1, "dog", token, "../test/test.jpg", "MEDIUM", null, null, console.log).then((image) => {
    console.log(image);
});

// Generate image manually from prompt
WomboDream.createTaskID(token).then((task) => {
    WomboDream.createTask(token, task.id, "dog", 1).then((start) => {
        WomboDream.checkStatus(token, task.id, 1000).then((final) => {
            console.log(final);
        });
    });
});

// Generate image manually from prompt and input image
WomboDream.createTaskID(token, "../test/test.jpg").then((task) => {
    WomboDream.uploadPhoto("../test/test.jpg", task.target_image_url).then((upload) => {
        WomboDream.createTask(token, task.id, "dog", 1, "LOW").then((start) => {
            WomboDream.checkStatus(token, task.id, 1000).then((final) => {
                console.log(final);
            });
        });
    });
});