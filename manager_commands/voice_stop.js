module.exports = {
  name: "voice_stop",
  description: "Function to stop the voice time counter",
  async execute(message, db) {
    var user_id = message.member.id;
    if (user_id != "323146644113588234") return;
    var data = db.all();

    var message_user = data.map(function (e) {
      return e.ID;
    });
    message.channel.send(
      "<@&667397171364102163> Voice time going to stop in 5 seconds if you want your time to count disconect and reconnect now."
    );
    setTimeout(function () {
      for (var i = 0; i < message_user.length; i++) {
        db.delete(`${message_user[i]}.entry_time`);
      }
    }, 5000);
  },
};
