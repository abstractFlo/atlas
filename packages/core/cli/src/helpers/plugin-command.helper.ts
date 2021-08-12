import { createProgressBar, env, formatBytes, fsJetpack, FSJetpack } from '@abstractflo/atlas-devtools';
import tar from 'tar';
import axios from 'axios';
import { green, yellow } from 'colorette';

export const axiosNoCacheOptions = {
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
};

/**
 * Extract the downloaded branch
 *
 * @param {string} pluginName
 * @param {string} extractTo
 * @param {FSJetpack} tmpDir
 * @return {Promise<string | void>}
 */
export async function extractBranch(pluginName: string, extractTo: string, tmpDir: FSJetpack): Promise<string | void> {
  const extractionDirPath = `${env<string>('ATLAS_PLUGIN_FOLDER', 'plugins')}/${extractTo}`;

  fsJetpack().remove(extractionDirPath);

  const extractionDir = fsJetpack().dir(extractionDirPath);
  const writeStream = tmpDir.createReadStream(pluginName)
      .pipe(
          tar.x({
            strip: 1,
            C: extractionDir.cwd()
          })
      );

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      tmpDir.remove();
      resolve();
    });

    writeStream.on('error', () => {
      tmpDir.remove();
      reject();
    });
  });
}

/**
 * Download the branch
 *
 * @param {string} url
 * @param pluginName
 * @param downloadRef
 * @param tmpDir
 * @return {Promise<FSJetpack|void>}
 */
export async function downloadBranch(url: string, pluginName: string, downloadRef: string, tmpDir: FSJetpack): Promise<FSJetpack | void> {
  const writer = tmpDir.createWriteStream(pluginName);

  const { data, headers } = await axios.get(url, {
    responseType: 'stream',
    headers: axiosNoCacheOptions.headers
  });

  const totalLength = headers['content-length'] || 0;

  const progressBar = createProgressBar(
      '-> downloading [:bar] :percent :etas',
      {
        total: parseInt(totalLength)
      },
      `Starting download ${green(downloadRef)} [${yellow(formatBytes(totalLength))}]`
  );

  data.on('data', (chunk) => progressBar.tick(chunk.length));
  data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(tmpDir));
    writer.on('error', reject);
  });

}

/**
 * Return the default branch for current repository
 *
 * @param {string} url
 * @return {Promise<string>}
 */
export async function getDefaultBranch(url: string): Promise<string> {
  const response = await axios.get(url, axiosNoCacheOptions);
  return response.data.default_branch;
}
