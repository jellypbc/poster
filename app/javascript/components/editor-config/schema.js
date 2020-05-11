import { Schema } from 'prosemirror-model'

import nodes from './nodes'
import { marks, titleMarks } from './marks'

export const schema = new Schema({ nodes, marks })
export const titleSchema = new Schema({ nodes, titleMarks })
