import { injectable } from 'tsyringe';
import { DiscordApiProvider } from '../providers/discord-api.provider';
import { from, Observable } from 'rxjs';
import { AccessTokenModel, DiscordUserModel } from '@abstractFlo/shared';
import axios, { AxiosResponse } from 'axios';
import { map } from 'rxjs/operators';

@injectable()
export class DiscordApiService {

  constructor(
      private readonly discordApiProvider: DiscordApiProvider
  ) {}

  /**
   * Return the token as observable
   *
   * @param {string} code
   * @returns {Observable<AccessTokenModel>}
   */
  public getToken(code: string): Observable<AccessTokenModel> {

    return from(axios.post(
        this.discordApiProvider.config.auth_token_url,
        this.discordApiProvider.getAuthTokenParams(code),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
    )).pipe(
        map((response: AxiosResponse<any>) => new AccessTokenModel().cast(response.data))
    );

  }

  /**
   * Return discord user data
   *
   * @param {string} tokenType
   * @param {string} accessToken
   * @returns {Observable<DiscordUserModel>}
   */
  public getUserData(tokenType: string, accessToken: string): Observable<DiscordUserModel> {
    return from(axios.get(
        this.discordApiProvider.config.user_me_url,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `${tokenType} ${accessToken}`
          }
        }
    )).pipe(
        map((response: AxiosResponse<any>) => new DiscordUserModel().cast(response.data))
    );

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
