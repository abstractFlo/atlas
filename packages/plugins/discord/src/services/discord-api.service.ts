import { Singleton } from '@abstractflo/atlas-shared';
import { DiscordApiProvider } from '../providers/discord-api.provider';
import axios, { AxiosResponse } from 'axios';
import { from, map, Observable } from 'rxjs';
import { AccessTokenModel } from '../models/access-token.model';
import { DiscordUserModel } from '../models/discord-user.model';

@Singleton
export class DiscordApiService {

  /**
   * Contains the auth token url
   *
   * @type {string}
   * @private
   */
  private authTokenUrl: string = 'https://discord.com/api/oauth2/token';

  /**
   * Contains the userMe url
   *
   * @type {string}
   * @private
   */
  private userMeUrl: string = 'https://discord.com/api/users/@me';

  constructor(
      private readonly discordApiProvider: DiscordApiProvider
  ) {}

  /**
   * Return the token access response
   *
   * @param {string} code
   * @return {Observable<AccessTokenModel>}
   */
  public getToken(code: string): Observable<AccessTokenModel> {
    return from(axios.post(
        this.authTokenUrl,
        this.discordApiProvider.getAuthTokenParams(code),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
    )).pipe(
        map((response: AxiosResponse<any>) => new AccessTokenModel().cast(response.data))
    );
  }

  /**
   * Return the discord user data
   *
   * @param {string} tokenType
   * @param {string} accessToken
   * @return {Observable<DiscordUserModel>}
   */
  public getUserData(tokenType: string, accessToken: string): Observable<DiscordUserModel> {
    return from(axios.get(
        this.userMeUrl,
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

}
