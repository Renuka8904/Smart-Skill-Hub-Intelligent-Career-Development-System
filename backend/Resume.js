
const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true
    },
    extractedText: {
      type: String,
      required: true
    },
    detectedSkills: {
      type: [String],
      default: []
    },
    recommendedSkills: {
      type: [
        {
          skill: String,
          reason: String
        }
      ],
      default: []
    },
    learningRoadmap: {
      type: [
        {
          step: Number,
          skill: String,
          reason: String
        }
      ],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Resume", resumeSchema);
