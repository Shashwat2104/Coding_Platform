const mongoose = require("mongoose");

const adminschema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: {
    type: String,
    required: true,
    enum: ["easy", "medium", "hard"],
  },
  testcases: [
    {
      input: { type: String, required: true },
      output: { type: String, required: true },
    },
  ],
});

const adminmodel = mongoose.model("admin", adminschema);

module.exports = { adminmodel };
