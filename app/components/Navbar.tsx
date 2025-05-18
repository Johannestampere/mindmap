import React, { JSX } from "react";
import Link from "next/link";

export default function Navbar(): JSX.Element {
    return (
        <nav className="bg-gray-400 p-4">
            <ul className="flex justify-between items-stretch">
                <li>
                    <Link href="/dashboard">Logo</Link>
                </li>
                <div>
                    Username's dashboard
                </div>
                <li>
                    <Link href="/account">Account</Link>
                </li>
            </ul>
        </nav>
    )
}