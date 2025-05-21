const express = require("express");
const app = express();
const { pool, initializeDatabase } = require("./dao");
const Router = require("./router/router");

app.use(express.json());
app.use(Router);
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

startserver();

app.listen(port, () => {
  console.log(`Sever is running at http://localhost:${port}`);
});
