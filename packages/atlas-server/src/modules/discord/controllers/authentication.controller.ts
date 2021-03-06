import { ClassMiddleware, Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { filter, mergeMap } from 'rxjs/operators';
import { FrameworkEvent, LoggerService } from '@abstractflo/atlas-shared';
import { AccessTokenModel } from '../models/access-token.model';
import { DiscordApiService } from '../services/discord-api.service';
import { EventService } from '../../../services/event.service';
import { injectable } from 'tsyringe';
import cors from 'cors';
import { DiscordUserModel } from '../models/discord-user.model';

@injectable()
@Controller('auth')
@ClassMiddleware([cors()])
export class AuthenticationController {

  constructor(
      private readonly discordApiService: DiscordApiService,
      private readonly eventService: EventService,
      private readonly loggerService: LoggerService
  ) {}

  /**
   * Show up the authentication done message
   *
   * @param {e.Request} req
   * @param {e.Response} res
   */
  @Get('done')
  public done(req: Request, res: Response): void {
    res.send('Authentication done, you can now close this window').end();
  }

  /**
   * Route to authenticate the user
   *
   * @param {e.Request} req
   * @param {e.Response} res
   * @private
   */
  @Get('discord')
  private info(req: Request, res: Response): void {
    const bearerToken = req.query.code as string;
    const discordToken = req.query.state as string;

    if (!bearerToken || !discordToken) {
      return res.redirect('done');
    }

    this.discordApiService
        .getToken(bearerToken)
        .pipe(
            filter((model: AccessTokenModel) => !!model.access_token),
            mergeMap((model: AccessTokenModel) => this.discordApiService.getUserData(
                model.token_type,
                model.access_token
            )),
            filter((discordUser: DiscordUserModel) => !!discordUser.id && !!discordUser.username)
        )
        .subscribe((discordUser: DiscordUserModel) => {
          this.eventService.emit(FrameworkEvent.Discord.AuthDone, discordToken, discordUser);
          res.redirect('done');
        }, (err: Error) => this.loggerService.error(err.message, err.stack));
  }

}
