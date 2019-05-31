// Controllers (route handlers)
import * as authController from "./auth";
const jwt = require("express-jwt");
import { SECRET } from "../constant";
const unlessPath = ["/people", "/signup", "/login", "/essay"];
import essayInitRoute from "./essay";
const initRoute = (app: any) => {
    /**
     * app routes Auth
     */

    app.use(jwt({ secret: SECRET }).unless({ path: unlessPath }));
    // auth
    app.post("/signup", authController.signup);
    app.post("/login", authController.login);
    essayInitRoute(app);

};

export default initRoute;