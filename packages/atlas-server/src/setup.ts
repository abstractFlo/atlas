import alt from 'alt-server';
import {config} from 'dotenv';
import { registerAltLib } from '@abstractflo/atlas-shared/helpers';

config();
registerAltLib(alt);
