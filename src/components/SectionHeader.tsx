/**
 * Numbered section caption in the mono system register: a red slash, the
 * label, and an optional zero-padded count on the far edge. Shared by the
 * homepage indices and the product pages so section rhythm stays identical.
 */
interface SectionHeaderProps {
  label: string;
  count?: number;
  /** Match the horizontal inset of `.index-row` lists (homepage indices). */
  inset?: boolean;
}

export default function SectionHeader({
  label,
  count,
  inset = false,
}: SectionHeaderProps) {
  return (
    <div
      className={`flex items-baseline justify-between ${
        inset ? "pb-4 pl-4 pr-2 md:pl-6 md:pr-3" : "mb-5"
      }`}
    >
      <h2 className="eyebrow-system">
        <span aria-hidden="true" className="text-[var(--color-red)]">
          /
        </span>
        {label}
      </h2>
      {count !== undefined && (
        <span className="eyebrow-system opacity-60">
          {String(count).padStart(2, "0")}
        </span>
      )}
    </div>
  );
}
