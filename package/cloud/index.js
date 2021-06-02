"use strict";
const pulumi = require("@pulumi/pulumi");
const dotenv = require("dotenv");

const config = new pulumi.Config();
const names = JSON.parse(config.require("env_files")) || [];

names.forEach((path) => dotenv.config({ path }));

module.exports.backend = require("./backend");
module.exports.dynamo = require("./dynamo");
