const aiClient = require("../utils/aiClient");


const chatWithAI = async (req, res) => {
    const { message } = req.body;

    try {
        // 构建提示信息
        const fullPrompt = aiClient.prompt(message);

        // 调用AI服务
        const reply = await aiClient.sendMessage(fullPrompt);

        console.log("AI原始回复：", reply);

        let result;
        try {
            // 尝试解析为JSON
            result = JSON.parse(reply);

            // 如果解析成功但不是任务格式，转换为普通消息格式
            if (!result.is_task && !result.message) {
                result = { message: result.feedback || reply };
            }
        } catch (e) {
            // 如果解析失败，作为普通消息返回
            result = { message: reply };
        }

        // 统一的成功响应格式
        res.json({
            success: true,
            data: result.message
        });
    } catch (error) {
        console.error("AI交互出错：", error.message);
        // 明确的错误响应
        res.status(500).json({
            success: false,
            error: "AI服务暂时不可用",
            details: error.message
        });
    }
};


module.exports = { chatWithAI };
