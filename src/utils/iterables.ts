/** @file Operations on iterables. */

import {range} from "@liqvid/utils/misc"
import {$zip} from "./js";

// from _Future__ import annotations

// _All__ = [
//     "removeListRedundancies",
//     "listUpdate",
//     "listDifferenceUpdate",
//     "allElementsAreInstances",
//     "adjacentNTuples",
//     "adjacentPairs",
//     "tuplify",
//     "stretchArrayToLength",
//     "makeEven",
//     "makeEvenByCycling",
//     "removeNones",
//     "concatenateLists",
//     "listify",
// ]


// import itertools as it

// resizeArray(nparray, length) {
//     if len(nparray) == length:
//         return nparray
//     return np.resize(nparray, (length, *nparray.shape[1:]))


// resizePreservingOrder(nparray, length) {
//     if len(nparray) == 0:
//         return np.zeros((length, *nparray.shape[1:]))
//     if len(nparray) == length:
//         return nparray
//     indices = np.arange(length) * len(nparray) // length
//     return nparray[indices]


// resizeWithInterpolation(nparray, length) {
//     if len(nparray) == length:
//         return nparray
//     contIndices = np.linspace(0, len(nparray) - 1, length)
//     return np.array(
//         [
//             (1 - a) * nparray[lh] + a * nparray[rh]
//             for ci in contIndices
//             for lh, rh, a in [(int(ci), int(np.ceil(ci)), ci % 1)]
//         ],
//     )


// removeListRedundancies(lst) {
//     """
//     Used instead of list(set(l)) to maintain order
//     Keeps the last occurrence of each element
//     """
//     reversedResult = []
//     used = set()
//     for x in reversed(lst) {
//         if x not in used:
//             reversedResult.append(x)
//             used.add(x)
//     reversedResult.reverse()
//     return reversedResult

/**
 * Used instead of list(set(l1).update(l2)) to maintain order,
 * making sure duplicates are removed from l1, not l2.
 */ 
export function listUpdate<T>(l1: T[], l2: T[]): T[] {
  return l1.filter(item => !l2.includes(item)).concat(l2);
}

export function listDifferenceUpdate<T>(l1: T[], l2: T[]): T[] {
  return l1.filter(item => !l2.includes(item));
}

export function allElementsAreInstances<T, V>(iterable: T[], Class: new (...args: unknown[]) => V) {
  return iterable.every(item => item instanceof Class);
}

export function adjacentNTuples<T>(objects: T[], n: number): T[][] {
  return $zip(...range(n).map(k => [...objects.slice(k), ...objects.slice(0, k)]));
}

export function adjacentPairs<T>(objects: T[]): [T, T][] {
  return adjacentNTuples(objects, 2) as [T, T][];
}

// tuplify(obj) {
//     if isinstance(obj, str) {
//         return (obj,)
//     try:
//         return tuple(obj)
//     except TypeError:
//         return (obj,)


// batchByProperty(items, propertyFunc) {
//     """
//     Takes in a list, and returns a list of tuples, (batch, prop)
//     such that all items in a batch have the same output when
//     put into propertyFunc, and such that chaining all these
//     batches together would give the original list (i.e. order is
//     preserved)
//     """
//     batchPropPairs = []
//     currBatch = []
//     currProp = None
//     for item in items:
//         prop = propertyFunc(item)
//         if prop != currProp:
//             # Add current batch
//             if len(currBatch) > 0:
//                 batchPropPairs.append((currBatch, currProp))
//             # Redefine curr
//             currProp = prop
//             currBatch = [item]
//         else:
//             currBatch.append(item)
//     if len(currBatch) > 0:
//         batchPropPairs.append((currBatch, currProp))
//     return batchPropPairs


// listify(obj) {
//     if isinstance(obj, str) {
//         return [obj]
//     try:
//         return list(obj)
//     except TypeError:
//         return [obj]


// stretchArrayToLength(nparray, length) {
//     currLen = len(nparray)
//     if currLen > length:
//         raise Warning("Trying to stretch array to a length shorter than its own")
//     indices = np.arange(length) / float(length)
//     indices *= currLen
//     return nparray[indices.astype("int")]


// makeEven(iterable_1, iterable_2) {
//     list_1, list_2 = list(iterable_1), list(iterable_2)
//     length = max(len(list_1), len(list_2))
//     return (
//         [list_1[(n * len(list_1)) // length] for n in range(length)],
//         [list_2[(n * len(list_2)) // length] for n in range(length)],
//     )


// makeEvenByCycling(iterable_1, iterable_2) {
//     length = max(len(iterable_1), len(iterable_2))
//     cycle1 = it.cycle(iterable_1)
//     cycle2 = it.cycle(iterable_2)
//     return (
//         [next(cycle1) for x in range(length)],
//         [next(cycle2) for x in range(length)],
//     )

export function removeNones<T>(sequence: T[]) {
  return sequence.filter(item => typeof item !== "undefined");
}

// # Note this is redundant with it.chain

// concatenateLists(*listOfLists) {
//     return [item for lst in listOfLists for item in lst]


// uniqChain(*args) {
//     uniqueItems = set()
//     for x in it.chain(*args) {
//         if x in uniqueItems:
//             continue
//         uniqueItems.add(x)
//         yield x
