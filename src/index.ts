import { searchModels } from '@/handlers/searchModels';
import { searchQueries } from '@/handlers/searchQueries';
import { mapFiles } from '@/helpers/mapFiles';
import { searchTypeOrInterfaceAndGetContent, textMountedSearchTypes } from '@/helpers/searchTyieInterfacenDgetContent';
import fsPromise from 'fs';

const getActualMoment = (): string => new Date().toLocaleString('en-US', { timeStyle: 'long' });

export const generateGraphqlSchema = (): string => {
  const graphqlSchema: string = 'schema.ts_to_gql.graphql';
  // console.log(`[TS-TO-GQL] ${getActualMoment()} - Not add ${graphqlSchema} in gitignore`);

  const items: string[] = mapFiles('.');
  const allProject = items.map((item) => fsPromise.readFileSync(item, { encoding: 'utf-8' })).join('\n');

  const models = searchModels(allProject);
  const queries = searchQueries(allProject, 'Query');
  const mutation = searchQueries(allProject, 'Mutation');

  const notAnalysed = [];
  queries.keys.forEach((item) => {
    if (models.finishKeys.includes(item) === false && notAnalysed.includes(item) === false) {
      notAnalysed.push(item);
    }
  });

  mutation.keys.forEach((item) => {
    if (models.finishKeys.includes(item) === false && notAnalysed.includes(item) === false) {
      notAnalysed.push(item);
    }
  });

  const lastModels = textMountedSearchTypes(searchTypeOrInterfaceAndGetContent(notAnalysed, allProject));

  return `${models.queries}
  ${queries.values}
  ${mutation.values}
  ${lastModels}`;
  //   try {
  //     fsPromise.writeFileSync(
  //       graphqlSchema,
  //       `
  // ${models.queries}
  // ${queries.values}
  // ${mutation.values}
  // ${lastModels}`,
  //     );
  //   } catch (error: unknown) {
  //     console.log(`[TS-TO-GQL] ${getActualMoment()} - Error on save ${graphqlSchema}, please, check permissions`);
  //   }
};
