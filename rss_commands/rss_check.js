module.exports =  {
    name: 'rss_check',
    description: 'Main Brain for RSS - IST News',
    async execute(client){
        let Parser = require('rss-parser');
        const fs = require('fs');
        
        let parser = new Parser();
        const cursos = fs.readFileSync('cursos.txt', 'UTF-8');
    
        // split the contents by new line
        const links = cursos.split(/\r?\n/);
    
        var a = links.length - 6;
        var b = 0;
        while(b < a){
            var c = 0;
            const link = links[b].split("»");
            let feed = await parser.parseURL(link[0]);
            //console.log(feed.items);
            console.log(link[1]);
    
            const times = fs.readFileSync("./cursos/" + link[1]+'.txt', 'UTF-8');
            const time = times.split(/\r?\n/);
    
            while(c != feed.items.length){
                if(time.indexOf(feed.items[c].isoDate) == -1){
                    if(feed.items[c].contentSnippet.length < 2048){
                        client.channels.cache.get(link[2]).send({
                          content: "<@&667397171364102163>",
                          embed: {
                            color: 0xf7c500,
                            title: feed.title,
                            url: feed.items[c].guid,
                            description: feed.items[c].contentSnippet,
                            footer: {
                              text: link[1]
                            },
                            timestamp: feed.items[c].isoDate
                          },
                        });
                    }else{
                        console.log(feed.items[c]);
                        var text = feed.items[c].contentSnippet;
    
                        var first_half = text.slice(0,text.lastIndexOf(' ', 2047));;
                        var second_half = text.slice(text.lastIndexOf(' ', 2047));
                        client.channels.cache.get(link[2]).send({
                          content: "<@&667397171364102163>",
                          embed: {
                            color: 0xf7c500,
                            title: feed.title,
                            url: feed.items[c].guid,
                            description: first_half,
                          },
                        });
                        client.channels.cache.get(link[2]).send({
                          embed: {
                            color: 0xf7c500,
                            title: feed.title + " (continuação)",
                            url: feed.items[c].guid,
                            description: second_half,
                            footer: {
                              text: link[1]
                            },
                            timestamp: feed.items[c].isoDate
                          },
                        });
                    }
                    fs.writeFile("./cursos/" + link[1]+'.txt', feed.items[c].isoDate+'\n',{encoding: "UTF-8",flag: "a+"},  function (err) {
                        if (err) return console.log(err);
                    });
                }
                c++;
            }
            b++;
        }
    
        var a = links.length - 1;
        var b = 5;
        while(b < a){
            var c = 0;
            const link = links[b].split("»");
            let feed = await parser.parseURL(link[0]);
            //console.log(feed.items);
            console.log(link[1]);
    
            const times = fs.readFileSync("./cursos/" + link[1]+'.txt', 'UTF-8');
            const time = times.split(/\r?\n/);
    
            while(c != feed.items.length){
                if(time.indexOf(feed.items[c].isoDate) == -1){
                    if(feed.items[c].contentSnippet.length < 2048){
                        client.channels.cache.get(link[2]).send({
                          content: "<@&760051133221175309>",
                          embed: {
                            color: 0xf7c500,
                            title: feed.title,
                            url: feed.items[c].guid,
                            description: feed.items[c].contentSnippet,
                            footer: {
                              text: link[1]
                            },
                            timestamp: feed.items[c].isoDate
                          },
                        });
                    }else{
                        console.log(feed.items[c]);
                        var text = feed.items[c].contentSnippet;
    
                        var first_half = text.slice(0,text.lastIndexOf(' ', 2047));;
                        var second_half = text.slice(text.lastIndexOf(' ', 2047));
                        client.channels.cache.get(link[2]).send({
                          content: "<@&760051133221175309>",
                          embed: {
                            color: 0xf7c500,
                            title: feed.title,
                            url: feed.items[c].guid,
                            description: first_half,
                          },
                        });
                        client.channels.cache.get(link[2]).send({
                          embed: {
                            color: 0xf7c500,
                            title: feed.title + " (continuação)",
                            url: feed.items[c].guid,
                            description: second_half,
                            footer: {
                              text: link[1]
                            },
                            timestamp: feed.items[c].isoDate
                          },
                        });
                    }
                    fs.writeFile("./cursos/" + link[1]+'.txt', feed.items[c].isoDate+'\n',{encoding: "UTF-8",flag: "a+"},  function (err) {
                        if (err) return console.log(err);
                    });
                }
                c++;
            }
            b++;
        }
    }
}