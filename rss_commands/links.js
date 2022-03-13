module.exports =  {
    name: 'links',
    description: 'Prints links as message.',
    async execute(message){
        const Discord = require('discord.js');
        const client = message.client;

        var embed = new Discord.MessageEmbed()
        .setTitle(`IST - RSS News Links`)
        .setColor(0xf7c500)
        .setDescription("Lista de links a verificar. Para remover algum link basta escrever: `||remove_link` seguido do número/s entre parênteses.")

        const row = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setCustomId('Txolas')
					.setLabel('Txolas')
					.setStyle('SECONDARY')
                    .setDisabled(true),
                new Discord.MessageButton()
					.setCustomId('Caloiros')
					.setLabel('Caloiros')
					.setStyle('SECONDARY')
		);
        embed.addFields(client.txolasFields);
        message.channel.send({ephemeral: true, embeds: [embed], components: [row] }); 
    }
}