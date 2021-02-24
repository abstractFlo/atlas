/*export const Cmd = (name?: string): MethodDecorator => {
  return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {

    //const commandName = name || String(propertyKey);
    const original = descriptor.value;

    //const propertiesConfig = Reflect.getMetadata(KEYS.COMMANDS, target) || {};


    descriptor.value = function (...args: any[]) {
      return original.apply(this, args);
    };

    return descriptor;
  };
};*/
