export type SocketMessage =
    | {
          type: "chat";
          response: ChatResponse;
      }
    | {
          type: "active_bot_status";
          name: string;
      };

export type ChatResponse =
    | {
          ok: true;
          sender: string;
          message: string;
      }
    | {
          ok: false;
          message: string;
      };
