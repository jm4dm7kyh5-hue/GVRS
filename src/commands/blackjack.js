module.exports = {
    name: 'blackjack',
    description: 'Play a game of Blackjack (21)',
    async execute(message, args) {
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

        let resultText = '';
        if (playerScore === 21) {
            resultText = '🎉 *Blackjack! You win!*';
        } else if (playerScore > 21) {
            resultText = '💥 *Bust! You went over 21.*';
        } else {
            resultText = Dealer revealed: ${dealerHand[1].value}${dealerHand[1].suit} (Total: ${dealerScore})\n +
                (playerScore > dealerScore || dealerScore > 21 ? '🏆 *You win!*' : playerScore === dealerScore ? '🤝 *It\'s a tie!*' : '❌ *Dealer wins!*');
        }

        const embed = {
            title: '🃏 Blackjack / 21',
            color: 0x2b2d31,
            fields: [
                { name: 'Your Hand', value: ${playerHand.map(c => `${c.value}${c.suit}).join(' ')} (Score: ${playerScore})`, inline: true },
                { name: "Dealer's Hand", value: ${dealerHand[0].value}${dealerHand[0].suit} 🂠, inline: true }
            ],
            description: resultText
        };

        await message.channel.send({ embeds: [embed] });
    },
};
