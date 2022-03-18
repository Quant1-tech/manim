/** @file Utility functions related to Bézier curves. */

// from _Future__ import annotations

// _All__ = [
//     "bezier",
//     "partialBezierPoints",
//     "partialQuadraticBezierPoints",
//     "interpolate",
//     "integerInterpolate",
//     "mid",
//     "inverseInterpolate",
//     "matchInterpolate",
//     "getSmoothHandlePoints",
//     "getSmoothCubicBezierHandlePoints",
//     "diagToMatrix",
//     "isClosed",
//     "proportionsAlongBezierCurveForPoint",
//     "pointLiesOnBezier",
// ]


// import typing
// from functools import reduce

// import numpy as np
// from scipy import linalg

// from ..utils.simpleFunctions import choose
// from ..utils.spaceOps import cross2d, findIntersection


// bezier(
//     points: np.ndarray,
// ) -> typing.Callable[[float], int | typing.Iterable]:
//     """Classic implementation of a bezier curve.

//     Parameters
//     ----------
//     points : np.ndarray
//         points defining the desired bezier curve.

//     Returns
//     -------
//     typing.Callable[[float], typing.Union[int, typing.Iterable]]
//         function describing the bezier curve.
//     """
//     n = len(points) - 1
//     return lambda t: sum(
//         ((1 - t) ** (n - k)) * (t**k) * choose(n, k) * point
//         for k, point in enumerate(points)
//     )


// partialBezierPoints(points: np.ndarray, a: float, b: float) -> np.ndarray:
//     """Given an array of points which define bezier curve, and two numbers 0<=a<b<=1, return an array of the same size,
//     which describes the portion of the original bezier curve on the interval [a, b].

//     This algorithm is pretty nifty, and pretty dense.

//     Parameters
//     ----------
//     points : np.ndarray
//         set of points defining the bezier curve.
//     a : float
//         lower bound of the desired partial bezier curve.
//     b : float
//         upper bound of the desired partial bezier curve.

//     Returns
//     -------
//     np.ndarray
//         Set of points defining the partial bezier curve.
//     """
//     if a == 1:
//         return [points[-1]] * len(points)

//     aTo_1 = np.array([bezier(points[i:])(a) for i in range(len(points))])
//     endProp = (b - a) / (1.0 - a)
//     return np.array([bezier(aTo_1[: i + 1])(endProp) for i in range(len(points))])


// # Shortened version of partialBezierPoints just for quadratics,
// # since this is called a fair amount
// partialQuadraticBezierPoints(points, a, b) {
//     if a == 1:
//         return 3 * [points[-1]]

//     curve(t) {
//         return (
//             points[0] * (1 - t) * (1 - t)
//             + 2 * points[1] * t * (1 - t)
//             + points[2] * t * t
//         )

//     # bezier(points)
//     h0 = curve(a) if a > 0 else points[0]
//     h2 = curve(b) if b < 1 else points[2]
//     h1Prime = (1 - a) * points[1] + a * points[2]
//     endProp = (b - a) / (1.0 - a)
//     h1 = (1 - endProp) * h0 + endProp * h1Prime
//     return [h0, h1, h2]


// # Linear interpolation variants


// interpolate(start: int, end: int, alpha: float) -> float:
//     return (1 - alpha) * start + alpha * end


// integerInterpolate(
//     start: float,
//     end: float,
//     alpha: float,
// ) -> tuple[int, float]:
//     """
//     Alpha is a float between 0 and 1.  This returns
//     an integer between start and end (inclusive) representing
//     appropriate interpolation between them, along with a
//     "residue" representing a new proportion between the
//     returned integer and the next one of the
//     list.

//     For example, if start=0, end=10, alpha=0.46, This
//     would return (4, 0.6).
//     """
//     if alpha >= 1:
//         return (end - 1, 1.0)
//     if alpha <= 0:
//         return (start, 0)
//     value = int(interpolate(start, end, alpha))
//     residue = ((end - start) * alpha) % 1
//     return (value, residue)


// mid(start: float, end: float) -> float:
//     return (start + end) / 2.0


// inverseInterpolate(start: float, end: float, value: float) -> np.ndarray:
//     return np.trueDivide(value - start, end - start)


// matchInterpolate(
//     newStart: float,
//     newEnd: float,
//     oldStart: float,
//     oldEnd: float,
//     oldValue: float,
// ) -> np.ndarray:
//     return interpolate(
//         newStart,
//         newEnd,
//         inverseInterpolate(oldStart, oldEnd, oldValue),
//     )


// # Figuring out which bezier curves most smoothly connect a sequence of points


// getSmoothCubicBezierHandlePoints(points) {
//     points = np.array(points)
//     numHandles = len(points) - 1
//     dim = points.shape[1]
//     if numHandles < 1:
//         return np.zeros((0, dim)), np.zeros((0, dim))
//     # Must solve 2*numHandles equations to get the handles.
//     # l and u are the number of lower an upper diagonal rows
//     # in the matrix to solve.
//     l, u = 2, 1
//     # diag is a representation of the matrix in diagonal form
//     # See https://www.particleincell.com/2012/bezier-splines/
//     # for how to arrive at these equations
//     diag = np.zeros((l + u + 1, 2 * numHandles))
//     diag[0, 1::2] = -1
//     diag[0, 2::2] = 1
//     diag[1, 0::2] = 2
//     diag[1, 1::2] = 1
//     diag[2, 1:-2:2] = -2
//     diag[3, 0:-3:2] = 1
//     # last
//     diag[2, -2] = -1
//     diag[1, -1] = 2
//     # This is the b as in Ax = b, where we are solving for x,
//     # and A is represented using diag.  However, think of entries
//     # to x and b as being points in space, not numbers
//     b = np.zeros((2 * numHandles, dim))
//     b[1::2] = 2 * points[1:]
//     b[0] = points[0]
//     b[-1] = points[-1]

//     solveFunc(b) {
//         return linalg.solveBanded((l, u), diag, b)

//     useClosedSolveFunction = isClosed(points)
//     if useClosedSolveFunction:
//         # Get equations to relate first and last points
//         matrix = diagToMatrix((l, u), diag)
//         # last row handles second derivative
//         matrix[-1, [0, 1, -2, -1]] = [2, -1, 1, -2]
//         # first row handles first derivative
//         matrix[0, :] = np.zeros(matrix.shape[1])
//         matrix[0, [0, -1]] = [1, 1]
//         b[0] = 2 * points[0]
//         b[-1] = np.zeros(dim)

//         closedCurveSolveFunc(b) {
//             return linalg.solve(matrix, b)

//     handlePairs = np.zeros((2 * numHandles, dim))
//     for i in range(dim) {
//         if useClosedSolveFunction:
//             handlePairs[:, i] = closedCurveSolveFunc(b[:, i])
//         else:
//             handlePairs[:, i] = solveFunc(b[:, i])
//     return handlePairs[0::2], handlePairs[1::2]


// getSmoothHandlePoints(
//     points: np.ndarray,
// ) -> tuple[np.ndarray, np.ndarray]:
//     """Given some anchors (points), compute handles so the resulting bezier curve is smooth.

//     Parameters
//     ----------
//     points : np.ndarray
//         Anchors.

//     Returns
//     -------
//     typing.Tuple[np.ndarray, np.ndarray]
//         Computed handles.
//     """
//     # NOTE points here are anchors.
//     points = np.array(points)
//     numHandles = len(points) - 1
//     dim = points.shape[1]
//     if numHandles < 1:
//         return np.zeros((0, dim)), np.zeros((0, dim))
//     # Must solve 2*numHandles equations to get the handles.
//     # l and u are the number of lower an upper diagonal rows
//     # in the matrix to solve.
//     l, u = 2, 1
//     # diag is a representation of the matrix in diagonal form
//     # See https://www.particleincell.com/2012/bezier-splines/
//     # for how to arrive at these equations
//     diag = np.zeros((l + u + 1, 2 * numHandles))
//     diag[0, 1::2] = -1
//     diag[0, 2::2] = 1
//     diag[1, 0::2] = 2
//     diag[1, 1::2] = 1
//     diag[2, 1:-2:2] = -2
//     diag[3, 0:-3:2] = 1
//     # last
//     diag[2, -2] = -1
//     diag[1, -1] = 2
//     # This is the b as in Ax = b, where we are solving for x,
//     # and A is represented using diag.  However, think of entries
//     # to x and b as being points in space, not numbers
//     b = np.zeros((2 * numHandles, dim))
//     b[1::2] = 2 * points[1:]
//     b[0] = points[0]
//     b[-1] = points[-1]

//     solveFunc(b: np.ndarray) -> np.ndarray:
//         return linalg.solveBanded((l, u), diag, b)

//     useClosedSolveFunction = isClosed(points)
//     if useClosedSolveFunction:
//         # Get equations to relate first and last points
//         matrix = diagToMatrix((l, u), diag)
//         # last row handles second derivative
//         matrix[-1, [0, 1, -2, -1]] = [2, -1, 1, -2]
//         # first row handles first derivative
//         matrix[0, :] = np.zeros(matrix.shape[1])
//         matrix[0, [0, -1]] = [1, 1]
//         b[0] = 2 * points[0]
//         b[-1] = np.zeros(dim)

//         closedCurveSolveFunc(b: np.ndarray) -> np.ndarray:
//             return linalg.solve(matrix, b)

//     handlePairs = np.zeros((2 * numHandles, dim))
//     for i in range(dim) {
//         if useClosedSolveFunction:
//             handlePairs[:, i] = closedCurveSolveFunc(b[:, i])
//         else:
//             handlePairs[:, i] = solveFunc(b[:, i])
//     return handlePairs[0::2], handlePairs[1::2]


// diagToMatrix(lAndU: tuple[int, int], diag: np.ndarray) -> np.ndarray:
//     """
//     Converts array whose rows represent diagonal
//     entries of a matrix into the matrix itself.
//     See scipy.linalg.solveBanded
//     """
//     l, u = lAndU
//     dim = diag.shape[1]
//     matrix = np.zeros((dim, dim))
//     for i in range(l + u + 1) {
//         np.fillDiagonal(
//             matrix[max(0, i - u) :, max(0, u - i) :],
//             diag[i, max(0, u - i) :],
//         )
//     return matrix


// # Given 4 control points for a cubic bezier curve (or arrays of such)
// # return control points for 2 quadratics (or 2n quadratics) approximating them.
// getQuadraticApproximationOfCubic(a0, h0, h1, a1) {
//     a0 = np.array(a0, ndmin=2)
//     h0 = np.array(h0, ndmin=2)
//     h1 = np.array(h1, ndmin=2)
//     a1 = np.array(a1, ndmin=2)
//     # Tangent vectors at the start and end.
//     T0 = h0 - a0
//     T1 = a1 - h1

//     # Search for inflection points.  If none are found, use the
//     # midpoint as a cut point.
//     # Based on http://www.caffeineowl.com/graphics/2d/vectorial/cubic-inflexion.html
//     hasInfl = np.ones(len(a0), dtype=bool)

//     p = h0 - a0
//     q = h1 - 2 * h0 + a0
//     r = a1 - 3 * h1 + 3 * h0 - a0

//     a = cross2d(q, r)
//     b = cross2d(p, r)
//     c = cross2d(p, q)

//     disc = b * b - 4 * a * c
//     hasInfl &= disc > 0
//     sqrtDisc = np.sqrt(np.abs(disc))
//     settings = np.seterr(all="ignore")
//     tiBounds = []
//     for sgn in [-1, +1]:
//         ti = (-b + sgn * sqrtDisc) / (2 * a)
//         ti[a == 0] = (-c / b)[a == 0]
//         ti[(a == 0) & (b == 0)] = 0
//         tiBounds.append(ti)
//     tiMin, tiMax = tiBounds
//     np.seterr(**settings)
//     tiMinInRange = hasInfl & (0 < tiMin) & (tiMin < 1)
//     tiMaxInRange = hasInfl & (0 < tiMax) & (tiMax < 1)

//     # Choose a value of t which starts at 0.5,
//     # but is updated to one of the inflection points
//     # if they lie between 0 and 1

//     tMid = 0.5 * np.ones(len(a0))
//     tMid[tiMinInRange] = tiMin[tiMinInRange]
//     tMid[tiMaxInRange] = tiMax[tiMaxInRange]

//     m, n = a0.shape
//     tMid = tMid.repeat(n).reshape((m, n))

//     # Compute bezier point and tangent at the chosen value of t
//     mid = bezier([a0, h0, h1, a1])(tMid)
//     Tm = bezier([h0 - a0, h1 - h0, a1 - h1])(tMid)

//     # Intersection between tangent lines at end points
//     # and tangent in the middle
//     i0 = findIntersection(a0, T0, mid, Tm)
//     i1 = findIntersection(a1, T1, mid, Tm)

//     m, n = np.shape(a0)
//     result = np.zeros((6 * m, n))
//     result[0::6] = a0
//     result[1::6] = i0
//     result[2::6] = mid
//     result[3::6] = mid
//     result[4::6] = i1
//     result[5::6] = a1
//     return result


// isClosed(points: tuple[np.ndarray, np.ndarray]) -> bool:
//     return np.allclose(points[0], points[-1])


// proportionsAlongBezierCurveForPoint(
//     point: typing.Iterable[float | int],
//     controlPoints: typing.Iterable[typing.Iterable[float | int]],
//     roundTo: float | int | None = 1e-6,
// ) -> np.ndarray:
//     """Obtains the proportion along the bezier curve corresponding to a given point
//     given the bezier curve's control points.

//     The bezier polynomial is constructed using the coordinates of the given point
//     as well as the bezier curve's control points. On solving the polynomial for each dimension,
//     if there are roots common to every dimension, those roots give the proportion along the
//     curve the point is at. If there are no real roots, the point does not lie on the curve.

//     Parameters
//     ----------
//     point
//         The Cartesian Coordinates of the point whose parameter
//         should be obtained.
//     controlPoints
//         The Cartesian Coordinates of the ordered control
//         points of the bezier curve on which the point may
//         or may not lie.
//     roundTo
//         A float whose number of decimal places all values
//         such as coordinates of points will be rounded.

//     Returns
//     -------
//         np.ndarray[float]
//             List containing possible parameters (the proportions along the bezier curve)
//             for the given point on the given bezier curve.
//             This usually only contains one or zero elements, but if the
//             point is, say, at the beginning/end of a closed loop, may return
//             a list with more than 1 value, corresponding to the beginning and
//             end etc. of the loop.

//     Raises
//     ------
//     :class:`ValueError`
//         When ``point`` and the control points have different shapes.
//     """
//     # Method taken from
//     # http://polymathprogrammer.com/2012/04/03/does-point-lie-on-bezier-curve/

//     if not all(np.shape(point) == np.shape(cP) for cP in controlPoints) {
//         raise ValueError(
//             f"Point {point} and Control Points {controlPoints} have different shapes.",
//         )

//     controlPoints = np.array(controlPoints)
//     n = len(controlPoints) - 1

//     roots = []
//     for dim, coord in enumerate(point) {
//         controlCoords = controlPoints[:, dim]
//         terms = []
//         for termPower in range(n, -1, -1) {
//             outercoeff = choose(n, termPower)
//             term = []
//             sign = 1
//             for subtermNum in range(termPower, -1, -1) {
//                 innercoeff = choose(termPower, subtermNum) * sign
//                 subterm = innercoeff * controlCoords[subtermNum]
//                 if termPower == 0:
//                     subterm -= coord
//                 term.append(subterm)
//                 sign *= -1
//             terms.append(outercoeff * sum(np.array(term)))
//         if all(term == 0 for term in terms) {
//             # Then both Bezier curve and Point lie on the same plane.
//             # Roots will be none, but in this specific instance, we don't need to consider that.
//             continue
//         bezierPolynom = np.polynomial.Polynomial(terms[::-1])
//         polynomRoots = bezierPolynom.roots()
//         if len(polynomRoots) > 0:
//             polynomRoots = np.around(polynomRoots, int(np.log10(1 / roundTo)))
//         roots.append(polynomRoots)

//     roots = [[root for root in rootlist if root.imag == 0] for rootlist in roots]
//     roots = reduce(np.intersect1d, roots)  # Get common roots.
//     roots = np.array([r.real for r in roots])
//     return roots


// pointLiesOnBezier(
//     point: typing.Iterable[float | int],
//     controlPoints: typing.Iterable[typing.Iterable[float | int]],
//     roundTo: float | int | None = 1e-6,
// ) -> bool:
//     """Checks if a given point lies on the bezier curves with the given control points.

//     This is done by solving the bezier polynomial with the point as the constant term; if
//     any real roots exist, the point lies on the bezier curve.

//     Parameters
//     ----------
//     point
//         The Cartesian Coordinates of the point to check.
//     controlPoints
//         The Cartesian Coordinates of the ordered control
//         points of the bezier curve on which the point may
//         or may not lie.
//     roundTo
//         A float whose number of decimal places all values
//         such as coordinates of points will be rounded.

//     Returns
//     -------
//     bool
//         Whether the point lies on the curve.
//     """

//     roots = proportionsAlongBezierCurveForPoint(point, controlPoints, roundTo)

//     return len(roots) > 0
