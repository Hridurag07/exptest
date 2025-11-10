"use client"
import type { AvatarSettings } from "@/lib/types"
import { User } from "lucide-react"

interface AvatarDisplayProps {
  settings: AvatarSettings
  size?: "sm" | "md" | "lg"
}

const SKIN_COLORS: Record<string, string> = {
  "skin-default": "bg-primary",
  "skin-cool": "bg-blue-500",
  "skin-warm": "bg-orange-500",
  "skin-nature": "bg-green-500",
  "skin-royal": "bg-purple-500",
  "skin-gold": "bg-yellow-500",
}

const BG_STYLES: Record<string, string> = {
  "bg-default": "bg-muted",
  "bg-gradient": "bg-gradient-to-br from-primary/20 to-accent/20",
  "bg-stars": "bg-gradient-to-b from-blue-900 to-purple-900",
  "bg-coffee": "bg-gradient-to-br from-amber-900 to-orange-900",
  "bg-luxury": "bg-gradient-to-br from-yellow-600 to-amber-800",
}

export function AvatarDisplay({ settings, size = "md" }: AvatarDisplayProps) {
  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
  }

  const iconSizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  }

  const bgStyle = BG_STYLES[settings.selectedBackground] || BG_STYLES["bg-default"]
  const skinColor = SKIN_COLORS[settings.selectedSkin] || SKIN_COLORS["skin-default"]

  return (
    <div
      className={`${sizeClasses[size]} ${bgStyle} rounded-full flex items-center justify-center relative overflow-hidden`}
    >
      <div className={`${skinColor} rounded-full p-3`}>
        <User className={`${iconSizes[size]} text-primary-foreground`} />
      </div>

      {settings.selectedAccessory !== "acc-none" && (
        <div className="absolute top-0 right-0 text-2xl">
          {settings.selectedAccessory === "acc-glasses" && "👓"}
          {settings.selectedAccessory === "acc-hat" && "🎩"}
          {settings.selectedAccessory === "acc-crown" && "👑"}
          {settings.selectedAccessory === "acc-halo" && "😇"}
        </div>
      )}
    </div>
  )
}
