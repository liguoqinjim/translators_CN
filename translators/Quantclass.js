{
	"translatorID": "2169248a-2314-4a35-b520-0169d05b5ade",
	"label": "Quantclass",
	"creator": "liguoqinjim",
	"target": "^https?://bbs.quantclass.cn/thread/*",
	"minVersion": "5.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2022-06-29 15:42:11"
}

/*
	***** BEGIN LICENSE BLOCK *****

	Copyright © 2022 YOUR_NAME <- TODO

	This file is part of Zotero.

	Zotero is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	Zotero is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with Zotero. If not, see <http://www.gnu.org/licenses/>.

	***** END LICENSE BLOCK *****
*/


async function detectWeb(doc, url) {
	// TODO: adjust the logic here
	// if (url.includes('/article/')) {
	// 	return 'newspaperArticle';
	// }
	// else if (getSearchResults(doc, true)) {
	// 	return 'multiple';
	// }
	if (url.includes("/thread")){
		return "webpage"
	}

	return false;
}

function getSearchResults(doc, checkOnly) {
	var items = {};
	var found = false;
	// TODO: adjust the CSS selector
	var rows = doc.querySelectorAll('h2 > a.title[href*="/article/"]');
	for (let row of rows) {
		// TODO: check and maybe adjust
		let href = row.href;
		// TODO: check and maybe adjust
		let title = ZU.trimInternal(row.textContent);
		if (!href || !title) continue;
		if (checkOnly) return true;
		found = true;
		items[href] = title;
	}
	return found ? items : false;
}

async function doWeb(doc, url) {
	if (await detectWeb(doc, url) == 'webpage') {
		await scrape(doc, url);
	}
}

function scrape(doc, url = doc.location.href) {
	// TODO: implement or add a scrape function template
	const item = new Zotero.Item("webpage");

	//Zotero.debug(doc.head.querySelectorAll("title"));
	//标题
	title = doc.head.querySelectorAll("title")[0].innerText;
	title = title.replace(" - 量化小论坛","");
	// - 量化小论坛

	//作者
	authorDiv = doc.body.querySelector("div.author-name > a");
	author = authorDiv.innerText;
	userId = authorDiv.href.split("/").pop();
	// Zotero.debug(userId);

	//分类
	sectorDiv = doc.head.querySelector('meta[name="keywords"]');
	sector = sectorDiv.content;
	Zotero.debug(sector);
	
	//description
	despDiv = doc.head.querySelector('meta[name="description"]');
	desp = despDiv.content;
	// Zotero.debug(despDiv);

	item.title = title;
	item.websiteTitle = "量化小论坛";
	item.abstractNote = desp;
	item.url = url;
	item.creators = [{"lastName":author,"userId":userId}];
	item.attachments.push({"url": url, title: "Snapshot"});
	item.sector = sector;
	// item.postType = sector;
	
	item.complete();
}

/** BEGIN TEST CASES **/
var testCases = [
]
/** END TEST CASES **/
