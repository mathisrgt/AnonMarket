'use client';
import { Card, CardBody, Progress } from "@nextui-org/react";
import Image from 'next/image';

export default function PortfolioPage() {
    const portfolio = {
        totalValue: '$12,345.67',
        assets: [
            { name: 'Bitcoin', symbol: 'BTC', value: '$8,234.21', percentage: 70, icon: '/bitcoin.png' },
            { name: 'Ethereum', symbol: 'ETH', value: '$4,111.46', percentage: 30, icon: '/ethereum.png' },
        ]
    };

    return (
        <div className="max-w-4xl mx-auto pt-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Portfolio</h1>
                <div className="text-2xl font-bold text-primary">{portfolio.totalValue}</div>
            </div>
            
            <Card className="bg-white shadow-md">
                <CardBody className="gap-4">
                    {portfolio.assets.map((asset) => (
                        <div key={asset.symbol} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 relative">
                                        <Image
                                            src={asset.icon}
                                            alt={asset.name}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <div>
                                        <div className="font-semibold">{asset.symbol}</div>
                                        <div className="text-sm text-gray-500">{asset.name}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold">{asset.value}</div>
                                    <div className="text-sm text-gray-500">{asset.percentage}%</div>
                                </div>
                            </div>
                            <Progress 
                                value={asset.percentage} 
                                className="h-2" 
                                color="primary"
                            />
                        </div>
                    ))}
                </CardBody>
            </Card>
        </div>
    );
}