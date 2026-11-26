const express = require("express");
const cors = require("cors");
const routes = require("./routes/routes");
const { port, paths } = require("./config");
const { errorHandler } = require("./middlewares/error-handler");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", routes);
app.use("/uploads", express.static(paths.uploadsDir));


app.use(errorHandler);

app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
});