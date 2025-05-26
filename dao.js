const mysql = require("mysql2/promise");

// 数据库配置
const dbConfig = {
  host: "localhost", // 数据库主机地址
  user: "root", // 数据库用户名
  password: "8899", // 数据库密码
  database: "meowdata", // 要连接的数据库名
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

    //创建tasks表，包含创建时间，修改时间，截止时期（年月日），完成状态，标签（重要，紧急，常规），描述，积分
    await pool.execute(`CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNIQUE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        deadline TEXT,
        completed BOOLEAN DEFAULT FALSE,
        priority ENUM('low', 'medium', 'high') DEFAULT 'low',
        coin INT DEFAULT 2,
        create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        tag VARCHAR(255)
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
          coin INT DEFAULT 0
      )
    `);

    console.log("Database initialized: tables 'tasks' and 'users' are ready.");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}
module.exports = { pool, initializeDatabase };
