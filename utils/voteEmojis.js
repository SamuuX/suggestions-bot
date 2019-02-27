const voteEmojis = client => [
    {
        id: 0,
        name: 'defaultEmojis',
        fullName: 'Defaults',
        emojis: [
            client.emojis.get('490708616056406017'),
            client.emojis.get('522929743507488795')   
        ]
    },
    {
        id: 1,
        name: 'oldDefaults',
        fullName: 'Old Defaults',
        emojis: ['✅', '❌']
    },
    {
        id: 2,
        name: 'thumbsEmojis',
        fullName: 'Thumbs',
        emojis: ['👍', '👎']
    },
    {
        id: 3,
        name: 'arrowsEmojis',
        fullName: 'Arrows',
        emojis: ['⬆', '⬇']
    },
    {
        id: 4,
        name: 'greenEmojis',
        fullName: 'Green',
        emojis: ['✅', '❎']
    }
];

module.exports = voteEmojis;