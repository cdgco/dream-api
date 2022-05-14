const WomboDream = require('../dist/app');
const fs = require('fs');
const axios = require('axios');

// Create a token
WomboDream.signUp().then((token) => {
    console.log(token);
});
WomboDream.signUp("test@test.com", "test", "test").then((token) => {
    console.log(token);
});
WomboDream.signIn("test@test.com", "test").then((token) => {
    console.log(token);
});
WomboDream.signUp().then((token) => {
    WomboDream.refresh(token.refreshToken).then((refresh) => {
        console.log(refresh);
    });
});

// Get the styles
WomboDream.printStyles();
WomboDream.getStyles().then((styles) => {
    console.log(styles);
});

// Upload an image manually
let buffer1 = fs.readFileSync('./test.jpg');
WomboDream.getUploadURL().then((upload) => {
    axios.put(upload.media_url, buffer1, {
        headers: {
            'Content-Type': 'image/jpeg',
            'Content-Length': buffer1.length,
        },
    });

});

// Upload an image with the uploadPhoto function
let buffer2 = fs.readFileSync('./test.jpg');
WomboDream.uploadPhoto(buffer2).then((upload) => {
    console.log(upload);
});

// Get user gallery
WomboDream.signIn("test@test.com", "test").then((token) => {
    WomboDream.getGallery(token).then((gallery) => {
        console.log(gallery);
    });
});

// Generate image from prompt only
WomboDream.generateImage(1, "dog").then((image) => {
    console.log(image);
});

// Generate image from prompt and image
WomboDream.generateImage(1, "dog", null, buffer1).then((image) => {
    console.log(image);
});
WomboDream.generateImage(1, "dog", null, buffer1, "LOW").then((image) => {
    console.log(image);
});
WomboDream.signUp().then((token) => {
    WomboDream.generateImage(1, "dog", token.tokenId, buffer1).then((image) => {
        console.log(image);
    });
});
WomboDream.signUp().then((token) => {
    WomboDream.generateImage(1, "dog", token.tokenId, buffer1, "HIGH").then((image) => {
        console.log(image);
    });
});

// Generate image and save to account gallery
WomboDream.signIn("test@test.com", "test").then((token) => {
    WomboDream.generateImage(1, "dog", token.tokenId, buffer1, "HIGH", true).then((image) => {
        console.log(image);
    });
});
WomboDream.signIn("test@test.com", "test").then((token) => {
    WomboDream.generateImage(1, "dog", token.tokenId, null, null, true, { "name": "test", "public": true, "visible": true }).then((image) => {
        console.log(image);
    });
});

// Generate image with callback function
WomboDream.generateImage(1, "dog", null, null, null, null, null, console.log).then((image) => {
    console.log(image);
});
WomboDream.generateImage(1, "dog", null, buffer1, "MEDIUM", null, null, console.log).then((image) => {
    console.log(image);
});
WomboDream.signUp("test@test.com", "test", "test").then((token) => {
    WomboDream.generateImage(1, "dog", token.tokenId, null, null, true, null, console.log).then((image) => {
        console.log(image);
    });
});

// Generate image manually
WomboDream.signUp().then((token) => {
    WomboDream.getTaskID(token.tokenId).then((taskId) => {
        WomboDream.createTask(token.tokenId, taskId, "dog", 1).then((image) => {
            var state = image.state;
            while (state != "completed" && state != "failed") {
                WomboDream.checkStatus(token.tokenId, taskId).then((image2) => {
                    state = image2.state;
                });
                setTimeout(() => { }, 1000);
            }
            WomboDream.checkStatus(token.tokenId, taskId).then((image2) => {
                console.log(image2);
            });
        });
    });
});

// Get purchase URL 
WomboDream.generateImage(1, "dog").then((image) => {
    WomboDream.getTaskShopURL(image.id).then((url) => {
        console.log(url);
    });
});