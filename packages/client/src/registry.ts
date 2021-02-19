import { container } from 'tsyringe';
import alt from 'alt-client';

container.register('alt', { useValue: alt });
