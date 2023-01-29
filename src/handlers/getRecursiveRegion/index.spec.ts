import { getRecursiveContentInRegion } from '@/handlers/getRecursiveRegion';

describe('getRecursiveContentInRegion()', () => {
  it('should get complex json', () => {
    const localMock3 = `
interface IInputUpdatePostPayload {
  updatePostPayload {
    body: string;
    img: string;
    handlePostPayload {
      postId: string;
    };
    id: string;
  };
}} {} // THIS IS TRASH`;

    expect(
      getRecursiveContentInRegion(localMock3, {
        startDelimiter: '{',
        endDelimiter: '}',
        skipStrings: true,
      }),
    ).toEqual(`{
  updatePostPayload {
    body: string;
    img: string;
    handlePostPayload {
      postId: string;
    };
    id: string;
  };
}`);
  });

  it('should get a json with one dept, and strings', () => {
    const localMock2 = `

interface IInputUpdatePostPayload {
  updatePostPayload {
    body: string;
    img: string;
    video: "{ -> )";
    video: '{ -> )';
    video2: \`{ -> )\`;
    id: string;
  };
}

interface IInputHandlePostPayload {
  handlePostPayload {
    postId: string;
  };
}`;

    expect(
      getRecursiveContentInRegion(localMock2, {
        startDelimiter: '{',
        endDelimiter: '}',
        skipStrings: true,
      }),
    ).toEqual(`{
  updatePostPayload {
    body: string;
    img: string;
    video: "{ -> )";
    video: '{ -> )';
    video2: \`{ -> )\`;
    id: string;
  };
}`);
  });

  it('should get a simple object ', () => {
    const localMock = `interface IInputUpdatePostPayload {  id: string;}\n interface IInputHandlePostPayload { handlePostPayload { postId: string; }; }`;

    expect(
      getRecursiveContentInRegion(localMock, {
        startDelimiter: '{',
        endDelimiter: '}',
        skipStrings: true,
      }),
    ).toEqual(`{  id: string;}`);
  });
});
