var self = (module.exports = {
  name: "rss_check",
  description: "Main Brain for RSS - IST News",
  async execute(client, db) {
    let Parser = require("rss-parser");
    let parser = new Parser();
    const fs = require("fs");
    const delay = require("delay");

    for (const entry of client.Links) {
      let feed = await parser.parseURL(entry.link).catch((err) => {
        client.channels.cache
          .get("756650299099185162")
          .send({
            content: `<@323146644113588234>`,
            embeds: [
              {
                color: 0xf7c500,
                title: "Fenix in Maintenance",
                description: "Rss feed parser failed. Check if bot still online",
              },
            ],
          })
          .catch((err) => {
            console.log("Internet was probably out", err);
          });
        console.log(`Feed at URL ${entry.link} did not respond with valid RSS.`, entry.link, err);
        //await delay(300000);
        return 1;
      });
      var counter = 0;
      //console.log(feed);
      if (feed.items === undefined) {
        console.log("\n\nHERE MOTHERFUCKER", feed);
        return 1;
      }
      feed.items.reverse();
      for (const item of feed.items) {
        var index = entry.records.indexOf(item.isoDate);

        if (index == -1) {
          //console.log(item.content);
          var stripedHtml = self.htmlParser(item.content);
          var msg;

          msg = await client.channels.cache.get(entry.roomId).send({
            content: `<@&${entry.roleId}>`,
            embeds: [
              {
                color: 0xf7c500,
                title: feed.title,
                url: item.guid,
                description: stripedHtml,
                footer: {
                  text: entry.acron,
                },
                timestamp: item.isoDate,
              },
            ],
          });
          entry.records.push(item.isoDate);
          entry.msgRecords.push(msg.id);
          entry.msgBody.push(stripedHtml);
          db.set(`${entry.acron}.records`, entry.records);
          db.set(`${entry.acron}.msgRecords`, entry.msgRecords);
          db.set(`${entry.acron}.msgBody`, entry.msgBody);
        } else {
          //console.log(item.content);
          var stripedHtml = self.htmlParser(item.content);
          var msg;

          //console.log(entry)
          //console.log(stripedHtml)
          var second_index = entry.msgBody.indexOf(stripedHtml);

          if (second_index === -1) {
            msg = await client.channels.cache.get(entry.roomId).send({
              content: `<@&${entry.roleId}> Anúncio Editado!`,
              embeds: [
                {
                  color: 0xffffff,
                  title: feed.title,
                  url: item.guid,
                  description: stripedHtml,
                  footer: {
                    text: entry.acron,
                  },
                  timestamp: item.isoDate,
                },
              ],
              reply: {
                messageReference: entry.msgRecords[index],
              },
            });
            entry.msgBody.push(stripedHtml);
            db.set(`${entry.acron}.msgBody`, entry.msgBody);
          }
        }
      }
    }
    console.log("Good Check!");
    client.rss_commands.get("arrays_init").execute(client, db);
  },
  htmlParser: function (content) {
    const { convert } = require("html-to-text");

    content = content.replace(/<[\/b^>]+>/gm, "**");

    const text = convert(content, {
      wordwrap: false,
      formatters: {
        // Create a formatter.
        myAnchor: function formatAnchor(elem, walk, builder, formatOptions) {
          function getHref() {
            if (formatOptions.ignoreHref) {
              return "";
            }
            if (!elem.attribs || !elem.attribs.href) {
              return "";
            }
            let href = elem.attribs.href.replace(/^mailto:/, "");
            if (formatOptions.noAnchorUrl && href[0] === "#") {
              return "";
            }
            href = formatOptions.baseUrl && href[0] === "/" ? formatOptions.baseUrl + href : href;
            return href;
          }

          function addText(stackItem, text) {
            //console.log(stackItem.inlineTextBuilder);
            var parentText = stackItem.inlineTextBuilder.isEmpty()
              ? stackItem.rawText
              : stackItem.rawText + [...stackItem.inlineTextBuilder.lines, stackItem.inlineTextBuilder.nextLineWords].map((words) => words.join(" ")).join(" ");

            //console.log([parentText]);

            const regex = /(?!.*\s)/gm;
            var n = parentText.search(regex);
            parentText = parentText.substring(0, n) + `[` + parentText.substring(n) + `](${text}) `;
            //console.log([parentText]);

            stackItem.inlineTextBuilder.clear();
            if (parentText) {
              stackItem.rawText = parentText;
            }
          }

          const href = getHref();
          walk(elem.children, builder);
          builder.popWordTransform();

          addText(builder._stackItem, href);
        },
      },
      selectors: [
        { selector: "h1", format: "inline" },
        { selector: "h2", format: "inline" },
        { selector: "h3", format: "inline" },
        { selector: "h4", format: "inline" },
        { selector: "h5", format: "inline" },
        { selector: "h6", format: "inline" },
        { selector: "a", format: "myAnchor" },
      ],
    });
    //console.log("////////////////\n\n", [text]);
    return text;
  },
});
