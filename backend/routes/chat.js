const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const getPromptForMessage = require("../prompts");
// ✅ Handle Chat Request with Enhanced Logging
router.post("/", async (req, res) => {
    const { message } = req.body;
    console.log("🟢 Received message:", message);

    if (!message) {
        console.log("❌ No message received!");
        return res.status(400).json({ error: "Message is required" });
    }

    const prompt = getPromptForMessage(message);
    // ✅ Run Ollama Command with Correct Syntax
    const command = `echo "${prompt}" | ollama run llama2:13b`;
    console.log("🟢 Running Command:", command);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error("❌ Error Executing Ollama Command:", error);
            console.error("❌ Stderr:", stderr);
            return res.status(500).json({ error: "Failed to process message", details: stderr });
        }

        console.log("✅ Raw Output:", stdout);

        try {
            // ✅ Extracting model's response
            const reply = stdout.trim();
            console.log("✅ Extracted Reply:", reply);
            res.json({ reply });
        } catch (parseError) {
            console.error("❌ JSON Parse Error:", parseError);
            res.status(500).json({ error: "Failed to parse Ollama response" });
        }
    });
});

module.exports = router;
