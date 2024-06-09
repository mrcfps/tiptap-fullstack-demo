import { OnGatewayConnection, WebSocketGateway } from '@nestjs/websockets';
import { Request } from 'express';
import { Server } from '@hocuspocus/server';
import { Logger } from '@hocuspocus/extension-logger';
import { Database } from '@hocuspocus/extension-database';
import { data, schema } from './db';

import { defaultMarkdownParser, defaultMarkdownSerializer } from 'prosemirror-markdown';
import { prosemirrorToYXmlFragment, yXmlFragmentToProseMirrorRootNode } from 'y-prosemirror';
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
        if (data[documentName]) {
          return data[documentName];
        }
        console.log(`document ${documentName} not found, initializing...`);
        const doc = defaultMarkdownParser.parse('# Empty document\n## Write your first document!');
        const ydoc = new Y.Doc();
        prosemirrorToYXmlFragment(doc, ydoc.getXmlFragment('default'));
        return Y.encodeStateAsUpdate(ydoc);
      },
      store: async ({ state, documentName, document }) => {
        console.log('document', document.getXmlFragment('default').toJSON());
        data[documentName] = state;
        const doc = yXmlFragmentToProseMirrorRootNode(document.getXmlFragment('default'), schema);
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
    server.handleConnection(connection, request, {});
  }
}
