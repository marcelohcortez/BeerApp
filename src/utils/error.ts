import axios from "axios";
import { errorLogger } from "./logger";

const handle = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      errorLogger.error(
        `Server returned an error with status code: ${error.response.status}`
      );
    } else if (error.request) {
      errorLogger.error("No response from the server");
    } else {
      errorLogger.error("Axios library internal error");
    }
  } else {
    errorLogger.error("Internal code error, we did something wrong");
  }
};

export default handle;
