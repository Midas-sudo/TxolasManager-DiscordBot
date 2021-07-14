module.exports =  {
    name: 'links',
    description: 'Prints links as message.',
    async execute(message){
        const fs = require('fs');
        const Discord = require('discord.js');

        var links  = fs.readFileSync('cursos_txolas.txt', 'UTF-8');
        var list = links.split(/\r?\n/);
        var a = 0;
        embed = new Discord.MessageEmbed()
        .setTitle("IST - RSS News Links - Txolas")
        .setColor(0xf7c500)
        .setDescription("Lista de links a verificar. Para remover escrever: `||remove_link seguido` do número do link.")

        list.forEach(link => {
        var name = link.split("»")
        console.log(name);
        if(name[1] !== undefined){
            embed.addFields({ name: a + " - " + name[1], value: link});
        }
        a++;      
    });
    a--;
    message.channel.send(embed); 
    
	links  = fs.readFileSync('cursos_caloiros.txt', 'UTF-8');
        list = links.split(/\r?\n/);
        embed = new Discord.MessageEmbed()
        .setTitle("IST - RSS News Links - Caloiros")
        .setColor(0xf7c500)
        .setDescription("Lista de links a verificar. Para remover escrever: `||remove_link seguido` do número do link.")

        list.forEach(link => {
        var name = link.split("»")
        console.log(name);
        if(name[1] !== undefined){
            embed.addFields({ name: a + " - " + name[1], value: link});
        }
        a++;      
    });
    message.channel.send(embed); 



}
}