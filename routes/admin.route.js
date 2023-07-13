const express = require("express");
const adminrouter = express.Router();
const axios = require("axios");
const { adminmodel } = require("../models/admin.model");
require("dotenv").config();

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

// adminrouter.post("/questions/:id/submit", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { code, language } = req.body;

//     const question = await adminmodel.findById(id);
//     if (!question) {
//       return res.status(404).json({ message: "Question not found" });
//     }

//     // Find test cases for question
//     const testCases = question.testcases;

//     const results = [];
//     for (const testCase of testCases) {
//       const response = await axios.post(
//         // console.log("j")
//         "https://d6ee0a57.compilers.sphere-engine.com/api/v4/submissions?access_token=e2c1dc11d7c91025751647382b3bc543",
//         {
//           language,
//           sourceCode: code,
//           input: testCase.input,
//         }
//       );
//       console.log(response.sourceCode);
//       const submissionId = response.data.id;
//       console.log(submissionId, "heloo");
//       let status = "running";
//       while (status === "running") {
//         const statusResponse = await axios.get(
//           `https://d6ee0a57.compilers.sphere-engine.com/api/v4/submissions/${submissionId}?access_token=e2c1dc11d7c91025751647382b3bc543`
//         );
//         status = statusResponse.data.status;
//       }
//       if (status === "accepted" && response.data.output === testCase.output) {
//         results.push("success");
//       } else {
//         results.push("wrong");
//       }
//     }

//     if (results.every((result) => result === "success")) {
//       res.status(200).json({ message: "Solution is correct" });
//     } else if (results.some((result) => result === "success")) {
//       res.status(200).json({ message: "Some test cases passed, some failed" });
//     } else {
//       res.status(200).json({ message: "Solution is wrong" });
//     }
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });



adminrouter.post("/submit-solution", async (req, res) => {
  try {
    const { question_id, answer } = req.body;

    const question = await adminmodel.findById(question_id);

    const data = {
      question_id: question.sphere_engine_question_id,
      answer,
    };

    const headers = { Authorization: `Bearer ${process.env.SPHERE_ENGINE_API_KEY}` };
    const response = await axios.post(
      `${process.env.SPHERE_ENGINE_API_URL}/check-solution`,
      data,
      { headers }
    );

    if (response.status === 200) {
      const result = response.data;
      if (result.correct) {
        res.json({ result: "success" });
      } else {
        const error_message = result.error_message;
        res.json({ result: "wrong", error_message });
      }
    } else {
      res.status(500).json({
        result: "error",
        error_message: "An error occurred while checking the solution",
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ result: "error", error_message: "Internal server error" });
  }
});







module.exports = { adminrouter };
