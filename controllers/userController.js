// 用户登录相关功能实现
const db = require('../dao');
const bcrypt = require('bcrypt');

// 用户登录
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // 查询数据库中是否存在该用户
        const [rows] = await db.pool.execute("SELECT * FROM users WHERE username = ?", [username]);
        const user = rows[0];

        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }
        // 检查密码是否正确
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: '密码错误' });
        }
        // 更新最后登录时间
        await db.pool.execute("UPDATE users SET last_login_time = CURRENT_TIMESTAMP WHERE id = ?", [user.id]);

        // 登录成功返回用户信息
        return res.status(200).json({
            message: '登录成功',
            user: {
                id: user.id,
                username: user.username,
                create_time: user.create_time,
                last_login_time: user.last_login_time
            }
        });
    } catch (error) {
        console.error('登录出错:', error);
        return res.status(500).json({ message: '登录出错' });
    }
};

// 用户注册
exports.register = async (req, res) => {
    const { username, password } = req.body;

    try {
        // 检查用户名是否已存在
        const [existingUserRows] = await db.pool.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        if (existingUserRows.length > 0) {
            return res.status(400).json({ message: '用户名已存在' });
        }
        // 对密码进行加密
        const hashedPassword = await bcrypt.hash(password, 10);

        // 插入新用户
        const [insertResult] = await db.pool.execute(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );
        const newUser = {
            id: insertResult.insertId,
            username
        };
        return res.status(201).json({
            message: '注册成功',
            user: newUser
        });
    } catch (error) {
        console.error('注册出错:', error);
        return res.status(500).json({ message: '服务器内部错误' });
    }
};

// 修改密码
exports.updatePassword = async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;

    try {
        // 检查用户是否存在
        const [rows] = await db.pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];
        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }

        // 检查旧密码是否正确
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: '旧密码错误' });
        }
        // 对新密码进行加密
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        // 调用 DAO 层更新密码，并更新 update_time
        await db.pool.execute(
            'UPDATE users SET password = ?, update_time = CURRENT_TIMESTAMP WHERE username = ?',
            [hashedNewPassword, username]
        );
        // 修改成功返回响应
        return res.status(200).json({ message: '密码修改成功' });
    } catch (error) {
        console.error('修改密码出错:', error);
        return res.status(500).json({ message: '服务器内部错误' });
    }
};

// 根据id查询用户
exports.getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const [rows] = await db.pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
        const user = rows[0];

        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }

        return res.status(200).json({
            message: '查询成功',
            user: {
                id: user.id,
                username: user.username,
                create_time: user.create_time,
                update_time: user.update_time,
                last_login_time: user.last_login_time,
                sex: user.sex,
                point: user.point
            }
        });
    } catch (error) {
        console.error('查询用户出错:', error);
        return res.status(500).json({ message: '服务器内部错误' });
    }
};

