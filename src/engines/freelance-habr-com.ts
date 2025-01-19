import { JSDOM } from "jsdom";
import axios from "axios";
import { ParsedValue } from "../types/parsed";

export class FreelanceHabrCom {
    words = [
        "go",
        "golang",
        "python",
        "javascript",
        "react",
        "angular",
        "js",
        "bot",
        "парсинг",
    ];

    list(): Promise<ParsedValue[]> {
        const url = "https://freelance.habr.com/tasks";

        return axios.get(url).then(({ data }) => {
            const dom = new JSDOM(data);
            const result: ParsedValue[] = [];
            const cards = dom.window.document.querySelectorAll(
                ".content-list__item"
            );

            cards.forEach((item) => {
                const header = item.querySelector(".task__title a");
                if (!header) return;

                const name = header.textContent;
                const href = header.getAttribute("href");
                if (!href || !name) return;

                const tags = Array.from(
                    item.querySelectorAll(".tags__item_link")
                ).reduce((state, item) => {
                    const text = item.textContent;
                    if (text) {
                        state.push(text.toLocaleLowerCase());
                    }
                    return state;
                }, [] as string[]);

                const link = new URL(href, url).toString();

                const word = this.words.find((word) => {
                    return name.includes(word) || tags.includes(word);
                });

                if (word) {
                    result.push({
                        name,
                        tags,
                        link,
                    });
                }
            });

            return result;
        });
    }
}
