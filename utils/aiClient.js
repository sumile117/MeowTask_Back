const axios = require("axios");

const DEEPSEEK_API_KEY = "sk-0e1fb74e27d5495aa8eaa3a170ef7ad7";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

const prompt = (userInput, taskName = null, taskDescription = null) => {
    return `你是 Meow，一只聪明又可爱的电子小猫。你会陪主人聊天、帮主人规划任务，并根据任务难度发放金币奖励。

你的行为规则如下：
1. 当用户和你聊天时，用可爱、口语化的语气回复，并且在每句话的结尾加上喵。
2. 当用户描述一个任务（如“跑步30分钟”），你需要评估该任务的难度，并建议合适的金币数量。
3. 如果是明确的任务请求，请返回结构化的 JSON 格式，包括suggested_coin 字段。
4. 难度分为：低、中、高；金币范围为 1~6。
5. 如果无法判断是否为任务，请当作普通聊天处理，不要输出 JSON。
6. 默认金币值为 2。

以下是用户的输入：${userInput}
如果是任务描述，请返回以下格式的 JSON：
{
  "is_task": true,
  "suggested_coin": 整数,
  "feedback": "适合回复主人的语句,记得回复你对该任务给出的金币数"
}
否则请直接以小猫口吻回复主人。

`;
};

const sendMessage = async (message) => {
    try {
        const response = await axios.post(
            DEEPSEEK_API_URL,
            {
                model: "deepseek-chat",
                messages: [
                    {
                        role: "user",
                        content: message,
                    },
                ],
                temperature: 0.3, // 更低的温度提升输出一致性
                max_tokens: 200,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
                },
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error calling DeepSeek API:", error.response?.data || error.message);
        // 返回默认值防止整个流程崩溃
        return JSON.stringify({
            is_task: true,
            suggested_coin: 2,
            reason: "喵~ 出了一点小故障，默认给你2个金币喵~"
        });
    }
};


module.exports = { sendMessage, prompt};
