# Wombo Dream API

NodeJS wrapper for Wombo Dream API. 

# Installation

Run `npm i dream-api`

# Usage

## Generate an image from a text prompt
```
const WomboDream = require('dream-api');

async function main() {
    let token = await WomboDream.signUp();
    console.log(await WomboDream.generateImage(token.idToken, 1, "dog"));
}

main();
```

## Generate an image from a text prompt and input image
```
async function main() {
    let buffer = fs.readFileSync('image.jpg');
    let token = await WomboDream.signUp("email@email.com", "password", "username");
    let image = await WomboDream.uploadImage(buffer, token.idToken);
    console.log(await WomboDream.generateImage(token.idToken, 1, "dog", image, "HIGH"));
}

main();
```

## Generate an image, save it, and get the URL to purchase a print
```
async function main() {
    let token = await WomboDream.signUp();
    let taskID = await WomboDream.getTaskID(token);
    await createTask(token, taskID, promptValue, style, imageId, weight);
    var status = { "state": "generating" };
    var result;
    while (status.state == "generating" || status.state == "input" || status.state == "pending") {
        result = await checkStatus(token, taskID);
        await new Promise(resolve => setTimeout(resolve, 1000));
        status.state = result.state;
    }
    saveToGallery(token.idToken, taskID, { "name": "My Image", "public": false, "visible": true }); 
    console.log(await WomboDream.getTaskShopURL(token.idToken, taskID));
}

main();
```

## Refresh token and print user gallery
```
async function main() {
    let token = await WomboDream.signIn("email@email.com", "password");
    let token = await WomboDream.refreshToken(token.refreshToken);
    console.log(await WomboDream.getGallery(token.idToken));
}

main();
```

# Functions
<hr>

## Authentication
`signUp([email, password, username])` - Creates a new user account.
- `email`: `string` (Optional) Email address. Must not already exist.
- `password`: `string` (Optional) Password.
- `username`: `string` (Optional) Username. Must not already exist.

`signIn(email, password)` - Signs in a user account.
- `email`: `string` Email address.
- `password`: `string` Password.

`refresh(refreshToken)` - Refreshes a user's access token.
- `refreshToken`: `string` Refresh token. 
  - `(await WomboDream.signUp('email', 'password', 'username')).refreshToken`
  - `(await WomboDream.signIn('username', 'password)).refreshToken`

<hr>

## Styles

`getStyles()` - Promise that returns an array of styles.

`printStyles()` - Promise that prints the styles in a formatted table.

<hr>

## Image Uploading

`uploadPhoto(buffer [, token])` - Uploads a photo for later use and returns upload ID (automatically generates upload URL).
- `buffer`: `buffer` Buffer of jpg / jpeg image.
- `token`: `string` (Optional) Access token.
  - `(await WomboDream.signUp('email', 'password', 'username')).idToken`
  - `(await WomboDream.signIn('username', 'password)).idToken`

`getUploadURL([token])` - Returns a URL to upload an image for later use (used internally in uploadPhoto()).
- `token`: `string` (Optional) Access token.
  - `(await WomboDream.signUp('email', 'password', 'username')).idToken`
  - `(await WomboDream.signIn('username', 'password)).idToken`

<hr>

## Image Generation

`generateImage(token, style, prompt [, image [, weight]] [, save [, saveSettings]])` - Generates an image based on the style, prompt and input image.
- `token`: `string` Access token.
  - `(await WomboDream.signUp('email', 'password', 'username')).idToken`
  - `(await WomboDream.signIn('username', 'password)).idToken`
- `style`: `int` Style number (from getStyles()).
- `prompt`: `string` Image prompt. String of up to 100 characters.
- `image`: `string` (Optional) ID of uploaded image to use.
  - `await WomboDream.uploadPhoto(buffer)`
- `weight`: `string` (Optional) Influence of the input image.
    - `LOW`, `MEDIUM` or  `HIGH`
    - Defaults to `MEDIUM`
- `save`: `boolean` (Optional) Whether to save the image to the user's account.
  - token must be provided for a user account. Save will fail if username not set or token is for anonymous account.
  - Defaults to `false`
- `saveSettings`: `object` (Optional) JSON object with settings for saving the image.
  - `{ "name": nameValue, "public": publicValue, "visible": visibleValue }`
    - `nameValue`: `string` Name of the image.
    - `publicValue`: `boolean` Whether the image is public.
    - `visibleValue`: `boolean` Whether the name is visible on the image.
    - Defaults to `{ "name": "", "public": false, "visible": true }`

`getTaskID(token)` - Returns the ID for a new image generation session (used internally in generateImage()).
- `token`: `string` Access token.
  - `(await WomboDream.signUp('email', 'password', 'username')).idToken`
  - `(await WomboDream.signIn('username', 'password)).idToken`

`createTask(token, taskID, prompt, style [, image [, weight]])` - Creates a new image generation task (used internally in generateImage()).
- `token`: `string` Access token.
  - `(await WomboDream.signUp('email', 'password', 'username')).idToken`
  - `(await WomboDream.signIn('username', 'password)).idToken`
- `taskID`: `string` ID of the task.
  - `await WomboDream.getTaskID(token)`
- `prompt`: `string` Image prompt. String of up to 100 characters.
- `style`: `int` Style number (from getStyles()).
- `image`: `string` (Optional) ID of uploaded image to use.
  - `await WomboDream.uploadPhoto(buffer)`
- `weight`: `string` (Optional) Influence of the input image.
    - `LOW`, `MEDIUM` or  `HIGH`
    - Defaults to `MEDIUM`

`checkStatus(token, taskID)` - Check status of image generation task (used internally in generateImage()).
- `token`: `string` Access token.
  - `(await WomboDream.signUp('email', 'password', 'username')).idToken`
  - `(await WomboDream.signIn('username', 'password)).idToken`
- `taskID`: `string` ID of the task.
  - `await WomboDream.getTaskID(token)`

<hr>

## Additional Functions

`getTaskShopURL(token, taskID)` - Get URL to purchase print of generated image.
- `token`: `string` Access token.
  - `(await WomboDream.signUp('email', 'password', 'username')).idToken`
  - `(await WomboDream.signIn('username', 'password)).idToken`
- `taskID`: `string` ID of the task.
  - `await WomboDream.getTaskID(token)`

`saveToGallery(token, taskID [, saveSettings])` - Save image to user account (used internally in generateImage()).
- `token`: `string` Access token.
  - `(await WomboDream.signUp('email', 'password', 'username')).idToken`
  - `(await WomboDream.signIn('username', 'password)).idToken`
  - token must be provided for a user account. Save will fail if username not set or token is for anonymous account.
- `taskID`: `string` ID of the task.
  - `await WomboDream.getTaskID(token)`
- `saveSettings`: `object` (Optional) JSON object with settings for saving the image.
  - `{ "name": nameValue, "public": publicValue, "visible": visibleValue }`
    - `nameValue`: `string` Name of the image.
    - `publicValue`: `boolean` Whether the image is public.
    - `visibleValue`: `boolean` Whether the name is visible on the image.
    - Defaults to `{ "name": "", "public": false, "visible": true }`

`getGallery(token)` - Get list of images saved to a user's account.
- `token`: `string` Access token.
  - `(await WomboDream.signUp('email', 'password', 'username')).idToken`
  - `(await WomboDream.signIn('username', 'password)).idToken`
  - token must be provided for a non-guest user account.