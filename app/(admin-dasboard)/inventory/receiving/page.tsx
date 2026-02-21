import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Goods Receiving - Sanaeva Store",
  description: "Receive incoming inventory shipments",
};

export default function GoodsReceivingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Goods Receiving</h1>
        <p className="mt-2 text-muted-foreground">
          Process incoming inventory shipments
        </p>
      </div>

      {/* Receiving Header */}
      <Card>
        <CardHeader>
          <CardTitle>Receiving Information</CardTitle>
          <CardDescription>
            Enter shipment details and receiving location
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
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
              <Label htmlFor="po-ref">PO Reference (Optional)</Label>
              <Input id="po-ref" placeholder="PO-2024-001" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice">Invoice Number (Optional)</Label>
              <Input id="invoice" placeholder="INV-2024-001" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Receiving Items</CardTitle>
              <CardDescription>
                Add products and quantities being received
              </CardDescription>
            </div>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Variant</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No items added yet. Click &quot;Add Item&quot; to start.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Submit Receiving</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
