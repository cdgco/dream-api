var request = require('request');

const signUp = () => {
    return new Promise(function(resolve, reject) {
        request({ 'method': 'POST', 'url': 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyDCvp5MTJLUdtBYEKYWXJrlLzu1zuKM6Xw'}, function(error, res, body) {
            if (!error && res.statusCode == 200) {
                resolve(JSON.parse(body));
            } else {
                reject(error);
            }
        });
    });
};

const emailSignUp = (email, password) => {
    return new Promise(function(resolve, reject) {
        request({ 
            'method': 'POST', 
            'url': 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyDCvp5MTJLUdtBYEKYWXJrlLzu1zuKM6Xw', 
            json: { 
                "email": email,
                "password": password
            } 
        }, function(error, res, body) {
            if (!error && res.statusCode == 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
};

const emailSignIn = (email, password) => {
    return new Promise(function(resolve, reject) {
        request({ 
            'method': 'POST', 
            'url': 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyDCvp5MTJLUdtBYEKYWXJrlLzu1zuKM6Xw',
            json: { 
                "email": email,
                "password": password,
                "returnSecureToken": true
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

const refreshToken = (token) => {
    return new Promise(function(resolve, reject) {
        request({ 
            'method': 'POST', 
            'url': 'https://securetoken.googleapis.com/v1/token?key=AIzaSyDCvp5MTJLUdtBYEKYWXJrlLzu1zuKM6Xw',
            json: { 
                "grant_type": "refresh_token",
                "refresh_token": token
            }
        }, function(error, res, body) {
            if (!error && res.statusCode == 200) {
                resolve(JSON.parse(body));
            } else {
                reject(error);
            }
        });
    });
}

exports.signUp = signUp;
exports.emailSignUp = emailSignUp;
exports.emailSignIn = emailSignIn;
exports.refreshToken = refreshToken;