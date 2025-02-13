import { Bot, Message } from "node-core/instance/types";
import { base } from "../../base";
const Mirai = require("node-mirai-sdk");
const { Plain, Image } = Mirai.MessageComponent;
const axios = require("axios");
const cheerio = require("cheerio");

export class linkParse implements base {
  static instruction = "全网链接解析";
  bot: Bot;
  url: string;
  message: Message;
  constructor(bot) {
    this.bot = bot;
  }
  async action(matchResult, url) {
    console.log("解析中...");
    this.url = matchResult[0];
    const content = await axios.get(this.url).then((res) => res.data);
    let $ = cheerio.load(content, {
      decodeEntities: false,
    });
    this.speak({
      title: $("title:first").text(),
      keywords: $('meta[name="keywords"]').attr("content"),
      description: $('meta[name="description"]').attr("content"),
    });
  }
  speak(result) {
    let content = `网站链接解析by ${this.bot.name} 

${this.url}
【标题】${result.title}
`;
    if (result.keywords)
      content += `【关键字】${
        result.keywords ? result.keywords : "好像没有喔~"
      }\n`;
    if (result.description)
      content += `${result.description ? result.description : "好像没有喔~"}`;
    this.bot.speak(content, this.message);
  }
  setMessage() {
    this.message = this.bot.contextIsolate.message;
  }
}
