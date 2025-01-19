import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import { FreelanceHabrCom } from "./engines/freelance-habr-com";
import { StackCache } from "./classes/cache";
import { ParsedValue } from "./types/parsed";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN || "");

const cache = new StackCache();

bot.start(async (ctx) => {
    ctx.reply("Погнали");

    const engine = new FreelanceHabrCom();

    const handler = (result: ParsedValue[]) => {
        result.forEach((item) => {
            if (cache.items.includes(item.link)) return;

            cache.push(item.link);

            ctx.reply(
                [
                    item.tags.map((item) => `#${item}`).join(" "),
                    "",
                    item.name,
                    "",
                    item.link,
                ].join("\n")
            );
        });
    };

    const run = () => {
        Promise.all([engine.list().then(handler)])
            .then(() => setTimeout(run, 1000 * 60))
            .catch((e) => {
                console.warn(e);
                setTimeout(run, 1000);
            });
    };

    run();
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
