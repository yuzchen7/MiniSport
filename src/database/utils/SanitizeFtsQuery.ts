export function sanitizeFtsQuery(input: string) {
    return input
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .replace(/\s+/g, " ")
        .trim();
}