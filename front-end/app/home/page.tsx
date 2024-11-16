'use client';
import { useState } from 'react';
import { Card, CardBody, Input, Button, Tabs, Tab, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { Search, TrendingUp, Trophy, LandPlot } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import NavBar from '@/components/NavBar';
import { ChainSelector } from '@/components/ux/ChainSelector';
import { markets } from '@/data/market';

export default function HomePage() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('finance');

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
        <>
            <NavBar />
            <div className="max-w-4xl mx-auto pt-6 px-4">
                {/* Header with Title and Chain Selector */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">AnonMarket</h1>

                    <ChainSelector />
                </div>

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
                <div className="grid grid-cols-1 gap-4">
                    {markets[selectedCategory as keyof typeof markets].map((market) => (
                        <Card
                            key={market.id}
                            isPressable
                            isHoverable
                            className="bg-white/70 backdrop-blur-lg hover:bg-white/80 transition-all cursor-pointer w-full"
                            onPress={() => handleMarketClick(market)}
                        >
                            <CardBody className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-lg">{market.title}</h3>
                                    <span className="text-primary font-semibold whitespace-nowrap ml-4">{market.odds}</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-4">{market.description}</p>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Ends: {market.endDate}</span>
                                    <span className="ml-4">Volume: {market.volume}</span>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}