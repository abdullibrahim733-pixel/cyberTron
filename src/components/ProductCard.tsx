"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  type: string;
  subtitle: string;
  description: string;
  price: number;
  level: string;
  pages: number;
  emoji: string;
  color: string;
  features: string;
}

export function ProductCard({
  id,
  name,
  slug,
  type,
  subtitle,
  description,
  price,
  level,
  pages,
  emoji,
  color,
  features,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const featureList = (() => {
    try {
      return JSON.parse(features) as string[];
    } catch {
      return [];
    }
  })();

  const handleAdd = () => {
    addItem({ id, name, price, slug, type });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="glass overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-1">
      <div
        className="h-[110px] flex items-center justify-center text-[38px] relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${color}20, ${color}08)`,
        }}
      >
        <span>{emoji}</span>
        {level && (
          <span className="absolute top-2.5 right-2.5 font-mono text-[10px] bg-[rgba(0,0,0,0.45)] text-muted border border-[rgba(255,255,255,0.07)] px-1.5 py-0.5 rounded-full">
            {level}
          </span>
        )}
      </div>

      <div className="p-4 flex-1">
        <h3 className="text-base font-semibold mb-0.5">{name}</h3>
        <p className="font-mono text-[11px] mb-2" style={{ color }}>
          {subtitle}
        </p>
        <p className="text-xs text-muted leading-[1.5] mb-2.5">
          {description}
        </p>
        {pages > 0 && (
          <p className="font-mono text-[11px] text-dim mb-2">
            {pages} pages · PDF + ePub
          </p>
        )}
        {featureList.length > 0 && (
          <ul className="font-mono text-[11px] text-dim space-y-0.5 mb-2.5">
            {featureList.map((f, i) => (
              <li key={i}>
                <span className="text-green">+ </span>
                {f}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-[rgba(255,255,255,0.07)]">
        <span className="font-display text-xl font-bold">
          <span className="text-xs font-normal text-muted mr-0.5">USD</span>$
          {price.toFixed(2)}
        </span>
        {type === "ebook" ? (
          <button
            onClick={handleAdd}
            className={`font-mono text-xs rounded-lg px-3.5 py-1.5 transition-all duration-150 ${
              added
                ? "bg-greendim text-green border border-[rgba(0,255,136,0.3)]"
                : "bg-orangedim text-orange border border-[rgba(255,85,0,0.3)] hover:bg-[rgba(255,85,0,0.24)]"
            }`}
          >
            {added ? "✓ Added" : "Add to Cart"}
          </button>
        ) : (
          <button
            onClick={handleAdd}
            className={`font-mono text-xs rounded-lg px-3.5 py-1.5 transition-all duration-150 ${
              added
                ? "bg-greendim text-green border border-[rgba(0,255,136,0.3)]"
                : "bg-orangedim text-orange border border-[rgba(255,85,0,0.3)] hover:bg-[rgba(255,85,0,0.24)]"
            }`}
          >
            {added ? "✓ Added" : "Add to Cart"}
          </button>
        )}
      </div>
    </div>
  );
}
