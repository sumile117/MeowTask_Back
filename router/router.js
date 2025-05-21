// routes/tasksRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  getTheTask,
  createTask,
  deleteTask,
} = require("../controllers/taskControler"); // 导入控制器

// 绑定路由
router.get("/tasks", getAllTasks);
router.get("/tasks/:id", getTheTask);
router.post("/tasks", createTask);
router.delete("/tasks/:id", deleteTask);

module.exports = router;
