const WomboDream = require('../dist/app');
const fs = require('fs');
const axios = require('axios');

////////////////////////////////
//////// AUTHENTICATION ////////
////////////////////////////////

// Anonymous Token
WomboDream.signUp().then((token) => {
    console.log(token);
});

// New User Account Token
WomboDream.signUp("test@test.com", "test", "test").then((token) => {
    console.log(token);
});

// Existing User Account Token
WomboDream.signIn("test@test.com", "test").then((token) => {
    console.log(token);
});

// Refresh Token
WomboDream.signUp().then((token) => {
    WomboDream.refresh(token.refreshToken).then((refresh) => {
        console.log(refresh);
    });
});

////////////////////////////////
//////////// STYLES ////////////
////////////////////////////////

// Print formatted table of styles to console
WomboDream.printStyles();

// Get styles
WomboDream.getStyles().then((styles) => {
    console.log(styles);
});

////////////////////////////////
/////// IMAGE UPLOADING ////////
////////////////////////////////

// Create image buffer
let buffer = fs.readFileSync('./test.jpg');

// Get upload URL and PUT manually
WomboDream.getUploadURL().then((upload) => {
    axios.put(upload.media_url, buffer, {
        headers: {
            'Content-Type': 'image/jpeg',
            'Content-Length': buffer.length,
        },
    });
});

// Upload an image automatically
WomboDream.uploadPhoto(buffer).then((upload) => {
    console.log(upload);
});

////////////////////////////////
/////// IMAGE GENERATION ///////
////////////////////////////////

// Generate image from prompt only
WomboDream.generateImage(1, "dog").then((image) => {
    console.log(image);
});

// Generate image from prompt and image
WomboDream.generateImage(1, "dog", null, buffer).then((image) => {
    console.log(image);
});

// Generate image from prompt and image with influence level specified
WomboDream.generateImage(1, "dog", null, buffer, "LOW").then((image) => {
    console.log(image);
});

// Generate image from prompt and image with token specified
WomboDream.signUp().then((token) => {
    WomboDream.generateImage(1, "dog", token.idToken, buffer).then((image) => {
        console.log(image);
    });
});

// Generate image from prompt and image with token and influence level specified
WomboDream.signUp().then((token) => {
    WomboDream.generateImage(1, "dog", token.idToken, buffer, "HIGH").then((image) => {
        console.log(image);
    });
});

// Generate image from prompt and image and save to account gallery
WomboDream.signIn("test@test.com", "test").then((token) => {
    WomboDream.generateImage(1, "dog", token.idToken, buffer, "HIGH", true).then((image) => {
        console.log(image);
    });
});

// Generate image from prompt and image and save to account gallery with save settings specified
WomboDream.signIn("test@test.com", "test").then((token) => {
    WomboDream.generateImage(1, "dog", token.idToken, null, null, true, { "name": "test", "public": true, "visible": true }).then((image) => {
        console.log(image);
    });
});

// Generate image from prompt with callback function
WomboDream.generateImage(1, "dog", null, null, null, null, null, console.log).then((image) => {
    console.log(image);
});

// Generate image from prompt and image with callback function and influence level specified
WomboDream.generateImage(1, "dog", null, buffer, "MEDIUM", null, null, console.log).then((image) => {
    console.log(image);
});

// Generate image from prompt with token and callback function and token specified, save image to account gallery
WomboDream.signUp("test@test.com", "test", "test").then((token) => {
    WomboDream.generateImage(1, "dog", token.idToken, null, null, true, null, console.log).then((image) => {
        console.log(image);
    });
});

// Generate image manually from prompt and input image
WomboDream.signUp().then((token) => {
    WomboDream.uploadPhoto(buffer, token.idToken).then((upload) => {
        WomboDream.getTaskID(token.idToken).then((taskId) => {
            WomboDream.createTask(token.idToken, taskId, "dog", 1, upload).then((start) => {
                WomboDream.checkStatus(token.idToken, taskId, 1000).then((final) => {
                    console.log(final);
                });
            });
        });
    });
});


////////////////////////////////
/////// OTHER FUNCTIONS ////////
////////////////////////////////

// Get user gallery
WomboDream.signIn("test@test.com", "test").then((token) => {
    WomboDream.getGallery(token.idToken).then((gallery) => {
        console.log(gallery);
    });
});

// Get purchase URL from auto - generated image
WomboDream.signUp().then((token) => {
    WomboDream.generateImage(1, "dog", token.idToken).then((image) => {
        WomboDream.getTaskShopURL(token.idToken, image.id).then((url) => {
            console.log(url);
        });
    });
});

// Get purchase URL from manually generated image
WomboDream.signUp().then((token) => {
    WomboDream.getTaskID(token.idToken).then((taskId) => {
        WomboDream.createTask(token.idToken, taskId, "dog", 1).then((start) => {
            WomboDream.checkStatus(token.idToken, taskId, 1000).then((final) => {
                console.log(final);
                WomboDream.getTaskShopURL(token.idToken, final.id).then((url) => {
                    console.log(url);
                });
            });
        });
    });
});