
const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    default: "Not Started"
  }
});

module.exports = mongoose.model("Progress", progressSchema);
