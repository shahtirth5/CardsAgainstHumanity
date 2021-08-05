export const STATUS_REQUEST = "STATUS_REQUEST";
export const STATUS_FAIL = "STATUS_FAIL";
export const STATUS_SUCCESS = "STATUS_SUCCESS";

//--------------------------------------------------------------------
// Helpers (CLIENT AND SERVER)
//--------------------------------------------------------------------
export function request(action) {
    return {...action, status: STATUS_REQUEST};
}

export function fail(action, error) {
    return {...action, status: STATUS_FAIL, error};
}

export function succeed(action) {
    return {...action, status: STATUS_SUCCESS};
}

//--------------------------------------------------------------------
// Views
//--------------------------------------------------------------------
export const MERGE_VIEW = "MERGE_VIEW";
export const mergeView = (view, diff, id = undefined) => ({type: MERGE_VIEW, view, diff, id});
export const setView = (view, data, id = undefined) => mergeView(view, {$set: data}, id);

export const VIEW_APP = "VIEW_APP";
export const VIEW_LOBBY = "VIEW_LOBBY";
export const VIEW_GAME = "VIEW_GAME";
export const VIEW_PLAYER = "VIEW_PLAYER";

//--------------------------------------------------------------------
// Dialogs (CLIENT)
//--------------------------------------------------------------------
export const DIALOG_SET = "DIALOG_SET";
export const dialogSet = (id, isOpen, props = {}) => ({type: DIALOG_SET, id, isOpen, props});

export const DIALOG_LOGIN = "DIALOG_LOGIN";

//--------------------------------------------------------------------
// Login - User Actions (SERVER)
//--------------------------------------------------------------------
export const USER_LOGIN = "USER_LOGIN";
export const userLogin = (name) => ({type: USER_LOGIN, name});

export const USER_DETAILS_SET = "USER_DETAILS_SET";
export const userDetailsSet = (details) => ({type: USER_DETAILS_SET, details});

//--------------------------------------------------------------------
// Lobby Actions (SERVER)
//--------------------------------------------------------------------
export const LOBBY_SEND_MESSAGE = "LOBBY_SEND_MESSAGE";
export const lobbySendMessage = (message) => ({type: LOBBY_SEND_MESSAGE, message});

export const LOBBY_JOIN = "LOBBY_JOIN";
export const lobbyJoin = () => ({type: LOBBY_JOIN});

//--------------------------------------------------------------------
// Game Actions (SERVER)
//--------------------------------------------------------------------
export const GAME_CREATE = "GAME_CREATE";
export const gameCreate = () => ({type: GAME_CREATE});

export const GAME_JOIN = "GAME_JOIN";
export const gameJoin = (gameId) => ({type: GAME_JOIN, gameId});

export const GAME_SET_OPTIONS = "GAME_SET_OPTIONS";
export const gameSetOptions = (gameId, options) => ({type: GAME_SET_OPTIONS, gameId, options});

export const GAME_START = "GAME_START";
export const gameStart = (gameId) => ({type: GAME_START, gameId});

export const GAME_SELECT_CARD = "GAME_SELECT_CARD";
export const gameSelectCard = (gameId, cardId) => ({type: GAME_SELECT_CARD, gameId, cardId});

export const GAME_SELECT_STACK = "GAME_SELECT_STACK";
export const gameSelectStack = (gameId, stackId) => ({type: GAME_SELECT_STACK, gameId, stackId});

export const GAME_SEND_MESSAGE = "GAME_SEND_MESSAGE";
export const gameSendMessage = (gameId, message) => ({type: GAME_SEND_MESSAGE, gameId, message});

//--------------------------------------------------------------------
// GAME CONSTANTS (SERVER)
//--------------------------------------------------------------------
export const STEP_SETUP = "STEP_SETUP";
export const STEP_CHOOSE_WHITES = "STEP_CHOOSE_WHITES";
export const STEP_JUDGE_STACKS = "STEP_JUDGE_STACKS";
export const STEP_WAIT = "STEP_WAIT";
export const STEP_DISPOSED = "STEP_DISPOSED";

export const WAIT_GAME_OVER = "WAIT_GAME_OVER";
export const WAIT_ROUND_OVER = "WAIT_ROUND_OVER";

export const WAIT_REASON_GAME_FINISHED = "WAIT_REASON_GAME_FINISHED";
export const WAIT_REASON_TOO_FEW_PLAYERS = "WAIT_REASON_TOO_FEW_PLAYERS";
export const WAIT_REASON_CZAR_LEFT = "WAIT_REASON_CZAR_LEFT";
export const WAIT_REASON_ROUND_FINISHED = "WAIT_REASON_ROUND_FINISHED";

//--------------------------------------------------------------------
// APP CONNECTION SET (CLIENT)
//--------------------------------------------------------------------
export const CONNECTION_CONNECTED = "CONNECTION_CONNECTED";
export const CONNECTION_CONNECTING = "CONNECTION_CONNECTING";
export const CONNECTION_RECONNECTING = "CONNECTION_RECONNECTING";
export const CONNECTION_DISCONNECTED = "CONNECTION_DISCONNECTED";

export const APP_CONNECTION_SET = "APP_CONNECTION_SET";
export const appConnectionSet = (connection) => ({type: APP_CONNECTION_SET, connection});

export const APP_CONNECTION_RECONNECTED = "APP_CONNECTION_RECONNECT";
export const appConnectionReconnected = () => ({type: APP_CONNECTION_RECONNECTED});