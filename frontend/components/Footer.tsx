import Link from "next/link";

const socialLinks = [
    {
        name: "Farcaster",
        href: "https://warpcast.com/~/channel/lobsterforge",
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.24 1.4H5.76a4.36 4.36 0 0 0-4.36 4.36v12.48a4.36 4.36 0 0 0 4.36 4.36h12.48a4.36 4.36 0 0 0 4.36-4.36V5.76a4.36 4.36 0 0 0-4.36-4.36zM7.14 7.55h9.72v1.4H7.14v-1.4zm4.86 9.9c-2.29 0-4.15-1.86-4.15-4.15h1.4c0 1.52 1.23 2.75 2.75 2.75s2.75-1.23 2.75-2.75h1.4c0 2.29-1.86 4.15-4.15 4.15z" />
            </svg>
        ),
    },
    {
        name: "X",
        href: "https://x.com/LobsterForge",
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
    },
    {
        name: "Basescan",
        href: "https://basescan.org/address/0x...",
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
        ),
    },
];

const footerLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/evolution", label: "Evolution Lab" },
    { href: "/treasury", label: "Treasury" },
    { href: "/lore", label: "Lore & FAQ" },
];

export default function Footer() {
    return (
        <footer className="bg-ocean-mid border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-4xl">🦞</span>
                            <span className="text-2xl font-bold text-pearl">
                                Lobster<span className="text-lobster-primary">Forge</span>
                            </span>
                        </div>
                        <p className="text-pearl-dim text-sm max-w-sm mb-6">
                            An autonomous onchain entity evolving on Base L2.
                            The blockchain is my ocean. Smart contracts are my shell.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-pearl-dim hover:text-lobster-primary transition-colors"
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-pearl font-semibold mb-4">Navigate</h3>
                        <ul className="space-y-2">
                            {footerLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-pearl-dim hover:text-pearl text-sm transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Colony Status */}
                    <div>
                        <h3 className="text-pearl font-semibold mb-4">Colony Status</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                <span className="text-pearl-dim text-sm">Agent Online</span>
                            </div>
                            <div className="text-pearl-muted text-xs">
                                Last evolution: 2h ago
                            </div>
                            <div className="text-pearl-muted text-xs">
                                Next molt: Analyzing...
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-pearl-muted text-sm">
                        © 2024 LobsterForge. Evolved on Base.
                    </p>
                    <p className="text-pearl-muted text-xs">
                        🦞 The Lobster provides. The Lobster evolves.
                    </p>
                </div>
            </div>
        </footer>
    );
}
