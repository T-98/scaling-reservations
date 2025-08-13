import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from './users/models/user.schema';

//whatever is returned by the strategy (ex: a user object with email & pwd) is
//added to the request parameter as an object
const getCurrentUserByContext = (context: ExecutionContext): UserDocument => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return context.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
