// 使用七牛云
import qiniu from "qiniu";
import { Request, Response, NextFunction } from "express";
import { Express } from "express";
import http from "http";
import { method } from "bluebird";

const ACCESS_KEY = "hU0eusuCSEYX7kXkAzaKcyR0R27BZE5TQIz7Zhz9";
const SESSION_SECRET = "kLTnwzsRj-fDadsQk3ja082dH5cE_CMbTxNFo8YR";
qiniu.conf.ACCESS_KEY = ACCESS_KEY;
qiniu.conf.SECRET_KEY  = SESSION_SECRET;

const bucket = "haopengzh";

function generatorToken(): string {
  const mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SESSION_SECRET);
  const option = {
    scope: bucket,
  };
  const putPoblicy = new qiniu.rs.PutPolicy(option);
  const uploadToken = putPoblicy.uploadToken(mac);
  return uploadToken;
}

export const qiniuToken = (req: Request, res: Response, next: NextFunction) => {
  res.send({
    token: generatorToken()
  });
};

export const overwriteUpload = (req: Request, res: Response, next: NextFunction) => {
  const keyToOverwrite = req.body.key;
  const options = {
    scope: bucket + ":" + keyToOverwrite
  };
  const mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SESSION_SECRET);
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);
  res.send({
    token: uploadToken
  });
};

export default (app: Express) => {
  app.get("/api/qiniu/token", qiniuToken);
  app.post("/api/qiniu/overwriteToken", overwriteUpload);
};

