"use client";

import { useState, useEffect } from "react";
import { useCart } from "./CartProvider";

export function CartDrawer() {
  const { items, total, removeItem, changeQty } = useCart();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    const nav = document.querySelector('a[href="/shop"]');
    if (!nav) return;
    const handler = (e: Event) => {
      e.preventDefault();
      setOpen(true);
    };
    nav.addEventListener("click", handler);
    return () => nav.removeEventListener("click", handler);
  }, []);

  const handleCheckout = async () => {
    const orderData = {
      items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
      total,
      customerName: "Guest",
      customerEmail: "guest@example.com",
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      if (res.ok) {
        alert("Order placed! We'll contact you about payment.");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    }
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-[rgba(6,11,18,0.6)] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 bottom-0 w-[380px] max-w-[90vw] z-50 bg-s1 border-l border-[rgba(255,255,255,0.07)] flex flex-col transition-transform duration-250 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.07)]">
          <h2 className="font-display text-lg font-semibold">Cart</h2>
          <button
            onClick={() => setOpen(false)}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-[rgba(255,255,255,0.07)] text-muted hover:text-text hover:border-[rgba(255,255,255,0.13)] transition-all text-sm"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3.5">
          {items.length === 0 ? (
            <div className="text-center py-10 font-mono text-xs text-muted">
              Cart is empty.
              <br />
              Add some books or kits.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-2.5 py-3 border-b border-[rgba(255,255,255,0.07)] items-center last:border-b-0"
              >
                <div className="flex-1">
                  <p className="text-xs font-medium mb-0.5">{item.name}</p>
                  <p className="font-mono text-xs text-muted">
                    ${(item.price * item.qty).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => changeQty(item.id, -1)}
                    className="w-[26px] h-[26px] rounded border border-[rgba(255,255,255,0.07)] bg-s2 text-muted hover:text-text hover:border-[rgba(255,255,255,0.13)] transition-all text-sm flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="font-mono text-xs min-w-[20px] text-center">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => changeQty(item.id, 1)}
                    className="w-[26px] h-[26px] rounded border border-[rgba(255,255,255,0.07)] bg-s2 text-muted hover:text-text hover:border-[rgba(255,255,255,0.13)] transition-all text-sm flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="px-5 py-3.5 border-t border-[rgba(255,255,255,0.07)]">
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="text-muted">Total</span>
              <span className="font-display text-xl font-bold">
                ${total.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-orange text-white border-none rounded-lg py-3 font-display text-sm font-semibold hover:opacity-85 transition-opacity"
            >
              Proceed to Checkout →
            </button>
            <p className="font-mono text-[11px] text-dim text-center mt-2">
              Secure checkout via Stripe
            </p>
          </div>
        )}
      </div>
    </>
  );
}
