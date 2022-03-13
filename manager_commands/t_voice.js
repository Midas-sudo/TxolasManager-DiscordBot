var self = (module.exports = {
  name: "t_voice",
  description: "Function to print the voice leaderboard",
  async execute(message, db) {
    const Discord = require("discord.js");
    require("quick.db");
    var data = db.all();

    data.sort(self.Byvoice);

    var player_number = data.length;
    var a = 0;
    var content = "";
    const embed = new Discord.MessageEmbed()
      .setTitle("Voice Time Leaderboard")
      .setColor(16753408)
      .setThumbnail("https://i.imgur.com/3m1E8r6.png");

    if (player_number >= 15) {
      while (a !== 15) {
        var hh = (data[a].data.total / 1000 / 60 / 60).toFixed(0);
        var mm = ((data[a].data.total / 1000 / 60 / 60 - hh) * 60).toFixed(0);
        var ss = ((data[a].data.total / 1000 / 60 - mm) * 60).toFixed(0);
        content =
          content +
          `**${a + 1}.** ${data[a].data.nome} **- ${hh}H : ${mm}M**\n`;
        a++;
      }
    } else {
      while (a !== player_number) {
        var hh = (data[a].data.total / 1000 / 60 / 60).toFixed(0);
        var mm = ((data[a].data.total / 1000 / 60 / 60 - hh) * 60).toFixed(0);
        var ss = ((data[a].data.total / 1000 / 60 - mm) * 60).toFixed(0);
        content =
          content +
          `**${a + 1}.** ${data[a].data.nome} **- ${hh}H : ${mm}M**\n`;
        a++;
      }
    }
    var message_user = data
      .map(function (e) {
        return e.ID;
      })
      .indexOf(message.member.id);
    hh = (data[message_user].data.total / 1000 / 60 / 60).toFixed(0);
    mm = ((data[message_user].data.total / 1000 / 60 / 60 - hh) * 60).toFixed(
      0
    );
    ss = ((data[message_user].data.total / 1000 / 60 - mm) * 60).toFixed(0);
    content =
      content +
      `A tua posição atual é ${message_user + 1}º lugar com ${hh}H : ${mm}M.`;

    embed.setDescription(content);
    message.channel.send({embeds:[embed]}).then((sentEmbed) => {
      sentEmbed.react("⬅️");
      sentEmbed.react("➡️");
    });
    // Create a reaction collector
    const filter = (reaction, user) =>
      reaction.emoji.name === "⬅️" && user.id === "someID"; //(reaction.emoji.name === '⬅️' || reaction.emoji.name === '➡️');
    const collector = message.createReactionCollector(filter, { time: 15000 });
    collector.on("collect", (r) => console.log(`Collected ${r.emoji.name}`));
    collector.on("end", (collected) =>
      console.log(`Collected ${collected.size} items`)
    );

    console.log(
      data.map(function (e) {
        return e.data.nome;
      })
    );
  },

  Byvoice: function (a, b) {
    return b.data.total - a.data.total;
  },
});
