import { User, UserDocument } from "../models/User";
class UserService {
    private GITHUB_SUFFIX: string = "_GITHUB";
    async getUserByEmail(email: any): Promise<UserDocument>  {
        let user = undefined;
        await User.findOne({ email: email }, { _id: 0, password: 0, tokens: 0 }, (err, exitUser) => {
            if (!err) {
                user = exitUser;
            }
        });
        return user;
    }

    async handleGithubUser(githubInfo: any): Promise<UserDocument>  {
        let user = undefined;
        const userName = githubInfo + this.GITHUB_SUFFIX;
        await User.findOne({ email: userName }, (err, existingUser) => {
            if (err) { return null; }
            if (existingUser) {
                user = this.updateUserInfoByGithub(existingUser, githubInfo);
            } else {
                user = this.createUserByGithub(githubInfo);
            }
        });
        return user;
    }
    async updateUserInfoByGithub(existingUser: UserDocument, githubInfo: any) {
        existingUser.profile = {
            name: githubInfo.login,
            gender: githubInfo.html_url,
            location: "",
            website: githubInfo.blog,
            picture: githubInfo.avatar_url,
            facebook: "",
            twitter: "",
            google: "",
            github: githubInfo.html_url,
        };
        await existingUser.save((err) => {
            if (err) return err;
            return existingUser;
        });
        return existingUser;
    }

    async createUserByGithub(githubInfo: any): Promise<UserDocument> {
        const user = new User({
            email: githubInfo.login + "_GITHUB",
            password: githubInfo.node_id,
            profile: {
                name: githubInfo.login,
                gender: githubInfo.html_url,
                location: "",
                website: githubInfo.blog,
                picture: githubInfo.avatar_url,
                facebook: "",
                twitter: "",
                google: "",
                github: githubInfo.html_url,
            }
        });
        await user.save();
        return user;
    }
}
export default new UserService();