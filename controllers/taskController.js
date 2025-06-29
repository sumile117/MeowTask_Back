const db = require("../dao");
const aiClient = require("../utils/aiClient"); // 根据实际路径调整

const getAllTasks = async (req, res) => {
  try {
    const [rows] = await db.pool.execute("SELECT * FROM tasks");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
  //   res.json(tasks);
};

//获取特定的日程
const getTheTask = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [rows] = await db.pool.execute("SELECT * FROM tasks WHERE id = ?", [
      id,
    ]);
    const task = rows[0];
    //打印日程
    console.log(task);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
  //   const id = parseInt(req.params.id);
  //   const task = tasks.find((t) => t.id === id);
  //   if (task) {
  //     res.json(task);
  //   } else {
  //     res.status(404).json({ message: "Task not found" });
  //   }
};

//创建特定的日程
// const createTask = async (req, res) => {
//   try {
//     const { name = null, description = null, completed = false, coin } = req.body;
//     if (!name) {
//       return res.status(400).json({ message: "Name is required" });
//     }
//
//     const [result] = await db.pool.execute(
//       "INSERT INTO tasks (name, description, completed, coin) VALUES (?, ?, ?, ?)",
//       [name, description, completed, coin]
//     );
//
//     const newTask = {
//       id: result.insertId,
//       name,
//       description,
//       completed,
//       coin,
//     };
//
//     res.status(201).json(newTask);
//   } catch (error) {
//     console.error("Error creating task:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
const createTask = async (req, res) => {
  try {
    const { name = null, description = null, completed = false, deadline = null } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // 构建 Prompt
    const userInput = `我打算新增一个任务：${name}，描述是：${description}`;
    const prompt = aiClient.prompt(userInput, name, description);

    // 调用 AI
    const aiResponse = await aiClient.sendMessage(prompt);

    // 解析响应
    let parsedResult;
    try {
      parsedResult = JSON.parse(aiResponse);
    } catch (e) {
      parsedResult = {
        is_task: true,
        suggested_coin: 2,
        feedback: "喵~ 分析失败，默认给你2个金币喵~"
      };
    }
    console.log(parsedResult);

    if (!parsedResult.is_task) {
      return res.status(400).json({ message: parsedResult.feedback });
    }

    const suggestedCoin = parsedResult.suggested_coin;

    // 插入数据库
    const [result] = await db.pool.execute(
        "INSERT INTO tasks (name, description, completed, coin, deadline) VALUES (?, ?, ?, ?, ?)",
        [name, description, completed, suggestedCoin, deadline]
    );

    const newTask = {
      id: result.insertId,
      name,
      description,
      completed,
      coin: suggestedCoin,
      deadline
    };

    res.status(201).json({
      ...newTask,
      feedback: parsedResult.feedback
    });

  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//删除特定的日程
const deleteTask = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [result] = await db.pool.execute("DELETE FROM tasks WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Task not found" });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
  //   const id = parseInt(req.params.id);
  //   const index = tasks.findIndex((t) => t.id === id);
  //   if (index !== -1) {
  //     tasks.splice(index, 1);
  //     res.status(204).send();
  //   } else {
  //     res.status(404).json({ message: "Task not found" });
  //   }
};

//更新特定的日程
const updateTask = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, completed, coin, deadline } = req.body;

    // 构建要更新的字段和对应的值
    const fields = [];
    const values = [];

    if (name !== undefined) {
      fields.push("name = ?");
      values.push(name);
    }
    if (description !== undefined) {
      fields.push("description = ?");
      values.push(description);
    }
    if (completed !== undefined) {
      fields.push("completed = ?");
      values.push(completed);
    }
    if (coin !== undefined) {
      fields.push("coin = ?");
      values.push(coin);
    }
    if (deadline !== undefined) {
      fields.push("deadline = ?");
      values.push(deadline);
    }

    // 如果没有任何字段需要更新
    if (fields.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // 构建最终 SQL 语句
    const sql = `UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id); // 添加 ID 参数到最后

    // 执行 SQL
    const [result] = await db.pool.execute(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully" });

  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//完成任务
const completeTask = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [result] = await db.pool.execute(
        "UPDATE tasks SET completed = 1 WHERE id = ?",
        [id]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Task not found" });
    } else {
      res.status(200).json({ message: "Task completed successfully" });
    }
  } catch (error) {
    console.error("Error completing task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { getAllTasks, getTheTask, createTask, deleteTask, updateTask, completeTask };
