var self = module.exports =  {
    name: 't_text',
    description: 'Function to print the text leaderboard',
    async execute(message, db){
        var db = require('quick.db');
        var data = db.all();
	
        data.sort(self.sortBymessage);

        var player_number = data.length;
        var a = 0;
        var content = "";
        const embed = new Discord.MessageEmbed()
            .setTitle("Text Messages Leaderboard")
            .setColor(16753408)
            .setThumbnail("https://i.imgur.com/3m1E8r6.png")


        if(player_number >= 15){
            while(a !== 15){
                var temp = `**${a+1}.** ${data[a].data.nome} **- ${data[a].data.messages}**\n`;
                content  = content + `**${a+1}.** ${data[a].data.nome} **- ${data[a].data.messages}**\n`;
                a++;
            }
        }else{
            while(a !== player_number){
                var temp = `**${a+1}.** ${data[a].data.nome} **- ${data[a].data.messages}**\n`;
                content  = content + `**${a+1}.** ${data[a].data.nome} **- ${data[a].data.messages}**\n`;
                a++;
            }
        }
        var message_user = data.map(function(e) { return e.ID; }).indexOf(message.member.id);
        content = content + `A tua posição atual é ${message_user+1}º lugar com ${data[message_user].data.messages} mensagens.`

        embed.setDescription(content);
        message.channel.send(embed).then(sentEmbed => {
            sentEmbed.react("⬅️")
            sentEmbed.react("➡️")
        });
        // Create a reaction collector
        const filter = (reaction, user) => reaction.emoji.name === '⬅️' && user.id === 'someID';//(reaction.emoji.name === '⬅️' || reaction.emoji.name === '➡️');
        const collector = message.createReactionCollector(filter, { time: 15000 });
        collector.on('collect', r => console.log(`Collected ${r.emoji.name}`));
        collector.on('end', collected => console.log(`Collected ${collected.size} items`));


        console.log(data.map(function(e) { return e.data.nome;}));
    },

    sortBymessage: function(a, b){
        return b.data.messages - a.data.messages;
    }
}