import { EmbedBuilder } from 'discord.js';
import { getUserBirthday } from '../../../services/birthdayService.js';
import { logger } from '../../../utils/logger.js';

import { InteractionHelper } from '../../../utils/interactionHelper.js';
export default {
    async execute(interaction, config, client) {
        await InteractionHelper.safeDefer(interaction);

        const targetUser = interaction.options.getUser("user") || interaction.user;
        const userId = targetUser.id;
        const guildId = interaction.guildId;

        const birthdayData = await getUserBirthday(client, guildId, userId);

        if (!birthdayData) {
            const embed = new EmbedBuilder()
                .setColor(0xFFFFFF)
                .setTitle('⟡﹒ 𝗻𝗼 𝗯𝗶𝗿𝘁𝗵𝗱𝗮𝘆 𝗳𝗼𝘂𝗻𝗱')
                .setDescription(targetUser.id === interaction.user.id 
                    ? "you haven't set your birthday yet. use `/birthday set` to add it ‎𖹭"
                    : `${targetUser.username} hasn't set their birthday yet ‎𖹭`);
            return await InteractionHelper.safeEditReply(interaction, {
                embeds: [embed]
            });
        }

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('⟡﹒ 𝗯𝗶𝗿𝘁𝗵𝗱𝗮𝘆 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻𝘀')
            .setDescription(`**date:** ${birthdayData.monthName} ${birthdayData.day}\n**user:** ${targetUser.toString()}`);

        await InteractionHelper.safeEditReply(interaction, {
            embeds: [embed]
        });

        logger.info('Birthday info retrieved successfully', {
            userId: interaction.user.id,
            targetUserId: targetUser.id,
            guildId,
            commandName: 'birthday_info'
        });
    }
};
