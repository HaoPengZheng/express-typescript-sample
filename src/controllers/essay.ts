import { Essay, EssayDocument } from "../models/Essay";
import { User } from "../models/User";
import UserService from "../Services/UserService";
import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
import { SECRET } from "../constant";
const request = require("express-validator");

export const getAllEassyList = (req: Request, res: Response, next: NextFunction) => {
    Essay.find({}, {isDelete: 0, _id: 0, }, (err: any, essayList: EssayDocument) => {
        res.send({
            essayList
        });
    });

};


export const addEssay = (req: Request, res: Response, next: NextFunction) => {
    const userEmail = req.user.data.email;
    let userInfo = undefined;
    UserService.getUserByEmail(userEmail).then(user => {
        userInfo = user;
        const essay = new Essay({
            email: req.user.data.email,
            title: req.body.title,
            author: userInfo,
            time: new Date(),
            isMarkdown: req.body.isMarkdown,
            content: req.body.content,
            love: req.body.love,
            read: req.body.read
        });
        essay.save((err) => {
            if (!err) {
                res.send({
                    code: 201,
                    msg: "添加成功"
                });
            } else {
                res.send({
                    code: 500,
                    err: err
                });
            }
        });
    });

};

export default (app: any) => {
    app.get("/essay", getAllEassyList);
    app.post("/essay", addEssay);
};