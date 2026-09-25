import { EmbedBuilder } from 'discord.js';
import { getUpcomingBirthdays } from '../../../services/birthdayService.js';
import { deleteBirthday } from '../../../utils/database.js';
import { logger } from '../../../utils/logger.js';

import { InteractionHelper } from '../../../utils/interactionHelper.js';
export default {
    async execute(interaction, config, client) {
        await InteractionHelper.safeDefer(interaction);

        const next5 = await getUpcomingBirthdays(client, interaction.guildId, 5);

        if (next5.length === 0) {
            const embed = new EmbedBuilder()
                .setColor(0xFFFFFF)
                .setTitle('⟡﹒ 𝗻𝗼 𝗯𝗶𝗿𝘁𝗵𝗱𝗮𝘆𝘀 𝗳𝗼𝘂𝗻𝗱𝘀')
                .setDescription('no birthdays have been set up in this server yet. use `/birthday set` to add birthdays ‎𖹭');
            return await InteractionHelper.safeEditReply(interaction, {
                embeds: [embed]
            });
        }

        let displayIndex = 0;
        for (const birthday of next5) {
            const member = await interaction.guild.members.fetch(birthday.userId).catch(() => null);
            if (!member) {
                deleteBirthday(client, interaction.guildId, birthday.userId).catch(() => null);
                continue;
            }
            displayIndex++;

            let timeUntil = '';
            if (birthday.daysUntil === 0) {
                timeUntil = '🎉 **Today!**';
            } else if (birthday.daysUntil === 1) {
                timeUntil = '📅 **Tomorrow!**';
            } else {
                timeUntil = `In ${birthday.daysUntil} day${birthday.daysUntil > 1 ? 's' : ''}`;
            }
        }

        if (displayIndex === 0) {
            const embed = new EmbedBuilder()
                .setColor(0xFFFFFF)
                .setTitle('⟡﹒ 𝗻𝗼 𝘂𝗽𝗰𝗼𝗺𝗶𝗻𝗴 𝗯𝗶𝗿𝘁𝗵𝗱𝗮𝘆𝘀')
                .setDescription('no upcoming birthdays found for current server members ‎𖹭');
            return await InteractionHelper.safeEditReply(interaction, {
                embeds: [embed]
            });
        }

        let birthdayList = `🎂 **next 5 Upcoming Birthdays**\n\nhere are the next 5 birthdays in ${interaction.guild.name}:\n\n`;
        displayIndex = 0;
        for (const birthday of next5) {
            const member = await interaction.guild.members.fetch(birthday.userId).catch(() => null);
            if (!member) {
                continue;
            }
            displayIndex++;

            let timeUntil = '';
            if (birthday.daysUntil === 0) {
                timeUntil = '🎉 **Today!**';
            } else if (birthday.daysUntil === 1) {
                timeUntil = '📅 **Tomorrow!**';
            } else {
                timeUntil = `In ${birthday.daysUntil} day${birthday.daysUntil > 1 ? 's' : ''}`;
            }

            birthdayList += `${displayIndex}. **${member.displayName}**\n<@${birthday.userId}>\n📅 **date:** ${birthday.monthName} ${birthday.day}\n⏰ **time:** ${timeUntil}\n\n`;
        }

        birthdayList += `use /birthday set to add your birthday~`;

        const embed = new EmbedBuilder()
            .setColor(0xFFFFFF)
            .setTitle('⟡﹒ 𝗻𝗲𝘅𝘁 𝟱 𝘂𝗽𝗰𝗼𝗺𝗶𝗻𝗴 𝗯𝗶𝗿𝘁𝗵𝗱𝗮𝘆𝘀')
            .setDescription(birthdayList);

        await InteractionHelper.safeEditReply(interaction, {
            embeds: [embed]
        });

        logger.info('Next birthdays retrieved successfully', {
            userId: interaction.user.id,
            guildId: interaction.guildId,
            upcomingCount: displayIndex,
            commandName: 'next_birthdays'
        });
    }
};
