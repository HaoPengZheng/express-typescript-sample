import { User, UserDocument } from "../models/User";
class UserService {
    async getUserByEmail(email: any): Promise<UserDocument> {
        let user = undefined;
        await User.findOne({email: email}, {_id: 0, password: 0, tokens: 0}, (err, exitUser) => {
            if (!err) {
                user = exitUser;
            }
        });
        return user;
    }
}
export default new UserService();