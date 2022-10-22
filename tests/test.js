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

    if (token1.idToken) {
        console.log("User account generated successfully");
    } else {
        throw new Error("User account generation failed");
    }

    // Refresh Token
    let token2 = await WomboDream.refresh(token1.refreshToken);

    if (token2.id_token) {
        console.log("Refresh token generated successfully");
    } else {
        throw new Error("Refresh token generation failed");
    }

    ////////////////////////////////
    //////////// STYLES ////////////
    ////////////////////////////////

    // Print formatted table of styles to console
    let styles = await WomboDream.getStyles();
    if (styles.length > 0) {
        console.log("Styles retrieved successfully");
    } else {
        throw new Error("Styles retrieval failed");
    }

    ////////////////////////////////
    /////// IMAGE UPLOADING ////////
    ////////////////////////////////

    // Create image buffer
    let buffer = fs.readFileSync('./tests/test.jpg');

    ////////////////////////////////
    /////// IMAGE GENERATION ///////
    ////////////////////////////////

    // Generate image from prompt only
    let image1 = await WomboDream.generateImage(1, "dog", token2.id_token);
    if (image1.result.final) {
        console.log("Image generated successfully");
    } else {
        // try one more time
        image1 = await WomboDream.generateImage(1, "dog", token2.id_token);
        if (image1.result.final) {
            console.log("Image generated successfully");
        } else {
            throw new Error("Image generation failed");
        }
    }

    // Generate image from prompt and image
    let image2 = await WomboDream.generateImage(1, "dog", token2.id_token, buffer);
    if (image2.result.final) {
        console.log("Image with buffer generated successfully");
    } else {
        // try one more time
        image1 = await WomboDream.generateImage(1, "dog", token2.id_token, buffer);
        if (image1.result.final) {
            console.log("Image with buffer generated successfully");
        } else {
            throw new Error("Image with buffer generation failed");
        }
    }

    ////////////////////////////////
    /////// OTHER FUNCTIONS ////////
    ////////////////////////////////

    // Get trading card URL from auto-generated image
    let cardURL1 = await WomboDream.getTradingCardURL(token2.id_token, image1.id);
    if (cardURL1) {
        console.log("Trading card URL generated successfully");
    } else {
        throw new Error("Trading card URL generation failed");
    }

    // Get purchase URL from auto-generated image
    let purchaseURL1 = await WomboDream.getTaskShopURL(token2.id_token, image1.id);
    if (purchaseURL1.url) {
        console.log("Purchase URL generated successfully");
    } else {
        throw new Error("Purchase URL generation failed");
    }

    console.log("All tests passed successfully");
}

main();