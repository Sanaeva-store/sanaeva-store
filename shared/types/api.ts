export type ApiSuccessResponse<TData> = {
  success: true;
  data: TData;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

export type ApiResponse<TData> = ApiSuccessResponse<TData> | ApiErrorResponse;
