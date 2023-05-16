const WomboDream = require('../dist/app');
const fs = require('fs');
const axios = require('axios');

// Wrapper so we can use async/await
async function main() {

    ////////////////////////////////
    //////// AUTHENTICATION ////////
    ////////////////////////////////

    // Anonymous Token
    let token1 = await WomboDream.signUp();

    // New User Account Token
    let token2 = await WomboDream.signUp("test@test.com", "test", "test");

    // Existing User Account Token
    let token3 = await WomboDream.signIn("test@test.com", "test");

    // Refresh Token
    let token4 = await WomboDream.refresh(token1.refreshToken);

    ////////////////////////////////
    //////////// STYLES ////////////
    ////////////////////////////////

    // Print formatted table of styles to console
    await WomboDream.printStyles();

    // Get styles'
    let styles = await WomboDream.getStyles();

    ////////////////////////////////
    /////// IMAGE UPLOADING ////////
    ////////////////////////////////

    // Create image buffer
    let buffer = fs.readFileSync('./test.jpg');

    // Get upload URL and PUT manually
    let upload1 = await WomboDream.getUploadURL();
    axios.put(upload1.media_url, buffer, {
        headers: {
            'Content-Type': 'image/jpeg',
            'Content-Length': buffer.length,
        },
    });

    /// Upload an image automatically
    let upload2 = await WomboDream.uploadPhoto(buffer);

    ////////////////////////////////
    /////// IMAGE GENERATION ///////
    ////////////////////////////////

    // Generate image from prompt only
    let image1 = await WomboDream.generateImage(1, "dog");

    // Generate image from prompt and image
    let image2 = await WomboDream.generateImage(1, "dog", null, buffer);

    // Generate image from prompt and image with influence level specified
    let image3 = await WomboDream.generateImage(1, "dog", null, buffer, "LOW");

    // Generate image from prompt and image with token specified
    let image4 = await WomboDream.generateImage(1, "dog", token2.idToken, buffer);

    // Generate image from prompt and image with token and influence level specified
    let image5 = await WomboDream.generateImage(1, "dog", token3.idToken, buffer, "HIGH");

    // Generate image from prompt and image and save to account gallery
    let image6 = await WomboDream.generateImage(1, "dog", token3.idToken, buffer, "HIGH", true);

    // Generate image from prompt and image and save to account gallery with save settings specified
    let image7 = await WomboDream.generateImage(1, "dog", token3.idToken, null, null, true, { "name": "test", "public": true, "visible": true });

    // Generate image from prompt with callback function
    let image8 = await WomboDream.generateImage(1, "dog", null, null, null, null, null, console.log);

    // Generate image from prompt and image with callback function and influence level specified
    let image9 = await WomboDream.generateImage(1, "dog", null, buffer, "HIGH", null, null, console.log);

    // Generate image from prompt with token and callback function and token specified, save image to account gallery
    let image10 = await WomboDream.generateImage(1, "dog", token3.idToken, null, null, true, null, console.log);

    // Generate image manually from prompt and input image
    let result = await WomboDream.createTask(token1.idToken, taskID, "dog", 1, upload2);
    let taskID = result.id;
    result = await WomboDream.checkStatus(token1.idToken, taskID, 1000);

    ////////////////////////////////
    /////// OTHER FUNCTIONS ////////
    ////////////////////////////////

    // Get user gallery
    let gallery = await WomboDream.getGallery(token3.idToken);

    // Get trading card URL from auto-generated image
    let cardURL1 = await WomboDream.getTradingCardURL(token1.idToken, image1.id);

    // Get purchase URL from auto-generated image
    let purchaseURL1 = await WomboDream.getTaskShopURL(token3.idToken, image10.id);

    // Get purchase URL from manually generated image
    let purchaseURL2 = await WomboDream.getTaskShopURL(token4.idToken, taskID);



}

main();