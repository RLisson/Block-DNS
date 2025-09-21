import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import UserModel from "../models/userModel";
import { config } from "./environment";


passport.use(new LocalStrategy(
    { usernameField: 'username' },
    async (username: string, password: string, done: any) => {
        try {
            const user = await UserModel.findByUsername(username);
            if (!user) {
                return done(null, false, { message: 'Usuário não encontrado' });
            }

            const isValidPassword = await UserModel.validatePassword(user, password);
            if (!isValidPassword) {
                return done(null, false, { message: 'Senha incorreta' });
            }

            return done(null, user);
        } catch (error: any) {
            return done(error);
        }
    }
));

    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.JWT_SECRET
    }, async (jwtPayload, done) => {
        try {
            const user = await UserModel.findById(jwtPayload.id);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error: any) {
            return done(error, false);
        }
    }
));

export default passport;

