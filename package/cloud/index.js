"use strict";
const pulumi = require("@pulumi/pulumi");
const dotenv = require("dotenv");

const config = new pulumi.Config("pulumi");
const names = JSON.parse(config.require("env_files")) || [];

names.forEach((path) => dotenv.config({ path }));

module.exports.backend = require("./backend");
module.exports.dynamo = require("./dynamo");
module.exports.lambda = require("./lambda");
module.exports.website = require("./website");
