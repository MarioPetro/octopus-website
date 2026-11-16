// Temporary token preview — replaced by the real homepage in a later step.
const swatches = [
  "bg-primary",
  "bg-secondary",
  "bg-accent",
  "bg-card",
  "bg-stroke",
  "bg-stroke-subtle",
];

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-content flex-col gap-8 px-gutter py-12">
      <h1 className="text-h1">Kitchen</h1>
      <h2 className="text-h2">Heading 2</h2>
      <h3 className="text-h3">Best sellers</h3>
      <p className="text-subtitle text-secondary">Powerful appliances for everyday cooking</p>
      <p className="text-body-lg font-book text-accent">Kitchen</p>
      <p className="text-title font-book text-secondary">
        A 5.7 L air fryer that cooks meals quickly and evenly, with 2200W and dual heaters
      </p>
      <a
        href="#"
        className="inline-flex h-10 w-fit items-center rounded-button bg-button-primary px-4 text-cta text-inverse"
      >
        Learn more
      </a>
      <div className="flex flex-wrap gap-4">
        {swatches.map((swatch) => (
          <div key={swatch} className={`size-16 rounded-card border border-stroke ${swatch}`} title={swatch} />
        ))}
      </div>
    </main>
  );
}
