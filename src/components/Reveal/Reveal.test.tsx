import { act, render, screen } from "@testing-library/react";
import { Reveal } from ".";

// jsdom has no IntersectionObserver: this fake keeps the callback so a test can fire it.
let fire: (isIntersecting: boolean) => void;
const disconnect = vi.fn();

class FakeIntersectionObserver {
  constructor(callback: (entries: Partial<IntersectionObserverEntry>[]) => void) {
    fire = (isIntersecting) => callback([{ isIntersecting }]);
  }
  observe() {}
  disconnect = disconnect;
}

/** jsdom lays nothing out (every rect is 0): this places the wrapper `top` px from the top. */
function placeAt(top: number) {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ top } as DOMRect);
}

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Reveal", () => {
  it("leaves a group already on screen at load visible", () => {
    placeAt(100);
    render(<Reveal>Content</Reveal>);

    expect(screen.getByText("Content")).not.toHaveAttribute("data-reveal-state");
  });

  it("hides a group below the screen, then shows it once when it scrolls in", () => {
    placeAt(5000);
    render(<Reveal>Content</Reveal>);
    const group = screen.getByText("Content");
    expect(group).toHaveAttribute("data-reveal-state", "pending");

    act(() => fire(false));
    expect(group).toHaveAttribute("data-reveal-state", "pending");

    act(() => fire(true));
    expect(group).toHaveAttribute("data-reveal-state", "shown");
    expect(disconnect).toHaveBeenCalled();
  });

  it("stays visible when the browser has no IntersectionObserver", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    placeAt(5000);
    render(<Reveal>Content</Reveal>);

    expect(screen.getByText("Content")).not.toHaveAttribute("data-reveal-state");
  });

  it("renders the given element and marks its own travel", () => {
    render(
      <ul>
        <Reveal as="li" travel="media">
          Card
        </Reveal>
      </ul>,
    );

    const item = screen.getByRole("listitem");
    expect(item).toHaveTextContent("Card");
    expect(item).toHaveAttribute("data-reveal", "media");
  });
});
