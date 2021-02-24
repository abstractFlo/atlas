import { container, instanceCachingFactory } from 'tsyringe';

export const StringResolver = (target: any) => {
  container.register(target.name, { useFactory: instanceCachingFactory(c => c.resolve(target)) });
  return target;
};
