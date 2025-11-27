import { Connection } from 'mongoose';
import { DATABASE_CONNECTION, USER_MODEL } from '../database/constants';
import { UserMongooseSchema } from 'types/schemas/UserSchemas/user.mongoose.schema';

export const userProviders = [
  {
    provide: USER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('user', UserMongooseSchema),
    inject: [DATABASE_CONNECTION],
  },
];
