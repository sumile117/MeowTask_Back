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
const createTask = async (req, res) => {
  try {
    const { name = null, description = null, completed = false, coin } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const [result] = await db.pool.execute(
      "INSERT INTO tasks (name, description, completed, coin) VALUES (?, ?, ?, ?)",
      [name, description, completed, coin]
    );

    const newTask = {
      id: result.insertId,
      name,
      description,
      completed,
      coin
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

//更新特定的日程
const updateTask = async (req, res) => {
  try {
      const id = parseInt(req.params.id);
      const { name, description, completed, coin } = req.body;
      if (!name && !description && !completed && !coin) {
          return res.status(400).json({ message: "至少需要提供 name、description、completed 或 coin" });
      }
      const [result] = await db.pool.execute(
          "UPDATE tasks SET name = ?, description = ?, completed = ?, coin = ? WHERE id = ?",
          [name, description, completed, coin, id]
      );
      if (result.affectedRows === 0) {
          res.status(404).json({ message: "Task not found" });
      } else {
          res.status(200).json({ message: "Task updated successfully" });
      }
  } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAllTasks, getTheTask, createTask, deleteTask, updateTask };
