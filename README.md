# Wombo Dream API

> **Warning**
> Dream API now uses the official [Wombo Dream API](https://api.dream.ai/) and requires an API key. Endpoints for gallery, trading card, and shop are no longer supported. See [changelog](https://github.com/cdgco/dream-api/releases) for more details.

Promise based NodeJS API for Wombo Dream. 

![](https://img.shields.io/circleci/build/github/cdgco/dream-api/main?label=test&style=for-the-badge) ![](https://img.shields.io/npm/dt/dream-api?style=for-the-badge) ![](https://img.shields.io/npm/v/dream-api?style=for-the-badge) ![](https://img.shields.io/github/repo-size/cdgco/dream-api?style=for-the-badge)
# Installation

Add `dream-api` to your project:
```
npm i dream-api
```

Sign up for [Dream API](https://api.dream.ai/signup) to get an API key.

```
const WomboDream = require('dream-api');
const dreamKey = "<API-KEY-HERE>";
```

# Usage

## Generate an image from a text prompt
```
let image = await WomboDream.generateImage(1, "dog", dreamKey);
```
or
```
WomboDream.generateImage(1, "dog", dreamKey).then(image => {
  console.log(image);
});
```

## Generate an image from a text prompt and input image
```
let image = await WomboDream.generateImage(1, "dog", dreamKey, "image.jpg", "LOW");
```
or
```
WomboDream.generateImage(1, "dog", dreamKey, "image.jpg", "LOW").then(image => {
  console.log(image);
});
```

## Generate an image, with a callback function
```
let image = await WomboDream.generateImage(1, "dog", dreamKey, null, null, null, null, console.log));
```
or
```
WomboDream.generateImage(1, "dog", dreamKey, null, null, null, null, console.log).then(image => {
  console.log(image);
});
```

See [examples/await.js](https://github.com/cdgco/dream-api/blob/main/examples/await.js) and [examples/promise.js](https://github.com/cdgco/dream-api/blob/main/examples/promise.js) for much more example code.

# Functions
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

`generateImage(style, prompt, token [, imagePath [, weight]] [, width] [, height] [, callback] [, interval])`
- Generates an image based on the style, prompt and input image. Returns image object.
- Set any optional parameter to `null` in order to skip that function and use a later parameter.
- `style`: `int` Style number (from getStyles()).
- `prompt`: `string` Image prompt. String of up to 100 characters.
- `token`: `string` API Key
- `imagePath`: `string` (Optional) Path to jpg / jpeg image.
- `weight`: `string` or `float` (Optional) Influence of the input image.
    - String `LOW`, `MEDIUM` or  `HIGH`
    - Float 0.0 - 1.0
    - Defaults to `MEDIUM` (0.5)
- `width`: `int` (Optional) Width of image
  - Defaults to 950
- `height`: `int` (Optional) Height of image
  - Defaults to 1560
- `callback`: `function` (Optional) Callback function for intermediate image generation steps.
  - callback is passed 1 argument, the JSON image object containing the status, task info and intermediate images.
- `interval`: `int` (Optional) Milliseconds to wait between status checks and callback function.
  - Defaults to `1000`

`createTaskID(token [, image])`
- Creates a new image generation task (used internally in generateImage()). Returns image object.
- `token`: `string` API Key
- `image`: `boolean` Whether or not to use influence image (specified in createTast())

`createTask(token, taskID, prompt, style [, weight] [, width] [, height])`
- Configure and start image generation task (used internally in generateImage()). Returns image object.
- `token`: `string` API Key
- `taskID`: `string` ID of the task.
  - `await WomboDream.createTaskID(...).id`
- `prompt`: `string` Image prompt. String of up to 100 characters.
- `style`: `int` Style number (from getStyles()).
- `weight`: `string` or `float` (Optional) Influence of the input image.
    - String `LOW`, `MEDIUM` or  `HIGH`
    - Float 0.0 - 1.0
    - Defaults to `MEDIUM` (0.5)
- `width`: `int` (Optional) Width of image
  - Defaults to 950
- `height`: `int` (Optional) Height of image
  - Defaults to 1560

`checkStatus(token, taskID [, interval] [, callback])`
- Check status of image generation task (used internally in generateImage()). Returns image object.
- If loop is unset or null, will check status once. If set to true, will check status every `loop` ms until task is complete.
- `token`: `string` API Key
- `taskID`: `string` ID of the task.
  - `await WomboDream.createTaskID(...).id`
- `interval`: `int` (Optional) Milliseconds to wait between status checks.
- `callback`: `function` (Optional) Callback function for intermediate image generation steps.

<hr>

## Additional Functions

`uploadPhoto(imagePath, token)`
- Uploads a photo for later use (used internally in generateImage()). Returns upload status code.
- `imagePath`: `string` Path to jpg / jpeg image.
- `token`: `string` API Key.

# Development & Testing

## Testing

Mocha tests for some basic functions are included in `test/test.js`, runnable through `npm test`. To run tests, set environment variable `DREAM_API_KEY` or use `DREAM_API_KEY=KEY_HERE npm test` to temporarily set variable. Not all functions are tested. The primary purpose of testing is to ensure that the internal Wombo API URLs are still valid.

Tested functions include:
* Style retrieval
* Prompt based generation
* Image based generation

Tests are run through CircleCI weekly, and on every commit using `.circleci/config.yml`. If any test fails, the script will throw exit code 1, rather than exit code 0, and will set the test status to failed, indicating that at least one API function is broken. To see test results, visit the [CircleCI testing page](https://app.circleci.com/pipelines/github/cdgco/dream-api).

## Publishing

Release publishing is automated through GitHub actions. On every release, the package is automatically published to both NPM and GitHub Packages, using the workflows defined in `.github/workflows`.
