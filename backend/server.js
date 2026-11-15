
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Progress = require("./Progress");
const Resume = require("./Resume");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const app = express();
const PORT = 5000;

require("dotenv").config();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((error) =>
    console.error("MongoDB connection error:", error.message)
  );

// Middleware
app.use(cors());
app.use(express.json());

// Resume upload configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    const allowedExtensions = /\.(pdf|docx?)$/i;

    if (allowedExtensions.test(file.originalname)) {
      callback(null, true);
    } else {
      callback(new Error("Please upload a PDF or DOCX resume."));
    }
  }
});

// Home route
app.get("/", (req, res) => {
  res.send("Smart Skill Hub Backend is running successfully!");
});

// API route
app.get("/api", (req, res) => {
  res.json({
    project: "Smart Skill Hub",
    message: "Welcome to Smart Skill Hub API",
    status: "running"
  });
});

// Skills to detect in resume
const skillList = [
  "Java",
  "Python",
  "JavaScript",
  "HTML",
  "CSS",
  "React",
  "Node.js",
  "Express",
  "SQL",
  "MySQL",
  "MongoDB",
  "Git",
  "C",
  "C++",
  "JDBC",
  "Spring Boot",
  "Machine Learning"
];

// Recommended learning path
const learningPath = [
  {
    skill: "SQL and MySQL",
    reason: "Learn how to store, retrieve, and manage application data."
  },
  {
    skill: "JDBC",
    reason: "Learn how Java applications connect to databases."
  },
  {
    skill: "Spring Boot",
    reason: "Learn to build Java backend applications and REST APIs."
  },
  {
    skill: "React",
    reason: "Learn to create interactive frontend applications."
  },
  {
    skill: "Git and GitHub",
    reason: "Learn to manage code and showcase your projects."
  }
];

// Resume analysis route
app.post(
  "/api/resume/analyze",
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Please upload a resume."
        });
      }

      const fileName = req.file.originalname.toLowerCase();
      let extractedText = "";

      if (fileName.endsWith(".pdf")) {
        const parser = new pdfParse.PDFParse({
          data: req.file.buffer
        });

        try {
          const result = await parser.getText();
          extractedText = result.text;
        } finally {
          await parser.destroy();
        }

      } else if (fileName.endsWith(".docx")) {
        const result = await mammoth.extractRawText({
          buffer: req.file.buffer
        });

        extractedText = result.value;

      } else {
        return res.status(400).json({
          message: "Please upload a PDF or DOCX file."
        });
      }

      if (!extractedText.trim()) {
        return res.status(400).json({
          message: "No readable text found in the resume."
        });
      }

      const detectedSkills = skillList.filter((skill) => {
        const escapedSkill = skill.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );

        const pattern = new RegExp(
          `(^|[^a-zA-Z0-9+#.])${escapedSkill}(?=$|[^a-zA-Z0-9+#.])`,
          "i"
        );

        return pattern.test(extractedText);
      });

      // Recommend missing skills
      const normalizedSkills = detectedSkills.map((skill) =>
        skill.toLowerCase()
      );

      const recommendedSkills = learningPath.filter((item) => {
        if (item.skill === "SQL and MySQL") {
          return (
            !normalizedSkills.includes("sql") &&
            !normalizedSkills.includes("mysql")
          );
        }

        if (item.skill === "Git and GitHub") {
          return !normalizedSkills.includes("git");
        }

        return !normalizedSkills.includes(
          item.skill.toLowerCase()
        );
      });

      const learningRoadmap = recommendedSkills.map(
        (item, index) => ({
          step: index + 1,
          skill: item.skill,
          reason: item.reason
        })
      );

      const savedResume = await Resume.create({
        fileName: req.file.originalname,
        extractedText,
        detectedSkills,
        recommendedSkills,
        learningRoadmap
      });

      res.json({
        message: "Resume analyzed and saved successfully.",
        resumeId: savedResume._id,
        fileName: savedResume.fileName,
        extractedText: savedResume.extractedText,
        detectedSkills: savedResume.detectedSkills,
        recommendedSkills: savedResume.recommendedSkills,
        learningRoadmap: savedResume.learningRoadmap
      });

    } catch (error) {
      console.error("Resume analysis error:", error);

      res.status(500).json({
        message: "Could not analyze the resume. Please try another file."
      });
    }
  }
);

// Handle upload errors
app.use((error, req, res, next) => {
  if (
    error instanceof multer.MulterError &&
    error.code === "LIMIT_FILE_SIZE"
  ) {
    return res.status(400).json({
      message: "Resume must be smaller than 5 MB."
    });
  }

  if (error.message?.includes("Please upload")) {
    return res.status(400).json({
      message: error.message
    });
  }

  next(error);
});

// Save or update learning progress
app.post("/api/progress", async (req, res) => {
  try {
    const { skill, status } = req.body;

    if (!skill || !status) {
      return res.status(400).json({
        message: "Skill and status are required."
      });
    }

    const allowedStatuses = [
      "Not Started",
      "In Progress",
      "Completed"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid progress status."
      });
    }

    const progress = await Progress.findOneAndUpdate(
      { skill },
      { skill, status },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      message: "Learning progress saved successfully!",
      progress
    });

  } catch (error) {
    console.error("Progress save error:", error);

    res.status(500).json({
      message: "Could not save learning progress."
    });
  }
});

// Get all learning progress
app.get("/api/progress", async (req, res) => {
  try {
    const progress = await Progress.find();
    res.json(progress);

  } catch (error) {
    console.error("Progress fetch error:", error);

    res.status(500).json({
      message: "Could not retrieve learning progress."
    });
  }
});

// Get all resumes
app.get("/api/resumes", async (req, res) => {
  try {
    const resumes = await Resume.find()
      .select("-extractedText")
      .sort({ createdAt: -1 });

    res.json(resumes);

  } catch (error) {
    console.error("Error fetching resumes:", error);

    res.status(500).json({
      message: "Failed to fetch resumes"
    });
  }
});

// Test route
app.get("/api/test", (req, res) => {
  res.send("Test route is working!");
});

// AI-powered chatbot using Ollama
app.post("/api/chatbot", async (req, res) => {
  const { message } = req.body;



  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      reply: "Please enter a programming question."
    });
  }

  try {
    const response = await fetch(
      "http://localhost:11434/api/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gemma3:1b",
          prompt: `You are Smart Skill Hub's programming mentor.
Explain concepts in simple words with examples.

Student's question: ${message.trim()}`,
          stream: false
        })
      }
    );

    if (!response.ok) {
      throw new Error("Ollama API request failed");
    }

    const data = await response.json();

    res.json({
      reply: data.response
    });

  } catch (error) {
    console.error("Chatbot error:", error);

    res.status(500).json({
      reply: "Sorry, I could not generate an answer. Please try again."
    });
  }
});


// AI-powered Code Assessment using Ollama
app.post("/api/code-assessment", async (req, res) => {
  const { title, description, example, language, code } = req.body;

  if (
    typeof code !== "string" ||
    !code.trim() ||
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof language !== "string"
  ) {
    return res.status(400).json({
      reply: "Please provide the question and your code."
    });
  }

  try {
    const response = await fetch(
      "http://localhost:11434/api/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gemma3:1b",
          
          prompt: `You are Smart Skill Hub's AI Code Reviewer.

Evaluate the student's ${language} code for this programming problem.

Question: ${title}
Description: ${description}
Example: ${example}

Student's code:
${code}

Give beginner-friendly feedback using this format:

1. Score: Give a score out of 10.
2. Correctness: Is the solution logically correct?
3. Mistakes: Explain any errors in simple words.
4. Improvements: Suggest how to improve the code.
5. Corrected Code: Provide a correct ${language} solution if needed.

Be encouraging and explain clearly.
Do not claim that you executed the code. Review it logically.`,
          stream: false
        })
      }
    );

    if (!response.ok) {
      throw new Error("Ollama API request failed");
    }

    const data = await response.json();

    res.json({
      reply: data.response
    });

  } catch (error) {
    console.error("Code Assessment error:", error);

    res.status(500).json({
      reply: "Sorry, I could not assess your code. Please try again."
    });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(
    `Smart Skill Hub server running at http://localhost:${PORT}`
  );
});
