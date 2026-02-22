import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { adjustmentReasonOptions } from "@/shared/constants/options";

export const metadata: Metadata = {
  title: "Stock Adjustment - Sanaeva Store",
  description: "Adjust inventory levels",
};

export default function StockAdjustmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Stock Adjustment</h1>
        <p className="mt-2 text-muted-foreground">
          Increase or decrease inventory levels with full traceability
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          All adjustments are tracked and require a reason code for audit purposes.
        </AlertDescription>
      </Alert>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Adjustment Form</CardTitle>
          <CardDescription>
            Adjust stock levels for a specific variant and location
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="variant">Product Variant</Label>
            <Select>
              <SelectTrigger id="variant">
                <SelectValue placeholder="Select variant..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Product A - Size M</SelectItem>
                <SelectItem value="2">Product B - Size L</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="warehouse">Warehouse</Label>
            <Select>
              <SelectTrigger id="warehouse">
                <SelectValue placeholder="Select warehouse..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">Main Warehouse</SelectItem>
                <SelectItem value="secondary">Secondary Warehouse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Adjustment Type</Label>
              <Select>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="increase">Increase</SelectItem>
                  <SelectItem value="decrease">Decrease</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" placeholder="0" min="1" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason Code</Label>
            <Select>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select reason..." />
              </SelectTrigger>
              <SelectContent>
                {adjustmentReasonOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Textarea id="note" placeholder="Add details about this adjustment..." />
          </div>

          <div className="flex gap-2">
            <Button className="flex-1">Submit Adjustment</Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
