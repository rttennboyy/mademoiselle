import { EmbedBuilder } from 'discord.js';
import { deleteBirthday } from '../../../services/birthdayService.js';

import { InteractionHelper } from '../../../utils/interactionHelper.js';
export default {
    async execute(interaction, config, client) {
        await InteractionHelper.safeDefer(interaction);

        const userId = interaction.user.id;
        const guildId = interaction.guildId;

        const result = await deleteBirthday(client, guildId, userId);

        if (result.status === 'not_found') {
            const embed = new EmbedBuilder()
                .setColor(0xFFFFFF)
                .setTitle('⟡﹒ 𝗻𝗼 𝗯𝗶𝗿𝘁𝗵𝗱𝗮𝘆 𝗳𝗼𝘂𝗻𝗱')
                .setDescription('you do not have a birthday set to remove ‎𖹭');
            await InteractionHelper.safeEditReply(interaction, {
                embeds: [embed]
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setColor(0xFFFFFF)
            .setTitle('⟡﹒ 𝗯𝗶𝗿𝘁𝗵𝗱𝗮𝘆 𝗿𝗲𝗺𝗼𝘃𝗲𝗱')
            .setDescription('your birthday has been successfully removed from the server ‎𖹭');
        await InteractionHelper.safeEditReply(interaction, {
            embeds: [embed]
        });
    }
};
