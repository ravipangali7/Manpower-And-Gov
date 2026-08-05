import { Accessibility } from "lucide-react";

export function AccessibilityButton() {
  return (
    <button
      type="button"
      aria-label="Accessibility options"
      className="fixed bottom-6 left-1/2 z-50 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-gov-blue text-primary-foreground shadow-lg"
    >
      <Accessibility className="h-6 w-6" />
    </button>
  );
}