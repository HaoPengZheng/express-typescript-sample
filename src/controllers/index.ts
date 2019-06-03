// Controllers (route handlers)
import * as authController from "./auth";
const jwt = require("express-jwt");
import { SECRET } from "../constant";
const unlessPath = ["/people", "/signup", "/login", "/feed", {url: "/essay", methods: ["GET", "PUT"]}];
import essayInitRoute from "./essay";
import accountInitRoute from "./account";
import { Express } from "express";
const initRoute = (app: Express) => {
    /**
     * app routes Auth
     */

    app.use(jwt({ secret: SECRET }).unless({ path: unlessPath }));
    // auth
    app.post("/signup", authController.signup);
    app.post("/login", authController.login);
    app.get("/user", authController.userinfo);
    essayInitRoute(app);
    accountInitRoute(app);
};

export default initRoute;