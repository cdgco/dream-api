const Authentication = require('./auth');
const Dream = require('./dream')

const getStyles = async() => {
    let token = await Authentication.signUp();
    return await Dream.getStyles(token.idToken);
}

const printStyles = async() => {
    let token = await Authentication.signUp();
    await Dream.printStyles(token.idToken);
}

const generateImage = async(styleValue, promptValue, image = null) => {
    let token = await Authentication.signUp();
    return await Dream.generateImage(token.idToken, promptValue, styleValue, image);
}

exports.getStyles = getStyles;
exports.printStyles = printStyles;
exports.generateImage = generateImage;