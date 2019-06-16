// 使用七牛云
import qiniu from "qiniu";
import { Request, Response, NextFunction } from "express";
import { Express } from "express";

const ACCESS_KEY = "hU0eusuCSEYX7kXkAzaKcyR0R27BZE5TQIz7Zhz9";
const SESSION_SECRET = "kLTnwzsRj-fDadsQk3ja082dH5cE_CMbTxNFo8YR";
qiniu.conf.ACCESS_KEY = ACCESS_KEY;
qiniu.conf.SECRET_KEY  = SESSION_SECRET;

const bucket = "haopengzh";


export const qiniuToken = (req: Request, res: Response, next: NextFunction) => {
  const mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SESSION_SECRET);
  const option = {
    scope: bucket,
  };
  const putPoblicy = new qiniu.rs.PutPolicy(option);
  const uploadToken = putPoblicy.uploadToken(mac);
  res.send({
    token: uploadToken
  });
};

export default (app: Express) => {
  
  app.get("/api/qiniu/token", qiniuToken);
};

