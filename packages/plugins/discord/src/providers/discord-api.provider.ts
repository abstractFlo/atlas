import { Singleton } from '@abstractflo/atlas-shared';

@Singleton
export class DiscordApiProvider {

  /**
   * Discord Auth URL
   *
   * @type {string}
   * @private
   */
  private authUrl: string = 'https://discord.com/api/oauth2/authorize';

  /**
   * Return the auth url
   *
   * @param {string} state
   * @return {string}
   */
  public getAuthUrl(state: string): string {
    const params = this.getAuthUrlParams(state);
    return `${this.authUrl}?${params}`;
  }

  /**
   * Return the auth token params
   *
   * @param {string} code
   * @return {URLSearchParams}
   */
  public getAuthTokenParams(code: string): URLSearchParams {
    return this.createSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: encodeURI(`${process.env.DISCORD_REDIRECT_URI}/auth/discord`)
    });
  }

  /**
   * Return the auth url params
   *
   * @param {string} state
   * @return {URLSearchParams}
   */
  public getAuthUrlParams(state: string): URLSearchParams {
    return this.createSearchParams({
      prompt: 'none',
      response_type: 'code',
      scope: 'identify',
      client_id: process.env.DISCORD_CLIENT_ID,
      redirect_uri: encodeURI(`${process.env.DISCORD_REDIRECT_URI}/auth/discord`),
      state
    });
  }

  /**
   * Transform given params to URLSearchParams
   *
   * @param {{[p: string]: string}} params
   * @return {URLSearchParams}
   * @private
   */
  private createSearchParams(params: { [key: string]: string }): URLSearchParams {
    return new URLSearchParams(params);
  }

}
