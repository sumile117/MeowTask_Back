const express = require("express");
const app = express();
// const { pool, initializeDatabase } =require('./db-controler')
// const mysql = require('mysql2/promise'); // 使用 mysql2 的 Promise 版本
// const fs = require('fs').promises; // 用于读取 SQL 初始化文件

app.use(express.json());

const port = 3000;
let nextId =1;
let tasks =[];

//定义根路由
// app.get("/", async (req, res) => {
//   res.json({ message: "no imlemented" });
// });

//获取所有的日程
app.get("/tasks", async (req, res) => {
  res.json(tasks);
});

//获取特定的日程
app.get("/tasks/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t=> t.id === id);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

//创建特定的日程
app.post("/tasks", async (req, res) => {
  const { title, completed = false } = req.body;
  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }
  const newTask = {
    id: nextId++,
    title,
    completed,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

//删除特定的日程
app.delete("/tasks/:id", async (req, res) => {
    const id=parseInt(req.params.id);
    const index=tasks.findIndex(t=>t.id===id);
    if(index!==-1){
        tasks.splice(index,1   );
        res.status(204).send();
    }
    else {
        res.status(404).json({message:"Task not found"});
    }
});

// app.get("/", (req, res) => {
//   const requestData = {
//     method: req.method,
//     url: req.url,
//     headers: req.headers,
//     query: req.query,
//     ip: req.ip,
//     path: req.path,
//     protocol: req.protocol,
//     hostname: req.hostname,
//   };

//   res.json({
//     message: "hello world",
//     requestData: requestData,
//   });
// });

app.listen(port, () => {
  console.log(`Sever is running at http://localhost:${port}`);
});

// // 如果直接运行此文件，则执行初始化
// if (require.main === module) {
//   (async () => {
//     try {
//       await initializeDatabase();
//       console.log('数据库初始化完成');
//       process.exit(0);
//     } catch (error) {
//       console.error('初始化过程中发生错误:', error);
//       process.exit(1);
//     }
//   })();
// }