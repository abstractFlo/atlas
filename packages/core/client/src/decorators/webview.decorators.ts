import { app, constructor, getFrameworkMetaData, registerDescriptor } from '@abstractflo/atlas-shared';
import { WebviewService } from '../services/webview.service';
import { OnGuiModel } from '../models/on-gui.model';
import { WebviewOnEvent } from '../helpers';


/**
 * Register event listener for gui events
 *
 * @param {string} identifier
 * @param {string} name
 * @return {MethodDecorator}
 * @constructor
 */
export function OnGui(identifier: string, name?: string): MethodDecorator {

  return (target: constructor<any>, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    const eventName = name || propertyKey;
    const webviewService = app.resolve(WebviewService);

    const events = getFrameworkMetaData<OnGuiModel[]>(WebviewOnEvent, webviewService);

    const event = new OnGuiModel().cast({
      eventName,
      targetName: target.constructor.name,
      methodName: propertyKey,
      identifier
    });

    events.push(event);
    Reflect.defineMetadata<OnGuiModel[]>(WebviewOnEvent, events, webviewService);

    return registerDescriptor(descriptor);
  };

}
