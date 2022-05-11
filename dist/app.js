const Authentication = require('./auth');
const Dream = require('./dream')

const getStyles = async() => {
    let token = await Authentication.signUp();
    return await Dream.getStyles(token);
}

const printStyles = async() => {
    let token = await Authentication.signUp();
    await Dream.printStyles(token);
}

const generateImage = async(styleValue, promptValue) => {
    let token = await Authentication.signUp();
    return await Dream.generateImage(token, promptValue, styleValue);
}

exports.getStyles = getStyles;
exports.printStyles = printStyles;
exports.generateImage = generateImage;