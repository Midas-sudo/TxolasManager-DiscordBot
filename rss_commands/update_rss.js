module.exports =  {
    name: 'update_rss',
    description: 'Function to call the rss_check every x time',
    async execute(client, db){
      const fs = require('fs');
      console.log("Update Command");
      const time = fs.readFileSync('time.txt', 'UTF-8');
      var code = client.rss_commands.get('rss_check').execute(client, db);
      if(code === 1){
        time = 10;
      }
      console.log(time*60*1000);
      setTimeout(function(){client.rss_commands.get('update_rss').execute(client, db)}, time*60*1000);
    }
}