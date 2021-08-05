//--------------------------------------------------------------------
// Helpers
//--------------------------------------------------------------------
const STATUS_REQUEST = "STATUS_REQUEST";
const STATUS_FAIL = "STATUS_FAIL";
const STATUS_SUCCESS = "STATUS_SUCCESS";

function request(action) {
    return {...action, status: STATUS_REQUEST};
}

function fail(action, error) {
    return {...action, status: STATUS_FAIL, error};
}

function succeed(action) {
    return {...action, status: STATUS_SUCCESS};
}

//--------------------------------------------------------------------
// Views
//--------------------------------------------------------------------
const MERGE_VIEW = "MERGE_VIEW";
const mergeView = (view, diff, id = undefined) => ({type: MERGE_VIEW, view, diff, id});
const setView = (view, data, id = undefined) => mergeView(view, {$set: data}, id);

const VIEW_APP = "VIEW_APP";
const VIEW_LOBBY = "VIEW_LOBBY";
const VIEW_GAME = "VIEW_GAME";
const VIEW_PLAYER = "VIEW_PLAYER";

//--------------------------------------------------------------------
// Dialogs (DELETE LATER IF NOT REQUIRED)
//--------------------------------------------------------------------
const DIALOG_SET = "DIALOG_SET";
const dialogSet = (id, isOpen, props = {}) => ({type: DIALOG_SET, id, isOpen, props});

const DIALOG_LOGIN = "DIALOG_LOGIN";

//--------------------------------------------------------------------
// Login
//--------------------------------------------------------------------
const USER_LOGIN = "USER_LOGIN";
const userLogin = (name) => ({type: USER_LOGIN, name});

const USER_DETAILS_SET = "USER_DETAILS_SET";
const userDetailsSet = (details) => ({type: USER_DETAILS_SET, details});


//--------------------------------------------------------------------
// Lobby
//--------------------------------------------------------------------
const LOBBY_SEND_MESSAGE = "LOBBY_SEND_MESSAGE";
const lobbySendMessage = (message) => ({type: LOBBY_SEND_MESSAGE, message});

const LOBBY_JOIN = "LOBBY_JOIN";
const lobbyJoin = () => ({type: LOBBY_JOIN});

//--------------------------------------------------------------------
// Game Setup
//--------------------------------------------------------------------
const GAME_CREATE = "GAME_CREATE";
const gameCreate = () => ({type: GAME_CREATE});

const GAME_JOIN = "GAME_JOIN";
const gameJoin = (gameId) => ({type: GAME_JOIN, gameId});

const GAME_SET_OPTIONS = "GAME_SET_OPTIONS";
const gameSetOptions = (gameId, options) => ({type: GAME_SET_OPTIONS, gameId, options});

const GAME_START = "GAME_START";
const gameStart = (gameId) => ({type: GAME_START, gameId});

const GAME_SELECT_CARD = "GAME_SELECT_CARD";
const gameSelectCard = (gameId, cardId) => ({type: GAME_SELECT_CARD, gameId, cardId});

const GAME_SELECT_STACK = "GAME_SELECT_STACK";
const gameSelectStack = (gameId, stackId) => ({type: GAME_SELECT_STACK, gameId, stackId});

const GAME_SEND_MESSAGE = "GAME_SEND_MESSAGE";
const gameSendMessage = (gameId, message) => ({type: GAME_SELECT_STACK, gameId, message});


//--------------------------------------------------------------------
// Game Constants
//--------------------------------------------------------------------
const STEP_SETUP = "STEP_SETUP";
const STEP_CHOOSE_WHITES = "STEP_CHOOSE_WHITES";
const STEP_JUDGE_STACKS = "STEP_JUDGE_STACKS";
const STEP_WAIT = "STEP_WAIT";
const STEP_DISPOSED = "STEP_DISPOSED";

const WAIT_GAME_OVER = "WAIT_GAME_OVER";
const WAIT_ROUND_OVER = "WAIT_ROUND_OVER";

const WAIT_REASON_GAME_FINISHED = "WAIT_REASON_GAME_FINISHED";
const WAIT_REASON_TOO_FEW_PLAYERS = "WAIT_REASON_TOO_FEW_PLAYERS";
const WAIT_REASON_CZAR_LEFT = "WAIT_REASON_CZAR_LEFT";
const WAIT_REASON_ROUND_FINISHED = "WAIT_REASON_ROUND_FINISHED";

//--------------------------------------------------------------------
// Exclusive to server actions
//--------------------------------------------------------------------
const GAME_DISPOSED = "GAME_DISPOSED";
const gameDisposed = (gameId) => ({type: GAME_DISPOSED, gameId});

const PLAYER_DISPOSED = "PLAYER_DISPOSED";
const playerDisposed = (gameId, playerId) => ({type: PLAYER_DISPOSED, gameId, playerId});

const GAME_SUMMARY_CHANGED = "GAME_SUMMARY_CHANGED";
const gameSummaryChanged = (gameId, summary) => ({type: GAME_SUMMARY_CHANGED, gameId, summary});

module.exports = {

    //
    STATUS_REQUEST,
    STATUS_FAIL,
    STATUS_SUCCESS,
    request,
    fail,
    succeed,

    //
    DIALOG_SET,
    DIALOG_LOGIN,
    dialogSet,

    //
    USER_LOGIN,
    USER_DETAILS_SET,
    userLogin,
    userDetailsSet,

    //
    LOBBY_SEND_MESSAGE,
    lobbySendMessage,
    LOBBY_JOIN,
    lobbyJoin,

    //
    MERGE_VIEW,
    mergeView,
    setView,

    //
    VIEW_APP,
    VIEW_LOBBY,
    VIEW_GAME,
    VIEW_PLAYER,

    //
    GAME_CREATE,
    gameCreate,
    GAME_JOIN,
    gameJoin,
    GAME_SET_OPTIONS,
    gameSetOptions,
    GAME_START,
    gameStart,
    GAME_SELECT_STACK,
    gameSelectStack,
    GAME_SELECT_CARD,
    gameSelectCard,
    GAME_SEND_MESSAGE,
    gameSendMessage,


    //
    STEP_SETUP,
    STEP_CHOOSE_WHITES,
    STEP_JUDGE_STACKS,
    STEP_WAIT,
    STEP_DISPOSED,

    WAIT_GAME_OVER,
    WAIT_ROUND_OVER,

    WAIT_REASON_GAME_FINISHED,
    WAIT_REASON_TOO_FEW_PLAYERS,
    WAIT_REASON_CZAR_LEFT,
    WAIT_REASON_ROUND_FINISHED,


    //
    GAME_DISPOSED,
    gameDisposed,
    PLAYER_DISPOSED,
    playerDisposed,
    GAME_SUMMARY_CHANGED,
    gameSummaryChanged
};