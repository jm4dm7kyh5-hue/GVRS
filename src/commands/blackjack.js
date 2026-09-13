const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blackjack')
        .setDescription('Play a game of Blackjack (21)'),
    async execute(interaction) {
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

        function drawCard() {
            const suit = suits[Math.floor(Math.random() * suits.length)];
            const value = values[Math.floor(Math.random() * values.length)];
            return { suit, value };
        }

        function calculateHand(hand) {
            let score = 0;
            let aces = 0;
            for (const card of hand) {
                if (card.value === 'A') {
                    aces += 1;
                    score += 11;
                } else if (['K', 'Q', 'J'].includes(card.value)) {
                    score += 10;
                } else {
                    score += parseInt(card.value);
                }
            }
            while (score > 21 && aces > 0) {
                score -= 10;
                aces -= 1;
            }
            return score;
        }

        const playerHand = [drawCard(), drawCard()];
        const dealerHand = [drawCard(), drawCard()];

        const playerScore = calculateHand(playerHand);
        const dealerScore = calculateHand(dealerHand);

        const embed = new EmbedBuilder()
            .setTitle('🃏 Blackjack / 21')
            .setColor('#2b2d31')
            .addFields(
                { name: 'Your Hand', value: ${playerHand.map(c => `${c.value}${c.suit}).join(' ')} (Score: ${playerScore})`, inline: true },
                { name: "Dealer's Hand", value: ${dealerHand[0].value}${dealerHand[0].suit} 🂠, inline: true }
            );

        if (playerScore === 21) {
            embed.setDescription('🎉 *Blackjack! You win!*');
        } else if (playerScore > 21) {
            embed.setDescription('💥 *Bust! You went over 21.*');
        } else {
            embed.setDescription(Dealer revealed: ${dealerHand[1].value}${dealerHand[1].suit} (Total: ${dealerScore})\n +
                (playerScore > dealerScore || dealerScore > 21 ? '🏆 *You win!*' : playerScore === dealerScore ? '🤝 *It\'s a tie!*' : '❌ *Dealer wins!*'));
        }

        await interaction.reply({ embeds: [embed] });
    },
};
