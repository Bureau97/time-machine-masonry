// The MIT License (MIT)
// Copyright © 2018 Andreas Mehlsen andmehlsen@gmail.com
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE

export const DEFAULT_MAX_COL_WIDTH = 500;
export const DEFAULT_COLS = "auto";
export const DEFAULT_DEBOUNCE_MS = 300;
export const DEFAULT_GAP_PX = 24;

export const COL_COUNT_CSS_VAR_NAME = `--_masonry-layout-col-count`;
export const GAP_CSS_VAR_NAME = `--_masonry-layout-gap`;

// https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
export const ELEMENT_NODE_TYPE = 1;

export type ColHeightMap = number[];
export type MasonryCols = number | "auto";

const DEBOUNCE_MAP: Map<string, number> = new Map();

/**
 * Returns a number attribute from an element.
 * @param $elem
 * @param name
 * @param defaultValue
 */
export function getNumberAttribute<T>($elem: HTMLElement, name: string, defaultValue: T): number | T {
    const value = parseFloat($elem.getAttribute(name) || "");
    return isNaN(value) ? defaultValue : value;
}


/**
 * Returns the amount of cols that the masonry grid should have.
 * @param totalWidth
 * @param cols
 * @param maxColWidth
 */
export function getColCount(totalWidth: number, cols: MasonryCols, maxColWidth: number): number {
    return isNaN(cols as number)
        ? Math.max(1, Math.ceil(totalWidth / maxColWidth))
        : cols as number;
}

/**
 * Debounces a function.
 * @param cb
 * @param ms
 * @param id
 */
export function debounce(cb: (() => void), ms: number, id: string) {
    const existingTimeout = DEBOUNCE_MAP.get(id);
    if (existingTimeout != null) window.clearTimeout(existingTimeout);
    DEBOUNCE_MAP.set(id, window.setTimeout(cb, ms));
}

/**
 * Returns the index of the column with the smallest height.
 * @param colHeights
 */
export function findSmallestColIndex(colHeights: ColHeightMap) {
    let smallestIndex = 0;
    let smallestHeight = Infinity;
    colHeights.forEach((height, i) => {
        if (height < smallestHeight) {
            smallestHeight = height;
            smallestIndex = i;
        }
    });

    return smallestIndex;
}