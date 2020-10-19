module.exports =  {
    name: 'ready',
    description: 'Function to change roles for the "Caloiros"',
    async execute(message){
        message.delete;
		message.member.roles.add(['760051133221175309']);
		await wait(1000);
		message.member.roles.remove(['760051795618955264']);
		await wait(1000);
    }
}