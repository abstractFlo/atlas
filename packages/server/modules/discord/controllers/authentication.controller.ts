import { injectable } from 'tsyringe';
import { ClassMiddleware, Controller, Get } from '@overnightjs/core';
import cors from 'cors';
import { DiscordApiService } from '../services/discord-api.service';
import { EventService } from '../../../services';
import { Request, Response } from 'express';
import { filter, mergeMap } from 'rxjs/operators';
import { AccessTokenModel, DiscordUserModel } from '../models';
import { LoggerService } from '@abstractFlo/shared';

@injectable()
@Controller('auth/discord')
@ClassMiddleware([cors()])
export class AuthenticationController {

  constructor(
      private readonly discordApiService: DiscordApiService,
      private readonly eventService: EventService,
      private readonly loggerService: LoggerService
  ) {}


  /**
   * Route to authenticate the user
   *
   * @param {e.Request} req
   * @param {e.Response} res
   * @private
   */
  @Get('')
  private info(req: Request, res: Response) {
    const bearerToken = req.query.code as string;
    const discordToken = req.query.state as string;

    this.discordApiService
        .getToken(bearerToken)
        .pipe(
            filter((model: AccessTokenModel) => !!model.access_token),
            mergeMap((model: AccessTokenModel) =>
                this.discordApiService.getUserData(
                    model.token_type,
                    model.access_token
                )
            ),
            filter((discordUser: DiscordUserModel) => !!discordUser.id && !!discordUser.username)
        )
        .subscribe((discordUser: DiscordUserModel) => {
          this.eventService.emit('discord:user:access:done', discordToken, discordUser);
          res.send('Authentication done, you can now close this window');
        }, (err: Error) => this.loggerService.error(err.message, err.stack));
  }


}
