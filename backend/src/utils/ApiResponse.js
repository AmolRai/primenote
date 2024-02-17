class ApiResponse {
  constructor(statusCode, data, message = "suceess") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }
}

export { ApiResponse };
