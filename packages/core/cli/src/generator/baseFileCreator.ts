import { dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  convertNameType,
  errorMessage,
  fsJetpack,
  renderTemplateFromPath,
  successMessage
} from '@abstractflo/atlas-devtools';

export default async function(name: string, type: string, fileImports: string, decorator: string) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const converted = convertNameType(name, type);
  const jetpack = fsJetpack().cwd(__dirname).cwd('..');
  const templateStub = jetpack.path('stubs/class.ejs');
  const template = await renderTemplateFromPath(templateStub, {
    fileImports,
    decorator,
    className: converted.className
  });

  const projectJetpack = fsJetpack();

  if (projectJetpack.exists(converted.completePath)) {
    return errorMessage(converted.completePath, 'Error Already Exists');
  }

  projectJetpack.write(converted.completePath, template);
  successMessage(converted.completePath, 'Created');
}
