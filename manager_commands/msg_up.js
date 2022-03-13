const { DH_NOT_SUITABLE_GENERATOR } = require("constants");

module.exports = {
  name: "msg_up",
  description: "Function to increase the msg counter of a person.",
  async execute(message, db) {
    if (message.channel == "703243184549003356") return;
    var user_id = message.member.id;
    var username = message.member.user.username;
    var monthly_rank = new db.table("monthly_rank");
    var general = new db.table("general");
    if (
      message.content.startsWith("pls") ||
      message.content.startsWith("$") ||
      user_id === "464723995632074773" || 
      user_id === "839912860845998130" || 
      message.author.bot
    ) {
      return;
    }
    general.add(`${user_id}.messages`, 1);
    monthly_rank.add(`${user_id}.messages`, 1);
    general.set(`${user_id}.nome`, username);
    monthly_rank.set(`${user_id}.nome`, username);
  },
};
