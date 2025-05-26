require("dotenv").config();
const { server } = require('./src/app');
const port = process.env.PORT || 3000;

server.listen(port, "0.0.0.0", () => {
  console.log(`Server running on: http://0.0.0.0:${port}`);
});