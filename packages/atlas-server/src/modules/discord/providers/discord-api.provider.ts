import { singleton } from 'tsyringe';
import { DiscordConfigService } from '../services/discord-config.service';
import { URLSearchParams } from 'url';
import { DiscordConfigModel } from '../models/discord-config.model';

@singleton()
export class DiscordApiProvider {

  /**
   * Contains the discord config model
   *
   * @type {DiscordConfigModel}
   * @private
   */
  private config: DiscordConfigModel = this.discordConfigService.config;

  constructor(
      private readonly discordConfigService: DiscordConfigService
  ) {}

  /**
   * Return the auth url
   *
   * @param {string} state
   * @returns {string}
   */
  public getAuthUrl(state: string): string {
    const url = this.config.auth_url;
    const params = this.getAuthUrlParams(state);
    return `${url}?${params}`;
  }

  /**
   * Return the auth token params
   *
   * @param {string} code
   * @returns {URLSearchParams}
   */
  public getAuthTokenParams(code: string): URLSearchParams {
    return this.createSearchParams({
      client_id: this.config.client_id,
      client_secret: this.config.client_secret,
      grant_type: 'authorization_code',
      code,
      scope: 'identify',
      redirect_uri: encodeURI(`${this.config.redirect_url}/auth/discord`)
    });
  }


  /**
   * Return the auth url params
   *
   * @param {string} state
   * @return {URLSearchParams}
   * @private
   */
  private getAuthUrlParams(state: string): URLSearchParams {
    return this.createSearchParams({
      prompt: 'none',
      response_type: 'code',
      scope: 'identify',
      client_id: this.config.client_id,
      redirect_uri: encodeURI(`${this.config.redirect_url}/auth/discord`),
      state

    });
  }

  /**
   * Return URLSearchParams
   *
   * @param {{[p: string]: string}} params
   * @return {URLSearchParams}
   * @private
   */
  private createSearchParams(params: { [key: string]: string }): URLSearchParams {
    return new URLSearchParams(params);
  }
}
