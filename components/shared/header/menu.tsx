import Link from "next/link";
import { CartBadge } from "./cart-badge";

export default function Menu() {
    return (
        <div className="flex justify-end">
          <nav className="flex gap-4 w-full">
            <Link href='/signin' className="flex items-center header-button">
                Hello, Sign in
            </Link>

            <CartBadge />
          </nav>
        </div>
    )
}