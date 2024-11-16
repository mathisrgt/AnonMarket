'use client';
import { SettingsMenu } from "@/components/accountPage/SettingsMenu";
import NavBar from "@/components/NavBar";
import { Card, CardBody, Button } from "@nextui-org/react";
import { useWeb3Auth } from "@web3auth/no-modal-react-hooks";
import { LogOut } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function AccountPage() {
    const {
        logout
    } = useWeb3Auth();
    const router = useRouter();

    return (
        <>
            <div className="max-w-md mx-auto py-6">
                <div>
                    <h1 className="text-2xl font-bold mb-6">Profile</h1>

                    <Card className="bg-white shadow-md mb-6">
                        <CardBody>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-full" />
                                <div>
                                    <h2 className="font-semibold">Anonymous User</h2>
                                    <p className="text-sm text-gray-500">ID: 0x1234...5678</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <SettingsMenu />
                </div>

                <Button
                    color="danger"
                    variant="flat"
                    className="w-full mt-6"
                    startContent={<LogOut size={20} />}
                    size="lg"
                    onClick={() => {
                        logout();
                        router.push('/');
                    }}>
                    Logout
                </Button>
            </div>
            <NavBar />
        </>
    );
}