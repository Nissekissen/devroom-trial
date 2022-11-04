const { InteractionType } = require("discord.js");
const getFiles = require("../utils/recursiveFiles");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.type == InteractionType.ApplicationCommand) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;
            try {
                await command.execute(interaction);
                console.log(`${interaction.member.user.username} ran the command ${command.data.name}`)
            } catch (error) {
                await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
                console.log(error);
            }
        } else if (interaction.type == InteractionType.MessageComponent) {
            const files = getFiles('./src/buttons')
            for await (const file of getFiles('./src/buttons')) {
                if (file.endsWith('.js') && interaction.customId.startsWith(file.split('\\')[file.split('\\').length-1].split('.')[0])) {
                    const buttonData = require('../../' + file.replaceAll(/\\/gi, '/'))
                    await buttonData.execute(interaction, interaction.customId)
                }
            }
        }
    }
}