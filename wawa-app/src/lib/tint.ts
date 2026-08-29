/**
 * A translucent wash of a language accent, for card and badge backgrounds.
 *
 * The old approach shipped a hardcoded pastel per language (`colorSoft`), which
 * stayed light in dark mode while the text on top went light too — invisible.
 * color-mix against `transparent` keeps the hue but lets whatever surface is
 * underneath show through, so it reads correctly in both themes.
 */
export function tint(color: string, percent = 16): string {
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`
}
