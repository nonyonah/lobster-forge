"use client";

import Link from "next/link";
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Colony" },
    { href: "/evolution", label: "Evolution Lab" },
    { href: "/treasury", label: "Treasury" },
    { href: "/lore", label: "Lore" },
];

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-ocean-deep border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <span className="text-3xl group-hover:animate-swim">🦞</span>
                        <span className="text-xl font-bold text-pearl">
                            Lobster<span className="text-lobster-primary">Forge</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 text-sm font-medium text-pearl-dim hover:text-pearl transition-colors rounded-lg hover:bg-white/5"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Connect Wallet Button */}
                    <div className="hidden md:block">
                        <ConnectButton
                            showBalance={false}
                            chainStatus="icon"
                            accountStatus={{
                                smallScreen: "avatar",
                                largeScreen: "full",
                            }}
                        />
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-pearl-dim hover:text-pearl"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {mobileMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-white/10">
                        <nav className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="px-4 py-3 text-pearl-dim hover:text-pearl hover:bg-white/5 rounded-lg transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="mt-4 px-4">
                                <ConnectButton showBalance={false} />
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
