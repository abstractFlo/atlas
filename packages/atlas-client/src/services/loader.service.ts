import { singleton } from 'tsyringe';
import { BaseLoaderService, UtilsService } from '@abstractflo/atlas-shared';

@singleton()
export class LoaderService extends BaseLoaderService {

  protected startLoading() {
    UtilsService.autoClearSetTimeout(() => {
      UtilsService.log('~lg~Start booting => ~w~Please wait...');
      this.startingSubject$.next(true);
      this.startingSubject$.complete();
    }, 125);
  }
}
