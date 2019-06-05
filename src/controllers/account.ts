import { User, UserDocument, AuthToken } from "../models/User";
import { Request, Response, NextFunction } from "express";
import { WriteError } from "mongodb";
import { Express } from "express";
/**
 * POST /account/profile
 * Update profile information.
 */
export let postUpdateProfile = (req: Request, res: Response, next: NextFunction) => {
    const userEmail = req.user.data.email;
    User.findOne({email: userEmail}, (err, user: UserDocument) => {
      if (err) { return next(err); }
      user.profile.name = req.body.name || "";
      user.profile.gender = req.body.gender || "";
      user.profile.location = req.body.location || "";
      user.profile.website = req.body.website || "";
      user.profile.twitter = req.body.twitter || "";
      user.profile.github = req.body.github || "";
      user.profile.google = req.body.google || "";
      user.profile.facebook = req.body.facebook || "";
      user.save((err: WriteError) => {
        if (err) {
          if (err.code === 11000) {
            req.flash("errors", { msg: "The email address you have entered is already associated with an account." });
            return res.send({
              err,
              code: 500
            });
          }
        }
        res.send({
          code: 200,
          msg: "保存成功"
        });
      });
    });
  };

export default (app: Express) => {
    app.post("/api/account/profile", postUpdateProfile);
};