const Authentication = require('./auth');
const Dream = require('./dream')

exports.signUp = Authentication.signUp;
exports.signIn = Authentication.signIn;
exports.refresh = Authentication.refreshToken;
exports.getStyles = Dream.getStyles;
exports.printStyles = Dream.printStyles;
exports.getUploadURL = Dream.getUploadURL;
exports.uploadPhoto = Dream.uploadPhoto;
exports.generateImage = Dream.generateImage;
exports.getTaskID = Dream.getTaskID;
exports.createTask = Dream.createTask;
exports.checkStatus = Dream.checkStatus;
exports.getTaskShopURL = Dream.getTaskShopURL;
exports.saveToGallery = Dream.saveToGallery;
exports.getGallery = Dream.getGallery;