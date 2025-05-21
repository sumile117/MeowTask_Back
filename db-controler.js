const mysql = require("mysql2/promise");
const fs = require("fs").promises; // 用于读取 SQL 初始化文件

// 数据库配置
const dbConfig = {
  host: "localhost", // 数据库主机地址
  user: "root", // 数据库用户名
  password: "password", // 数据库密码
  database: "myapp", // 要连接的数据库名
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// 初始化数据库连接池
const pool = mysql.createPool(dbConfig);

// 数据库初始化函数
async function initializeDatabase() {
  let connection;
  try {
    // 从连接池获取连接
    connection = await pool.getConnection();

    console.log("成功连接到 MySQL 数据库");

    // 读取并执行 SQL 初始化脚本
    try {
      const sqlScript = await fs.readFile("./database/init.sql", "utf8");
      const statements = sqlScript
        .split(";")
        .filter((statement) => statement.trim() !== "");
      for (const statement of statements) {
        await connection.query(statement);
      }

      console.log("数据库初始化脚本执行成功");
    } catch (err) {
      if (err.code === "ENOENT") {
        console.log("未找到初始化脚本，跳过执行");
      } else {
        throw err;
      }
    }
  } catch (error) {
    console.error("数据库初始化失败:", error.message);
    throw error; // 抛出错误以便调用者处理
  } finally {
    if (connection) {
      connection.release(); // 释放连接回连接池
    }
  }
}

module.exports = { pool, initializeDatabase };
