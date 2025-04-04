const HOST = "127.0.0.1:8000";
const HTTP_HOST = `http://${HOST}`;

export const CHAT_HISTORY_SOCKET_URL = `ws://${HOST}/chat_history_ws`;
export const BOT_STATUS_SOCKET_URL = `ws://${HOST}/bot_status_ws`;
export const USER_NAME_URL = `${HTTP_HOST}/user_name`;
export const BOTS_URL = `${HTTP_HOST}/bots`;
export const CHAT_HISTORY_URL = `${HTTP_HOST}/chat_history`;
