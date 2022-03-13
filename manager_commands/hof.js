var self = (module.exports = {
  name: "hof",
  description: "Function to print Hall of Fame Ranks",
  async execute(message, db, type1, type2) {
    const Discord = require("discord.js");
    require("quick.db");

    var data = db.all();
    var player_number = data.length;
    var a = 0;
    var content = "";

    const embed = new Discord.MessageEmbed()
      .setColor(16753408)
      .setThumbnail("https://i.imgur.com/v83SQg2.png");

    if (type1 === "text") {
      embed.setTitle("Hall of Fame - Text");
      data.sort(self.Bytext);
      if (player_number >= 15) {
        while (a !== 15) {
          content =
            content +
            `**${a + 1}.** ${data[a].data.nome} **- ${data[a].data.text}**\n`;
          a++;
        }
      } else {
        while (a !== player_number) {
          content =
            content +
            `**${a + 1}.** ${data[a].data.nome} **- ${data[a].data.text}**\n`;
          a++;
        }
      }
      var message_user = data
        .map(function (e) {
          return e.ID;
        })
        .indexOf(message.member.id);
      content = content + `A tua posição atual é ${message_user + 1}º lugar.`;

      embed.setDescription(content);
      message.channel.send({embeds:[embed]});
    } else if (type1 === "voice") {
      embed.setTitle("Hall of Fame - Voice");
      data.sort(self.Byvoice);
      console.log(data);
      if (player_number >= 15) {
        while (a !== 15) {
          content =
            content +
            `**${a + 1}.** ${data[a].data.nome} **- ${data[a].data.voice}**\n`;
          a++;
        }
      } else {
        while (a !== player_number) {
          content =
            content +
            `**${a + 1}.** ${data[a].data.nome} **- ${data[a].data.voice}**\n`;
          a++;
        }
      }
      var message_user = data
        .map(function (e) {
          return e.ID;
        })
        .indexOf(message.member.id);
      content = content + `A tua posição atual é ${message_user + 1}º lugar.`;

      embed.setDescription(content);
      message.channel.send({embeds:[embed]});
    }
  },
  Bytext: function (a, b) {
    return b.data.text - a.data.text;
  },
  Byvoice: function (a, b) {
    return b.data.voice - a.data.voice;
  },
});
