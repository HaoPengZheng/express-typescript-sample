// Controllers (route handlers)
import * as authController from "./auth";
const jwt = require("express-jwt");
import { SECRET } from "../constant";
const unlessPath = ["/people", "/signup", "/login"];
const initRoute = (app: any) => {
    /**
     * app routes Auth
     */

    app.use(jwt({ secret: SECRET }).unless({ path: unlessPath }));

    app.post("/signup", authController.signup);
    app.post("/login", authController.login);
};

export default initRoute;