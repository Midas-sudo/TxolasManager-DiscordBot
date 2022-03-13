module.exports = {
  name: "remove_link",
  description: "Function to remove links.",
  async execute(message, args, db){
    var data = db.all();
    var client = message.client;

    var ID = data.map(function (e) {
      return e.ID;
    });

    args.forEach(number => {
      db.delete(ID[number]);
    });

    message.react("✅");

    client.rss_commands.get("arrays_init").execute(client, db);
  },
};
