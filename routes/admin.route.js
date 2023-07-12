const express = require("express");
const adminrouter = express.Router();

const { adminmodel } = require("../models/admin.model");

adminrouter.post("/questions", async (req, res) => {
  try {
    //   const { title, description, difficulty } = req.body;
    let data = req.body;
    const newData = new adminmodel(data);
    await newData.save();
    res.status(200).send({ msg: "Question Added" });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

adminrouter.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await adminmodel.findOneAndDelete({ _id: id });
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

adminrouter.put("/change/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;
    const data = await adminmodel.findOneAndUpdate({ _id: id }, newData);
    res.status(200).json({ message: "Question Update successfully" });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

adminrouter.get("/allquestions", async (req, res) => {
  try {
    const data = await adminmodel.find();
    console.log("data", data);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

adminrouter.post("/questions/:id/testcases", async (req, res) => {
  try {
    const { id } = req.params;
    const newdata = req.body;
    let data = await adminmodel.findById({ _id: id });
    data.testcases.push(newdata);
    await data.save();
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
  }
});

module.exports = { adminrouter };
