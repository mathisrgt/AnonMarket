'use client';
import { useState } from 'react';
import { Card, CardBody } from "@nextui-org/react";
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

export default function ConverterPage() {
    const [amount, setAmount] = useState<string>('');
    
    const cryptos = [
        { symbol: 'BTC', name: 'Bitcoin', value: '0.001502', icon: '/bitcoin.png' },
        { symbol: 'ETH', name: 'Ethereum', value: '1.2000', icon: '/ethereum.png' }
    ];

    return (
        <div className="max-w-md mx-auto pt-6 px-4">
            <h1 className="text-2xl font-bold mb-6">Converter</h1>
            
            <Card className="bg-white shadow-md">
                <CardBody className="gap-4">
                    {cryptos.map((crypto, index) => (
                        <div key={crypto.symbol} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="w-8 h-8 relative">
                                    <Image
                                        src={crypto.icon}
                                        alt={crypto.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{crypto.symbol}</span>
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <span className="text-sm text-gray-500">{crypto.name}</span>
                                </div>
                            </div>
                            <input
                                type="number"
                                value={index === 0 ? amount : (Number(amount) * 800).toString()}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-32 text-right bg-transparent focus:outline-none"
                                placeholder="0.00"
                            />
                        </div>
                    ))}
                </CardBody>
            </Card>

            <div className="grid grid-cols-3 gap-2 mt-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '⌫'].map((key) => (
                    <button
                        key={key}
                        onClick={() => {
                            if (key === '⌫') {
                                setAmount(prev => prev.slice(0, -1));
                            } else if (key === '*') {
                                setAmount(prev => prev + '.');
                            } else {
                                setAmount(prev => prev + key);
                            }
                        }}
                        className="aspect-square flex items-center justify-center rounded-full bg-white text-xl font-medium shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    >
                        {key}
                    </button>
                ))}
            </div>
        </div>
    );
}