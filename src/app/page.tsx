import { Button, type ButtonColor } from "@/components/Button";
import { ChevronIcon } from "@/components/icons";

// Temporary component preview — replaced by the real homepage in a later step.
const COLORS: ButtonColor[] = ["primary", "secondary", "ghost-light", "ghost-dark"];

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-content flex-col gap-6 px-gutter py-12">
      <h1 className="text-h3">Buttons</h1>
      {COLORS.map((color) => (
        <div
          key={color}
          className={`flex flex-wrap items-center gap-4 rounded-card p-4 ${color === "ghost-dark" ? "bg-footer" : ""}`}
        >
          <span className={`w-28 text-label ${color === "ghost-dark" ? "text-inverse" : ""}`}>{color}</span>
          <Button color={color} href="#">
            Learn more
          </Button>
          <Button color={color} disabled>
            Disabled
          </Button>
          <Button color={color} variant="icon" icon={<ChevronIcon />} aria-label="Next slide" />
          <Button
            color={color}
            variant="icon"
            icon={<ChevronIcon direction="left" />}
            aria-label="Previous slide"
            disabled
          />
        </div>
      ))}
    </main>
  );
}
