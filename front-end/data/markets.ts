export const availableMarkets = {
    finance: [
        {
            id: 0,
            title: "Bitcoin Price Above $100K",
            description: "Will Bitcoin reach $100,000 by the end of 2025?",
            longDescription: "This market will resolve to 'Yes' if the price of Bitcoin (BTC) reaches or exceeds $100,000 USD on any major exchange before December 31st, 2025 23:59:59 UTC.",
            odds: "1.95",
            endDate: "Dec 31, 2025",
            volume: "$1.2M",
            type: "binary",
            options: [
                { label: "Yes", odds: "1.95" },
                { label: "No", odds: "2.05" }
            ]
        },
        {
            id: 1,
            title: "Tesla Stock Performance",
            description: "Will Tesla stock outperform S&P500 in 2024?",
            longDescription: "This market will resolve to 'Yes' if Tesla's stock price percentage gain exceeds that of the S&P500 index for the year 2024.",
            odds: "2.10",
            endDate: "Dec 31, 2024",
            volume: "$856K",
            type: "binary",
            options: [
                { label: "Yes", odds: "2.10" },
                { label: "No", odds: "1.85" }
            ]
        }
    ],
    sports: [
        {
            id: 2,
            title: "Champions League Winner",
            description: "Who will win the 2024 UEFA Champions League?",
            longDescription: "This market will resolve based on the winner of the 2024 UEFA Champions League final.",
            odds: "Various",
            endDate: "June 1, 2024",
            volume: "$2.1M",
            type: "multiple-choice",
            options: [
                { label: "Manchester City", odds: "2.50" },
                { label: "Real Madrid", odds: "3.75" }
            ]
        },
        // ... other sports markets
    ],
    politics: [
        {
            id: 3,
            title: "US Presidential Election",
            description: "Who will win the 2024 US Presidential Election?",
            longDescription: "This market will resolve based on the winner of the 2024 United States presidential election.",
            odds: "Various",
            endDate: "Nov 5, 2024",
            volume: "$5.2M",
            type: "multiple-choice",
            options: [
                { label: "Trump", odds: "1.85" },
                { label: "Biden", odds: "2.15" }
            ]
        },
        // ... other politics markets
    ]
};

export const portefolioMarkets = {
    balance: '1,234.56',
    currentPositions: [
        {
            title: "Bitcoin Price Above $100K",
            prediction: "Yes",
            amount: "$100.00",
            odds: "1.95",
            potentialWin: "$195.00",
            endDate: "Dec 31, 2025",
            status: "active"
        },
        {
            title: "US Presidential Election",
            prediction: "Trump",
            amount: "$50.00",
            odds: "1.85",
            potentialWin: "$92.50",
            endDate: "Nov 5, 2024",
            status: "active"
        },
    ],
    pastPositions: [
        {
            title: "FIFA World Cup 2022",
            prediction: "Argentina",
            amount: "$75.00",
            odds: "2.10",
            potentialWin: "$157.50",
            endDate: "Dec 18, 2022",
            status: "won"
        },
        {
            title: "ETH Price Above $3K",
            prediction: "Yes",
            amount: "$60.00",
            odds: "1.75",
            potentialWin: "$105.00",
            endDate: "Jan 1, 2024",
            status: "lost"
        },
    ]
};
