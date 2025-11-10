"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { AvatarSettings, AvatarCosmetic } from "@/lib/types"
import { Lock, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AvatarDisplay } from "./avatar-display"
import { storage } from "@/lib/storage"
import { gamification } from "@/lib/gamification"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AvatarCustomizationProps {
  settings: AvatarSettings
  onUpdate: () => void
}

export function AvatarCustomization({ settings, onUpdate }: AvatarCustomizationProps) {
  const faces = settings.cosmetics.filter((c) => c.type === "face")
  const outfits = settings.cosmetics.filter((c) => c.type === "outfit")
  const shoes = settings.cosmetics.filter((c) => c.type === "shoes")
  const headdresses = settings.cosmetics.filter((c) => c.type === "headdress")
  const backgrounds = settings.cosmetics.filter((c) => c.type === "background")

  const handleSelect = (cosmeticId: string, type: "face" | "outfit" | "shoes" | "headdress" | "background") => {
    const progress = gamification.getProgress()

    if (type === "face") {
      progress.avatarSettings.selectedFace = cosmeticId
    } else if (type === "outfit") {
      progress.avatarSettings.selectedOutfit = cosmeticId
    } else if (type === "shoes") {
      progress.avatarSettings.selectedShoes = cosmeticId
    } else if (type === "headdress") {
      progress.avatarSettings.selectedHeaddress = cosmeticId
    } else if (type === "background") {
      progress.avatarSettings.selectedBackground = cosmeticId
    }

    storage.setProgress(progress)
    onUpdate()
  }

  const renderCosmetic = (cosmetic: AvatarCosmetic, isSelected: boolean) => {
    const unlockText = cosmetic.requiredLevel
      ? `Level ${cosmetic.requiredLevel}`
      : cosmetic.requiredBadge
        ? cosmetic.requiredBadge
        : ""

    return (
      <div
        key={cosmetic.id}
        className={`p-4 rounded-lg border-2 transition-all ${
          isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        } ${!cosmetic.unlocked ? "opacity-50" : "cursor-pointer"}`}
        onClick={() => cosmetic.unlocked && handleSelect(cosmetic.id, cosmetic.type)}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-sm">{cosmetic.name}</span>
          {isSelected && <Check className="h-4 w-4 text-primary" />}
          {!cosmetic.unlocked && <Lock className="h-4 w-4 text-muted-foreground" />}
        </div>

        {!cosmetic.unlocked && unlockText && (
          <Badge variant="secondary" className="text-xs">
            {unlockText}
          </Badge>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Avatar Preview</CardTitle>
          <CardDescription>See how your avatar looks with current customizations</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <AvatarDisplay settings={settings} size="lg" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customize Your Avatar</CardTitle>
          <CardDescription>Unlock new items by leveling up and earning badges</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="face" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="face">Face</TabsTrigger>
              <TabsTrigger value="outfit">Outfit</TabsTrigger>
              <TabsTrigger value="shoes">Shoes</TabsTrigger>
              <TabsTrigger value="headdress">Headdress</TabsTrigger>
              <TabsTrigger value="background">Background</TabsTrigger>
            </TabsList>

            <TabsContent value="face" className="mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Male Faces</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {faces
                      .filter((f) => f.gender === "male")
                      .map((face) => renderCosmetic(face, face.id === settings.selectedFace))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Female Faces</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {faces
                      .filter((f) => f.gender === "female")
                      .map((face) => renderCosmetic(face, face.id === settings.selectedFace))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="outfit" className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {outfits.map((outfit) => renderCosmetic(outfit, outfit.id === settings.selectedOutfit))}
              </div>
            </TabsContent>

            <TabsContent value="shoes" className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {shoes.map((shoe) => renderCosmetic(shoe, shoe.id === settings.selectedShoes))}
              </div>
            </TabsContent>

            <TabsContent value="headdress" className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {headdresses.map((hd) => renderCosmetic(hd, hd.id === settings.selectedHeaddress))}
              </div>
            </TabsContent>

            <TabsContent value="background" className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {backgrounds.map((bg) => renderCosmetic(bg, bg.id === settings.selectedBackground))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
