const Discord = require('discord.js');
var db = require('quick.db');

const {
	prefix,
	token,
} = require('./config.json');


const client = new Discord.Client();
client.manager_commands = new Discord.Collection();
const invites = {};
const wait = require('util').promisify(setTimeout);
const manager_commands = fs.readdirSync('./manager_commands/').filter(file => file.endsWith('.js'));

for(const file of manager_commands){
  const command = require(`./manager_commands/${file}`);
  client.manager_commands.set(command.name, command);  
}




client.once('ready', async () => {
	await wait(1000);
	client.guilds.cache.forEach(g => {
		g.fetchInvites().then(guildInvites => {
		  invites[g.id] = guildInvites;
		});
	  });
	
	console.log('Txolas Manager is online!');
	console.log(client.guilds.cache.get("667012045677264936").createdAt);

	client.once('reconnecting', () => {
    	console.log('Reconnecting!');
   	});
	client.once('disconnect', () => {
    	console.log('Disconnect!');
   	});
});



client.on('message', async message => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	client.manager_commands.get('msg_up').execute(message, db);
		
    if(command === "ready" && (message.member.roles.cache.find((role)=> role.name == "NewMember")) ){
      client.commands.get('ready').execute(message); //Feito

    } else if (command === "top"){
		if (args[0] === 'text'){
			client.commands.get('t_text').execute(message, db);
		}else if (args[0] === 'voice'){
			client.commands.get('t_voice').execute(message, db);
		}
    } else {
      message.channel.send("That's not a valid command!")
    }
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

client.login(token);