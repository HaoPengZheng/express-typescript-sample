import { User, UserDocument, AuthToken } from "../models/User";
import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
import { SECRET } from "../constant";
const request = require("express-validator");

export const getAllEassyList = (req: Request, res: Response, next: NextFunction) => {
    res.send({
        req: 123456777
    });
};

export default (app: any) => {
    app.get("/essay", getAllEassyList);
};