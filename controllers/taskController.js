const db = require("../dao");

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
const createTask = async (req, res) => {
  try {
    const {
      title,
      deadline,
      tag,
      integral,
      summary,
      completed = false,
    } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const [result] = await db.pool.execute(
      "INSERT INTO tasks (title,deadline,tag,integral,summary, completed) VALUES (?, ?,?,?,?,?)",
      [title,deadline,tag,integral,summary, completed]
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

module.exports = { getAllTasks, getTheTask, createTask, deleteTask };
