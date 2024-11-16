'use client';
import { useEffect, useState } from 'react';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { Button } from "@nextui-org/react";
import { useRouter } from 'next/navigation';

interface Market {
    id: string;
    title: string;
    description: string;
    longDescription: string;
    endDate: string;
    volume: string;
    type: 'binary' | 'multiple-choice';
    options: Array<{ label: string; odds: string; }>;
}

export default function MarketPage() {
    const router = useRouter();
    const [market, setMarket] = useState<Market | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [shares, setShares] = useState(1);
    const [previousPage, setPreviousPage] = useState<string>('/home');

    useEffect(() => {
        try {
            const storedMarket = localStorage.getItem('selectedMarket');
            const storedPreviousPage = localStorage.getItem('previousPage');
            
            if (storedMarket) {
                setMarket(JSON.parse(storedMarket));
            }
            if (storedPreviousPage) {
                setPreviousPage(storedPreviousPage);
            }
        } catch (error) {
            console.error('Error loading market data:', error);
        }
    }, []);

    if (!market) {
        return (
            <div className="max-w-4xl mx-auto pt-6 px-4">
                <button 
                    onClick={() => router.push('/home')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>
                <div>Loading market data...</div>
            </div>
        );
    }

    const handleSharesChange = (increment: boolean) => {
        setShares(prev => Math.max(1, increment ? prev + 1 : prev - 1));
    };

    const handleBuy = () => {
        if (!selectedOption) return;
        console.log(`Buying ${shares} shares of ${selectedOption}`);
    };

    // Calculate total cost
    const selectedOdds = market.options.find(opt => opt.label === selectedOption)?.odds;
    const totalCost = shares * (selectedOdds ? parseFloat(selectedOdds) : 0);

    return (
        <div className="max-w-4xl mx-auto pt-6 px-4 pb-24">
            {/* Back Button */}
            <button 
                onClick={() => router.push(previousPage)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
                <ArrowLeft size={20} />
                <span>Back</span>
            </button>

            {/* Market Details */}
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 mb-6">
                <h1 className="text-2xl font-bold mb-4">{market.title}</h1>
                <p className="text-gray-600 mb-6">{market.description}</p>
                
                <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>End Date:</span>
                        <span>{market.endDate}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Volume:</span>
                        <span>{market.volume}</span>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="font-semibold mb-4">Market Details</h3>
                    <p className="text-sm text-gray-600">{market.longDescription}</p>
                </div>

                {/* Option Selection */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {market.options.map((option) => (
                        <Button
                            key={option.label}
                            size="lg"
                            className="h-14"
                            color="primary"
                            variant={selectedOption === option.label ? "solid" : "bordered"}
                            onClick={() => setSelectedOption(option.label)}
                        >
                            <div className="flex flex-col">
                                <span>{option.label}</span>
                                <span className="text-sm opacity-80">{option.odds}</span>
                            </div>
                        </Button>
                    ))}
                </div>

                {/* Shares Selection */}
                {selectedOption && (
                    <div className="mb-8">
                        <h3 className="font-semibold mb-4">Number of Shares</h3>
                        <div className="flex items-center justify-center gap-4">
                            <Button
                                isIconOnly
                                variant="bordered"
                                onClick={() => handleSharesChange(false)}
                                className="h-12 w-12"
                            >
                                <Minus size={20} />
                            </Button>
                            <span className="text-2xl font-semibold min-w-[60px] text-center">
                                {shares}
                            </span>
                            <Button
                                isIconOnly
                                variant="bordered"
                                onClick={() => handleSharesChange(true)}
                                className="h-12 w-12"
                            >
                                <Plus size={20} />
                            </Button>
                        </div>
                        <div className="text-center mt-2 text-gray-600">
                            Total Cost: ${totalCost.toFixed(2)}
                        </div>
                    </div>
                )}

                {/* Buy Button */}
                {selectedOption && (
                    <Button
                        color="primary"
                        size="lg"
                        className="w-full h-14"
                        onClick={handleBuy}
                    >
                        Buy {shares} Share{shares > 1 ? 's' : ''} of {selectedOption}
                    </Button>
                )}
            </div>
        </div>
    );
}