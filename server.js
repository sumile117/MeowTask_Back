const express = require("express");
const app = express();
const { pool, initializeDatabase } = require("./db-controler");


app.use(express.json());

const port = 3000;

//定义根路由
// app.get("/", async (req, res) => {
//   res.json({ message: "no imlemented" });
// });

async function startserver() {
  // 启动时初始化数据库
  initializeDatabase().catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });
}

//获取所有的日程
app.get("/tasks", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM tasks");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
  //   res.json(tasks);
});

//获取特定的日程
app.get("/tasks/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [rows] = await pool.execute("SELECT * FROM tasks WHERE id = ?", [id]);
    const task = rows[0];
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
});

//创建特定的日程
app.post("/tasks", async (req, res) => {
  try {
    const { title, completed = false } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const [result] = await pool.execute(
      "INSERT INTO tasks (title, completed) VALUES (?, ?)",
      [title, completed]
    );

    const newTask = {
      id: result.insertId,
      title,
      completed,
    };

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
  //   const { title, completed = false } = req.body;
  //   if (!title) {
  //     return res.status(400).json({ message: "Title is required" });
  //   }
  //   const newTask = {
  //     id: nextId++,
  //     title,
  //     completed,
  //   };
  //   tasks.push(newTask);
  //   res.status(201).json(newTask);
});

//更新特定的日程
app.put("/tasks/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, completed } = req.body;

    if (!title && completed === undefined) {
      return res
        .status(400)
        .json({ message: "至少需要提供 title 或 completed" });
    }
    // 构建更新语句和参数
    let sql = "UPDATE tasks SET ";
    const values = [];
    if (title) {
      sql += "title = ?";
      values.push(title);

      if (completed !== undefined) {
        sql += ", completed = ?";
        values.push(completed);
      }
    } else {
      sql += "completed = ?";
      values.push(completed);
    }

    sql += " WHERE id = ?";
    values.push(id);

    const [result] = await pool.execute(sql, values);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Task not found" });
    } else {
      res.status(200).json({ message: "Task updated successfully" });
    }
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//删除特定的日程
app.delete("/tasks/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [result] = await pool.execute("DELETE FROM tasks WHERE id = ?", [id]);

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
});

startserver();

app.listen(port, () => {
  console.log(`Sever is running at http://localhost:${port}`);
});
