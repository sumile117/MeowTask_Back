const mysql = require("mysql2/promise");

// 数据库配置
const dbConfig = {
  host: "localhost", // 数据库主机地址
  user: "root", // 数据库用户名
  password: "123456", // 数据库密码
  database: "meowtask", // 要连接的数据库名
  port: "3306",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// 初始化数据库连接池
const pool = mysql.createPool(dbConfig);

// 数据库初始化函数
async function initializeDatabase() {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT false
      )
    `);

    // 创建 users 表
    await pool.execute(`      CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
          update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_login_time DATETIME,
          sex TINYINT UNSIGNED DEFAULT 0,
          point INT DEFAULT 0
      )
    `);

    console.log("Database initialized: tables 'tasks' and 'users' are ready.");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}
module.exports = { pool, initializeDatabase };
