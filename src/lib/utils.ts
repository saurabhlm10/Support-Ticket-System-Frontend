import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

export function cn(...inputs: string[]) {
    return twMerge(clsx(inputs));
}