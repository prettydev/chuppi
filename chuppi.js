'use strict';

require('dotenv').config();

const fs = require('fs');
const { Client, MessageAttachment, MessageEmbed, WebhookClient } = require('discord.js');
const client = new Client();
const hook = new WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN);

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', message => {

    if (message.content === 'ping') {
        message.channel.send('pong');
    } else if (message.content === 'avatar') {
        message.reply(message.author.displayAvatarURL());
    } else if (message.content === '!hook') {
        hook.send('I am now alive!');
    } else if (message.content === '!rip') {
        const attachment = new MessageAttachment('https://i.imgur.com/w3duR07.png');
        message.channel.send(`${message.author},`, attachment);
    } else if (message.content === '!memes') {
        const buffer = fs.readFileSync('./yarn.lock');
        const attachment = new MessageAttachment(buffer, 'yarn.lock');
        message.channel.send(`${message.author}, here are your memes!`, attachment);
    } else if (message.content === 'embed') {
        const embed = new MessageEmbed()
            .setTitle('A slick little embed')
            .setColor(0xff0000)
            .setDescription('Hello, this is a slick embed!');
        message.channel.send(embed);
    }

    if (message.content.startsWith('!kick')) {
        if (!message.guild) {
            return;
        }
        const user = message.mentions.users.first();
        if (user) {
            const member = message.guild.member(user);
            if (member) {
                member
                    .kick('Optional reason that will display in the audit logs')
                    .then(() => {
                        message.reply(`Successfully kicked ${user.tag}`);
                    })
                    .catch(err => {
                        message.reply('I was unable to kick the member');
                        console.error(err);
                    });
            } else {
                message.reply("That user isn't in this guild!");
            }
        } else {
            message.reply("You didn't mention the user to kick!");
        }
    } else if (message.content.startsWith('!ban')) {
        if (!message.guild) {
            return;
        }
        const user = message.mentions.users.first();
        if (user) {
            const member = message.guild.member(user);
            if (member) {
                member
                    .ban({
                        reason: 'They were bad!',
                    })
                    .then(() => {
                        message.reply(`Successfully banned ${user.tag}`);
                    })
                    .catch(err => {
                        message.reply('I was unable to ban the member');
                        console.error(err);
                    });
            } else {
                message.reply("That user isn't in this guild!");
            }
        } else {
            message.reply("You didn't mention the user to ban!");
        }
    }
});

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
    if (!channel) {
        return;
    }
    channel.send(`Welcome to the server, ${member}`);
});

client.login(process.env.TOKEN);