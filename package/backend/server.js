import app from "./app.js";

const port = process.env.API_PORT;
// eslint-disable-next-line no-unused-vars
const server = app.listen(port);

console.info(`Listening to http://localhost:${port}`);
