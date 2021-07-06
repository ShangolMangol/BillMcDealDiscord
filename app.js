const puppeteer = require("puppeteer");
const Discord = require("discord.js");
const client = new Discord.Client();
const AsciiTable = require("ascii-data-table").default;
const { token } = require("./token");

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
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

	const words = msg.content.split(" ");
	if (words[0] === "/deal") {
		words.shift();
		let gameName = words.join("+");

		(async () => {
			const browser = await puppeteer.launch();
			const page = await browser.newPage();
			await page.goto("https://isthereanydeal.com/search/?q=" + gameName);
			await page.setViewport({
				width: 1920,
				height: 1080,
			});

			let hrefs = await page.evaluate(() => {
				let data = [];
				let elements = document.getElementsByClassName("card__title");
				for (let element of elements) data.push(element.href);
				return data;
			});

			console.log(hrefs);
			if (hrefs.length !== 0) {
				await page.goto(hrefs[0]);

				await page.waitForSelector("#gameHead__img"); // wait for the selector to load
				const gamePhoto = await page.$("#gameHead__img"); // declare a variable with an ElementHandle
				await gamePhoto.screenshot({ path: "gamePhoto.png" }); // take screenshot element in puppeteer

				const result = await page.evaluate(() => {
					let rows =
						document.getElementsByClassName("priceTable")[0]
							.childNodes[0].childNodes;

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

				for (let i = 0; i < info.length && i <= 7; i++) {
					items.push(info[i]);
				}
				const maxColumnWidth = 40;

				let priceTable = AsciiTable.table(items, maxColumnWidth);

				priceTable = "```" + priceTable + "```";
				priceTable = priceTable.replace("'", " ");
				await msg.channel.send({ files: ["./gamePhoto.png"] });
				msg.channel.send(priceTable);
			} else {
				msg.reply("Sorry, I couldn't find that game.");
			}
			// priceTable.replace('"', ' ');
			// console.log(priceTable);

			// for (row in rows) {
			//     console.log(row.text);
			// }

			// if (hrefs.length !== 0) {

			//     isExist = true;

			//     // await page.goto(hrefs[0]);

			//     // let divOfTable = document.getElementById("pageContainer");
			//     // let pricesTable = divOfTable.getElementsByTagName("table");
			//     // await pricesTable.screenshot({ path: 'prices.png' });
			//     console.log(pricesTable);

			//     // await page.waitForSelector("#pageContainer > div.layout-2c > div.layout-2c__col1 > section:nth-child(1) > div > table");// wait for the selector to load
			//     // const element1 = page.$("#pageContainer > div.layout-2c > div.layout-2c__col1 > section:nth-child(1) > div > table"); // declare a variable with an ElementHandle
			//     if (element1 === null) {

			//         // await page.waitForSelector("#pageContainer > div.layout-2c > div.layout-2c__col1 > section:nth-child(2) > div > table"); // wait for the selector to load
			//         // const element2 = await page.$("#pageContainer > div.layout-2c > div.layout-2c__col1 > section:nth-child(2) > div > table"); // declare a variable with an ElementHandle
			//         // await element2.screenshot({ path: 'prices.png' }); // take screenshot element in puppeteer

			//         if (element2 === null) {
			//             isExist = false;
			//             console.log("false");

			//         }
			//         else {
			//             isExist = true;
			//             console.log("true");
			//         }
			//     }
			//     else {
			//         // await page.waitForSelector("#pageContainer > div.layout-2c > div.layout-2c__col1 > section:nth-child(1) > div > table");
			//         // await element1.screenshot({ path: 'prices.png' }); // take screenshot element in puppeteer

			//         isExist = true;
			//         console.log("true");
			//     }

			//     await page.waitForSelector("#gameHead__img"); // wait for the selector to load
			//     const element3 = await page.$("#gameHead__img"); // declare a variable with an ElementHandle
			//     await element3.screenshot({ path: 'gamePhoto.png' }); // take screenshot element in puppeteer

			//     // msg.channel.send("My Bot's message", { files: ["./prices", "./gamePhoto"] });
			//     console.log("true");
			//     // msg.channel.send("yes im here", { files: ["./gamePhoto.png", "./prices.png"] });//, { files: ["./gamePhoto", "./prices"] }
			// }
			// else {
			//     console.log("false");
			//     isExist = false;
			//     // msg.reply("Sorry, Bill couldn't find this game. Please try a differnt name.")
			//     msg.reply("Sorry, Bill couldn't find this game. Please try a differnt name.");
			// }
			// // await table[0].screenshot({ path: 'example.png' });

			// await browser.close();
			// endFunction();
		})();

		// msg.channel.send("My Bot's message", { files: ["./prices.png", "./gamePhoto.png"] });

		// msg.reply("So the game you chosen is `" + gameName + "`");
	}
});

client.login(token);

// let gameName = "stardew valley";
// gameName = gameName.split(" ").join("+");

// (async () => {
//     const browser = await puppeteer.launch({
//         args: [
//             '--window-size=1920,1080',
//         ],
//     });
//     const page = await browser.newPage();
//     await page.goto("https://isthereanydeal.com/search/?q=" + gameName);
//     await page.setViewport({
//         width: 1920,
//         height: 1080
//     });

//     let hrefs = await page.evaluate(() => {
//         let data = [];
//         let elements = document.getElementsByClassName('card__title');
//         for (var element of elements)
//             data.push(element.href);
//         return data;
//     });

//     console.log(hrefs);
//     if (hrefs.length !== 0) {
//         await page.goto(hrefs[0]);
//         await page.waitForSelector("#pageContainer > div.layout-2c > div.layout-2c__col1 > section:nth-child(2) > div"); // wait for the selector to load
//         const element = await page.$("#pageContainer > div.layout-2c > div.layout-2c__col1 > section:nth-child(2) > div"); // declare a variable with an ElementHandle
//         page.setViewport({
//             width: 1920,
//             height: 1080
//         });
//         await element.screenshot({ path: 'prices.png' }); // take screenshot element in puppeteer
//     }
//     else
//         console.log("Sorry, Bill couldn't find the game!")

//     // await table[0].screenshot({ path: 'example.png' });

//     await browser.close();
// })();
