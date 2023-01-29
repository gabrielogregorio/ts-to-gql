import { getRecursiveContentInRegion } from '@/handlers/getRecursiveRegion';
import { linesTsToGraphql } from '@/handlers/tsToGraphql';

type model = {
  nameModel: string;
  content: string;
};

const searchAndPrepare = (code): model[] => {
  const searchFirstOcurrence = /[type|interface]\s{1,50}(GqlModel\w{1,500})\s{0,500}=\s{0,500}([^$]*)/;
  let count = 0;
  let indexToStart = 0;

  const items: model[] = [];

  while (true) {
    const textToAnalyse = code.slice(indexToStart, code.length);
    const results = searchFirstOcurrence.exec(textToAnalyse);
    if (Boolean(results) === false) {
      break;
    }
    indexToStart = indexToStart + results.index + results[1].length;

    const content = getRecursiveContentInRegion(results[2], {
      startDelimiter: '{',
      endDelimiter: '}',
      skipStrings: true,
    });
    const nameModel = results[1];

    items.push({
      nameModel,
      content: linesTsToGraphql(content, [{ from: 'Types.ObjectId', to: 'ID' }]),
    });

    count += 1;

    if (count === 20) {
      break;
    }
  }

  return items;
};

export const searchModels = (code): { queries: string; listModelsMapped: string[] } => {
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
