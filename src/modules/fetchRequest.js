/**
 * A versatile and optimized request function with extensive features.
 * @param {Object} options - Configuration object for the request.
 * @param {string} options.url - The URL for the request.
 * @param {string} [options.method="GET"] - HTTP method (GET, POST, PUT, DELETE, etc.).
 * @param {Object} [options.body=null] - Request body (for POST, PUT, etc.).
 * @param {Object} [options.headers={}] - Custom headers for the request.
 * @param {Function} [options.beforeSend] - Hook to run before sending the request.
 * @param {Function} [options.onProgress] - Progress callback for upload/download.
 * @param {Function} [options.onSuccess] - Hook to run on successful response.
 * @param {Function} [options.onError] - Hook to run on error response.
 * @param {Function} [options.onComplete] - Hook to run after the request completes.
 * @param {number} [options.timeout=30000] - Request timeout in milliseconds.
 * @returns {Promise<Object>} - Resolves with the response or rejects with an error.
 */
export async function fetchRequest({
  url,
  method = "GET",
  body = null,
  headers = {},
  beforeSend = () => {},
  onProgress = null,
  onSuccess = () => {},
  onError = () => {},
  onComplete = () => {},
  timeout = 3000,
}) {
  return new Promise((resolve, reject) => {
    // Run beforeSend hook
    try {
      beforeSend();
    } catch (error) {
      console.error("Error in beforeSend:", error);
    }

    // Use XMLHttpRequest for advanced features
    const xhr = new XMLHttpRequest();

    xhr.open(method, url, true);

    // Set custom headers
    for (const key in headers) {
      xhr.setRequestHeader(key, headers[key]);
    }

    // Timeout setup
    xhr.timeout = timeout;

    // Handle progress if callback is provided
    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress({
            type: "upload",
            loaded: event.loaded,
            total: event.total,
            progress: (event.loaded / event.total) * 100,
          });
        }
      };

      xhr.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress({
            type: "download",
            loaded: event.loaded,
            total: event.total,
            progress: (event.loaded / event.total) * 100,
          });
        }
      };
    }

    // Handle response
    xhr.onload = () => {
      const isSuccess = xhr.status >= 200 && xhr.status < 300;
      const response = xhr.responseText;

      try {
        console.log(response)
        const parsedResponse = JSON.parse(response);

        if (isSuccess) {
          onSuccess(parsedResponse);
          resolve(parsedResponse);
        } else {
          const errorData = {
            status: xhr.status,
            message: xhr.statusText,
            response: parsedResponse,
          };
          onError(errorData);
          reject(errorData);
        }
      } catch (error) {
        const parseError = {
          error: "Invalid JSON response",
          details: error.message,
        };
        onError(parseError);
        reject(parseError);
      }
    };

    // Handle errors
    xhr.onerror = () => {
      const networkError = {
        error: "Network Error",
        details: "Failed to connect to the server.",
      };
      onError(networkError);
      reject(networkError);
    };

    xhr.ontimeout = () => {
      const timeoutError = {
        error: "Request Timed Out",
        details: `Timeout after ${timeout}ms.`,
      };
      onError(timeoutError);
      reject(timeoutError);
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        onComplete();
      }
    };

    // Send the request
    try {
      if (body) {
        xhr.send(JSON.stringify(body));
      } else {
        xhr.send();
      }
    } catch (error) {
      const requestError = { error: "Request Failed", details: error.message };
      onError(requestError);
      reject(requestError);
    }
  });
}
