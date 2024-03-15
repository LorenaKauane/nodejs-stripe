import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve('.env'),
});

import app from './configs/app';

const port = process.env.PORT || 3003;

((): void => {
  app.listen(port, () => {
    console.info('Hello world!');
    console.log(`Server started on port ${port}`);
  });
})();
