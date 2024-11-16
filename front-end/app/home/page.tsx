'use client';
import { useState } from 'react';
import { Card, CardBody, Input, Button, Tabs, Tab } from "@nextui-org/react";
import { Search, TrendingUp, Trophy, LandPlot } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('finance');

    const markets = {
        finance: [
            {
                id: "btc-100k",
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
                id: "tesla-sp500",
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
                id: "champions-league-2024",
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
                id: "us-election-2024",
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

    const handleMarketClick = (market: any) => {
        try {
            console.log('Clicking market:', market.id);
            // Store market data in localStorage
            localStorage.setItem('selectedMarket', JSON.stringify(market));
            localStorage.setItem('previousPage', '/home'); // Store the current page
            // Navigate to market page
            router.push(`/markets/${market.id}`);
        } catch (error) {
            console.error('Error navigating to market:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pt-6 px-4">
            {/* Title */}
            <h1 className="text-3xl font-bold text-center mb-8">AnonMarket</h1>
            
            {/* Search Bar */}
            <div className="mb-8">
                <Input
                    classNames={{
                        input: "h-12",
                        inputWrapper: "h-12 bg-white/70 backdrop-blur-lg"
                    }}
                    placeholder="Search markets..."
                    startContent={<Search className="text-gray-400" />}
                />
            </div>

            {/* Category Tabs */}
            <Tabs 
                selectedKey={selectedCategory} 
                onSelectionChange={(key) => setSelectedCategory(key.toString())}
                className="mb-8"
            >
                <Tab
                    key="finance"
                    title={
                        <div className="flex items-center gap-2">
                            <TrendingUp size={18} />
                            <span>Finance</span>
                        </div>
                    }
                />
                <Tab
                    key="sports"
                    title={
                        <div className="flex items-center gap-2">
                            <Trophy size={18} />
                            <span>Sports</span>
                        </div>
                    }
                />
                <Tab
                    key="politics"
                    title={
                        <div className="flex items-center gap-2">
                            <LandPlot size={18} />
                            <span>Politics</span>
                        </div>
                    }
                />
            </Tabs>

            {/* Market Cards */}
            <div className="space-y-4">
                {markets[selectedCategory as keyof typeof markets].map((market) => (
                    <Card 
                        key={market.id} 
                        isPressable
                        isHoverable
                        className="bg-white/70 backdrop-blur-lg hover:bg-white/80 transition-all cursor-pointer"
                        onPress={() => handleMarketClick(market)}
                    >
                        <CardBody className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-lg">{market.title}</h3>
                                <span className="text-primary font-semibold">{market.odds}</span>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">{market.description}</p>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Ends: {market.endDate}</span>
                                <span>Volume: {market.volume}</span>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
}