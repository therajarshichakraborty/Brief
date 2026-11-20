export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }

  static badRequest(message = "Bad request"): HttpError {
    return new HttpError(400, message);
  }

  static unauthorized(message = "Unauthorized"): HttpError {
    return new HttpError(401, message);
  }

  static notFound(message = "Not found"): HttpError {
    return new HttpError(404, message);
  }
}
