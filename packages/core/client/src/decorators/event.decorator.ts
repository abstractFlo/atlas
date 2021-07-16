import { Internal, registerDescriptor, setEventServiceReflectMetaData } from '@abstractflo/atlas-shared';
import { BaseObjectType } from 'alt-client';

/**
 * Register @OnServer decorator
 *
 * @param {string} name
 * @return {MethodDecorator}
 * @constructor
 */
export const OnServer = (name?: string): MethodDecorator => {
	return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
		const eventName = name || propertyKey;

		setEventServiceReflectMetaData(Internal.Events_On_Server, {
			type: 'onServer',
			eventName,
			methodName: propertyKey,
			targetName: target.constructor.name,
			validateOptions: {
				name: eventName
			}
		});

		return registerDescriptor(descriptor);
	};
};

/**
 * Register @OnceServer decorator
 *
 * @param {string} name
 * @return {MethodDecorator}
 * @constructor
 */
export const OnceServer = (name?: string): MethodDecorator => {
	return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
		const eventName = name || propertyKey;

		setEventServiceReflectMetaData(Internal.Events_Once_Server, {
			type: 'onceServer',
			eventName,
			methodName: propertyKey,
			targetName: target.constructor.name,
			validateOptions: {
				name: eventName
			}
		});

		return registerDescriptor(descriptor);
	};
};

/**
 * Register @OnGui decorator
 *
 * @param {string} name
 * @return {MethodDecorator}
 * @constructor
 */
export const OnGui = (name?: string): MethodDecorator => {
	return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
		const eventName = name || propertyKey;

		setEventServiceReflectMetaData(Internal.Events_On_Gui, {
			type: 'onGui',
			eventName,
			methodName: propertyKey,
			targetName: target.constructor.name,
			validateOptions: {
				name: eventName
			}
		});

		return registerDescriptor(descriptor);
	};
};

/**
 * Register @GameEntityCreate decorator
 *
 * @param {BaseObjectType} entityType
 * @return {MethodDecorator}
 * @constructor
 */
export const GameEntityCreate = (entityType: BaseObjectType): MethodDecorator => {
	return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
		setEventServiceReflectMetaData(Internal.Events_Game_Entity_Create, {
			type: 'gameEntityCreate',
			methodName: propertyKey,
			targetName: target.constructor.name,
			validateOptions: {
				entity: entityType
			}
		});

		return registerDescriptor(descriptor);
	};
};

/**
 * Register @GameEntityDestroy decorator
 *
 * @param {BaseObjectType} entityType
 * @return {MethodDecorator}
 * @constructor
 */
export const GameEntityDestroy = (entityType: BaseObjectType): MethodDecorator => {
	return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
		setEventServiceReflectMetaData(Internal.Events_Game_Entity_Destroy, {
			type: 'gameEntityDestroy',
			methodName: propertyKey,
			targetName: target.constructor.name,
			validateOptions: {
				entity: entityType
			}
		});

		return registerDescriptor(descriptor);
	};
};

/**
 * Register @StreamSyncedMetaChange decorator
 *
 * @param {BaseObjectType} entityType
 * @param {string} metaKey
 * @return {MethodDecorator}
 * @constructor
 */
export const StreamSyncedMetaChange = (entityType: BaseObjectType, metaKey?: string): MethodDecorator => {
	return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
		setEventServiceReflectMetaData(Internal.Events_Stream_Synced_Meta_Change, {
			type: 'streamSyncedMetaChange',
			methodName: propertyKey,
			targetName: target.constructor.name,
			validateOptions: {
				entity: entityType,
				metaKey
			}
		});

		return registerDescriptor(descriptor);
	};
};

/**
 * Register @SyncedMetaChange decorator
 *
 * @param {BaseObjectType} entityType
 * @param {string} metaKey
 * @return {MethodDecorator}
 * @constructor
 */
export const SyncedMetaChange = (entityType: BaseObjectType, metaKey?: string): MethodDecorator => {
	return (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor | void => {
		setEventServiceReflectMetaData(Internal.Events_Synced_Meta_Change, {
			type: 'syncedMetaChange',
			methodName: propertyKey,
			targetName: target.constructor.name,
			validateOptions: {
				entity: entityType,
				metaKey
			}
		});

		return registerDescriptor(descriptor);
	};
};
