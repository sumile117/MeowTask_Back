const express = require("express");
const app = express();
const { pool, initializeDatabase } = require("./dao");
const Router = require("./router/router");
const cors = require("cors");
app.use(cors()); //使用cors中间件

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

startserver();

app.listen(port, () => {
  console.log(`Sever is running at http://localhost:${port}`);
});
