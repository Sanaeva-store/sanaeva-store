"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartActions } from "@/features/cart/store/cart.selectors";
import type { CartItem } from "@/features/cart/store/cart.store";

interface AddToCartButtonProps {
  item: Omit<CartItem, "quantity">;
  disabled?: boolean;
}

export function AddToCartButton({ item, disabled }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const { addItem } = useCartActions();

  const handleAddToCart = () => {
    addItem({ ...item, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Button
      className="flex-1"
      size="lg"
      onClick={handleAddToCart}
      disabled={disabled || added}
    >
      {added ? (
        <>
          <Check className="mr-2 h-5 w-5" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add to Cart
        </>
      )}
    </Button>
  );
}
