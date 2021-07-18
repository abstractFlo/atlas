import { CommandModule } from 'yargs';
import { fsJetpack, jsonToYaml } from '@abstractflo/atlas-devtools';

export const TestComand: CommandModule = {

  command: 'test',
  describe: 'foooo',

  async handler(): Promise<void> {


    /*try {
      const config = createTempCfg(gameResource);
      console.log(config.serialize());
    } catch (err) {
      errorMessage('Key not found or given type not valid', 'Parse Error');
    }*/


    /*try {
      const doc = await readYamlAsJson('docker-compose.yml');
      console.log(doc);
    } catch (err) {
      errorMessage(err.path, err.message)
    }*/

    /*try {
      const doc = await appendJsonToYaml('test.yml', { bar: 'baz', bra: 'bru' });
      successMessage(doc.path, doc.message);
    } catch (err) {
      errorMessage(err.path, err.message);
    }
*/

    /*const written = {
      version: '3.3',
      services: {
        altv: {}
      }
    }

    console.log(yaml.dump(written));*/
  }
};
