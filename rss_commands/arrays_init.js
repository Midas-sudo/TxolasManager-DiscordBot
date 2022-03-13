module.exports =  {
    name: 'arrays_init',
    description: 'Initialize Arrays',
    async execute(client, db){
        var data = db.all();
        //console.log(db.get('E1.roomId'));

        var listNumber1 = 1;
        var listNumber2 = 1;

        client.Links = [];
        client.txolasFields = [];
        client.caloirosFields = [];


        for (let index = 0; index < data.length; index++) {
          const roleName = data[index].data.roleName;
          const roleId = data[index].data.roleId;
          const acron =  data[index].data.acron;
          const name =  data[index].data.name;
          const link =  data[index].data.link;
          const roomId = data[index].data.roomId;
          const records = data[index].data.records;
          const msgRecords = data[index].data.msgRecords;
          const msgBody = data[index].data.msgBody;
          //console.log(roleName, roleId, acron, name, link, roomId);

          if(roleName === "Txolas" || roleName === "txolas"  ){
              const embedField = new Object();
              embedField.name = `${listNumber1} (${index}) - ${name}`;
              embedField.value = `*${link}*`;
              client.txolasFields.push(embedField);
              listNumber1++;
      
              const linkObject = new Object();
              linkObject.roleName = roleName;
              linkObject.roleId = roleId;
              linkObject.acron = acron;
              linkObject.name = name;
              linkObject.link = link;
              linkObject.roomId = roomId;
              linkObject.records = records;
              linkObject.msgRecords = msgRecords;
              linkObject.msgBody = msgBody;

              client.Links.push(linkObject);
      
          }else{
              const embedField = new Object();
              embedField.name = `${listNumber2} (${index}) - ${name}`;
              embedField.value = `*${link}*`;
              client.caloirosFields.push(embedField)
              listNumber2++;
              
              const linkObject = new Object();
              linkObject.roleName = roleName;
              linkObject.roleId = roleId;
              linkObject.acron = acron;
              linkObject.name = name;
              linkObject.link = link;
              linkObject.roomId = roomId;
              linkObject.records = records;
              linkObject.msgRecords = msgRecords;
              linkObject.msgBody = msgBody;

              client.Links.push(linkObject);
          }
        }
    }
}