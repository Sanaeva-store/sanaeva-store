import { render, screen, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, afterEach } from "vitest"
import { PageHelp } from "@/components/common/page-help"

afterEach(() => cleanup())

const items = [
  { label: "Search", description: "Search by name or SKU" },
  { label: "Status", description: "Filter by product status" },
]

describe("PageHelp", () => {
  it("renders help trigger button with aria-label", () => {
    render(<PageHelp title="Products Guide" items={items} />)
    expect(screen.getByRole("button", { name: "Help" })).toBeInTheDocument()
  })

  it("shows popover content with title and items when trigger is clicked", async () => {
    render(<PageHelp title="Products Guide" items={items} />)
    await userEvent.click(screen.getByRole("button", { name: "Help" }))
    expect(screen.getByText("Products Guide")).toBeInTheDocument()
    expect(screen.getByText("Search")).toBeInTheDocument()
    expect(screen.getByText("Search by name or SKU")).toBeInTheDocument()
    expect(screen.getByText("Status")).toBeInTheDocument()
    expect(screen.getByText("Filter by product status")).toBeInTheDocument()
  })

  it("renders all items in the list after opening", async () => {
    const manyItems = [
      { label: "A", description: "desc-a" },
      { label: "B", description: "desc-b" },
      { label: "C", description: "desc-c" },
    ]
    render(<PageHelp title="Guide" items={manyItems} />)
    await userEvent.click(screen.getByRole("button", { name: "Help" }))
    expect(screen.getAllByRole("listitem")).toHaveLength(3)
  })
})
