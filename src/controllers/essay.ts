import { Essay, EssayDocument } from "../models/Essay";
import { User } from "../models/User";
import UserService from "../Services/UserService";
import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
import { SECRET } from "../constant";
const request = require("express-validator");
import builder from "xmlbuilder";
import { Express } from "express";
import EssayService from "../Services/EssayService";
export const getAllEassyList = (req: Request, res: Response, next: NextFunction) => {
    Essay.find({}, { isDelete: 0 }, (err: any, essayList: EssayDocument) => {
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
            cover: req.body.cover,
            author: userInfo,
            time: new Date(),
            isMarkdown: req.body.isMarkdown,
            content: req.body.content,
            love: 0,
            read: 0
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

export const getEssayById = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    Essay.findById(id, (err: any, essay: EssayDocument) => {
        if (!err) {
            res.send({
                essay
            });
        } else {
            res.status(500);
            res.send({
                code: 500,
                msg: "查无信息"
            });
        }
    });
};

/**
 * Get: /feed
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns build a xml for rss subscription
 */

export const feed = (req: Request, res: Response, next: NextFunction) => {

    // const rss = builder.create("rss");
    // rss.att("version", "2.0");
    // const channel = rss.ele("channel");
    // for (let i = 1; i <= 5; i++) {
    //     const item = channel.ele("item");
    //     item.att("x", i);
    //     item.att("y", i * i);
    //     item.ele("title", {}, "菜鸟教程首页");
    //     item.ele("link", {}, "http://www.runoob.com");
    //     item.ele("description", {}, "免费编程教程");
    // }
    // const xml = rss.end({ pretty: true });
    // res.set("Content-type", "application/rss+xml").send(xml);
    EssayService.getEssayForRssFeed().then(data => {
        const rss = builder.create("rss");
        rss.att("version", "2.0");
        const channel = rss.ele("channel");
        data.forEach(essay => {
            const item = channel.ele("item");
            item.ele("title", {}, essay.title);
            item.ele("link", {}, `http://haopengzh.cn/essay/${essay._id}`);
            item.ele("description", {}, essay.title);
        });
        const xml = rss.end({ pretty: true });
        res.set("Content-type", "application/rss+xml").send(xml);
    });
};

export default (app: Express) => {
    app.get("/api/essay", getAllEassyList);
    app.get("/api/essay/:id", getEssayById);
    app.post("/api/essay", addEssay);
    app.get("/api/feed", feed);
};