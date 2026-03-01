"use client";

import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PageHelpItem {
  label: string;
  description: string;
}

interface PageHelpProps {
  title: string;
  items: PageHelpItem[];
}

export function PageHelp({ title, items }: PageHelpProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
          aria-label="Help"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-3">
          <p className="text-sm font-semibold">{title}</p>
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li key={i} className="text-sm">
                <span className="font-medium">{item.label}</span>
                {" — "}
                <span className="text-muted-foreground">{item.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
}
