import { injectable } from 'tsyringe';
import { setEntityAlpha } from 'natives';

@injectable()
export class ClientUtilsService {

  /**
   * Set the alpha for given entity
   *
   * @param {number} entity
   * @param {number} level
   * @param {boolean} skin
   */
  public setEntityAlpha(entity: number, level: number, skin: boolean): void {
    setEntityAlpha(entity, level, skin);
  }

}
