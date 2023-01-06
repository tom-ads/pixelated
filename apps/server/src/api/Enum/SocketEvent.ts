export enum SocketEvent {
  CREATE_PARTY = "CREATE_PARTY",
  JOIN_PARTY = "JOIN_PARTY",
  LEAVE_PARTY = "LEAVE_PARTY",
  USER_JOINED = "USER_JOINED",
  USER_LEFT = "USER_LEFT",
  SEND_MESSAGE = "SEND_MESSAGE",
  RECEIVE_MESSAGE = "RECEIVE_MESSAGE",
}

export default SocketEvent;
