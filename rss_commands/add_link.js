module.exports =  {
  name: 'add_link',
  description: 'Add links.',
  async execute(message, args, db){
    const client = message.client;
    let isnum1 = /^\d+$/.test(args[1]);
    let isnum2 = /^\d+$/.test(args[5]);
    console.log(isnum1, isnum2, args[1],args[5])
    if(!isnum1 || !isnum2 || args[1] === undefined || args[5] === undefined){
      message.reply({ content: 'A ordem introduzida não foi correta.\nA ordem correta é `||add_link RoleName IdTag Acrônimo Nome Link IdRoom`', allowedMentions: { repliedUser: false }})
    }else{
      args[3] = args[3].replaceAll("_", " ");

      var linkObject = new Object();
      linkObject.roleName = args[0];
      linkObject.roleId = args[1];
      linkObject.acron = args[2];
      linkObject.name = args[3];
      linkObject.link = args[4];
      linkObject.roomId = args[5];
      linkObject.records = new Array();
      linkObject.msgRecords = new Array();
      linkObject.msgBody = new Array();
      db.set(args[2], linkObject);

      db.set(`${args[2]}.records`, linkObject.records); //Used to correct JSON in the DB
      
      client.rss_commands.get("arrays_init").execute(client, db);
      message.reply({ content: 'Link adicionada com sucesso.', allowedMentions: { repliedUser: false }})
    }
  }
}