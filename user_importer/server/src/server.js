const express = require("express");
const cors = require("cors");
const routes = require("./routes/routes");
const { port } = require("./config");

const app = express();

app.use(cors());
app.use("/api", routes);

app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
});