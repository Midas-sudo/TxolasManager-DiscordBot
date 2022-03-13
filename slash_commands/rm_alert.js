const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rm_alerta')
		.setDescription('Remove o alerta para vagas de turnos')
        .addStringOption(option =>
            option.setName('cadeira')
                .setDescription('Escolhe a Cadeira')
                .setRequired(true)
                .addChoice('Instalações e Edifícios Inteligentes', '846035542880774')
                .addChoice('Microeletrónica', '846035542880275')
                .addChoice('Sistemas Autónomos', '846035542880510')
                .addChoice('Sistemas de Telecomunicações', '846035542880572')
                .addChoice('Programação Orientada por Objectos', '846035542880360')
                .addChoice('Arquitetura e Gestão de Redes', '846035542880501')
                .addChoice('Sistemas Elétricos', '846035542880532')
                .addChoice('Redes de Computadores e Internet', '846035542880738')
                .addChoice('Controlo', '846035542880434')
                .addChoice('Instrumentação e Medidas', '846035542880425')
                .addChoice('Probabilidades e Estatísticas', '846035542880671')
                .addChoice('Eletrotecnia Teórica', '846035542880465'))
        .addStringOption(option =>
            option.setName('turno')
                .setDescription('O turno a verificar')
                .setRequired(true)),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};