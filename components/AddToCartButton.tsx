"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ExamSlug } from "@/app/examCatalog";
import { useCart, priceLabelToInr, type CartItem } from "@/components/CartContext";

type AddToCartButtonProps = {
  exam: ExamSlug;
  examLabel: string;
  name: string;
  tag?: string;
  period: string;
  priceLabel: string;
  className?: string;
  label?: string;
  withIcon?: boolean;
};

// Adds a plan to the cart and moves the shopper forward to the cart page.
// If the plan is already in the cart, it just takes them there.
export default function AddToCartButton({
  exam,
  examLabel,
  name,
  tag,
  period,
  priceLabel,
  className = "button ghost",
  label = "Add to cart",
  withIcon = true
}: AddToCartButtonProps) {
  const { addItem, has } = useCart();
  const router = useRouter();
  const id = `${exam}:${name}`;
  const inCart = has(id);

  function onClick() {
    if (!inCart) {
      const item: CartItem = {
        id,
        exam,
        examLabel,
        name,
        tag,
        period,
        priceLabel,
        priceInr: priceLabelToInr(priceLabel)
      };
      addItem(item);
    }
    router.push("/cart");
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {withIcon ? <ShoppingCart size={18} aria-hidden="true" /> : null}
      {inCart ? "View in cart" : label}
    </button>
  );
}
