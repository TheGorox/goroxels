export async function sha256Hex(buffer) {
  const buf = buffer.buffer ?? buffer;

  const hashBuffer = await crypto.subtle.digest('SHA-256', buf);
  const hashArray = new Uint8Array(hashBuffer);

  return [...hashArray]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

