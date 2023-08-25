class ApiResponse {
  status: number;
  success: boolean;
  message: string;
  data: any;

  constructor(
    success: boolean,
    message: string,
    data: any,
    status: number = 200,
  ) {
    this.success = success;

    this.message = message;
    this.data = data;
    this.status = status;
  }

  static success(message: string, data?: any | null, status: number = 200) {
    return new ApiResponse(true, message, data, status);
  }

  static error(message: string, data?: any | null, status: number = 400) {
    return new ApiResponse(false, message, data, status);
  }
}

export default ApiResponse;
