"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "--success-bg": "var(--semantic-success-bg)",
          "--success-text": "var(--semantic-success-text)",
          "--success-border": "var(--semantic-success-border)",
          "--info-bg": "var(--semantic-info-bg)",
          "--info-text": "var(--semantic-info-text)",
          "--info-border": "var(--semantic-info-border)",
          "--warning-bg": "var(--semantic-warning-bg)",
          "--warning-text": "var(--semantic-warning-text)",
          "--warning-border": "var(--semantic-warning-border)",
          "--error-bg": "var(--semantic-error-bg)",
          "--error-text": "var(--semantic-error-text)",
          "--error-border": "var(--semantic-error-border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
