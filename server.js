app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message.toLowerCase();

    // Custom response for "who made you" type questions
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
