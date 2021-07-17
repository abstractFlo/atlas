import { CommandModule } from 'yargs';
import { appendJsonToYaml, errorMessage, successMessage, writeJsonToYaml } from '@abstractflo/atlas-devtools';

export const TestComand: CommandModule = {

  command: 'test',
  describe: 'foooo',

  async handler(): Promise<void> {

    /*try {
      const doc = await readYamlAsJson('docker-compose.yml');
      console.log(doc);
    } catch (err) {
      errorMessage(err.path, err.message)
    }*/

    try {
      const doc = await appendJsonToYaml('test.yml', { bar: 'baz', bra: 'bru' });
      successMessage(doc.path, doc.message);
    } catch (err) {
      errorMessage(err.path, err.message);
    }


    /*const written = {
      version: '3.3',
      services: {
        altv: {}
      }
    }

    console.log(yaml.dump(written));*/
  }
};
