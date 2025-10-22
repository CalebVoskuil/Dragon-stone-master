// Simple utility function to combine styles
export function cn(...inputs: (string | undefined | null)[]): string {
  return inputs.filter(Boolean).join(' ');
}