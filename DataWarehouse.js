'use strict';
var API_COVER_URL = 'http://news-at.zhihu.com/api/4/start-image/1080*1776';
var API_NEWS_URL = 'http://news-at.zhihu.com/api/4/news/latest';
var API_NEWS_BEFORE = 'http://news.at.zhihu.com/api/4/news/before/'
const DataWarehouse = {
	cover: API_COVER_URL,
	news: API_NEWS_URL,
	before: API_NEWS_BEFORE
}

module.exports = DataWarehouse;