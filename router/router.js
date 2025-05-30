// routes/tasksRoutes.js
const express = require("express");
const router = express.Router();

const {
  getAllTasks,
  getTheTask,
  createTask,
  deleteTask,
    updateTask,
} = require("../controllers/taskController"); // 导入控制器

// 绑定路由
router.get("/tasks", getAllTasks);
router.get("/tasks/id/:id", getTheTask);
router.post("/tasks", createTask);
router.delete("/tasks/id/:id", deleteTask);
router.put("/tasks/id/:id", updateTask);



//用户登录相关功能
const {
    login,
    register,
    updatePassword,
    getUserById,
    getUserByUsername,
} = require("../controllers/userController");

router.post("/login", login);
router.post("/register", register);
router.post("/updatePassword", updatePassword);
router.get("/users/id/:id", getUserById);
router.get("/users/username/:username", getUserByUsername);

module.exports = router;
