# CSS Mask Image Tester

A modern web application built with Vite and TypeScript to test and experiment with CSS `mask-image` properties in real-time.

## Features

- **Live Preview**: See mask-image effects applied to a sample image in real-time
- **Interactive Editor**: Edit CSS mask-image values directly in a textarea with immediate updates
- **Preset Examples**: Choose from a collection of pre-configured mask examples loaded from JSON
- **Split View**: Left panel shows the masked image, right panel contains controls
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

1. The left panel displays a sample image with the mask effect applied
2. Select a preset example from the dropdown menu
3. Or manually edit the CSS in the textarea to create custom mask effects
4. Changes are applied immediately as you type

## Examples Included

The app includes various mask-image examples:
- Linear gradient fades
- Radial gradients
- Circle shapes
- Diagonal stripes
- Vignette effects
- Crosshatch patterns
- And more!

## Technology Stack

- **Vite**: Fast build tool and dev server
- **TypeScript**: Type-safe JavaScript
- **CSS3**: Modern styling with mask-image support

## Customization

To add your own examples, edit `public/examples.json`:

```json
{
  "name": "Your Example Name",
  "css": "your-mask-image-css-value"
}
```

## Browser Support

The CSS `mask-image` property is supported in modern browsers. The app uses both standard and `-webkit-` prefixed versions for maximum compatibility.
