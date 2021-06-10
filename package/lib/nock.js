const fs = require("fs");
const nock = require("nock");
const path = require("path");

/**
 *
 * @param {string} filename
 *
 * example usage `record(__filename)`
 */
module.exports.record = (filename) => {
  const parseFileName = path.parse(filename);
  const fileName = path.resolve(
    parseFileName.dir,
    parseFileName.name + ".nock.json"
  );
  const appendLogToFile = (content) => {
    let data = [];
    try {
      const saved = fs.readFileSync(fileName, { encoding: "utf8" });
      data = JSON.parse(saved);
    } catch (e) {}
    data.push(content);
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2), {
      encoding: "utf8",
    });
  };
  nock.recorder.rec({
    logging: appendLogToFile,
    use_separator: false,
    output_objects: true,
    enable_reqheaders_recording: true,
  });
};
