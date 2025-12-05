import { getChatCompletion } from "../services/model.service.js";
export async function chatCompletionHandler(req, res) {
    try {
        // The validate middleware places the parsed body on req.body
        const payload = req.body;
        // Call the AI model
        const result = await getChatCompletion(payload);
        // Return successful response
        return res.status(200).json({
            response: result,
            model: process.env.MODEL_NAME || "xai/grok-3",
            usage: {
                // Note: GitHub Models currently doesn't return token usage in response
                prompt_tokens: -1,
                completion_tokens: -1,
                total_tokens: -1,
            },
        });
    }
    catch (error) {
        console.error("Chat completion error:", error);
        if (error.message.includes("rate limit") || error.status === 429) {
            return res.status(429).json({ error: "Rate limit exceeded" });
        }
        if (error.message.includes("Unauthorized") || error.status === 401) {
            return res.status(401).json({ error: "Invalid or missing API token" });
        }
        return res.status(500).json({
            error: "Internal server error",
            message: error.message || "Failed to process request",
        });
    }
}
//# sourceMappingURL=model.controller.js.map