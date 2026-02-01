import { unzlibSync } from 'fflate';

console.log('COMPRESS WORKER BOOTED');
self.onmessage = (e) => {
  const { data, id } = e.data;

  const decompressed = unzlibSync(data);

  self.postMessage(
    { decompressed, id },
    [decompressed.buffer]
  );
};