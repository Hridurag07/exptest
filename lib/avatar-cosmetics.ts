import type { AvatarCosmetic } from "./types"

export const DEFAULT_COSMETICS: AvatarCosmetic[] = [
  { id: "face-male-1", type: "face", name: "Classic Male", unlocked: true, gender: "male" },
  { id: "face-male-2", type: "face", name: "Friendly Male", unlocked: false, requiredLevel: 3, gender: "male" },
  { id: "face-male-3", type: "face", name: "Wise Male", unlocked: false, requiredLevel: 6, gender: "male" },
  { id: "face-male-4", type: "face", name: "Young Male", unlocked: false, requiredLevel: 9, gender: "male" },
  { id: "face-male-5", type: "face", name: "Mature Male", unlocked: false, requiredLevel: 12, gender: "male" },
  { id: "face-male-6", type: "face", name: "Sporty Male", unlocked: false, requiredLevel: 15, gender: "male" },
  { id: "face-male-7", type: "face", name: "Professional Male", unlocked: false, requiredLevel: 18, gender: "male" },
  { id: "face-male-8", type: "face", name: "Adventurous Male", unlocked: false, requiredLevel: 21, gender: "male" },

  { id: "face-female-1", type: "face", name: "Classic Female", unlocked: true, gender: "female" },
  { id: "face-female-2", type: "face", name: "Friendly Female", unlocked: false, requiredLevel: 3, gender: "female" },
  { id: "face-female-3", type: "face", name: "Wise Female", unlocked: false, requiredLevel: 6, gender: "female" },
  { id: "face-female-4", type: "face", name: "Young Female", unlocked: false, requiredLevel: 9, gender: "female" },
  { id: "face-female-5", type: "face", name: "Mature Female", unlocked: false, requiredLevel: 12, gender: "female" },
  { id: "face-female-6", type: "face", name: "Sporty Female", unlocked: false, requiredLevel: 15, gender: "female" },
  {
    id: "face-female-7",
    type: "face",
    name: "Professional Female",
    unlocked: false,
    requiredLevel: 18,
    gender: "female",
  },
  {
    id: "face-female-8",
    type: "face",
    name: "Adventurous Female",
    unlocked: false,
    requiredLevel: 21,
    gender: "female",
  },

  { id: "outfit-casual", type: "outfit", name: "Casual Wear", unlocked: true, gender: "neutral" },
  {
    id: "outfit-business",
    type: "outfit",
    name: "Business Suit",
    unlocked: false,
    requiredLevel: 4,
    gender: "neutral",
  },
  { id: "outfit-sporty", type: "outfit", name: "Athletic Wear", unlocked: false, requiredLevel: 6, gender: "neutral" },
  { id: "outfit-formal", type: "outfit", name: "Formal Attire", unlocked: false, requiredLevel: 8, gender: "neutral" },
  { id: "outfit-hoodie", type: "outfit", name: "Cozy Hoodie", unlocked: false, requiredLevel: 10, gender: "neutral" },
  {
    id: "outfit-jacket",
    type: "outfit",
    name: "Leather Jacket",
    unlocked: false,
    requiredLevel: 12,
    gender: "neutral",
  },
  { id: "outfit-dress", type: "outfit", name: "Elegant Dress", unlocked: false, requiredLevel: 14, gender: "female" },
  { id: "outfit-tuxedo", type: "outfit", name: "Tuxedo", unlocked: false, requiredLevel: 16, gender: "male" },
  { id: "outfit-summer", type: "outfit", name: "Summer Outfit", unlocked: false, requiredLevel: 18, gender: "neutral" },
  { id: "outfit-winter", type: "outfit", name: "Winter Coat", unlocked: false, requiredLevel: 20, gender: "neutral" },
  {
    id: "outfit-superhero",
    type: "outfit",
    name: "Hero Costume",
    unlocked: false,
    requiredLevel: 25,
    gender: "neutral",
  },
  { id: "outfit-ninja", type: "outfit", name: "Ninja Outfit", unlocked: false, requiredLevel: 28, gender: "neutral" },
  { id: "outfit-royal", type: "outfit", name: "Royal Robes", unlocked: false, requiredLevel: 30, gender: "neutral" },

  { id: "shoes-sneakers", type: "shoes", name: "Sneakers", unlocked: true, gender: "neutral" },
  { id: "shoes-boots", type: "shoes", name: "Boots", unlocked: false, requiredLevel: 4, gender: "neutral" },
  { id: "shoes-dress", type: "shoes", name: "Dress Shoes", unlocked: false, requiredLevel: 7, gender: "neutral" },
  { id: "shoes-sandals", type: "shoes", name: "Sandals", unlocked: false, requiredLevel: 9, gender: "neutral" },
  { id: "shoes-heels", type: "shoes", name: "High Heels", unlocked: false, requiredLevel: 11, gender: "female" },
  { id: "shoes-running", type: "shoes", name: "Running Shoes", unlocked: false, requiredLevel: 13, gender: "neutral" },
  { id: "shoes-loafers", type: "shoes", name: "Loafers", unlocked: false, requiredLevel: 15, gender: "neutral" },
  { id: "shoes-slippers", type: "shoes", name: "Slippers", unlocked: false, requiredLevel: 17, gender: "neutral" },
  { id: "shoes-combat", type: "shoes", name: "Combat Boots", unlocked: false, requiredLevel: 19, gender: "neutral" },

  { id: "headdress-none", type: "headdress", name: "None", unlocked: true, gender: "neutral" },
  {
    id: "headdress-cap",
    type: "headdress",
    name: "Baseball Cap",
    unlocked: false,
    requiredLevel: 3,
    gender: "neutral",
  },
  { id: "headdress-beanie", type: "headdress", name: "Beanie", unlocked: false, requiredLevel: 5, gender: "neutral" },
  { id: "headdress-fedora", type: "headdress", name: "Fedora", unlocked: false, requiredLevel: 7, gender: "neutral" },
  {
    id: "headdress-headband",
    type: "headdress",
    name: "Headband",
    unlocked: false,
    requiredLevel: 9,
    gender: "female",
  },
  {
    id: "headdress-bandana",
    type: "headdress",
    name: "Bandana",
    unlocked: false,
    requiredLevel: 11,
    gender: "neutral",
  },
  {
    id: "headdress-sunhat",
    type: "headdress",
    name: "Sun Hat",
    unlocked: false,
    requiredLevel: 13,
    gender: "female",
  },
  {
    id: "headdress-beret",
    type: "headdress",
    name: "Beret",
    unlocked: false,
    requiredLevel: 15,
    gender: "neutral",
  },
  {
    id: "headdress-cowboy",
    type: "headdress",
    name: "Cowboy Hat",
    unlocked: false,
    requiredLevel: 17,
    gender: "neutral",
  },
  {
    id: "headdress-crown",
    type: "headdress",
    name: "Crown",
    unlocked: false,
    requiredBadge: "Month Master",
    gender: "neutral",
  },
  {
    id: "headdress-tiara",
    type: "headdress",
    name: "Tiara",
    unlocked: false,
    requiredBadge: "Century Club",
    gender: "female",
  },
  { id: "headdress-halo", type: "headdress", name: "Halo", unlocked: false, requiredLevel: 30, gender: "neutral" },
  {
    id: "headdress-wizard",
    type: "headdress",
    name: "Wizard Hat",
    unlocked: false,
    requiredLevel: 35,
    gender: "neutral",
  },

  { id: "bg-simple", type: "background", name: "Simple", unlocked: true, gender: "neutral" },
  {
    id: "bg-gradient-blue",
    type: "background",
    name: "Blue Gradient",
    unlocked: false,
    requiredLevel: 4,
    gender: "neutral",
  },
  {
    id: "bg-gradient-warm",
    type: "background",
    name: "Warm Gradient",
    unlocked: false,
    requiredLevel: 6,
    gender: "neutral",
  },
  {
    id: "bg-gradient-purple",
    type: "background",
    name: "Purple Gradient",
    unlocked: false,
    requiredLevel: 8,
    gender: "neutral",
  },
  { id: "bg-stars", type: "background", name: "Starry Night", unlocked: false, requiredLevel: 10, gender: "neutral" },
  { id: "bg-office", type: "background", name: "Office", unlocked: false, requiredLevel: 12, gender: "neutral" },
  { id: "bg-nature", type: "background", name: "Nature", unlocked: false, requiredLevel: 14, gender: "neutral" },
  { id: "bg-city", type: "background", name: "City Skyline", unlocked: false, requiredLevel: 16, gender: "neutral" },
  { id: "bg-beach", type: "background", name: "Beach", unlocked: false, requiredLevel: 18, gender: "neutral" },
  { id: "bg-mountain", type: "background", name: "Mountains", unlocked: false, requiredLevel: 20, gender: "neutral" },
  { id: "bg-space", type: "background", name: "Space", unlocked: false, requiredLevel: 22, gender: "neutral" },
  { id: "bg-luxury", type: "background", name: "Luxury", unlocked: false, requiredLevel: 25, gender: "neutral" },
]

export const checkUnlockedCosmetics = (level: number, badges: string[]): AvatarCosmetic[] => {
  return DEFAULT_COSMETICS.map((cosmetic) => {
    if (cosmetic.unlocked) return cosmetic

    let shouldUnlock = false

    if (cosmetic.requiredLevel && level >= cosmetic.requiredLevel) {
      shouldUnlock = true
    }

    if (cosmetic.requiredBadge && badges.includes(cosmetic.requiredBadge)) {
      shouldUnlock = true
    }

    return {
      ...cosmetic,
      unlocked: shouldUnlock,
      unlockedAt: shouldUnlock ? new Date().toISOString() : undefined,
    }
  })
}
