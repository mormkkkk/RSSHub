const got = require('@/utils/got');
const cheerio = require('cheerio');
const { parseDate } = require('@/utils/parse-date');

module.exports = async (ctx) => {
    const link = 'https://www.volcengine.com/docs/6438/79289';

    // 发起 HTTP GET 请求
    const response = await got({
        method: 'get',
        url: link,
    });

    const data = response.data;

    // 使用 cheerio 加载返回的 HTML
    const $ = cheerio.load(data);
    const title = $('title').text();
    const desc = $('meta[name="description"]').attr('content');
    const table = $('div[class="volc-md-viewer "]').find('table[class="custom-md-table volc-viewer-table"]');

    ctx.state.data = {
        title: `VolcEngine - ${title}`,
        link,
        description: desc,
        item:
            table &&
            table
                .find('tbody > tr')
                .map((index, item) => {
                    item = $(item);
                    const tds = item.find('td');
                    const link = tds.eq(0).find('a').attr('href');
                    const title = tds.eq(0).text().trim();
                    const author = tds.eq(1).text().trim();
                    const pubDate = parseDate(tds.eq(2).text().trim());
                    const description = tds.eq(3).text().trim();
                    return {
                        title,
                        link,
                        author,
                        pubDate,
                        description,
                    };
                })
                .get(),
    };
};
