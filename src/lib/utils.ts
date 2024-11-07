import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function generateNewReference(type: string, year: string): Promise<string> {
  // Implementation...
  return `CLEX-${type}${year}-0001`
}