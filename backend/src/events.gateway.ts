import { OnGatewayConnection, WebSocketGateway } from '@nestjs/websockets';
import { Request } from 'express';
import { Server } from '@hocuspocus/server';
import { Logger } from '@hocuspocus/extension-logger';
import { Database } from '@hocuspocus/extension-database';
import { data } from './db';

import { defaultMarkdownParser, defaultMarkdownSerializer } from 'prosemirror-markdown';
import { prosemirrorToYDoc, prosemirrorToYXmlFragment, yDocToProsemirror } from 'y-prosemirror';
import * as Y from 'yjs';
import { getSchema } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

const schema = getSchema([StarterKit]);

const server = Server.configure({
  port: 1234,
  debounce: 1000,
  maxDebounce: 10000,
  extensions: [
    new Logger(),
    new Database({
      fetch: async ({ documentName }) => {
        console.log('fetch documentName', documentName);
        if (data[documentName]) {
          return data[documentName];
        }
        console.log(`document ${documentName} not found, initializing...`);
        const doc = defaultMarkdownParser.parse('# Empty document\n## Write your first document!');
        console.log('parsed doc', doc);
        const ydoc = new Y.Doc();
        prosemirrorToYXmlFragment(doc, ydoc.getXmlFragment('default'));
        console.log('ydoc', ydoc.getXmlFragment('default').toJSON());
        return Y.encodeStateAsUpdate(ydoc);
      },
      store: async ({ state, documentName, document }) => {
        console.log('document', document.getXmlFragment('default').toJSON());
        data[documentName] = state;
        const doc = yDocToProsemirror(schema, document);
        console.log('doc markdown content', defaultMarkdownSerializer.serialize(doc));
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
