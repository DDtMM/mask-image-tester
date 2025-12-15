# CSS Mask Tester

A modern interactive web application built with Svelte 5, Vite, TypeScript, and TailwindCSS/DaisyUI to test and experiment with CSS mask properties in real-time.

## Features

- **Live Preview**: See mask effects applied to a sample image with instant visual feedback
- **Complete Mask Control**: Edit all CSS mask properties:
  - `mask-image`: Define the mask pattern with gradients, shapes, or images
  - `mask-size`: Control the size of the mask layer
  - `mask-position`: Position the mask layer precisely
  - `mask-repeat`: Control how the mask repeats
  - `mask-mode`: Define how the mask layer is interpreted
- **CSS Variables**: Define and use custom CSS variables for dynamic mask properties
- **GSAP Animation System**: Create multi-step animated transitions between mask states with:
  - Multiple animation steps with custom durations and easing functions
  - Extensive easing options (power, back, elastic, bounce, circ, expo, sine)
  - Yoyo playback for smooth forward/backward animations
  - Play/pause/reset controls with visual playback indicator
- **Preset Examples**: Rich collection of pre-configured mask examples with animation presets
- **Export Functionality**: Export your mask configurations as reusable JSON examples
- **Responsive Split View**: Left sidebar for controls, main canvas for masked image preview
- **Cross-browser Support**: Uses both `-webkit-mask-image` and `mask-image` for compatibility

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Select an Example**: Choose from preset examples in the dropdown menu to load pre-configured masks and animations
2. **Edit Mask Properties**: 
   - Modify the `mask-image` value using CSS gradients, shapes, or image URLs
   - Adjust `mask-size`, `mask-position`, `mask-repeat`, and `mask-mode` as needed
3. **Define CSS Variables**: Create custom CSS variables for dynamic mask values (e.g., `--spotlight-size: 30%;`)
4. **Create Animations**: 
   - Add animation steps with custom durations and easing functions
   - Set target values for CSS variables in each step
   - Toggle yoyo mode for forward/backward playback
   - Preview animations with play/pause/reset controls
5. **Export Your Work**: Use the Export Settings to save your mask configuration as JSON for reuse

## Examples Structure

Examples are stored in `public/examples.json` with the following structure:

```json
{
  "name": "Spotlight",
  "maskImage": "radial-gradient(circle, black var(--spotlight-size), transparent var(--spotlight-fade))",
  "maskSize": "var(--spotlight-scale)",
  "maskPosition": "var(--spotlight-x) var(--spotlight-y)",
  "maskRepeat": "no-repeat",
  "maskMode": "alpha",
  "variables": [
    "--spotlight-size: 30%;",
    "--spotlight-fade: 70%;"
  ],
  "animationSteps": [
    {
      "easing": "power1.out",
      "duration": 2,
      "variables": [
        "--spotlight-size: 20%;",
        "--spotlight-fade: 80%;"
      ]
    }
  ]
}
```

## Technology Stack

- **Svelte 5**: Modern reactive UI framework with runes-based reactivity
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type-safe JavaScript
- **TailwindCSS**: Utility-first CSS framework
- **DaisyUI**: Component library for TailwindCSS
- **GSAP**: Professional-grade animation library
- **CSS3**: Modern styling with mask properties

## Customization

To add your own examples, edit `public/examples.json` and add entries with the structure shown above. You can also use the Export Settings feature in the app to generate properly formatted JSON from your current configuration.
