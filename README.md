# patchwork-css

A lightweight utility library for generating consistent design tokens and CSS custom properties from a single JSON config file.

## Installation

```bash
npm install patchwork-css
```

## Usage

Define your design tokens in a `tokens.json` config file:

```json
{
  "colors": {
    "primary": "#6200ee",
    "secondary": "#03dac6",
    "background": "#ffffff"
  },
  "spacing": {
    "sm": "8px",
    "md": "16px",
    "lg": "32px"
  }
}
```

Then generate your CSS custom properties:

```ts
import { generateTokens } from "patchwork-css";

const css = generateTokens("./tokens.json");
console.log(css);
```

**Output:**

```css
:root {
  --color-primary: #6200ee;
  --color-secondary: #03dac6;
  --color-background: #ffffff;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 32px;
}
```

You can also write the output directly to a file:

```ts
import { writeTokens } from "patchwork-css";

writeTokens("./tokens.json", "./styles/tokens.css");
```

## License

[MIT](./LICENSE)