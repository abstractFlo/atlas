export interface GameResourceInterface {
  /**
   * Name of the resource
   */
  name: string;

  /**
   * Enable if is a game resource
   */
  isGameResource: boolean;

  /**
   * Describe which modules can be convert to default imports
   */
  convert: string[];

  /**
   * Define which modules are externals
   */
  externals: string[]
}
