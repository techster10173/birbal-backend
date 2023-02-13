const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const routes = require("./routes");

dotenv.config();
const app = express();

const port = process.env.PORT || 3333;

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
});

mongoose.set('strictQuery', true);

const whitelist = ['http://localhost', 'capacitor://localhost', 'http://localhost:8100']
const corsOptions = {
  credentials: true,
  origin: whitelist,
}
app.use(cors(corsOptions));

app.use(express.json());
app.use(routes);

const server = app.listen(port);

process.on('SIGTERM', () => {
  server.close(async () => {
    await mongoose.disconnect();
  })
})
