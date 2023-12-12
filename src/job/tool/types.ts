import type { FunctionDefinition } from 'openai/resources/shared';

export interface Function {
  type: 'function';
  function: FunctionDefinition;
}
