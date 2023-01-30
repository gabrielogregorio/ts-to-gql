import { getRecursiveContentInRegion } from '@/handlers/getRecursiveRegion';
import { linesTsToGraphql } from '@/handlers/tsToGraphql';
import { Log } from '@/log/index';

// TODO: REFACTOR
type model = {
  nameModel: string;
  content: string;
};

// FIXME: DUPLICATED searchAndPrepare()
const searchAndPrepare = (code: string): model[] => {
  const searchFirstOccurrence = /[type|interface]\s{1,50}(GqlModel\w{1,500})\s{0,500}=\s{0,500}([^$]*)/;
  let preventInfiniteLoop = 0;
  let indexToStart = 0;

  const items: model[] = [];
  const INDEX_TO_BREAK_LOOP: number = 20;
  while (true) {
    preventInfiniteLoop += 1;
    if (preventInfiniteLoop === INDEX_TO_BREAK_LOOP) {
      Log.warning('possible infinite loop in searchAndPrepare()');
      break;
    }

    const textToAnalyze = code.slice(indexToStart, code.length);
    const results = searchFirstOccurrence.exec(textToAnalyze);
    if (Boolean(results) === false || results === null) {
      break;
    }

    const INDEX_NAME_TYPE: number = 1;
    const INDEX_CONTENT_TYPE: number = 2;

    indexToStart = indexToStart + results.index + results[INDEX_NAME_TYPE].length;

    const content = getRecursiveContentInRegion(results[INDEX_CONTENT_TYPE], {
      startDelimiter: '{',
      endDelimiter: '}',
      skipStrings: true,
    });
    const nameModel = results[1];

    items.push({
      nameModel,
      content: linesTsToGraphql(content || '', [{ from: 'Types.ObjectId', to: 'ID' }]),
    });
  }

  return items;
};

export const searchModels = (code: string): { queries: string; listModelsMapped: string[] } => {
  const items: model[] = searchAndPrepare(code);
  const listModelsMapped: string[] = [];

  const queries = items
    .map((item) => {
      listModelsMapped.push(item.nameModel);

      return `type ${item.nameModel} ${item.content}`;
    })
    .join('\n\n');

  return {
    queries,
    listModelsMapped,
  };
};