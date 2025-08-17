"use client"

import { ChevronsUp } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export default function Footer(){
    return (
        <footer className="bg-black text-white underline-link">
            <div className="w-full">
                <Button
                  variant='ghost'
                  className="bg-gray-800 w-full rounded-none"
                  onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                  >
                    <ChevronsUp className="mr-2 h-2 w-4"></ChevronsUp>
                    Back to top
                  </Button>
            </div>
            <div className="p-4">
                <div className="flex justify-center gap-3 text-sm">
                    <Link href="/page/conditions-of-use">Conditions of use</Link>
                    <Link href="/page/privacy-policy">Privacy policy</Link>
                    <Link href="/page/help">Help</Link>
                </div>
                <div className="flex justify-center text-sm">
                    <p> CopyRight 2019-2025, {APP_NAME}, Inc. or affiliates</p>
                </div>
                 <div className="mt-8 flex justify-center text-sm text-gray-400">
                    <p> Add Address here</p>
                </div>
            </div>
        </footer>
    )
}