module.exports =  {
    name: 'forced_update',
    description: 'Function to call the rss_check every x time',
    async execute(message, client, db){
      console.log("Update Command");
      message.channel.send("Looking for Updates...")
      client.rss_commands.get('rss_check').execute(client, db);
    }
}