import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../users/user.entity';
// Extend the Request interface to include the user property
interface RequestWithUser extends Request {
  user: User;
}

export const CurrentUser = createParamDecorator(
  // The decorator extracts the user from the request object
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
