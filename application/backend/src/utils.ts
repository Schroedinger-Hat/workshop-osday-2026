const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
const SLUG_LENGTH = 7;

export function nanoid(): string {
  let slug = "";
  for (let i = 0; i < SLUG_LENGTH; i++) {
    slug += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return slug;
}
