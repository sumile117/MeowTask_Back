const express = require("express");
const app = express();
const { pool, initializeDatabase } = require("./dao");
const Router = require("./router/router");
const cors = require("cors");
app.use(cors()); //使用cors中间件


const cors = require('cors');


// 启用 CORS（开发环境可开放所有来源）
app.use(cors());

// 或者更安全的方式（指定允许的域名）：
// app.use(cors({
//   origin: 'http://localhost:5173'
// }));

// 其他中间件和路由...

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
