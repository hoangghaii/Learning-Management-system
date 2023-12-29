import pinataSDK from '@pinata/sdk';

export const pinata = new pinataSDK(
  process.env.PINATA_KEY,
  process.env.PINATA_SECRET,
);
