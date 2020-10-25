module.exports =  {
    name: 'update_rss',
    description: 'Function to call the rss_check every x time',
    async execute(client){
      const fs = require('fs');
      const time = fs.readFileSync('time.txt', 'UTF-8');
      console.log("Update Command");
      client.rss_commands.get('rss_check').execute(client);
      console.log(time*60*1000);
      setTimeout(function(){client.rss_commands.get('update_rss').execute(client)}, time*60*1000);
    }
}