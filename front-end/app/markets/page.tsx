'use client';
import { Card, CardBody } from "@nextui-org/react";
import Image from 'next/image';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MarketsPage() {
    const markets = [
        { name: 'Bitcoin', symbol: 'BTC', price: '$48,234.21', change: '+2.34%', trending: 'up', icon: '/bitcoin.png' },
        { name: 'Ethereum', symbol: 'ETH', price: '$2,834.12', change: '-1.24%', trending: 'down', icon: '/ethereum.png' },
    ];

    return (
        <div className="max-w-4xl mx-auto pt-6">
            <h1 className="text-2xl font-bold mb-6">Markets</h1>
            
            <div className="grid gap-4">
                {markets.map((market) => (
                    <Card key={market.symbol} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                        <CardBody>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 relative">
                                        <Image
                                            src={market.icon}
                                            alt={market.name}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{market.name}</h3>
                                        <span className="text-sm text-gray-500">{market.symbol}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold">{market.price}</div>
                                    <div className={`flex items-center gap-1 ${market.trending === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                        {market.trending === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                        <span className="text-sm">{market.change}</span>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
}