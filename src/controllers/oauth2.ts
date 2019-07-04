import { Request, Response, NextFunction, response } from "express";
import { Express } from "express";
const rp = require("request-promise");

export const githubOAuth = (req: Request, res: Response, next: NextFunction) => {
    const clientId = "65ad12146e7e3487e139";
    const clientSecret = "f4917b7fdd05b133b9bcb0ee9aa236cd01658311";
    const code = req.body.code;
    const url = `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`;

    rp(url).then((response: any) => {
        const str = response;
        let access_token;
        let token_type;
        const params: any = {};
        str.split("&").forEach((ele: any) => {
            const obj: any = {};
            const value = ele.split("=");
            const key = value[0];
            const v = value[1];
            if (key == "access_token") {
                access_token = v;
            }
            if (key == "token_type") {
                token_type = v;
            }
            params[key] = v;
        });
        if (access_token != undefined) {
            const option = {
                uri: "https://api.github.com/user?access_token=" + access_token,
                headers: {
                    "User-Agent": "haopengzh",
                    "Authorization": `${token_type} ${access_token}`
                },
                json: true
            };
            rp(option).then((incomeingMessage: any) => {
                // 处理账号信息
                res.send({ data: incomeingMessage });
            }).catch((err: any) => {
                res.send({ data: err });
            });
        }
        res.send({ data: params });
    });

};

export default (app: Express) => {
    app.post("/api/oauth2/github", githubOAuth);
};