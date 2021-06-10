import { singleton } from 'tsyringe';
import { from, Observable } from 'rxjs';
import axios, { AxiosResponse } from 'axios';
import { DiscordConfigService } from './discord-config.service';
import { DiscordConfigModel } from '../models/discord-config.model';
import { DiscordApiProvider } from '../providers/discord-api.provider';
import { map } from 'rxjs/operators';
import { AccessTokenModel } from '../models/access-token.model';
import { DiscordUserModel } from '../models/discord-user.model';

@singleton()
export class DiscordApiService {
  /**
   * Contains the discord config
   *
   * @type {DiscordConfigModel}
   * @private
   */
  private readonly config: DiscordConfigModel;

  public constructor(
    private readonly discordConfigService: DiscordConfigService,
    private readonly discordApiProvider: DiscordApiProvider
  ) {
    this.config = this.discordConfigService.config;
  }

  /**
   * Return the AccessTokenModel as observable
   *
   * @param {string} code
   * @returns {Observable<AccessTokenModel>}
   */
  public getToken(code: string): Observable<AccessTokenModel> {
    return from(
      axios.post(this.config.auth_token_url, this.discordApiProvider.getAuthTokenParams(code), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
    ).pipe(map((response: AxiosResponse<any>) => new AccessTokenModel().cast(response.data)));
  }

  /**
   * Return discord user data
   *
   * @param {string} tokenType
   * @param {string} accessToken
   * @returns {Observable<DiscordUserModel>}
   */
  public getUserData(tokenType: string, accessToken: string): Observable<DiscordUserModel> {
    return from(
      axios.get(this.config.user_me_url, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `${tokenType} ${accessToken}`
        }
      })
    ).pipe(map((response: AxiosResponse<any>) => new DiscordUserModel().cast(response.data)));
  }

  /**
   * Return the auth url
   *
   * @param {string} token
   * @returns {string}
   */
  public getAuthUrl(token: string): string {
    return this.discordApiProvider.getAuthUrl(token);
  }
}
