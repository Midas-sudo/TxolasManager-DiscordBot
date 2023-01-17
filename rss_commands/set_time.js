module.exports =  {
    name: 'set_time',
    description: 'Function to set time for the rss check cycle',
    async execute(message, args, client){
        const fs = require('fs');

        var time = args[0];
        //console.log(args[0] )
        if (isNaN(time)){
            message.channel.send("Valor introduzido não é um número. Será mantido o valor anterior.")
        }else{
            fs.writeFile('time.txt', time,  function (err) {
                if (err) return console.log(err);
            });
            client.rss_commands.get('update_rss').execute(client);
        };
    }
}
