import { User, UserDocument, AuthToken } from "../models/User";
import { Request, Response, NextFunction, response } from "express";
import { Express } from "express";
import http from 'https';
// const http = require('https'); 


export const githubOAuth = (req: Request, res: Response, next: NextFunction) => {
    const clientId = "65ad12146e7e3487e139"
    const clientSecret = "f4917b7fdd05b133b9bcb0ee9aa236cd01658311"
    const code = req.body.code
    const url = `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`;
    http.get(url,(response)=>{
        console.log(response)
        res.send(response)
    })
   
}
export default (app: Express) => {
    app.post("/oauth2/github", githubOAuth);
};