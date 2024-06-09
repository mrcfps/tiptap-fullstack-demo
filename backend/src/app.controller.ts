import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { data, schema } from './db';
import { yXmlFragmentToProseMirrorRootNode } from 'y-prosemirror';
import * as Y from 'yjs';
import { defaultMarkdownSerializer } from 'prosemirror-markdown';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/docList')
  getDocList() {
    return Object.keys(data);
  }

  @Get('/doc/:documentName')
  getDocDetail(@Param('documentName') documentName: string) {
    const state = data[documentName];
    console.log('state', state);
    if (!state) {
      return { data: '' };
    }
    const ydoc = new Y.Doc();
    Y.applyUpdate(ydoc, state);
    const doc = yXmlFragmentToProseMirrorRootNode(ydoc.getXmlFragment('default'), schema);
    return { data: defaultMarkdownSerializer.serialize(doc) };
  }
}
