import { Config } from 'cfg-reader';
import { CommandModule } from 'yargs';
import { fsJetpack } from '@abstractflo/atlas-devtools';

export const TestComand: CommandModule = {

  command: 'test',
  describe: 'foooo',

  handler(): void {
    const filePath = fsJetpack().path('retail/server.cfg');
    const config = new Config({
      type: 'js',
      main: 'server.js',
      'client-main': 'client.js',
      clientFiles: []
    });


    console.log(config);

  }
};
