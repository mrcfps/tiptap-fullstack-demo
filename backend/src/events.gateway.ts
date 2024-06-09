import { OnGatewayConnection, WebSocketGateway } from '@nestjs/websockets';
import { Request } from 'express';
import { Server } from '@hocuspocus/server';
import { Logger } from '@hocuspocus/extension-logger';
import { Database } from '@hocuspocus/extension-database';
import * as Y from 'yjs';

const server = Server.configure({
  port: 1234,
  debounce: 1000,
  maxDebounce: 10000,
  extensions: [
    new Logger(),
    new Database({
      fetch: async ({ documentName }) => {
        console.log('fetch documentName', documentName);
        return null;
      },
      store: async ({ state, document }) => {
        console.log('store state', state);
        console.log('doc content', document.getXmlFragment('default').toJSON());
      },
    }),
  ],
});

@WebSocketGateway(1234, {
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection {
  handleConnection(connection: WebSocket, request: Request): void {
    // We can handle authentication of user like below

    // console.log('connection', JSON.stringify(connection, null, 2));

    // const token = getCookie(request?.headers?.cookie, 'auth_token');
    // const ERROR_CODE_WEBSOCKET_AUTH_FAILED = 4000;
    // if (!token) {
    //   connection.close(ERROR_CODE_WEBSOCKET_AUTH_FAILED);
    // } else {
    //   const signedJwt = this.authService.verifyToken(token);
    //   if (!signedJwt) connection.close(ERROR_CODE_WEBSOCKET_AUTH_FAILED);
    //   else {
    //     const docName = getCookie(request?.headers?.cookie, 'roomName');
    //     setupWSConnection(connection, request, { ...(docName && { docName }) });
    //   }
    // }

    server.handleConnection(connection, request, {});
  }
}
