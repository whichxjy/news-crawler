const pizzip = require("pizzip");
const docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");

const TEMPLATE_PATH = path.resolve(__dirname, "template.docx");

const OUTPUT_DIR = path.resolve(__dirname, "output");
if (!fs.existsSync(OUTPUT_DIR)){
    fs.mkdirSync(OUTPUT_DIR);
}

const replaceErrors = (_, value) => {
    if (value instanceof Error) {
        return Object.getOwnPropertyNames(value).reduce((error, key) => {
            error[key] = value[key];
            return error;
        }, {});
    }
    return value;
};

const errorHandler = (error) => {
    console.log(JSON.stringify({error: error}, replaceErrors));

    if (error.properties && error.properties.errors instanceof Array) {
        const errorMessages = error.properties.errors.map((error) => {
            return error.properties.explanation;
        }).join("\n");
        console.log("errorMessages", errorMessages);
    }

    throw error;
};

const writeContentToDocs = (title, content) => {
    console.log(`Start write docs ${title}`);

    const template = fs
        .readFileSync(TEMPLATE_PATH, "binary");

    const zip = new pizzip(template);
    let doc;
    try {
        doc = new docxtemplater(zip);
    } catch(error) {
        errorHandler(error);
    }

    doc.setData({
        content: content
    });
    doc.render();

    const buf = doc.getZip()
        .generate({type: "nodebuffer"});

    fs.writeFileSync(path.resolve(OUTPUT_DIR, `${title}.docx`), buf);
};

exports.writeContentToDocs = writeContentToDocs;
