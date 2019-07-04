// Controllers (route handlers)
import * as authController from "./auth";
const jwt = require("express-jwt");
import { SECRET } from "../constant";
const unlessPath = ["/api/signup", "/api/login", "/api/feed", {url: /\api\/essay\/*/, methods: ["GET"]}, {url: "/api/essay", methods: ["GET", "PUT"]}];
import essayInitRoute from "./essay";
import accountInitRoute from "./account";
import staticInitRoute from "./static";
import oauth2InitRoute from "./oauth2";
import { Express } from "express";
const initRoute = (app: Express) => {
    /**
     * app routes Auth
     */

    app.use(jwt({ secret: SECRET }).unless({ path: unlessPath }));
    // auth
    app.post("/api/signup", authController.signup);
    app.post("/api/login", authController.login);
    app.get("/api/user", authController.userinfo);
    essayInitRoute(app);
    accountInitRoute(app);
    staticInitRoute(app);
    oauth2InitRoute(app);
};

export default initRoute;