export function getClientHost(): string {
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${protocol}://${process.env.CLIENT_HOST}`;
}
