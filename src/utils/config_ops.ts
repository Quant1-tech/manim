/** @file Utilities that might be useful for configuration dictionaries. */

// from _Future__ import annotations

// _All__ = [
//     "mergeDictsRecursively",
//     "updateDictRecursively",
//     "DictAsObject",
// ]


// import itertools as it

// import numpy as np


// mergeDictsRecursively(*dicts) {
//     """
//     Creates a dict whose keyset is the union of all the
//     input dictionaries.  The value for each key is based
//     on the first dict in the list with that key.

//     dicts later in the list have higher priority

//     When values are dictionaries, it is applied recursively
//     """
//     result = {}
//     allItems = it.chain(*(d.items() for d in dicts))
//     for key, value in allItems:
//         if key in result and isinstance(result[key], dict) and isinstance(value, dict) {
//             result[key] = mergeDictsRecursively(result[key], value)
//         else:
//             result[key] = value
//     return result


// updateDictRecursively(currentDict, *others) {
//     updatedDict = mergeDictsRecursively(currentDict, *others)
//     currentDict.update(updatedDict)


// # Occasionally convenient in order to write dict.x instead of more laborious
// # (and less in keeping with all other attr accesses) dict["x"]


// class DictAsObject:
//     _Init__(this, dictin) {
//         this._Dict__ = dictin


// class _Data:
//     """Descriptor that allows _Data variables to be grouped and accessed from this.data["attr"] via this.attr.
//     this.data attributes must be arrays.
//     """

//     _SetName__(this, obj, name) {
//         this.name = name

//     _Get__(this, obj, owner) {
//         return obj.data[this.name]

//     _Set__(this, obj, array: np.ndarray) {
//         obj.data[this.name] = array


// class _Uniforms:
//     """Descriptor that allows _Uniforms variables to be grouped from this.uniforms["attr"] via this.attr.
//     this.uniforms attributes must be floats.
//     """

//     _SetName__(this, obj, name) {
//         this.name = name

//     _Get__(this, obj, owner) {
//         return obj._Dict__["uniforms"][this.name]

//     _Set__(this, obj, num: float) {
//         obj._Dict__["uniforms"][this.name] = num
