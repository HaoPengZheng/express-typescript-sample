import { Essay, EssayDocument } from "../models/Essay";
class EssayService {

    async getEssayForRssFeed() {
        let essayList = [];
        const limit = 10;
        essayList = await Essay.find().sort({time: "desc"}).limit(limit);
        return essayList;

    }
}
export default new EssayService();