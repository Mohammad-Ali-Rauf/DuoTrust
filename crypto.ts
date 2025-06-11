import { generateKeyPairSync, sign, verify } from "crypto";

export function generateKeyPair() {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519", {
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
  return { publicKey, privateKey };
}

export function signMessage(message: string, privateKey: string): string {
  return sign(null, Buffer.from(message), {
    key: privateKey,
    format: "pem",
    type: "pkcs8",
  }).toString("hex");
}

export function verifySignature(message: string, signature: string, publicKey: string): boolean {
  return verify(
    null,
    Buffer.from(message),
    {
      key: publicKey,
      format: "pem",
      type: "spki",
    },
    Buffer.from(signature, "hex")
  );
}