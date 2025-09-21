import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const HF_MODEL = "bigscience/bloom"; // Free Hugging Face model
const HF_TOKEN = process.env.HF_TOKEN;

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message.toLowerCase();

    // Custom response for "who made you"
    if (
      message.includes("who made you") ||
      message.includes("who created you") ||
      message.includes("who is your developer")
    ) {
      return res.json({ reply: "I was created by Kabeer Ali, an Indian developer." });
    }

    // Call Hugging Face for other questions
    const response = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: message })
    });

    const data = await response.json();
    const reply = data[0]?.generated_text || "Sorry, I could not respond.";
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.json({ reply: "Error occurred. Try again!" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
