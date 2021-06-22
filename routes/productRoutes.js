const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../models/product");

// for getting all products
router.get("/", async (req, res, next) => {
  try {
    const products = await Product.find({}, { name: 1, price: 1 });

    if (products.length) {
      return res.json({
        msg: "all the products",
        products,
      });
    } else {
      return res.json({
        msg: "no product found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      msg: "error occured",
      error: error,
    });
  }
});

// to create product
router.post("/", (req, res, next) => {
  const { name, price } = req.body;

  const product = new Product({
    name,
    price,
  });

  product
    .save()
    .then((result) => {
      res.json({
        product: result,
      });
    })
    .catch((err) => {
      res.status(400).json({
        msg: "not created",
        error: err,
      });
    });
});

// getting a single product

router.get("/:id_or_name", async (req, res) => {
  const id_or_name = req.params.id_or_name;

  console.log("id_or_name: ", id_or_name);
  console.log("true or not : ", mongoose.Types.ObjectId.isValid(id_or_name));

  if (mongoose.Types.ObjectId.isValid(id_or_name)) {
    // ! find by id
    try {
      const result = await Product.findById(id_or_name);

      return res.json({
        product: result,
      });
    } catch (error) {
      return res.status(400).json({
        message: "product not found by id",
        error,
      });
    }
  } else {
    // ! find by name
    try {
      const result = await Product.find({
        name: new RegExp(`^${id_or_name}$`, "i"),
      });

      return res.json({
        product: result,
      });
    } catch (error) {
      return res.status(400).json({
        message: "product not found by name",
        error,
      });
    }
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Product.findByIdAndDelete(id);

    if (result) {
      return res.json({
        message: "product deleted",
        result,
      });
    } else {
      return res.status(400).json({
        message: "no data found, db is empty",
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "NOT DELETE",
      error,
    });
  }
});
module.exports = router;
