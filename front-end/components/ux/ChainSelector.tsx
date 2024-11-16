import { supportedChains } from "@/types/blockchain";
import { Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function ChainSelector() {
    const [selectedChain, setSelectedChain] = useState({
        name: 'Ethereum',
        icon: '/ethereum.png',
        id: 'ethereum'
    });

    return <Dropdown>
        <DropdownTrigger>
            <Button
                isIconOnly
                className="bg-white/70 border-grey backdrop-blur-lg w-12 h-12"
                variant="bordered"
            >
                <div className="relative w-6 h-6 border-grey">
                    <Image
                        src={selectedChain.icon}
                        alt={selectedChain.name}
                        fill
                        className="object-contain"
                    />
                </div>
            </Button>
        </DropdownTrigger>
        <DropdownMenu
            aria-label="Chain Selection"
            onAction={(key) => {
                const chain = supportedChains.find(c => c.id === key);
                if (chain) setSelectedChain(chain);
            }}
        >
            {supportedChains.map((chain) => (
                <DropdownItem
                    key={chain.id}
                    startContent={
                        <div className="relative w-5 h-5 mr-2">
                            <Image
                                src={chain.icon}
                                alt={chain.name}
                                fill
                                className="object-contain"
                            />
                        </div>
                    }
                >
                    {chain.name}
                </DropdownItem>
            ))}
        </DropdownMenu>
    </Dropdown>;
}