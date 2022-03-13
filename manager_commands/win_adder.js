module.exports = {
  name: "win_adder",
  description: "Function to add another winner to the ranking",
  async execute(message, args, db) {
    var user_id = message.member.id;
    if (user_id != "323146644113588234") return;

    var mentioned_id = message.mentions.users.first().id;
    var mentioned_name = message.mentions.users.first().username;
console.log(mentioned_name);

    if (args[0] == "Text") {
      db.add(`${mentioned_id}.text`, 1);
      db.set(`${mentioned_id}.nome`, mentioned_name);
      db.push(`${mentioned_id}.text_Ext`, args[1]);
    } else if (args[0] == "Voice") {
      db.add(`${mentioned_id}.voice`, 1);
      db.set(`${mentioned_id}.nome`, mentioned_name);
      db.push(`${mentioned_id}.voice_Ext`, args[1]);
    }

    message.channel.send({content:
      `<@{mentioned_id}> foi adicionado como vencedor do mês de ${args[1]} no ranking de ${args[0]}.`}
    );
  },
};
