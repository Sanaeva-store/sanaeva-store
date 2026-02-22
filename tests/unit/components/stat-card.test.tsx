import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { StatCard } from "@/components/components-design/admin-dashboard-ui/stat-card"

describe("StatCard", () => {
  it("renders title, value, update date, and positive trend", () => {
    render(
      <StatCard
        title="Total Products"
        value="25"
        icon="Package"
        trend="+15%"
        updateDate="20 July 2024"
      />
    )

    expect(screen.getByText("Total Products")).toBeInTheDocument()
    expect(screen.getByText("25")).toBeInTheDocument()
    expect(screen.getByText("Update: 20 July 2024")).toBeInTheDocument()
    expect(screen.getByText("+15%")).toBeInTheDocument()
  })
})
