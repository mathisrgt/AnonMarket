import { Button } from "@nextui-org/react";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Welcome to AnonMarket</h1>
      <Link href={'/login'}><Button color="primary">Start</Button></Link>
    </main>
  );
}
