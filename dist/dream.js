const axios = require('axios').default;
const { printTable } = require('console-table-printer');

function defineHeaders(token, type = "text/plain;charset=UTF-8") {
    return {
        'Origin': 'https://app.wombo.art',
        'Referer': 'https://app.wombo.art/',
        'Authorization': 'bearer ' + token,
        'Content-Type': type,
        'service': 'Dream'
    };
}

const getStyles = () => {
    return new Promise(function(resolve, reject) {
        axios.get('https://app.wombo.art/api/styles')
            .then(function(response) {
                resolve(response.data);
            })
            .catch(function(error) {
                resolve(error);
            });
    });
}

const printStyles = async() => {
    let styles = await getStyles();
    styles.forEach(style => {
        delete style.is_visible;
        delete style.created_at;
        delete style.updated_at;
        delete style.deleted_at;
    });
    styles.sort((a, b) => (a.id > b.id) ? 1 : -1)
    printTable(styles);
}

const getTaskID = (token) => {
    return new Promise(function(resolve, reject) {
        axios.post('https://app.wombo.art/api/tasks', '{ "premium": false }', {
                headers: defineHeaders(token)
            })
            .then(function(response) {
                resolve(response.data.id);
            })
            .catch(function(error) {
                resolve(error);
            });
    });
}

const getUploadURL = (token) => {
    return new Promise(function(resolve, reject) {
        axios.post('https://mediastore.api.wombo.ai/io/', {
                "media_expiry": "HOURS_72",
                "media_suffix": "jpeg",
                "num_uploads": 1
            }, {
                headers: defineHeaders(token, "application/json")
            })
            .then(function(response) {
                resolve(response.data[0]);
            })
            .catch(function(error) {
                resolve(error);
            });
    });
}

const uploadPhoto = async(token, imageBuffer) => {
    let URL = await getUploadURL(token);
    return new Promise(function(resolve, reject) {
        axios.put(URL.media_url, imageBuffer, {
                headers: {
                    'Content-Type': 'image/jpeg',
                    'Content-Length': imageBuffer.length,
                },
            })
            .then(function(response) {
                resolve(URL);
            })
            .catch(function(error) {
                resolve(error);
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
        axios.put('https://app.wombo.art/api/tasks/' + taskID, jsonData, {
                headers: defineHeaders(token)
            })
            .then(function(response) {
                resolve(response.data);
            })
            .catch(function(error) {
                resolve(error);
            });
    });
}

// Check the status of the task. This function returns all data including progress photos and result.
const checkStatus = (token, taskID) => {
    return new Promise(function(resolve, reject) {
        axios.get('https://app.wombo.art/api/tasks/' + taskID, {
                headers: defineHeaders(token)
            })
            .then(function(response) {
                resolve(response.data);
            })
            .catch(function(error) {
                resolve(error);
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

exports.getStyles = getStyles;
exports.printStyles = printStyles;
exports.getTaskID = getTaskID;
exports.getUploadURL = getUploadURL;
exports.uploadPhoto = uploadPhoto;
exports.createTask = createTask;
exports.checkStatus = checkStatus;
exports.generateImage = generateImage;