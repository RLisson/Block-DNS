import { authenticate } from "passport";
import passport from "../config/passport.js";

export const requireAuth = (req: any, res: any, next: any) => {
    passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
        if (err) {
            return res.status(500).json({ error: `Erro no servidor: ${err.message}` });
        }

        if (!user) {
            return res.status(401).json({ 
                error: 'Não autorizado',
                authenticated: false,
            });
        }
        req.user = user;
        next();
    })(req, res, next);
};
