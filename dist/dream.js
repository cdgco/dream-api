var request = require('request');
const { printTable } = require('console-table-printer');

function defineHeaders(token, type = "text/plain;charset=UTF-8") {
    return {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:96.0) Gecko/20100101 Firefox/96.0',
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        'Accept-Language': 'fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3',
        'Referer': 'https://app.wombo.art/',
        'Authorization': 'bearer ' + token,
        'Content-Type': type,
        'Origin': 'https://app.wombo.art',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'TE': 'trailers',
        'DNT': 1,
        'service': 'Dream',
    };
}

// Using the Google API token, create a new task and get the task ID.
const getTaskID = (token) => {
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

const getStyles = (token) => {
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

const printStyles = async(token) => {
    let styles = await getStyles(token);
    styles.forEach(style => {
        delete style.is_visible;
        delete style.created_at;
        delete style.updated_at;
        delete style.deleted_at;
    });
    styles.sort((a, b) => (a.id > b.id) ? 1 : -1)
    printTable(styles);
}

// Get URL to upload photo for later use. Requires Wombo account (not anonymous).
const getUploadURL = (token) => {
    return new Promise(function(resolve, reject) {
        request({
            'method': 'POST',
            'url': 'https://mediastore.api.wombo.ai/io/',
            'headers': defineHeaders(token, "application/json"),
            json: {
                "media_expiry": "HOURS_72", 
                "media_suffix": "jpeg",
                "num_uploads": 1
            }
        }, function(error, res, body) {
            if (!error && res.statusCode == 200) {
                resolve(body[0]);
            } else {
                reject(error);
            }
        });
    });
}

// Upload photo (JPG / JPEG only) to Wombo. Requires Wombo account (not anonymous).
const uploadPhoto = async(token, imageBuffer) => {
    let URL = await getUploadURL(token);
    return new Promise(function(resolve, reject) {
        request({
            'method': 'PUT',
            'url': URL.media_url,
            headers: {
                'Content-Type': 'image/jpeg',
                'Content-Length': imageBuffer.length,
            },
            body: imageBuffer,
        }, function(error, res, body) {
            if (!error && res.statusCode == 200) {
                resolve(URL);
            } else {
                reject(error);
            }
        });
    });
}

// Using the new task ID, supply a prompt and start the image generation process.
const createTask = (token, taskID, prompt, style, image = null) => {
    var jsonData = {
        "input_spec": {
            "prompt": prompt,
            "style": style,
            "display_freq": 10
        }
    };
    // if (image != null) {
    //     jsonData.input_image = image;
    // }

    return new Promise(function(resolve, reject) {
        request({
            'method': 'PUT',
            'url': 'https://app.wombo.art/api/tasks/' + taskID,
            'headers': defineHeaders(token),
            json: jsonData
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
const checkStatus = (token, taskID) => {
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

const generateImage = async(token, promptValue, style, image = null) => {
    let taskID = await getTaskID(token); // Get the task ID
    console.log("creating task...");
    await createTask(token, taskID, promptValue, style, image); // Create the task
    var status = { "state": "generating" }; // Set the default status to generating
    var result;
    while (status.state == "generating" || status.state == "input" || status.state == "pending") { // While the task is still generating
        console.log("generating...");
        result = await checkStatus(token, taskID); // Get the latest status
        await new Promise(resolve => setTimeout(resolve, 1000));
        status.state = result.state; // Set the status to the current state and exit loop
    }
    return result
}

exports.generateImage = generateImage;
exports.uploadPhoto = uploadPhoto;
exports.getStyles = getStyles;
exports.printStyles = printStyles;
exports.getUploadURL = getUploadURL;
