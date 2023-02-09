import { searchContentRegions } from '@/modules/searchTypesInCode/searchContentRegions';
import { typeGql } from '@/modules/types';

type modelPrepareType = {
  nameModel: string;
  content: string;
};

type searchSignaturesResponse = {
  name: string;
  needMapping: string;
  hasMapped: string;
  content: string;
  type: typeGql;
};

export const searchSignatures = (code: string, prefix: string, type: typeGql): searchSignaturesResponse[] => {
  const signatures: modelPrepareType[] = searchContentRegions(code, prefix).map((signatureContent) => ({
    nameModel: signatureContent.name,
    content: signatureContent.content,
  }));

  // TODO: UNIFY LOOPS?
  return signatures.map((signature) => ({
    name: signature.nameModel,
    content: signature.content,
    hasMapped: signature.nameModel,
    needMapping: '',
    type,
  }));
};
