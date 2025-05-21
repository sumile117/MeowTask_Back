const mysql = require("mysql2/promise");
const fs = require("fs").promises; // 用于读取 SQL 初始化文件

// 数据库配置
const dbConfig = {
  host: "localhost", // 数据库主机地址
  user: "root", // 数据库用户名
  password: "8899", // 数据库密码
  database: "meowdata", // 要连接的数据库名
  port:"3306",
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
    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

module.exports = { pool, initializeDatabase };

