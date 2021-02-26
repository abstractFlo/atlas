import { EventServiceInterface } from '../interfaces';
import { EventModel } from '../models';
import { singleton } from 'tsyringe';
import { Autoload } from '../decorators/';
import { AutoloaderConstants } from '../constants';
import { UtilsService } from './utils.service';

@Autoload(AutoloaderConstants.BEFORE_BOOT)
@singleton()
export class BaseEventService implements EventServiceInterface {


  public getMetaData(key: string): EventModel[] {
    return Reflect.getMetadata(key, this) || [];
  }


  public autoStart(done: CallableFunction): void {
    UtilsService.logLoaded('EventService');
    done();
  }

}
