export default function cn(...parts) {
  return parts
    .flat()
    .filter(Boolean)
    .map((p) => String(p).trim())
    .join(" ");
}
