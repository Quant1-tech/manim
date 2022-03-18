/** @file A collection of simple functions. */

// from _Future__ import annotations

// _All__ = [
//     "sigmoid",
//     "choose",
//     "getParameters",
//     "binarySearch",
// ]


// import inspect
// from functools import lruCache

// import numpy as np
// from scipy import special


// sigmoid(x) {
//     return 1.0 / (1 + np.exp(-x))


// @lruCache(maxsize=10)
// choose(n, k) {
//     return special.comb(n, k, exact=True)


// getParameters(function) {
//     return inspect.signature(function).parameters


// clip(a, minA, maxA) {
//     if a < minA:
//         return minA
//     elif a > maxA:
//         return maxA
//     return a


// binarySearch(function, target, lowerBound, upperBound, tolerance=1e-4) {
//     lh = lowerBound
//     rh = upperBound
//     while abs(rh - lh) > tolerance:
//         mh = np.mean([lh, rh])
//         lx, mx, rx = (function(h) for h in (lh, mh, rh))
//         if lx == target:
//             return lh
//         if rx == target:
//             return rh

//         if lx <= target and rx >= target:
//             if mx > target:
//                 rh = mh
//             else:
//                 lh = mh
//         elif lx > target and rx < target:
//             lh, rh = rh, lh
//         else:
//             return None
//     return mh
