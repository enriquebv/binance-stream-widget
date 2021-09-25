export function base64ToString(string) {
  return Buffer.from(string, "base64").toString("utf-8");
}

export function stringToBase64(string) {
  return Buffer.from(string, "utf-8").toString("base64");
}
