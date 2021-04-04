export abstract class HandlerError extends Error {
  code: number = 500
}

export class NotFoundError extends HandlerError {
  code = 404
}

export class UnauthorizedError extends HandlerError {
  code = 401
}

export class NotImplemented extends HandlerError {
  code = 501
}
