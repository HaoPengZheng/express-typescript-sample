import { User, UserDocument, AuthToken } from "../models/User";
import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
import { SECRET } from "../constant";
const request = require("express-validator");
/**
 * POST /signup
 * Create a new local account.
 */
export const signup = (req: Request, res: Response, next: NextFunction) => {
    req.assert("email", "Email is not valid").isEmail();
    req.assert("password", "Password must be at least 4 characters long").len({ min: 4 });
    req.assert("confirmPassword", "Passwords do not match").equals(req.body.password);
    req.sanitize("email").normalizeEmail({ gmail_remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
        res.send({
            code: 400,
            msg: "bad request",
            errors
        });
        return;
    }

    const user = new User({
        email: req.body.email,
        password: req.body.password
    });

    user.profile.picture = user.gravatar(200);
    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (err) { return next(err); }
        if (existingUser) {
            res.send({
                code: 500,
                msg: "Account with that email address already exists."
            });
        } else {
            user.save((err) => {
                if (err) { return next(err); }
                res.send({
                    code: 201,
                    msg: "create success"
                });
            });
        }
    });
};


export const login = (req: Request, res: Response, next: NextFunction) => {
    req.assert("email", "Email is not valid").isEmail();
    req.assert("password", "Password must be at least 4 characters long").len({ min: 4 });

    const errors = req.validationErrors();

    if (errors) {
        res.send({
            code: 400,
            msg: "bad request",
            errors
        });
        return;
    }

    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (err) { return next(err); }
        if (existingUser) {
            existingUser.comparePassword(req.body.password, (err: Error , isMatch: boolean) => {
                if (err) {
                    res.send({
                        code: 500,
                        msg: "服务器错误"
                    });
                    return {};
                }
                if (isMatch) {
                    const token = jwt.sign({data: existingUser}, SECRET, {
                        expiresIn : 60 * 60 * 1  // 授权时效24小时
                      });
                    res.send({
                        code: 200,
                        msg: "login success",
                        token
                    });
                    return {};
                } else {
                    res.send({
                        code: 400,
                        msg: "密码错误"
                    });
                }
              });

        } else {
            res.send({
                code: 400,
                msg: "账号或密码错误"
            });
        }
    });
};

/**
 * Get /user
 * Get userinfo
 */
export const userinfo = (req: Request, res: Response, next: NextFunction) => {
    const userEmail = req.user.data.email;
    User.findOne({email: userEmail}, (err: any, exitUser: UserDocument) => {
        if (err) {
            next(err);
        }
        res.send({
            code: 200,
            userInfo: exitUser
        });
    });
};