import { container } from 'tsyringe';
import alt from 'alt-client';

// Timers
container.register('alt', { useValue: alt });
