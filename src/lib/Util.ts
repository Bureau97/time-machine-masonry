export class Util {
  /**
   * Shuffle an array
   */
  public static shuffleArray(
    array: Array<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  ): Array<any> /* eslint-disable-line @typescript-eslint/no-explicit-any */ {
    return array.sort(() => Math.random() - 0.5);
  }

  public static async asyncForeach(
    array: Array<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    callback: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  public static async reportBrokenImage(
    teeeApiUrl: string,
    src: string | null
  ): Promise<void> {
    console.warn(`Broken image: ${src}`);
    fetch(`${teeeApiUrl}/feedback/image/broken`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: src,
      }),
    });
  }

  public static removeAllChildren(
    parentElement: HTMLElement | undefined
  ): void {
    if (!parentElement) {
      return;
    }
    let childToDelete = parentElement.lastChild;
    while (childToDelete) {
      parentElement.removeChild(childToDelete);
      childToDelete = parentElement.lastChild;
    }
  }
}

export interface IHash {
  [Identifier: string | number]: boolean | number | string | undefined;
}
