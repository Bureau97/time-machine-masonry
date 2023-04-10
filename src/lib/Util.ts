
export class Util {
    /**
     * Shuffle an array
    */
    public static shuffleArray(array: Array<any>): Array<any> {
        return array.sort(() => Math.random() - 0.5);
    }

    public static async asyncForeach(array: Array<any>, callback: any) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }
}