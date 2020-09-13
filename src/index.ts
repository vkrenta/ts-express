import App from './app';
import logger from './helpers/logger';

const app = new App(8000);

app.listen(({ port, error }) => {
  if (port) logger.info({ label: 'Port', message: port });
  if (error) logger.error(error);
});
