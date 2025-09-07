import { Button } from "@heroui/react";
import Link from "next/link";

export function HomePage() {
  return (
    <Button color="primary" href="./auth/login">
      <Link href="./auth/login" className="text-white">Click</Link>
    </Button>
  )
}