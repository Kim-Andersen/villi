import { CacheContainer } from 'node-ts-cache';
import { MemoryStorage } from 'node-ts-cache-storage-memory';

export default function createCache(): CacheContainer {
  return new CacheContainer(new MemoryStorage());
}
