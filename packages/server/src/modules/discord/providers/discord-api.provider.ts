import { injectable } from 'tsyringe';
import { DiscordConfigModel } from '@abstractflo/atlas-shared';
import { ConfigService } from '../../../services';
import { URLSearchParams } from 'url';

@injectable()
export class DiscordApiProvider {

  public readonly config: DiscordConfigModel = this.configService.get('discord');

  constructor(
      private readonly configService: ConfigService
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
      redirect_uri: encodeURI(this.config.redirect_url)
    });
  }

  /**
   * Return auth url params
   *
   * @returns {URLSearchParams}
   * @private
   */
  private getAuthUrlParams(state: string): URLSearchParams {
    return this.createSearchParams({
      prompt: 'none',
      response_type: 'code',
      scope: 'identify',
      client_id: this.config.client_id,
      redirect_uri: encodeURI(this.config.redirect_url),
      state
    });
  }


  /**
   * Return URLSearchParams from given params
   *
   * @param params
   * @returns {URLSearchParams}
   * @private
   */
  private createSearchParams(params: { [key: string]: string }): URLSearchParams {
    return new URLSearchParams(params);
  }

}
