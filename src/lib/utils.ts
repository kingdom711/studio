import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from 'date-fns';
import type { Timestamp } from 'firebase/firestore';

/**
 * Merges Tailwind CSS classes with clsx logic.
 * @param inputs - Variable number of class strings or objects.
 * @returns A single merged class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a Firestore Timestamp into a readable string (e.g., "Apr 29, 2023").
 * Handles null/undefined inputs gracefully.
 * 
 * @param timestamp - The Firestore Timestamp object.
 * @returns Formatted date string or 'N/A'.
 */
export function formatDate(timestamp: Timestamp | null | undefined) {
  if (!timestamp) return 'N/A';
  return format(timestamp.toDate(), 'PPP');
}
