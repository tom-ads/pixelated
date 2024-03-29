export enum SocketEvent {
  // Party
  CREATE_PARTY = "CREATE_PARTY",
  JOIN_PARTY = "JOIN_PARTY",
  LEAVE_PARTY = "LEAVE_PARTY",
  USER_JOINED = "USER_JOINED",
  USER_LEFT = "USER_LEFT",
  USER_RECONNECTED = "USER_RECONNECTED",

  // Chat
  SEND_MESSAGE = "SEND_MESSAGE",
  RECEIVE_MESSAGE = "RECEIVE_MESSAGE",

  // Game
  START_GAME = "START_GAME",
  END_GAME = "END_GAME",
  START_TURN = "START_TURN",
  END_TURN = "END_TURN",
  GAME_DATA = "GAME_DATA",
  GAME_TIMER = "GAME_TIMER",
  GAME_DRAWING = "GAME_DRAWING",
}

export default SocketEvent;
