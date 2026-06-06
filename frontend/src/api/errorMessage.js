export function getApiErrorMessage(error, fallbackMessage) {
  const responseData = error.response?.data;

  if (responseData?.errors && typeof responseData.errors === "object") {
    return Object.values(responseData.errors).join(" ");
  }

  if (responseData?.message) {
    return responseData.message;
  }

  if (error.code === "ECONNABORTED") {
    return "The request took too long. Please try again.";
  }

  if (!error.response) {
    return "Cannot connect to the backend. Make sure Spring Boot is running.";
  }

  return fallbackMessage;
}
