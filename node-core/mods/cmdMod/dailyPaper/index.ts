import axios from "axios";
import { Bot } from "node-core/instance/types";
import { base } from "../../base";
import fs from "fs";
export class dailyPaper implements base {
  static instruction = "日报";
  bot: Bot;
  params: any;
  constructor(bot) {
    this.bot = bot;
  }
  async action() {
    const imgData = await this.getData();
    await this.store(imgData);
  }
  error() {
    throw new Error("主动抛出错误");
  }
  async getData() {
    const imgData = await axios
        .get("http://news.soyiji.com/26960-2022-5-02.jpg", { headers: { Referer: "safe.soyiji.com" }, responseType:'arraybuffer'})
        .then((res) => {
            return res.data
        });
        console.log(imgData);
    return imgData
  }
  store(imgData) {
    return new Promise((resolve) => {
      fs.writeFile(
        `node-core/statics/img/out/paper.png`,
        imgData,
        "binary",
        (error) => {
          if (error) {
            console.log(error);
            console.log("下载失败");
          } else {
            console.log("下载成功！");
          }
          resolve(true);
        }
      );
    });
  }
}
