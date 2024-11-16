'use client';
import { Card, CardBody, Button, Divider, Tabs, Tab } from "@nextui-org/react";
import Image from 'next/image';
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Key, useState } from "react";

export default function PortfolioPage() {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState('current');
    
    const portfolio = {
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

    const handlePositionClick = (position: any) => {
        localStorage.setItem('previousPage', '/portfolio');
        router.push(`/markets/${position.title.toLowerCase().replace(/\s+/g, '-')}`);
    };

    const renderPositions = (positions: any[]) => {
        return positions.map((position, index) => (
            <Card 
                key={index} 
                className="bg-white/70 backdrop-blur-lg"
                isPressable
                onPress={() => handlePositionClick(position)}
            >
                <CardBody className="p-4">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold">{position.title}</h3>
                        <span className={`text-sm font-semibold ${
                            position.status === 'active' ? 'text-primary' :
                            position.status === 'won' ? 'text-green-600' :
                            position.status === 'lost' ? 'text-red-600' : ''
                        }`}>
                            {position.status.charAt(0).toUpperCase() + position.status.slice(1)}
                        </span>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Prediction:</span>
                            <span className="font-medium">{position.prediction}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Amount:</span>
                            <span className="font-medium">{position.amount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Odds:</span>
                            <span className="font-medium">{position.odds}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Potential Win:</span>
                            <span className="font-medium text-green-600">{position.potentialWin}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">End Date:</span>
                            <span className="font-medium">{position.endDate}</span>
                        </div>
                    </div>
                </CardBody>
            </Card>
        ));
    };

    return (
        <div className="max-w-4xl mx-auto pt-6 px-4">
            <h1 className="text-3xl font-bold text-center mb-8">Portfolio</h1>

            {/* Balance Card */}
            <Card className="bg-white/70 backdrop-blur-lg mb-6">
                <CardBody className="py-5">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-8 h-8 relative">
                            <Image
                                src="/usdc.png"
                                alt="USDC"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-3xl font-bold">${portfolio.balance}</span>
                    </div>
                </CardBody>
            </Card>

            {/* Ramp Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <Button
                    startContent={<ArrowDownToLine size={20} />}
                    color="primary"
                    className="h-12"
                >
                    Onramp
                </Button>
                <Button
                    startContent={<ArrowUpFromLine size={20} />}
                    color="primary"
                    variant="bordered"
                    className="h-12"
                >
                    Offramp
                </Button>
            </div>

            <Divider className="my-6" />

            {/* Positions Section */}
            <div>
                <h2 className="text-xl font-semibold mb-4">My Positions</h2>
                
                {/* Position Tabs */}
                <Tabs 
                    selectedKey={selectedTab}
                    onSelectionChange={(key: Key) => setSelectedTab(key.toString())}
                    className="mb-4"
                >
                    <Tab key="current" title="Current">
                        <div className="space-y-4 mt-4">
                            {renderPositions(portfolio.currentPositions)}
                        </div>
                    </Tab>
                    <Tab key="past" title="Past">
                        <div className="space-y-4 mt-4">
                            {renderPositions(portfolio.pastPositions)}
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
}