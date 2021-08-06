import * as alt from 'alt-server';
import { config } from 'dotenv';
import { app, registerAltLib } from '@abstractflo/atlas-shared';

config();
registerAltLib(app, alt);
