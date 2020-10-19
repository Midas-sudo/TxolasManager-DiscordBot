const Discord = require('discord.js');
var db = require('quick.db');

const {
	prefix,
	token,
	check,
	text_channel
} = require('./config.json');


const client = new Discord.Client();
const invites = {};
const wait = require('util').promisify(setTimeout);


client.login(token);


const embed1 = new Discord.MessageEmbed()
	.setTitle("Welcome :tada:")
	.setDescription("Sê bem-vindo ao servidor oficial dos Txolas! :sparkles:\n\nEste servidor foi criado no início de 2020, pouco antes de se instalar esta pandemia, e tem sido desde então muito útil para trocar ideias e ficheiros relacionados com as várias cadeiras assim como para falar e discutir sobre questões relacionadas com o Técnico, mas também sobre outros temas por vezes bastante à toa.\nNeste momento não irás conseguir ver canal nenhum, é normal. Assim que responderes ready nesta sala irá receber a tua Role de **Caloiro** e passarás a poder ver todas as salas de voz e de texto, relacionadas com o Técnico assim como salas mais de lazer.\n\nEste servidor é composto ainda por um bot criado especificamente para o servidor que irá dar as notícias das vossas páginas das cadeiras diretamente na sala de texto de cada uma delas, por exemplo: <#760112795387035708>. \n\n - Uma sidenote estes text-channels de primeiro ano são privados, ou seja, apenas vocês e os admins têm acesso aos channels do vosso ano assim como apenas os **Txolas** têm acesso às das cadeiras de segundo ano, portanto não se preocupem se partilharem algo mais *shady*.\n\nEste servidor é bastante chill no que toca a regras, pois não é nenhum servidor oficial do técnico é apenas um servidor criado por um grupo de amigos (os Txolas), portanto desde que mantenhas as conversas minimamente civilizadas, podes dizer o que quiseres.\n\nOs vossos mentores tambem cá estão, portanto não hesitem a dar tag a um de nós (ou à role Mentores) assim que entrarem ou se tiverem alguma questão que nos queiram perguntar. Se for uma pergunta sobre matéria de alguma disciplina, não se esqueçam que os **Txolas** já tiveram todos nos vossos sapatos e portanto podem arriscar a vossa sorte e dar tag aos **Txolas**, pode ser que algum esteja online e disposto a ajudar-vos.")
	.setColor(16753408)
	.setAuthor("Gonçalo Midões (Midas)", "https://cdn.discordapp.com/avatars/323146644113588234/1a592feeda1d1398f32cce009f1e32fd.png?size=128&quothttps://cdn.discordapp.com/avatars/323146644113588234/1a592feeda1d1398f32cce009f1e32fd.png?size=128&quot");

const embed2 = new Discord.MessageEmbed()
	.setTitle("Para os com cabeça mais dura")
	.setDescription("Agora para aqueles que ainda não perceberam bem para que é que este servidor serve realmente eu irei agora falar um bocadinho da utilização que nós (Txolas) damos-lhe.")
	.setColor(16753408)
	.addFields(
		{ name: 'As Salas de Voz', value: 'Muitas das vezes durante a semana irão ver-nos por aqui dentro de uma sala de uma disciplina qualquer, isto acontece porque enquanto estamos numa aula de zoom também estamos numa sala aqui para poderemos discutir algo sobre a aula ou até mesmo falar um bocado entre nós quando a aula está a ser muito secante.' },
		{ name: 'As Salas de Texto', value: 'As salas de texto das disciplinas também são uma grande mais valia deste servidor, para além de ser o sítio onde recebemos os anúncios das páginas das cadeiras atualizados ao minuto, é tambem o local onde trocamos dúvidas, ficheiros, resoluções ou até mesmo confirmar certas resoluções de exercicios de uma certa complexidade *wink* *wink*.' },
		{ name: 'Palavras Finais', value: 'Mas o técnico não é só estudo, por vezes este permite-nos descontrair um bocado e irão ver-nos em alguma sala de jogo a jogar ou até mesmo na sala designada de cinema a ver-mos um filme ou uma série em conjunto. \nCom tudo isto dito espero que fiquem pelo servidor e que lhe deem o maior uso possível, pois é para isso que ele existe. Se tiverem ainda alguma questão ou quiserem ver alguma coisa adicionada ao servidor estejam à vontade de mandar-me uma mensagem (**Gonçalo Midões aka Midas**).\n Em nome dos **Txolas**, desejamos um excelente primeiro ano e boa sorte!', inline: true },
	);

const embed3 = new Discord.MessageEmbed()
	.setDescription(`Boas vindas caloiros, para os que não me conhecem da semana de acolhimento, chamo-me João Francisco Felizardo(Kiko), sou um dos três mentores neste grupo e fundador(título apenas honorário) deste servidor.

	Ao longo deste semestre vão poder contar com o apoio de todos nós e eu serei apenas mais um a desejar-vos e ajudar-vos a ter um excelente primeiro ano aqui no técnico.
	
	Estarei sempre disponível para qualquer forma de contacto, caso não se sintam à vontade a comunicar por aqui têm sempre o Whatsapp, quer num grupo, quer mensagem privada, como se sentirem mais confortáveis.
	
	Qualquer problema, questão, insegurança (ou coisa) podem falar comigo e que este semestre corra o melhor que possa!`)
	.setColor(0x0aefff)
	.setAuthor("João Francisco Felizardo (Kiko)", "https://cdn.discordapp.com/avatars/401887669052768276/65719aa77ab82832c9f2f706e42fbc89.png?size=128&quot");

const embed4 = new Discord.MessageEmbed()
	.setDescription(`Boas vindas caros Mentorandos.

	Este Unicórnio fofinho é o Fábio Dias (ou Fabex, como preferirem).
	
	Acho que já foi dito tudo o que era preciso, estarei à vossa disponibilidade neste servidor ou por qualquer outro contacto. Alguma dúvida, let me know.
	
	Boa sorte a todos!`)
	.setColor(0xf694c9)
	.setAuthor("Fábio Dias (Fabex)", "https://cdn.discordapp.com/avatars/307226655078875137/764e651823f0f8896a01583226a978e8.webp?size=128");


client.once('ready', async () => {
	await wait(1000);
	client.guilds.cache.forEach(g => {
		g.fetchInvites().then(guildInvites => {
		  invites[g.id] = guildInvites;
		});
	  });
	
	console.log('Ready!');
	console.log(client.guilds.cache.get("667012045677264936").createdAt);

	if(check == 0){
		client.channels.cache.get("760054233307021343").send(embed1);
		client.channels.cache.get("760054233307021343").send(embed2);
		client.channels.cache.get("760054233307021343").send(embed3);
		client.channels.cache.get("760054233307021343").send(embed4);
	}
   client.once('reconnecting', () => {
    console.log('Reconnecting!');
   });
   client.once('disconnect', () => {
    console.log('Disconnect!');
   });
});


client.on('guildMemberAdd', async member => {
	member.guild.fetchInvites().then(guildInvites => {
		// This is the *existing* invites for the guild.
		const ei = invites[member.guild.id];
		// Update the cached invites for the guild.
		invites[member.guild.id] = guildInvites;
		// Look through the invites, find the one for which the uses went up.
		const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
		// This is just to simplify the message being sent below (inviter doesn't have a tag property)
		if(invite.code === "f8rhfbk"){
			member.roles.add(['760051795618955264']);
		}
	  });
});


client.on('message', async message => {
	if(message.member.roles.cache.find((role)=> role.name == "NewMember")){
		if (message.content.startsWith(`Ready`)){
			message.delete;
			message.member.roles.add(['760051133221175309']);
			await wait(1000);
			message.member.roles.remove(['760051795618955264']);
			await wait(1000);
		}
	}
});


client.on('message', async message =>{
	if(message.author.bot){return;};
	var user_id = message.member.id;
	var username = message.member.user.username;
	db.add(`${user_id}.messages`, 1);
	db.set(`${user_id}.nome`, username);
});

client.on('message', async message =>{
	if (message.content.startsWith("||T_voice")){
		t_voice(message);
	}else if(message.content.startsWith("||T_text")){
		t_text(message);
	}
});

client.on("voiceStateUpdate", (member_previous_state, member_next_state) => {

	let newUserChannel = member_next_state.channelID;
  	let oldUserChannel = member_previous_state.channelID;

	var user_id = member_next_state.id;

	console.log(newUserChannel, oldUserChannel);
	if((oldUserChannel !== null && newUserChannel !== null) && (oldUserChannel !== undefined && newUserChannel !== undefined)){
		return;
	}else if(oldUserChannel === null || oldUserChannel === undefined){
		var current_time = Date.now();
		console.log(current_time);
		db.set(`${user_id}.entry_time`, current_time);
	}else if(newUserChannel !== null || newUserChannel !== undefined){
		var out_time = Date.now();
		var entry_time = db.get(`${user_id}.entry_time`);
		console.log(entry_time);
		if(entry_time === undefined || entry_time === null){
			console.log("Return HERE");
			return;
		}
		var session_time = out_time-entry_time;

		db.add(`${user_id}.total`, session_time);
		db.delete(`${user_id}.entry_time`);
	}
	console.log(db.all());
});

async function t_voice(message){

};

async function t_text(message){
	var data = db.all();
	
	data.sort(sortBymessage);
	
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
};


function sortBymessage(a, b){
	return b.data.messages - a.data.messages;
}