import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data, req) => {
  console.log(req.user, req.user[data]);
  return data ? req.user[data] : req.user;
});
