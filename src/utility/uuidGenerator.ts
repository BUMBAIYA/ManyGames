export function s4(): string {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString()
    .substring(1);
}

export function uuid4(): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const timestamp = Date.now().toString();
  const seed = timestamp + Math.random().toString();
  let id = "";
  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters.charAt(randomIndex);
  }
  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * seed.length);
    id += seed.charAt(randomIndex);
  }
  return id;
}
