# Wombo Dream API

Promise based NodeJS API for Wombo Dream. 

![](https://img.shields.io/npm/dt/dream-api?style=for-the-badge) ![](https://img.shields.io/npm/v/dream-api?style=for-the-badge) ![](https://img.shields.io/github/repo-size/cdgco/dream-api?style=for-the-badge)

# Installation

Run `npm i dream-api`

# Usage

## Generate an image from a text prompt
```
const WomboDream = require('dream-api');

async function main() {
    let token = await WomboDream.signUp();
    console.log(await WomboDream.generateImage(1, "dog", token.idToken));
}

main();
```

## Generate an image from a text prompt and input image
```
async function main() {
    let buffer = fs.readFileSync('image.jpg');
    let token = await WomboDream.signUp("email@email.com", "password", "username");
    console.log(await WomboDream.generateImage(1, "dog", token.idToken, buffer, "HIGH"));
}

main();
```

## Generate an image, save it, and get the URL to purchase a print
```
async function main() {
    let token = await WomboDream.signIn("email@email.com", "password");
    let taskID = await WomboDream.getTaskID(token);
    let result = await createTask(token, taskID, promptValue, style, imageId, weight);
    while (result.state == "generating" || result.state == "input" || result.state == "pending") {
        result = await checkStatus(token, taskID);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    await saveToGallery(token.idToken, taskID, { "name": "My Image", "public": false, "visible": true }); 
    console.log(await WomboDream.getTaskShopURL(token.idToken, taskID));
}
```

## Generate an image, with a callback function
```
function printStatus(task) {
  console.log(task.state);
}

async function main() {
     let result = await WomboDream.generateImage(1, "dog", null, null, null, null, null, printStatus));
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

See example.js for much more example code.

# Functions
<hr>

## Authentication
`signUp([email, password, username])`
- Creates a new user account. Returns token object.
- `email`: `string` (Optional) Email address. Must not already exist.
- `password`: `string` (Optional) Password.
- `username`: `string` (Optional) Username. Must not already exist.

`signIn(email, password)`
- Signs in a user account. Returns token object.
- `email`: `string` Email address.
- `password`: `string` Password.

`refresh(refreshToken)`
- Refreshes a user's access token. Returns token object.
- Works for anonymous and named users.
- `refreshToken`: `string` Refresh token. 
  - `(await WomboDream.signUp()).refreshToken`
  - `(await WomboDream.signUp('email', 'password', 'username')).refreshToken`
  - `(await WomboDream.signIn('username', 'password)).refreshToken`

<hr>

## Styles

`getStyles()`
- Retrieve all available styles. Returns array of style objects.
- Does not require authentication.

`printStyles()`
- Print all available styles to console in a formatted table. Returns nothing.
- Does not require authentication.

<hr>

## Image Generation

`generateImage(style, prompt [, token] [, imageBuffer [, weight]] [, save [, saveSettings]] [, callback])`
- Generates an image based on the style, prompt and input image. Returns image object.
- Set any optional parameter to `null` in order to skip that function and use a later parameter.
- `style`: `int` Style number (from getStyles()).
- `prompt`: `string` Image prompt. String of up to 100 characters.
- `token`: `string` (Optional) Access token.
  - If token is not provided, anonymous token will be generated. Saving will be disabled if token not provided.
  - `(await WomboDream.signUp()).idToken`
  - `(await WomboDream.signUp('email', 'password', 'username')).idToken`
  - `(await WomboDream.signIn('username', 'password)).idToken`
- `imageBuffer`: `buffer` (Optional) Buffer of jpg / jpeg image to use.
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
- `callback`: `function` (Optional) Callback function for intermediate image generation steps.
  - callback is passed 1 argument, the JSON image object containing the status, task info and intermediate images.

`getTaskID(token)`
- Returns the ID for a new image generation session (used internally in generateImage()). Returns task id.
- `token`: `string` Access token.
  - `(await WomboDream.signUp()).idToken`
  - `(await WomboDream.signUp('email', 'password', 'username')).idToken`
  - `(await WomboDream.signIn('username', 'password)).idToken`

`createTask(token, taskID, prompt, style [, imageId [, weight]])`
- Creates a new image generation task (used internally in generateImage()). Returns image object.
- `token`: `string` Access token.
  - `(await WomboDream.signUp()).idToken`
  - `(await WomboDream.signUp('email', 'password', 'username')).idToken`
  - `(await WomboDream.signIn('username', 'password)).idToken`
- `taskID`: `string` ID of the task.
  - `await WomboDream.getTaskID(token)`
- `prompt`: `string` Image prompt. String of up to 100 characters.
- `style`: `int` Style number (from getStyles()).
- `imageId`: `string` (Optional) ID of uploaded image to use.
  - `await WomboDream.uploadPhoto(buffer)`
- `weight`: `string` (Optional) Influence of the input image.
    - `LOW`, `MEDIUM` or  `HIGH`
    - Defaults to `MEDIUM`

`checkStatus(token, taskID)`
- Check status of image generation task (used internally in generateImage()). Returns image object.
- `token`: `string` Access token.
  - `(await WomboDream.signUp()).idToken`
  - `(await WomboDream.signUp('email', 'password', 'username')).idToken`
  - `(await WomboDream.signIn('username', 'password)).idToken`
- `taskID`: `string` ID of the task.
  - `await WomboDream.getTaskID(token)`

<hr>

## Additional Functions

`uploadPhoto(buffer [, token])`
- Uploads a photo for later use and returns upload ID (used internally in generateImage()). Returns upload id.
- Works for anonymous and named users. If token is not supplied, anonymous token will be used.
- `buffer`: `buffer` Buffer of jpg / jpeg image.
- `token`: `string` (Optional) Access token.
  - `(await WomboDream.signUp()).idToken`
  - `(await WomboDream.signUp('email', 'password', 'username')).idToken`
  - `(await WomboDream.signIn('username', 'password)).idToken`

`getUploadURL([token])`
- Returns a URL to upload an image for later use (used internally in uploadPhoto()). Returns upload object.
- Works for anonymous and named users. If token is not supplied, anonymous token will be used.
- `token`: `string` (Optional) Access token.
  - `(await WomboDream.signUp()).idToken`
  - `(await WomboDream.signUp('email', 'password', 'username')).idToken`
  - `(await WomboDream.signIn('username', 'password)).idToken`

`getTaskShopURL(token, taskID)`
- Get URL to purchase print of generated image. Returns URL.
- `token`: `string` Access token.
  - `(await WomboDream.signUp()).idToken`
  - `(await WomboDream.signUp('email', 'password', 'username')).idToken`
  - `(await WomboDream.signIn('username', 'password)).idToken`
- `taskID`: `string` ID of the task.
  - `await WomboDream.getTaskID(token)`

`saveToGallery(token, taskID [, saveSettings])`
- Save image to user account (used internally in generateImage()). Returns gallery item.
- `token`: `string` Access token.
  - `(await WomboDream.signUp()).idToken`
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

`getGallery(token)`
- Get list of images saved to a user's account. Returns array of gallery items.
- `token`: `string` Access token.
  - `(await WomboDream.signUp()).idToken`
  - `(await WomboDream.signUp('email', 'password', 'username')).idToken`
  - `(await WomboDream.signIn('username', 'password)).idToken`
  - token must be provided for a non-guest user account.