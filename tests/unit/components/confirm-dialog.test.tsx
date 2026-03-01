import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import { describe, expect, it, vi, afterEach } from "vitest"
import { ConfirmDialog } from "@/components/common/confirm-dialog"

afterEach(() => cleanup())

describe("ConfirmDialog", () => {
  it("renders title when open", () => {
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        title="Delete item?"
        onConfirm={vi.fn()}
      />
    )
    expect(screen.getByText("Delete item?")).toBeInTheDocument()
  })

  it("renders optional description", () => {
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        title="Delete item?"
        description="This cannot be undone."
        onConfirm={vi.fn()}
      />
    )
    expect(screen.getByText("This cannot be undone.")).toBeInTheDocument()
  })

  it("uses default confirm and cancel labels", () => {
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        title="Delete item?"
        onConfirm={vi.fn()}
      />
    )
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
  })

  it("uses custom confirm and cancel labels", () => {
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        title="Delete item?"
        confirmLabel="Yes, delete"
        cancelLabel="No, keep"
        onConfirm={vi.fn()}
      />
    )
    expect(screen.getByRole("button", { name: "Yes, delete" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "No, keep" })).toBeInTheDocument()
  })

  it("calls onConfirm when confirm button is clicked", () => {
    const onConfirm = vi.fn()
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        title="Delete item?"
        onConfirm={onConfirm}
      />
    )
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it("shows loading state on confirm button", () => {
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        title="Delete item?"
        onConfirm={vi.fn()}
        isLoading={true}
      />
    )
    expect(screen.getByRole("button", { name: "..." })).toBeInTheDocument()
  })

  it("disables confirm and cancel buttons when loading", () => {
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        title="Delete item?"
        onConfirm={vi.fn()}
        isLoading={true}
      />
    )
    expect(screen.getByRole("button", { name: "..." })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled()
  })

  it("does not render content when closed", () => {
    render(
      <ConfirmDialog
        open={false}
        onOpenChange={vi.fn()}
        title="Delete item?"
        onConfirm={vi.fn()}
      />
    )
    expect(screen.queryByText("Delete item?")).not.toBeInTheDocument()
  })
})
