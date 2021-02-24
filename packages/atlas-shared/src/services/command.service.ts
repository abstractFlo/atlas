import { singleton } from 'tsyringe';

@singleton()
export class CommandService {


  test(): void {
    //const properties = Reflect.getMetadata(KEYS.COMMANDS, CommandService);
    console.log('FICKEN?');
  }


}
