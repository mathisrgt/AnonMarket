'use client';
import { Card, CardBody, Button, Divider, Tabs, Tab, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, } from "@nextui-org/react";
import Image from 'next/image';
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Key, useState } from "react";
import { createWalletClient, createPublicClient, custom, formatEther, parseUnits, encodeFunctionData, parseEther } from 'viem'
import { useWeb3Auth } from "@web3auth/no-modal-react-hooks";
import handleSwap from "@/services/handleSwap"
import { mainnet, polygonAmoy, sepolia, baseSepolia } from 'viem/chains'
import { handleApproveAction, handleDepositAction } from "../../services/viemEscrow";
import { sendTransaction } from "viem/actions";
import { IProvider } from "@web3auth/base";
import NavBar from "@/components/NavBar";

export const getViewChain = (provider: IProvider) => {
    switch (provider.chainId) {
        case "1":
            return mainnet;
        case "0x13882":
            return polygonAmoy;
        case "0xaa36a7":
            return sepolia;
        case "0x14A34":
            return baseSepolia;
        default:
            return mainnet;
    }
}

export default function PortfolioPage() {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState('current');
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const {
        provider
    } = useWeb3Auth();

    const [isApproved, setIsApproved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    const renderPositions = (positions: any[], isCurrent: boolean) => {
        return (
            <div className="grid grid-cols-1 gap-4 w-full">
                {positions.map((position, index) => (
                    <Card
                        key={index}
                        className="bg-white/70 backdrop-blur-lg w-full"
                    >
                        <CardBody className="p-4">
                            <div
                                className="cursor-pointer"
                                onClick={() => handlePositionClick(position)}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-semibold">{position.title}</h3>
                                    <span className={`text-sm font-semibold whitespace-nowrap ml-4 ${position.status === 'active' ? 'text-primary' :
                                        position.status === 'won' ? 'text-green-600' :
                                            position.status === 'lost' ? 'text-red-600' : ''
                                        }`}>
                                        {position.status.charAt(0).toUpperCase() + position.status.slice(1)}
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Prediction:</span>
                                        <span className="font-medium ml-4">{position.prediction}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Amount:</span>
                                        <span className="font-medium ml-4">{position.amount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Odds:</span>
                                        <span className="font-medium ml-4">{position.odds}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Potential Win:</span>
                                        <span className="font-medium text-green-600 ml-4">{position.potentialWin}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">End Date:</span>
                                        <span className="font-medium ml-4">{position.endDate}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Claim Button - only show for current positions */}
                            {isCurrent && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <Button
                                        color="primary"
                                        variant="flat"
                                        className="w-full"
                                        onClick={() => handleClaim(position)}
                                    >
                                        Claim Position
                                    </Button>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                ))}
            </div>
        );
    };

    // Add the claim handler
    const handleClaim = (position: any) => {
        console.log('Claiming position:', position);
        // Add your claim logic here
    };
    async function handleDepositInescrow() {
        if (!provider) {
            console.error('Error: Provider is not initialized.');
            return;
        }

        const publicClient = createPublicClient({
            chain: getViewChain(provider),
            transport: custom(provider),
        });

        const walletClient = createWalletClient({
            chain: getViewChain(provider),
            transport: custom(provider),
        });

        await handleSwap(provider, publicClient, walletClient)
        await handleApproveAction(provider, publicClient, walletClient)
            .then((response) => {
                console.log(isApproved ? 'Deposit successful' : 'Approval successful', response);
            })
            .catch((error) => {
                console.error('Action failed:', error);
            })
            .finally(() => {
                setIsLoading(false); // Réinitialise l'état de chargement
            });
        await handleDepositAction(provider, publicClient, walletClient)
            .then((response) => {
                console.log(isApproved ? 'Deposit successful' : 'Approval successful', response);
            })
            .catch((error) => {
                console.error('Action failed:', error);
            })
            .finally(() => {
                setIsLoading(false); // Réinitialise l'état de chargement
            });
    }

    return (
        <div className="max-w-4xl mx-auto px-4 pb-24 min-h-screen overflow-y-auto">
            {/* Fixed Header Section */}
            <div className="sticky top-0 bg-background/80 backdrop-blur-lg pt-6 pb-4 z-10">
                <h1 className="text-3xl font-bold text-center mb-8">Portfolio</h1>

                {/* Balance Card */}
                <Card className="bg-white/70 backdrop-blur-lg mb-6 w-full">
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
                        variant="bordered"
                        className="h-12"
                        onPress={onOpen}>
                        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                            <ModalContent>
                                {(onClose) => (
                                    <>
                                        <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                                        <ModalBody>
                                            <h2 id="modal-title" className="text-xl font-semibold mb-4">Select an Action</h2>
                                            <div className="grid grid-cols-1 gap-4">
                                                <Button color="primary" className="w-full">Deposit</Button>
                                                <Button color="primary" variant="bordered" className="w-full" onClick={() => (handleDepositInescrow())}>Swap</Button>
                                                <Button color="primary" className="w-full">Onramp</Button>
                                            </div>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="danger" variant="light" onPress={onClose}>
                                                Close
                                            </Button>
                                        </ModalFooter>
                                    </>
                                )}
                            </ModalContent>
                        </Modal>

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

                {/* Positions Header */}
                <h2 className="text-xl font-semibold">My Positions</h2>
            </div>

            {/* Scrollable Content */}
            <div>
                <Tabs
                    selectedKey={selectedTab}
                    onSelectionChange={(key) => setSelectedTab(key.toString())}
                    className="mb-2"
                >
                    <Tab key="current" title="Current">
                        <div className="w-full">
                            {renderPositions(portfolio.currentPositions, true)}
                        </div>
                    </Tab>
                    <Tab key="past" title="Past">
                        <div className="w-full">
                            {renderPositions(portfolio.pastPositions, false)}
                        </div>
                    </Tab>
                </Tabs>
            </div>

            {/* Add bottom padding to account for mobile navigation */}
            <div className="h-16" />
            <NavBar />
        </div >
    );
}