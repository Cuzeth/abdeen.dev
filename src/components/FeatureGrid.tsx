/**
 * Numbered feature grid used by the product pages (Frost, Hush): the divided
 * `.feature-grid` panel with an index number, label, and detail per cell.
 */
interface FeatureGridProps {
  items: { label: string; detail: string }[];
}

export default function FeatureGrid({ items }: FeatureGridProps) {
  return (
    <div className="feature-grid sm:grid-cols-2 lg:grid-cols-3">
      {items.map((f, i) => (
        <div key={f.label} className="feature-cell">
          <span aria-hidden="true" className="index-num">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="text-base font-semibold tracking-[-0.02em] text-[var(--color-paper)]">
              {f.label}
            </h3>
            <p className="mt-1.5 text-sm leading-7 text-[var(--text)]">
              {f.detail}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
