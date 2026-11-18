import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";

export type PlaceholderPageProps = {
  title: string;
};

/** Stands in for the pages outside the demo, as the brief allows. */
export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <main className="py-section">
      <Container>
        <div className="mx-auto flex max-w-[550px] flex-col items-center gap-8 text-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-h2">{title}</h1>
            <p className="text-subtitle font-book text-secondary">This page is not part of the demo.</p>
          </div>
          <Button href="/">Back to the homepage</Button>
        </div>
      </Container>
    </main>
  );
}

export function placeholderMetadata(title: string): Metadata {
  return { title, robots: { index: false } };
}
