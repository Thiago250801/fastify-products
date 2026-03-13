export class NotFoundError extends Error {
  constructor(message = "Recurso não encontrado") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Ação proibida") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class AuthenticationError extends Error {
  constructor(message = "Não autorizado") {
    super(message);
    this.name = "AuthenticationError";
  }
}
