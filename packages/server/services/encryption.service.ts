import { injectable } from 'tsyringe';
import sjcl from 'sjcl';

@injectable()
export class EncryptionService {

  /**
   * Hash a string of data into a persistent SHA256 hash
   *
   * @param {string} data
   * @returns {string}
   */
  public static sha256(data: string): string {
    const hashBits = sjcl.hash.sha256.hash(data);
    return sjcl.codec.hex.fromBits(hashBits);
  }

  /**
   * Hash a string of data into random SHA256 Hash
   * @param {string} data
   * @returns {string}
   */
  public static sha256Random(data: string): string {
    return this.sha256(`${data} + ${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`);
  }

}
