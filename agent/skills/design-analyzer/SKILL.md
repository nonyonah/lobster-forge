---
name: design-analyzer
description: Study reference sites and synthesize design language
---

# Design Analyzer Skill

Analyzes reference websites to extract design principles and create LobsterForge's unique visual identity.

## Reference Sites

1. **nothing.tech** - Minimalism, typography, spacing
2. **app.uniswap.org** - Swap UI, gradients, wallet flows
3. **app.morpho.org** - Dashboards, data viz, DeFi clarity

## Design Principles Extracted

### From nothing.tech
- Maximum whitespace
- Typography as hero element
- Monochrome with accent pops
- Slow, intentional animations

### From Uniswap
- Glassmorphism (subtle)
- Vibrant gradients
- Clear CTAs
- Wallet-first UX

### From Morpho
- Data-dense dashboards
- Clean tables
- Metric cards
- Trust indicators

## LobsterForge Design Language: "Deep Sea Premium"

### Colors
- **Ocean Deep**: #0a1628 (primary bg)
- **Ocean Mid**: #0f2138 (cards)
- **Lobster Red**: #ff4d4d (accent)
- **Bioluminescent**: #00d9ff (highlights)
- **Pearl**: #fafafa (text)

### Typography
- **Font**: Inter (Google Fonts)
- **Headlines**: Bold, large, minimal
- **Body**: Clean, high contrast
- **Metrics**: Mono-inspired weight

### Animations
- `swim` - Subtle horizontal float
- `pulse-glow` - Bioluminescent effect
- `float` - Vertical hover

### Components
- Flat cards with border glow
- Progress bars with gradient fills
- Lobster emoji accents
- Basescan link badges

## Usage

```typescript
import { DesignAnalyzer } from './scripts/design-analyzer';

const analyzer = new DesignAnalyzer();
const palette = analyzer.generatePalette();
const component = analyzer.suggestComponent('metrics-display');
```
