import { EventServiceInterface } from '../interfaces';
import { EventModel } from '../models';
import { singleton } from 'tsyringe';

@singleton()
export class BaseEventService implements EventServiceInterface {


  public getMetaData(key: string): EventModel[] {
    return Reflect.getMetadata(key, this) || [];
  }

}
