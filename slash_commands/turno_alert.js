const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('alerta')
        .setDescription('Cria um alerta para vagas de turnos')
        .addStringOption(option =>
            option.setName('cadeira')
                .setDescription('Escolhe a Cadeira')
                .setRequired(true)
                .addChoice('Aprendizagem Automática', '564560566182818')
                .addChoice('Procura e Planeamento', '564560566181912'))
        .addStringOption(option =>
            option.setName('turno')
                .setDescription('O turno a verificar')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};