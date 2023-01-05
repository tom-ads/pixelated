import SocketError from "../../api/Enum/SocketError";
import SocketStatus from "../../api/Enum/SocketStatus";

type ErrorResponse = {
  type: SocketError;
  message: string;
};

export function socketResponse(
  type: SocketStatus,
  result: { data?: any; error?: ErrorResponse }
) {
  return {
    type,
    result,
  };
}
