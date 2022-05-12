const axios = require('axios').default;

const signUp = (email = "", password = "", username = "") => {
    var jsonData = {}
    if (email != "" && password != "" && username != "") {
        jsonData.email = email;
        jsonData.password = password;
        jsonData.displayName = username;
    }
    return new Promise(function(resolve, reject) {
        axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyDCvp5MTJLUdtBYEKYWXJrlLzu1zuKM6Xw', jsonData)
            .then(function(response) {
                resolve(response.data);
            })
            .catch(function(error) {
                resolve(error);
            });
    });
};

const signIn = (email, password) => {
    return new Promise(function(resolve, reject) {
        axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyDCvp5MTJLUdtBYEKYWXJrlLzu1zuKM6Xw', {
                "email": email,
                "password": password,
                "returnSecureToken": true
            })
            .then(function(response) {
                resolve(response.data);
            })
            .catch(function(error) {
                resolve(error);
            });
    });
}

const refreshToken = (token) => {
    return new Promise(function(resolve, reject) {
        axios.post('https://securetoken.googleapis.com/v1/token?key=AIzaSyDCvp5MTJLUdtBYEKYWXJrlLzu1zuKM6Xw', {
                "grant_type": "refresh_token",
                "refresh_token": token
            })
            .then(function(response) {
                resolve(response.data);
            })
            .catch(function(error) {
                resolve(error);
            });
    });
}

exports.signUp = signUp;
exports.signIn = signIn;
exports.refreshToken = refreshToken;