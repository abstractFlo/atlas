/**
 * Default global error handler
 */
export function defaultErrorHandling(): void {
  process.on('uncaughtException', (err: Error) => {
    console.log(err.stack);
  });
}
