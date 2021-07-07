if (process.argv[2]) {
  require("./" + process.argv[2] + ".local.js");
} else {
  console.error("Missing argument filename");
  console.error("Example usage: npm run -w lambda local on-installation");
}
