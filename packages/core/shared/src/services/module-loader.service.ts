import { Singleton } from '../decorators/framework-di.decorator';
import { app } from '../di-container';
import { getFrameworkMetaData } from '../decorators/helpers';
import { constructor } from '../interfaces/constructor.interface';
import { LoaderConstant } from '../constants/loader.constant';
import { After } from '../decorators/loader.decorator';

@Singleton
export class ModuleLoaderService {

	@After
	public initialize(): Promise<void> {
		return new Promise((resolve) => {
			this.loadModules();
			this.loadComponents();
			resolve();
		});
	}

	/**
	 * Resolve modules from reflection
	 *
	 * @private
	 */
	private loadModules() {
		const modules = getFrameworkMetaData<constructor<any>[]>(LoaderConstant.MODULE, this);
		this.resolveFromContainer(modules);
	}

	/**
	 * Resolve components from reflection
	 *
	 * @private
	 */
	private loadComponents() {
		const components = getFrameworkMetaData<constructor<any>[]>(LoaderConstant.COMPONENT, this);
		this.resolveFromContainer(components);
	}

	/**
	 * Loop given tokens and resolve each of them from app container
	 *
	 * @param {constructor<any>[]} tokens
	 * @private
	 */
	private resolveFromContainer(tokens: constructor<any>[]): void {
		tokens.forEach((token: constructor<any>) => app.resolve(token));
	}
}
