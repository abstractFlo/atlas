import { app, BaseEventService, constructor, EventModel, Last, Singleton } from '@abstractflo/atlas-shared';
import { Colshape, emitClient, Entity, offClient, onceClient, onClient, Player } from 'alt-server';

@Singleton
export class EventService extends BaseEventService {
	/**
	 * Receive event from client
	 */
	public onClient(eventName: string, listener: (...args: any[]) => void) {
		onClient(eventName, listener);
	}

	/**
	 * Unsubscribe from client event
	 */
	public offClient(eventName: string, listener: (...args: any[]) => void) {
		offClient(eventName, listener);
	}

	/**
	 * Emit event to one or all players
	 */
	public emitClient(player: Player | null, eventName: string, ...args: any[]) {
		emitClient(player, eventName, ...args);
	}

	/**
	 * Receive once event from client
	 */
	public onceClient(eventName: string, listener: (...args: any[]) => void) {
		onceClient(eventName, listener);
	}


	/**
	 * Override base startEventListeners to fit server needs
	 */
	@Last
	protected async start(): Promise<void> {
		await super.startEventListeners();
		await this.resolveAndLoadEvents(this.colShapeEvents, 'ColShapeEvents', this.startColShapeEvents.bind(this));
	}

	/**
	 * Start the colShape event listener
	 */
	private startColShapeEvents(events: EventModel[]) {
		const eventType = events[0].type;

		this.on(eventType, (colShape: Colshape, entity: Entity) => {
			this.handleColShapeEvents(events, colShape, entity);
		});
	}

	/**
	 * Handle all colShape events
	 */
	private handleColShapeEvents(events: EventModel[], colShape: Colshape, entity: Entity) {
		events.forEach((event: EventModel) => {
			if (colShape.colshapeType !== event.validateOptions.colShapeType) {
				return;
			}

			if (event.validateOptions.name !== undefined && colShape.name !== event.validateOptions.name) {
				return;
			}

			if (
				event.validateOptions.entity !== undefined &&
				!this.isEntityType(entity.type, event.validateOptions.entity)
			) {
				return;
			}

			const instances = app.resolveAll<constructor<any>>(event.targetName);

			instances.forEach(async (instance: constructor<any>) => {
				const instanceMethod = instance[event.methodName];

				if (!instanceMethod) {
					return;
				}

				const method = instanceMethod.bind(instance);
				await method(colShape, entity);
			});
		});
	}
}
