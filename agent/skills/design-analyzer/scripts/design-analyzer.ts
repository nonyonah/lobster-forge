/**
 * Design Analyzer Skill
 * Study reference sites and synthesize design language
 */

export interface ColorPalette {
    primary: string;
    secondary: string;
    accent: string;
    background: {
        deep: string;
        mid: string;
        surface: string;
    };
    text: {
        primary: string;
        secondary: string;
        muted: string;
    };
    status: {
        success: string;
        warning: string;
        error: string;
    };
}

export interface Typography {
    fontFamily: string;
    weights: number[];
    sizes: {
        xs: string;
        sm: string;
        base: string;
        lg: string;
        xl: string;
        "2xl": string;
        "3xl": string;
    };
}

export interface Animation {
    name: string;
    keyframes: string;
    duration: string;
    easing: string;
}

export interface DesignSystem {
    name: string;
    description: string;
    palette: ColorPalette;
    typography: Typography;
    animations: Animation[];
    borderRadius: Record<string, string>;
    spacing: Record<string, string>;
}

// Deep Sea Premium Design System
const DEEP_SEA_PREMIUM: DesignSystem = {
    name: "Deep Sea Premium",
    description: "A flat design language for LobsterForge - where ocean depths meet blockchain evolution",
    palette: {
        primary: "#0a1628",
        secondary: "#ff4d4d",
        accent: "#00d9ff",
        background: {
            deep: "#0a1628",
            mid: "#0f2138",
            surface: "#152742",
        },
        text: {
            primary: "#fafafa",
            secondary: "rgba(255, 255, 255, 0.7)",
            muted: "rgba(255, 255, 255, 0.5)",
        },
        status: {
            success: "#10b981",
            warning: "#f59e0b",
            error: "#ef4444",
        },
    },
    typography: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        weights: [400, 500, 600, 700],
        sizes: {
            xs: "0.75rem",
            sm: "0.875rem",
            base: "1rem",
            lg: "1.125rem",
            xl: "1.25rem",
            "2xl": "1.5rem",
            "3xl": "2rem",
        },
    },
    animations: [
        {
            name: "swim",
            keyframes: `
        0%, 100% { transform: translateX(0) rotate(0deg); }
        25% { transform: translateX(5px) rotate(2deg); }
        75% { transform: translateX(-5px) rotate(-2deg); }
      `,
            duration: "3s",
            easing: "ease-in-out",
        },
        {
            name: "pulse-glow",
            keyframes: `
        0%, 100% { opacity: 1; filter: drop-shadow(0 0 10px rgba(0, 217, 255, 0.3)); }
        50% { opacity: 0.8; filter: drop-shadow(0 0 20px rgba(0, 217, 255, 0.5)); }
      `,
            duration: "2s",
            easing: "ease-in-out",
        },
        {
            name: "float",
            keyframes: `
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      `,
            duration: "4s",
            easing: "ease-in-out",
        },
    ],
    borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        full: "9999px",
    },
    spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
    },
};

export interface ComponentSuggestion {
    name: string;
    description: string;
    cssClasses: string[];
    example: string;
}

export class DesignAnalyzer {
    private designSystem: DesignSystem;

    constructor(customSystem?: Partial<DesignSystem>) {
        this.designSystem = { ...DEEP_SEA_PREMIUM, ...customSystem };
        console.log(`🦞 Design Analyzer loaded: ${this.designSystem.name}`);
    }

    /**
     * Get the full design system
     */
    getDesignSystem(): DesignSystem {
        return this.designSystem;
    }

    /**
     * Get color palette
     */
    getPalette(): ColorPalette {
        return this.designSystem.palette;
    }

    /**
     * Generate CSS variables from palette
     */
    generateCSSVariables(): string {
        const { palette, typography, borderRadius, spacing } = this.designSystem;

        return `
:root {
  /* Colors */
  --color-primary: ${palette.primary};
  --color-secondary: ${palette.secondary};
  --color-accent: ${palette.accent};
  
  --color-bg-deep: ${palette.background.deep};
  --color-bg-mid: ${palette.background.mid};
  --color-bg-surface: ${palette.background.surface};
  
  --color-text-primary: ${palette.text.primary};
  --color-text-secondary: ${palette.text.secondary};
  --color-text-muted: ${palette.text.muted};
  
  --color-success: ${palette.status.success};
  --color-warning: ${palette.status.warning};
  --color-error: ${palette.status.error};
  
  /* Typography */
  --font-family: ${typography.fontFamily};
  
  /* Border Radius */
  --radius-sm: ${borderRadius.sm};
  --radius-md: ${borderRadius.md};
  --radius-lg: ${borderRadius.lg};
  --radius-xl: ${borderRadius.xl};
  
  /* Spacing */
  --space-xs: ${spacing.xs};
  --space-sm: ${spacing.sm};
  --space-md: ${spacing.md};
  --space-lg: ${spacing.lg};
  --space-xl: ${spacing.xl};
}
`;
    }

    /**
     * Generate Tailwind config extension
     */
    generateTailwindConfig(): object {
        const { palette } = this.designSystem;

        return {
            colors: {
                ocean: {
                    deep: palette.background.deep,
                    mid: palette.background.mid,
                    surface: palette.background.surface,
                },
                lobster: {
                    primary: palette.secondary,
                    light: "#ff6b6b",
                    dark: "#cc3d3d",
                },
                bioluminescent: palette.accent,
                pearl: {
                    DEFAULT: palette.text.primary,
                    dim: palette.text.secondary,
                    muted: palette.text.muted,
                },
            },
            animation: {
                swim: "swim 3s ease-in-out infinite",
                "pulse-glow": "pulse-glow 2s ease-in-out infinite",
                float: "float 4s ease-in-out infinite",
            },
        };
    }

    /**
     * Suggest component styling
     */
    suggestComponent(type: string): ComponentSuggestion {
        const suggestions: Record<string, ComponentSuggestion> = {
            card: {
                name: "Card",
                description: "Flat card with subtle border",
                cssClasses: [
                    "bg-ocean-mid",
                    "border",
                    "border-white/10",
                    "rounded-xl",
                    "p-6",
                ],
                example: `<div class="bg-ocean-mid border border-white/10 rounded-xl p-6">
  Content
</div>`,
            },
            button: {
                name: "Primary Button",
                description: "Lobster red CTA button",
                cssClasses: [
                    "bg-lobster-primary",
                    "hover:bg-lobster-light",
                    "text-white",
                    "font-semibold",
                    "px-6",
                    "py-3",
                    "rounded-lg",
                    "transition-colors",
                ],
                example: `<button class="bg-lobster-primary hover:bg-lobster-light text-white font-semibold px-6 py-3 rounded-lg transition-colors">
  Connect Wallet
</button>`,
            },
            metric: {
                name: "Metric Display",
                description: "Large value with label",
                cssClasses: ["metric-value", "metric-label"],
                example: `<div>
  <span class="metric-label">Treasury</span>
  <span class="metric-value">8.45 ETH</span>
</div>`,
            },
            "progress-bar": {
                name: "Progress Bar",
                description: "Gradient-filled progress indicator",
                cssClasses: ["progress-bar", "progress-fill"],
                example: `<div class="progress-bar">
  <div class="progress-fill" style="width: 75%"></div>
</div>`,
            },
            "gradient-text": {
                name: "Gradient Text",
                description: "Lobster-to-bioluminescent gradient text",
                cssClasses: ["gradient-text", "text-glow"],
                example: `<h1 class="gradient-text text-glow">LobsterForge</h1>`,
            },
        };

        return (
            suggestions[type] || {
                name: type,
                description: "Custom component",
                cssClasses: ["card"],
                example: `<div class="card">${type}</div>`,
            }
        );
    }

    /**
     * Generate animation keyframes CSS
     */
    generateAnimationCSS(): string {
        let css = "";

        for (const anim of this.designSystem.animations) {
            css += `
@keyframes ${anim.name} {
  ${anim.keyframes}
}

.animate-${anim.name} {
  animation: ${anim.name} ${anim.duration} ${anim.easing} infinite;
}
`;
        }

        return css;
    }

    /**
     * Analyze design principles from description
     */
    analyzePrinciples(): string[] {
        return [
            "Flat design with subtle depth through borders",
            "Dark theme with high contrast accents",
            "Bioluminescent glow effects for highlights",
            "Lobster red for primary actions",
            "Cyan accent for links and active states",
            "Inter font for clean readability",
            "Generous spacing and padding",
            "Smooth, ocean-inspired animations",
            "Emoji as visual anchors (🦞)",
            "Trust through transparency (basescan links)",
        ];
    }

    /**
     * Generate design documentation
     */
    generateDocumentation(): string {
        const principles = this.analyzePrinciples();

        return `# LobsterForge Design System: ${this.designSystem.name}

${this.designSystem.description}

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Ocean Deep | ${this.designSystem.palette.background.deep} | Page background |
| Ocean Mid | ${this.designSystem.palette.background.mid} | Cards, modals |
| Ocean Surface | ${this.designSystem.palette.background.surface} | Elevated elements |
| Lobster Red | ${this.designSystem.palette.secondary} | CTAs, accents |
| Bioluminescent | ${this.designSystem.palette.accent} | Links, highlights |
| Pearl | ${this.designSystem.palette.text.primary} | Primary text |

## Typography

- **Font**: Inter
- **Weights**: ${this.designSystem.typography.weights.join(", ")}

## Design Principles

${principles.map((p, i) => `${i + 1}. ${p}`).join("\n")}

## Animations

${this.designSystem.animations.map((a) => `- **${a.name}**: ${a.duration} ${a.easing}`).join("\n")}

---
🦞 The blockchain is my ocean. This design system is my shell.
`;
    }
}
