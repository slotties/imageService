const longParamNoValuePattern = /^\-\-([a-z]+)$/i;
const longParamWithValuePattern = /^\-\-([a-z]+)=([a-z0-9\/_\-\.]+)$/i;

function parseCommandlineArguments(argv) {
    const parsedArgs = {};
    
    argv.forEach((arg) => {
        let key = null;
        let value = true;
        if (longParamNoValuePattern.test(arg)) {
            key = longParamNoValuePattern.exec(arg)[1];
            value = true;
        } else if (longParamWithValuePattern.test(arg)) {
            const match = longParamWithValuePattern.exec(arg);
            key = match[1];
            value = match[2];
        }

        if (key) {
            parsedArgs[key] = value;
        }
    });

    return parsedArgs;
}

module.exports.parse = parseCommandlineArguments;