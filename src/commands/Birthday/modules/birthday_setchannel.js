import { PermissionsBitField, EmbedBuilder, MessageFlags } from 'discord.js';
import { getGuildConfig, setGuildConfig } from '../../../services/config/guildConfig.js';
import { InteractionHelper } from '../../../utils/interactionHelper.js';
import { logger } from '../../../utils/logger.js';

export default {
    async execute(interaction, config, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            const embed = new EmbedBuilder()
                .setColor(0xFFFFFF)
                .setTitle('⟡﹒ 𝗽𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻 𝗱𝗲𝗻𝗶𝗲𝗱')
                .setDescription('you need **Manage Server** permissions to configure the birthday channel...');
            return InteractionHelper.safeReply(interaction, {
                embeds: [embed],
                flags: MessageFlags.Ephemeral,
            });
        }

        try {
            const channel = interaction.options.getChannel('channel');
            const guildId = interaction.guildId;
            const guildConfig = await getGuildConfig(client, guildId);

            if (channel) {
                guildConfig.birthdayChannelId = channel.id;
                await setGuildConfig(client, guildId, guildConfig);
                const embed = new EmbedBuilder()
                    .setColor(0xFFFFFF)
                    .setTitle('⟡﹒ 𝗯𝗶𝗿𝘁𝗵𝗱𝗮𝘆 𝗮𝗻𝗻𝗼𝘂𝗻𝗰𝗲𝗺𝗲𝗻𝘁𝘀 𝗲𝗻𝗮𝗯𝗹𝗲𝗱')
                    .setDescription(`birthday announcements will now be posted in ${channel} ‎𖹭`);
                return InteractionHelper.safeReply(interaction, {
                    embeds: [embed],
                    flags: MessageFlags.Ephemeral,
                });
            } else {
                guildConfig.birthdayChannelId = null;
                await setGuildConfig(client, guildId, guildConfig);
                const embed = new EmbedBuilder()
                    .setColor(0xFFFFFF)
                    .setTitle('⟡﹒ 𝗯𝗶𝗿𝘁𝗵𝗱𝗮𝘆 𝗮𝗻𝗻𝗼𝘂𝗻𝗰𝗲𝗺𝗲𝗻𝘁𝘀 𝗱𝗶𝘀𝗮𝗯𝗹𝗲𝗱')
                    .setDescription('no channel provided — birthday announcements have been disabled ‎𖹭');
                return InteractionHelper.safeReply(interaction, {
                    embeds: [embed],
                    flags: MessageFlags.Ephemeral,
                });
            }
        } catch (error) {
            logger.error('birthday_setchannel error:', error);
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('⚠️ Configuration Error')
                .setDescription('Could not save the birthday channel configuration.');
            return InteractionHelper.safeReply(interaction, {
                embeds: [embed],
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};
