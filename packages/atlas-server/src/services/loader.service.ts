import { container, singleton } from 'tsyringe';
import { BaseLoaderService, UtilsService } from '@abstractflo/atlas-shared';
import { DatabaseService } from './database.service';

@singleton()
export class LoaderService extends BaseLoaderService {

  protected async startLoading() {
    const dbService = container.resolve(DatabaseService);

    try {
      dbService.setupReflectionEntities();
      await dbService.connect();
    } catch (e) {}

    UtilsService.autoClearSetTimeout(() => {
      UtilsService.log('~lg~Start booting => ~w~Please wait...');
      this.startingSubject$.next(true);
      this.startingSubject$.complete();
    }, 125);
  }
}
