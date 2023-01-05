import SocketStatus from "../../api/Enum/SocketStatus";

export function socketResponse(
  type: SocketStatus,
  result: { data?: any; error?: any }
) {
  return {
    type,
    result,
  };
}
