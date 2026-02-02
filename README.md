# Aura Luxury Store Theme

Custom Shopify theme built on Shopify Dawn (v15.4.1) with luxury styling and tailored components for Aura Luxury Store.

## Overview

This theme extends Dawn with brand-specific visual styling, refined product presentation, and additional UI components while keeping Dawn’s performance and accessibility foundations intact.

## Key customizations

- Luxury design layer (`assets/aura-luxury-product.css`, `assets/aura-luxury-variants.css`)
- Enhanced product card styling and interactions
- Brand-aligned color system and typography tweaks
- Component-level CSS and JavaScript aligned to Dawn architecture

## Requirements

- [Shopify CLI](https://shopify.dev/docs/api/shopify-cli)
- [Shopify Liquid VS Code extension](https://shopify.dev/docs/storefronts/themes/tools/shopify-liquid-vscode) (recommended)

## Development workflow

1. Authenticate with Shopify CLI.
2. Run the theme preview server.

```
shopify theme dev
```

## Project structure

```bash
.
├── assets          # Stores static assets (CSS, JS, images, fonts, etc.)
├── blocks          # Reusable, nestable, customizable UI components
├── config          # Global theme settings and customization options
├── layout          # Top-level wrappers for pages (layout templates)
├── locales         # Translation files for theme internationalization
├── sections        # Modular full-width page components
├── snippets        # Reusable Liquid code or HTML fragments
└── templates       # JSON templates composing sections and blocks per page
```

See the [Shopify theme architecture documentation](https://shopify.dev/docs/storefronts/themes/architecture) for details.

### Templates

[Templates](https://shopify.dev/docs/storefronts/themes/architecture/templates#template-types) control what's rendered on each type of page in a theme.

This theme uses [JSON templates](https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates) to support flexible, merchant-editable layouts.

### Sections

[Sections](https://shopify.dev/docs/storefronts/themes/architecture/sections) are Liquid files that allow you to create reusable modules of content that can be customized by merchants. They can also include blocks which allow merchants to add, remove, and reorder content within a section.

Sections are made customizable by including a `{% schema %}` in the body. For more information, refer to the [section schema documentation](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema).

### Blocks

[Blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks) let developers create flexible layouts by breaking down sections into smaller, reusable pieces of Liquid. Each block has its own set of settings, and can be added, removed, and reordered within a section.

Blocks are made customizable by including a `{% schema %}` in the body. For more information, refer to the [block schema documentation](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/schema).

## Schema guidelines

When developing components defined by schema settings, we recommend these guidelines to simplify your code:

- **Single property settings**: For settings that correspond to a single CSS property, use CSS variables:

  ```liquid
  <div class="collection" style="--gap: {{ block.settings.gap }}px">
    ...
  </div>

  {% stylesheet %}
    .collection {
      gap: var(--gap);
    }
  {% endstylesheet %}

  {% schema %}
  {
    "settings": [{
      "type": "range",
      "label": "gap",
      "id": "gap",
      "min": 0,
      "max": 100,
      "unit": "px",
      "default": 0,
    }]
  }
  {% endschema %}
  ```

- **Multiple property settings**: For settings that control multiple CSS properties, use CSS classes:

  ```liquid
  <div class="collection {{ block.settings.layout }}">
    ...
  </div>

  {% stylesheet %}
    .collection--full-width {
      /* multiple styles */
    }
    .collection--narrow {
      /* multiple styles */
    }
  {% endstylesheet %}

  {% schema %}
  {
    "settings": [{
      "type": "select",
      "id": "layout",
      "label": "layout",
      "values": [
        { "value": "collection--full-width", "label": "t:options.full" },
        { "value": "collection--narrow", "label": "t:options.narrow" }
      ]
    }]
  }
  {% endschema %}
  ```

## CSS and JavaScript

For CSS and JavaScript, we recommend using the [`{% stylesheet %}`](https://shopify.dev/docs/api/liquid/tags#stylesheet) and [`{% javascript %}`](https://shopify.dev/docs/api/liquid/tags/javascript) tags. They can be included multiple times, but the code will only appear once.

### `critical.css`

This theme keeps essential CSS in a dedicated `critical.css` file to ensure fast initial rendering.

## Documentation and references

- [AGENTS.md](./AGENTS.md) - Development guidelines and Liquid best practices
