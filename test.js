const puppeteer = require("puppeteer");
const { head } = require("ascii-data-table/lib/functions");
const AsciiTable = require("ascii-data-table").default;
const { token } = require("./token");
var AsciiTable2 = require("ascii-table");

let isExist = true;

const endFunction = () => {
	if (isExist)
		msg.channel.send("hello there", {
			files: ["./gamePhoto.png", "./prices.png"],
		});
	else
		msg.reply(
			"sorry, Bill couldn't find this game. Please try a differnt name."
		);
};

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	// await page.goto("https://isthereanydeal.com/search/?q=" + gameName);
	// await page.setViewport({
	//     width: 1920,
	//     height: 1080
	// });

	// let hrefs = await page.evaluate(() => {
	//     let data = [];
	//     let elements = document.getElementsByClassName('card__title');
	//     for (let element of elements)
	//         data.push(element.href);
	//     return data;
	// });

	// console.log(hrefs);
	// await page.goto(hrefs[0]);

	await page.goto(
		"https://isthereanydeal.com/game/callofdutymodernwarfare/info/"
	);

	const result = await page.evaluate(() => {
		let rows =
			document.getElementsByClassName("priceTable")[0].childNodes[0]
				.childNodes;

		let all = [];
		for (let i = 0; i < rows.length; i++) {
			let arr = [];
			for (let k = 0; k < rows[i].childNodes.length; k++) {
				let t = rows[i].childNodes[k];
				arr[k] = t.innerText;
			}
			all.push(arr);
		}
		return all;
	});

	let headline = (() => {
		let arr = [];
		for (let i = 1; i <= 11; i = i + 2) {
			arr.push(result[0][i]);
		}
		return arr;
	})();

	console.log(headline);

	let info = result.slice(1, result.length - 1);

	for (let i = 0; i < info.length; i++) {
		info[i].pop();
	}
	console.log(info);

	let items = [headline];

	for (let i = 0; i < info.length; i++) {
		items.push(info[i]);
	}

	let priceTable = new AsciiTable2();
	priceTable.setHeading(headline);

	for (let i = 0; i < info.length && i <= 4; i++) {
		priceTable.addRow(info[i]);
	}

	// let priceTable = AsciiTable.table(items, 40);
	// priceTable.replace('"', ' ');
	console.log(priceTable.toString);
})();
