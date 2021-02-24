import { container, DependencyContainer } from 'tsyringe';

/**
 * Export a child container from tsyringe
 *
 * @type {DependencyContainer}
 */
export const atlasContainer: DependencyContainer = container.createChildContainer();
