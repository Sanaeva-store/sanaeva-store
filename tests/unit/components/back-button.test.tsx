import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { BackButton } from "@/components/common/back-button"

const mockBack = vi.fn()
const mockPush = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ back: mockBack, push: mockPush }),
}))

afterEach(() => cleanup())

describe("BackButton", () => {
  beforeEach(() => {
    mockBack.mockReset()
    mockPush.mockReset()
  })

  it("renders with provided label", () => {
    render(<BackButton fallbackHref="/admin" label="Back to list" />)
    expect(screen.getByText("Back to list")).toBeInTheDocument()
  })

  it("renders without label when not provided", () => {
    render(<BackButton fallbackHref="/admin" />)
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("calls router.back() when history has entries", () => {
    Object.defineProperty(globalThis, "history", {
      value: { length: 3 },
      writable: true,
      configurable: true,
    })
    render(<BackButton fallbackHref="/admin" label="Back" />)
    fireEvent.click(screen.getByRole("button"))
    expect(mockBack).toHaveBeenCalledOnce()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it("calls router.push(fallbackHref) when no history", () => {
    Object.defineProperty(globalThis, "history", {
      value: { length: 1 },
      writable: true,
      configurable: true,
    })
    render(<BackButton fallbackHref="/fallback-path" label="Back" />)
    fireEvent.click(screen.getByRole("button"))
    expect(mockPush).toHaveBeenCalledWith("/fallback-path")
    expect(mockBack).not.toHaveBeenCalled()
  })
})
