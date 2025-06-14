const aiClient = require("../utils/aiClient");


const chatWithAI = async (req, res) => {
    const { message } = req.body;
    const prompt = aiClient.prompt(message);

    try {
        const reply = await aiClient.sendMessage(prompt);
        console.log("AI回复：", reply);

        let result;
        try {
            result = JSON.parse(reply); // 尝试解析为 JSON
        } catch (e) {
            result = { message: reply }; // 否则作为普通消息返回
        }

        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: "AI调用失败" });
    }
};


// POST /ai/chat
// const chatWithAI = async (req, res) => {
//     const { message } = req.body;
//     try {
//         const response = await aiClient.sendMessage(message); // 调用AI模型
//         res.json({ reply: response });
//     } catch (error) {
//         console.error("Error chatting with AI:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };
module.exports = { chatWithAI };
