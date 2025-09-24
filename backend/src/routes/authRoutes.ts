import express from "express";
import jwt from "jsonwebtoken";
import passport from "../config/passport";
import UserModel from "../models/userModel";
import { requireAuth } from "../middlewares/auth";
import { config } from "../config/environment";

const authRouter = express.Router();

// Rota de login
authRouter.post("/login", (req, res, next) => {
    passport.authenticate("local", { session: false }, (err: any, user: any, info: any) => {
        if (err) {
            return res.status(500).json({ error: `Erro no servidor: ${err.message}` });
        }

        if (!user) {
            return res.status(401).json({
                error: info.message || 'Credenciais inválidas',
                authenticated: false
            });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRES_IN } as jwt.SignOptions
        );

        return res.status(200).json({
            message: 'Login realizado com sucesso',
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            },
            authenticated: true,
        });
    })(req, res, next);
});


// Rotea de registro
authRouter.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await UserModel.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: 'Nome de usuário já está em uso' });
        }

        const existingEmail = await UserModel.findByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ error: 'Email já está em uso' });
        }

        const newUser = await UserModel.create(username, email, password);
        res.status(201).json({
            message: 'Usuário criado com sucesso',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error: any) {
        res.status(500).json({ error: `Erro no servidor: ${error.message}` });
    }
});

// Rota para obter informações do usuário autenticado
authRouter.get('/me', requireAuth, (req: any, res: any) => {
    res.status(200).json({
        user: {
            id: req.user.id,
            username: req.user.username,
            email: req.user.email
        },
        authenticated: true
    });
});

// Rota para obter todos os usuarios
authRouter.get('/getAll', requireAuth, async (req, res) => {
    try {
        const users = await UserModel.getAll();
        res.status(200).json({ users });
    } catch (error: any) {
        res.status(500).json({ error: `Erro no servidor: ${error.message}` });
    }
});

authRouter.patch('/update/:id', requireAuth, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { username, email, password } = req.body;
        const updatedUser = await UserModel.editUser(userId, username, email, password);
        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.status(200).json({ message: 'Usuário atualizado com sucesso', user: updatedUser });
    } catch (error: any) {
        res.status(500).json({ error: `Erro no servidor: ${error.message}` });
    }
});

authRouter.delete('/delete/:id', requireAuth, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        await UserModel.deleteUser(userId);
        res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (error: any) {
        res.status(500).json({ error: `Erro no servidor: ${error.message}` });
    }
});

// Rota de logout
authRouter.post('/logout', (req, res) => {
    res.json({ message: 'Logout bem-sucedido' });
});

export default authRouter;