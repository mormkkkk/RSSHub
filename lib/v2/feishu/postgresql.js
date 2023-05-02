const got = require('got');
const cheerio = require('cheerio');
const { parseContent } = require('../utils/rss');

async function hllVersions(ctx) {
    const url = 'https://www.volcengine.com/docs/6438/79289';

    const { body } = await got(url);
    const $ = cheerio.load(body);

    const title = $('title').text();
    const description = '监控火山引擎产品更新记录';
    const link = url;
    const pubDate = new Date().toUTCString();

    const volcMdViewer = $('.volc-md-viewer');
    const content = volcMdViewer.html();

    const feed = {
        title,
        description,
        link,
        pubDate,
        content,
    };

    ctx.body = parseContent(feed);
    ctx.set('Content-Type', 'text/xml');
}

module.exports = hllVersions;
