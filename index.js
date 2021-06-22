const express = require("express");
const mongoose = require("mongoose");

//! MY ROUTES
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(express.json());

app.use("/products", productRoutes);

app.get("/", (req, res) => {
  console.log(req.url);
  res.json({
    message: "home page",
  });
});

app.all("*", (req, res) => {
  res.status(404).json({
    message: "page not found",
  });
});

mongoose
  .connect("mongodb://localhost:27017/rest_api_tutorial", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    // mongodb connected
    console.log("DB CONNECTED");
    const port = 8000;
    app.listen(port, () => {
      console.log("server is up and running on ", port);
    });
  })
  .catch(() => {
    // not connected
    console.log("DB NOT CONNECTED");
  });
