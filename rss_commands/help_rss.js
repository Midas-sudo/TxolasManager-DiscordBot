module.exports =  {
    name: 'help_rss',
    description: 'Help command for RSS - IST News',
    async execute(message){
        message.channel.send({
            embeds:[ {
                color: 0xf7c500,
                title: "IST - RSS News HELP",
                description: "Este bot tem como objetivo mostrar os anúncios da diferentes páginas das cadeiras de cada curso. ",
                fields: [
                    {
                      "name": "Alguns comandos são:",
                      "value": "-------------------------------------------"
                    },
                    {
                      "name": "||set_time",
                      "value": "Este comando server para definir o tempo entre verificações dos RSS feeds. O tempo é definido em minutos e nao pode ser inferior a 5 min, sendo o default é 15 minutos.\n```Exemplo: ||set_time 15```\n"
                    },
                    {
                      "name": "||help",
                      "value": "Para mostrar esta página."
                    },
                    {
                      "name": "||add_link",
                      "value": "Para adicionar links de RSS da pagina de uma cadeira, utiliza-se este comando acompanhado de a aberviatura da cadeira e o id da sala onde o bot ira colocar os anúncios, tudo separado por ».\n```Exemplo: \n||add_link https://fenix.tecnico.ulisboa.pt/disciplinas/AC77/2020-2021/1-semestre/rss/announcement»ACir»123456789```"
                    },
                    {
                      "name": "||links",
                      "value": "Este comando pode ser utilizado para ver os links já inseridos no bot. Sendo que aparecem numerados de forma a que seja mais facil remover algum link.\n"
                    },
                    {
                      "name": "||update",
                      "value": "Este comando serve para reiniciar o contador sendo que provoca uma verificação no momento de utilização do comando."
                    },
                    {
                      "name": "||remove_link",
                      "value": "Este comado é utilizado para remover um link da lista de feeds de RSS. Para remover um link é aconcelhado primeiro executar ``||links`` e depois de ver o link a remover executar:\n```||remove_link numerodolink```"
                    }
                  ],
                author: {
                    "name": "Pagina de GitHub",
                    "url": "https://github.com/Midas-sudo/IST-RSS-FEED"
                  },
                footer: {
                    "text": "Para mais ajuda contactar Gonçalo Midoes "
                },
            }],
        });
    }
}