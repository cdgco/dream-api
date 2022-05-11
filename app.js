var request = require('request');
const readline = require('readline-sync');

// HTTP Headers for API requests to Wombo. Not sure if all attributes are needed, but these have been tested and work.
function defineHeaders(token) {
    return {
        'User-Agent': ' Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:96.0) Gecko/20100101 Firefox/96.0',
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        'Accept-Language': ' fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3',
        'Referer': ' https://app.wombo.art/',
        'Authorization': 'bearer ' + token,
        'Content-Type': "text/plain;charset=UTF-8",
        'Origin': ' https://app.wombo.art',
        'Connection': ' keep-alive',
        'Sec-Fetch-Dest': ' empty',
        'Sec-Fetch-Mode': ' cors',
        'Sec-Fetch-Site': ' same-origin',
        'TE': ' trailers',
        'DNT': 1,
        'service': 'Dream',
    };
}

// First step, get an authorization token from Google to access the Wombo API. Creates an anonymous account that lasts for 1 hour.
function getAuthToken() {
    return new Promise(function(resolve, reject) {
        request({ 'method': 'POST', 'url': 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDCvp5MTJLUdtBYEKYWXJrlLzu1zuKM6Xw' }, function(error, res, body) {
            if (!error && res.statusCode == 200) {
                resolve(JSON.parse(body).idToken);
            } else {
                reject(error);
            }
        });
    });
}

// Using the Google API token, create a new task and get the task ID.
function getTaskID(token) {
    return new Promise(function(resolve, reject) {
        request({
            'method': 'POST',
            'url': 'https://app.wombo.art/api/tasks',
            'headers': defineHeaders(token),
            body: '{"premium": false}',
        }, function(error, res, body) {
            if (!error && res.statusCode == 200) {
                resolve(JSON.parse(body).id);
            } else {
                reject(error);
            }
        });
    });
}

function getStyles(token) {
    return new Promise(function(resolve, reject) {
        request({
            'gzip': true,
            'method': 'GET',
            'url': 'https://app.wombo.art/api/styles',
            'headers': defineHeaders(token),
        }, function(error, res, body) {
            if (!error && res.statusCode == 200) {
                resolve(JSON.parse(body));
            } else {
                reject(error);
            }
        });
    });
}

// Get URL to upload photo for later use. Requires Wombo account (not anonymous).
function getUploadURL(token) {
    return new Promise(function(resolve, reject) {
        request({
            'method': 'POST',
            'url': 'https://mediastore.api.wombo.ai/io/',
            'headers': defineHeaders(token),
            json: {
                media_expiry: 'HOURS_72',
                media_suffix: 'jpeg',
                num_uploads: 1,
            },
        }, function(error, res, body) {
            if (!error && res.statusCode == 200) {
                resolve(JSON.parse(body).media_url);
            } else {
                reject(error);
            }
        });
    });
}

// Upload photo (JPG / JPEG only) to Wombo. Requires Wombo account (not anonymous).
async function uploadPhoto(token, imageBuffer) {
    let URL = await getUploadURL(token);
    return new Promise(function(resolve, reject) {
        request({
            'method': 'PUT',
            'url': URL,
            headers: {
                'Content-Type': 'image/jpeg',
                'Content-Length': imageBuffer.length,
            },
            body: imageBuffer,
        }, function(error, res, body) {
            if (!error && res.statusCode == 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
}

// Using the new task ID, supply a prompt and start the image generation process.
function createTask(token, taskID, prompt, style) {
    return new Promise(function(resolve, reject) {
        request({
            'method': 'PUT',
            'url': 'https://app.wombo.art/api/tasks/' + taskID,
            'headers': defineHeaders(token),
            json: {
                "input_spec": {
                    "prompt": prompt,
                    "style": style,
                    "display_freq": 10
                }
            }
        }, function(error, res, body) {
            if (!error && res.statusCode == 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
}

// Check the status of the task. This function returns all data including progress photos and result.
function checkStatus(token, taskID) {
    return new Promise(function(resolve, reject) {
        request({
                'gzip': true,
                'method': 'GET',
                'url': 'https://app.wombo.art/api/tasks/' + taskID,
                'headers': defineHeaders(token)
            },
            function(error, res, body) {
                if (!error && res.statusCode == 200) {
                    resolve(JSON.parse(body));
                } else {
                    reject(error);
                }
            });
    });
}

async function generateImage(token, promptValue, style) {
    let taskID = await getTaskID(token); // Get the task ID
    console.log("creating task...");
    await createTask(token, taskID, promptValue, style); // Create the task
    var status = { "state": "generating" }; // Set the default status to generating
    var result;
    while (status.state == "generating" || status.state == "input") { // While the task is still generating
        console.log("generating...");
        result = await checkStatus(token, taskID); // Get the latest status
        await new Promise(resolve => setTimeout(resolve, 1000));
        status.state = result.state; // Set the status to the current state and exit loop
    }
    return result.result.final
}

async function main() {
    let token = await getAuthToken(); // Get the authorization token from Google
    let styles = await getStyles(token);
    styles.forEach(style => {
        delete style.is_visible;
        delete style.created_at;
        delete style.updated_at;
        delete style.deleted_at;
    });
    console.log(styles)
    let styleValue = readline.question("Enter style number: ");
    let promptValue = readline.question("Enter prompt: ");
    let output = await generateImage(token, promptValue, styleValue);
    console.log(output);
}

main();
