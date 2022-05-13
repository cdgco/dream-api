const WomboDream = require('../dist/app');
const fs = require('fs');

async function main() {
    // Create a token
    let token1 = await WomboDream.signUp();
    let token2 = await WomboDream.signUp("test@test.com", "test", "test");
    let token3 = await WomboDream.signIn("test@test.com", "test");
    let token4 = await WomboDream.refresh(token1.refreshToken);

    // Get the styles
    await WomboDream.printStyles(styles);
    let styles = await WomboDream.getStyles();

    // Upload an image manually
    let buffer1 = fs.readFileSync('./test.jpg');
    let upload1 = await WomboDream.getUploadURL();
    axios.put(upload.media_url, buffer1, {
        headers: {
            'Content-Type': 'image/jpeg',
            'Content-Length': buffer1.length,
        },
    });

    // Upload an image with the uploadPhoto function
    let buffer2 = fs.readFileSync('./test.jpg');
    let upload2 = await WomboDream.uploadPhoto(buffer2);

    // Get user gallery
    let gallery = await WomboDream.getGallery(token3);

    // Generate image from prompt only
    let image1 = await WomboDream.generateImage(1, "dog");

    // Generate image from prompt and image
    let image2 = await WomboDream.generateImage(1, "dog", null, buffer1);
    let image3 = await WomboDream.generateImage(1, "dog", token2.tokenId, buffer1);
    let image4 = await WomboDream.generateImage(1, "dog", null, buffer2, "LOW");
    let image5 = await WomboDream.generateImage(1, "dog", token3.tokenId, buffer2, "HIGH");

    // Generate image and save to account gallery
    let image6 = await WomboDream.generateImage(1, "dog", token3.tokenId, buffer1, "HIGH", true);
    let image7 = await WomboDream.generateImage(1, "dog", token3.tokenId, null, null, true, { "name": "test", "public": true, "visible": true });

    // Generate image with callback function
    let image8 = await WomboDream.generateImage(1, "dog", null, null, null, null, null, console.log);
    let image9 = await WomboDream.generateImage(1, "dog", null, buffer1, "HIGH", null, null, console.log);
    let image10 = await WomboDream.generateImage(1, "dog", token3.tokenId, null, null, true, null, console.log);

    // Generate image manually
    let taskID = await WomboDream.getTaskID(token4);
    let result = await createTask(token4, taskID, "dog", 1, upload2, "HIGH");
    while (result.state == "generating" ||result.state == "input" || result.state == "pending") {
        result = await checkStatus(token4, taskID);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Get purchase URL 
    let purchaseURL1 = await WomboDream.getTaskShopURL(token4, taskID);
    let purchaseURL2 = await WomboDream.getTaskShopURL(token3, image10.id);
}

main();