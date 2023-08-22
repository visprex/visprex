export function convertNumberNotation(n: number): string {
    if (n < 1000) {
        return n.toString();
    } else if (n < 1000000) {
        return (n / 1000).toFixed(1) + "K";
    } else if (n < 1000000000) {
        return (n / 1000000).toFixed(1) + "M";
    } else if (n < 1000000000000) {
        return (n / 1000000000).toFixed(1) + "B";
    } else {
        return (n / 1000000000000).toFixed(1) + "T";
    }
}