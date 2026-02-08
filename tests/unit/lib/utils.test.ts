import { describe, expect, it } from "vitest"
import { cn } from "@/lib/utils"

describe("cn", () => {
  it("merges class names and removes conflicting tailwind utilities", () => {
    const result = cn("px-2 py-2", "px-4", { "text-sm": true, hidden: false })
    expect(result).toContain("px-4")
    expect(result).toContain("py-2")
    expect(result).toContain("text-sm")
    expect(result).not.toContain("px-2")
    expect(result).not.toContain("hidden")
  })
})
