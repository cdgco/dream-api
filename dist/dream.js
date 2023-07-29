const axios = require('axios').default;
const { printTable } = require('console-table-printer');

const API_URL = "https://api.luan.tools/api/tasks/"
const STYLE_URL = "https://api.luan.tools/api/styles/"

function defineHeaders(token, type = "text/plain;charset=UTF-8") {
    return {
        'Origin': 'https://dream.ai',
        'Referer': 'https://dream.ai/',
        'Authorization': 'bearer ' + token,
        'Content-Type': type,
        'service': 'Dream'
    };
}

const getStyles = () => {
    return new Promise(function(resolve, reject) {
        axios.get(STYLE_URL)
            .then(function(response) {
                resolve(response.data);
            })
            .catch(function(error) {
                reject(error);
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

// Create a new task ID and get upload URL if specified
const createTaskID = (token, image = false) => {
    image = image ? true : false;

    var jsonData = {    
        "use_target_image": image
    };

    return new Promise(function(resolve, reject) {
        axios.post(API_URL, jsonData, {
                headers: defineHeaders(token, "application/json")
            })
            .then(function(response) {
                resolve(response.data);
            })
            .catch(function(error) {
                reject(error.response.data);
            });
    });
}

// Upload photo to upload URL
const uploadPhoto = async(imagePath, targetImageURL) => {
    let FormData = require('form-data');
    let fs = require('fs');
    var form_data = new FormData();

    return new Promise(function(resolve, reject) {
        Object.entries(targetImageURL.fields).forEach(([field, value]) => {
            form_data.append(field, value);
        });
        form_data.append("file", fs.createReadStream(imagePath));

        form_data.submit(targetImageURL.url, (err, res) => {
            if (err) reject(err)
            else resolve(res.statusCode)
        });
    });
}

// Using the new task ID, supply a prompt and start the image generation process.
const createTask = (token, taskID, prompt, style_id, weight = "MEDIUM", width = 950, height = 1560) => {
    switch (typeof weight) {
        case 'string':
            if (weight == "LOW") {
                weight = 0.1;
            } else if (weight == "HIGH") {
                weight = 1.0;
            } else {
                weight = 0.5;
            }
            break;
        case 'number':
            if (weight < 0 || weight > 1) {
                weight = 0.5;
            }
            break;
        default:
            weight = 0.5;
            break;
    }

    var jsonData = {    
        'input_spec': {
            'style': style_id,
            'prompt': prompt,
            'target_image_weight': weight,
            'width': width,
            'height': height
        }
    };

    return new Promise(function(resolve, reject) {
        axios.put(API_URL + taskID, jsonData, {
                headers: defineHeaders(token, "application/json")
            })
            .then(function(response) {
                resolve(response.data);
            })
            .catch(function(error) {
                reject(error.response.data);
            });
    });
}

// Check the status of the task. This function returns all data including progress photos and result.
const checkStatus = async(token, taskID, interval = null, callback = null) => {
    return new Promise(async function(resolve, reject) {
        if (interval == null) {
            axios.get(API_URL + taskID, {
                    headers: defineHeaders(token, "application/json")
                })
                .then(function(response) {
                    if (callback && typeof callback === 'function') {
                        callback(response.data);
                    }
                    resolve(response.data);
                })
                .catch(function(error) {
                    reject(error);
                });
        } else {
            if (typeof interval !== 'number') {
                interval = 1000;
            }
            axios.get(API_URL + taskID, {
                    headers: defineHeaders(token, "application/json")
                })
                .then(async function(response) {
                    var result = response.data;
                    if (callback && typeof callback === 'function') {
                        callback(result);
                    }
                    while (result.state != "completed" && result.state != "failed") { // While the task is still generating
                        try {
                            result = (await axios.get(API_URL + taskID, { headers: defineHeaders(token, "application/json") })).data;
                        } catch (error) {
                            reject(error);
                        }
                        if (result.state != "completed" && result.state != "failed") {
                            if (callback && typeof callback === 'function') {
                                callback(result);
                            }
                        }
                        await new Promise(resolve => setTimeout(resolve, interval));
                    }
                    resolve(result);
                })
                .catch(function(error) {
                    reject(error);
                });
        }
    });
}

const generateImage = async(style, promptValue, token, image = null, weight = "MEDIUM", width = 950, height = 1560, callback = null, interval = 1000) => {
    try {
        let task = await createTaskID(token, image ? true : false); // Create the task
        let taskID = task.id;

        if (image != null && task.target_image_url) {
            let imageResult = await uploadPhoto(image, task.target_image_url);
        }

        let result = await createTask(token, taskID, promptValue, style, weight, width, height)

        if (callback && typeof callback === 'function') {
            callback(result);
        } else {
            console.log("creating task...");
        }
        result = await checkStatus(token, taskID, interval, (result) => {
            if (callback && typeof callback === 'function') {
                callback(result);
            } else {
                console.log("generating...");
            }
        });
        return result
    } catch (error) {
        console.error(error);
    }

}

exports.getStyles = getStyles;
exports.printStyles = printStyles;
exports.uploadPhoto = uploadPhoto;
exports.createTaskID = createTaskID;
exports.createTask = createTask;
exports.checkStatus = checkStatus;
exports.generateImage = generateImage;