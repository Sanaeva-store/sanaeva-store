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

export const metadata: Metadata = {
  title: "Initial Stock - Sanaeva Store",
  description: "Set initial stock levels for products",
};

export default function InitialStockPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Initial Stock</h1>
        <p className="mt-2 text-muted-foreground">
          Set initial stock levels for your inventory
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Initialize Form */}
        <Card>
          <CardHeader>
            <CardTitle>Initialize Stock</CardTitle>
            <CardDescription>
              Set the starting inventory for a product variant
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

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" placeholder="0" min="0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Textarea id="note" placeholder="Add any notes..." />
            </div>

            <Button className="w-full">Initialize Stock</Button>
          </CardContent>
        </Card>

        {/* Balance Lookup */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Balance Lookup</CardTitle>
            <CardDescription>
              Check current stock levels for any variant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lookup-variant">Product Variant</Label>
              <Select>
                <SelectTrigger id="lookup-variant">
                  <SelectValue placeholder="Select variant..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Product A - Size M</SelectItem>
                  <SelectItem value="2">Product B - Size L</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="w-full">
              Check Balance
            </Button>

            <div className="mt-6 rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                Select a variant to view current stock levels
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
