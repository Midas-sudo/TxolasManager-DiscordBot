module.exports =  {
    name: 'msg_up',
    description: 'Function to increase the msg counter of a person.',
    async execute(message, db){
        var user_id = message.member.id;
        var username = message.member.user.username;
        db.add(`${user_id}.messages`, 1);
        db.set(`${user_id}.nome`, username);
    }
}