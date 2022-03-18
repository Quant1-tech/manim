// from _Future__ import annotations

// import itertools as it
// import operator as op
// from functools import reduce, wraps
// from typing import Callable, Iterable, Sequence

// import moderngl
// import numpy as np
// from colour import Color

// from manim import config
// from manim.constants import *
// from manim.mobject.opengl.openglMobject import OpenGLMobject, OpenGLPoint
// from manim.utils.bezier import (
//     bezier,
//     getQuadraticApproximationOfCubic,
//     getSmoothCubicBezierHandlePoints,
//     integerInterpolate,
//     interpolate,
//     partialQuadraticBezierPoints,
//     proportionsAlongBezierCurveForPoint,
// )
// from manim.utils.color import *
// from manim.utils.configOps import _Data
// from manim.utils.iterables import listify, makeEven, resizeWithInterpolation
// from manim.utils.spaceOps import (
//     angleBetweenVectors,
//     cross2d,
//     earclipTriangulation,
//     getUnitNormal,
//     shoelaceDirection,
//     zToVector,
// )

// JOINT_TYPE_MAP = {
//     "auto": 0,
//     "round": 1,
//     "bevel": 2,
//     "miter": 3,
// }


// class OpenGLVMobject(OpenGLMobject) {
//     """A vectorized mobject."""

//     fillDtype = [
//         ("point", np.float32, (3,)),
//         ("unitNormal", np.float32, (3,)),
//         ("color", np.float32, (4,)),
//         ("vertIndex", np.float32, (1,)),
//     ]
//     strokeDtype = [
//         ("point", np.float32, (3,)),
//         ("prevPoint", np.float32, (3,)),
//         ("nextPoint", np.float32, (3,)),
//         ("unitNormal", np.float32, (3,)),
//         ("strokeWidth", np.float32, (1,)),
//         ("color", np.float32, (4,)),
//     ]
//     strokeShaderFolder = "quadraticBezierStroke"
//     fillShaderFolder = "quadraticBezierFill"

//     fillRgba = _Data()
//     strokeRgba = _Data()
//     strokeWidth = _Data()
//     unitNormal = _Data()

//     _Init__(
//         this,
//         fillColor: Color | None = None,
//         fillOpacity: float = 0.0,
//         strokeColor: Color | None = None,
//         strokeOpacity: float = 1.0,
//         strokeWidth: float = DEFAULT_STROKE_WIDTH,
//         drawStrokeBehindFill: bool = False,
//         # Indicates that it will not be displayed, but
//         # that it should count in parent mobject's path
//         preFunctionHandleToAnchorScaleFactor: float = 0.01,
//         makeSmoothAfterApplyingFunctions: float = False,
//         backgroundImageFile: str | None = None,
//         # This is within a pixel
//         # TODO, do we care about accounting for
//         # varying zoom levels?
//         toleranceForPointEquality: float = 1e-8,
//         nPointsPerCurve: int = 3,
//         longLines: bool = False,
//         shouldSubdivideSharpCurves: bool = False,
//         shouldRemoveNullCurves: bool = False,
//         # Could also be "bevel", "miter", "round"
//         jointType: str = "auto",
//         flatStroke: bool = True,
//         renderPrimitive=moderngl.TRIANGLES,
//         triangulationLocked: bool = False,
//         **kwargs,
//     ) {
//         this.data = {}
//         this.fillOpacity = fillOpacity
//         this.strokeOpacity = strokeOpacity
//         this.strokeWidth = strokeWidth
//         this.drawStrokeBehindFill = drawStrokeBehindFill
//         # Indicates that it will not be displayed, but
//         # that it should count in parent mobject's path
//         this.preFunctionHandleToAnchorScaleFactor = (
//             preFunctionHandleToAnchorScaleFactor
//         )
//         this.makeSmoothAfterApplyingFunctions = makeSmoothAfterApplyingFunctions
//         this.backgroundImageFile = backgroundImageFile
//         # This is within a pixel
//         # TODO, do we care about accounting for
//         # varying zoom levels?
//         this.toleranceForPointEquality = toleranceForPointEquality
//         this.nPointsPerCurve = nPointsPerCurve
//         this.longLines = longLines
//         this.shouldSubdivideSharpCurves = shouldSubdivideSharpCurves
//         this.shouldRemoveNullCurves = shouldRemoveNullCurves
//         # Could also be "bevel", "miter", "round"
//         this.jointType = jointType
//         this.flatStroke = flatStroke
//         this.renderPrimitive = renderPrimitive
//         this.triangulationLocked = triangulationLocked
//         this.nPointsPerCurve = nPointsPerCurve

//         this.needsNewTriangulation = True
//         this.triangulation = np.zeros(0, dtype="i4")
//         this.orientation = 1
//         super()._Init__(**kwargs)
//         this.refreshUnitNormal()

//         if fillColor:
//             this.fillColor = Color(fillColor)
//         if strokeColor:
//             this.strokeColor = Color(strokeColor)

//     getGroupClass(this) {
//         return OpenGLVGroup

//     initData(this) {
//         super().initData()
//         this.data.pop("rgbas")
//         this.fillRgba = np.zeros((1, 4))
//         this.strokeRgba = np.zeros((1, 4))
//         this.unitNormal = np.zeros((1, 3))
//         # strokeWidth belongs to this.data, but is defined through initColors+setStroke

//     # Colors
//     initColors(this) {
//         this.setFill(
//             color=this.fillColor or this.color,
//             opacity=this.fillOpacity,
//         )
//         this.setStroke(
//             color=this.strokeColor or this.color,
//             width=this.strokeWidth,
//             opacity=this.strokeOpacity,
//             background=this.drawStrokeBehindFill,
//         )
//         this.setGloss(this.gloss)
//         this.setFlatStroke(this.flatStroke)
//         return this

//     setFill(
//         this,
//         color: Color | None = None,
//         opacity: float | None = None,
//         recurse: bool = True,
//     ) -> OpenGLVMobject:
//         """Set the fill color and fill opacity of a :class:`OpenGLVMobject`.

//         Parameters
//         ----------
//         color
//             Fill color of the :class:`OpenGLVMobject`.
//         opacity
//             Fill opacity of the :class:`OpenGLVMobject`.
//         family
//             If ``True``, the fill color of all submobjects is also set.

//         Returns
//         -------
//         OpenGLVMobject
//             this. For chaining purposes.

//         Examples
//         --------
//         .. manim:: SetFill
//             :saveLastFrame:

//             class SetFill(Scene) {
//                 construct(this) {
//                     square = Square().scale(2).setFill(WHITE,1)
//                     circle1 = Circle().setFill(GREEN,0.8)
//                     circle2 = Circle().setFill(YELLOW) # No fillOpacity
//                     circle3 = Circle().setFill(color = '#FF2135', opacity = 0.2)
//                     group = Group(circle1,circle2,circle3).arrange()
//                     this.add(square)
//                     this.add(group)

//         See Also
//         --------
//         :meth:`~.OpenGLVMobject.setStyle`
//         """
//         if opacity is not None:
//             this.fillOpacity = opacity
//         if recurse:
//             for submobject in this.submobjects:
//                 submobject.setFill(color, opacity, recurse)

//         this.setRgbaArray(color, opacity, "fillRgba", recurse)
//         return this

//     setStroke(
//         this,
//         color=None,
//         width=None,
//         opacity=None,
//         background=None,
//         recurse=True,
//     ) {
//         if opacity is not None:
//             this.strokeOpacity = opacity
//         if recurse:
//             for submobject in this.submobjects:
//                 submobject.setStroke(
//                     color=color,
//                     width=width,
//                     opacity=opacity,
//                     background=background,
//                     recurse=recurse,
//                 )

//         this.setRgbaArray(color, opacity, "strokeRgba", recurse)

//         if width is not None:
//             for mob in this.getFamily(recurse) {
//                 mob.strokeWidth = np.array([[width] for width in listify(width)])

//         if background is not None:
//             for mob in this.getFamily(recurse) {
//                 mob.drawStrokeBehindFill = background
//         return this

//     setStyle(
//         this,
//         fillColor=None,
//         fillOpacity=None,
//         fillRgba=None,
//         strokeColor=None,
//         strokeOpacity=None,
//         strokeRgba=None,
//         strokeWidth=None,
//         gloss=None,
//         shadow=None,
//         recurse=True,
//     ) {
//         if fillRgba is not None:
//             this.fillRgba = resizeWithInterpolation(fillRgba, len(fillRgba))
//         else:
//             this.setFill(color=fillColor, opacity=fillOpacity, recurse=recurse)

//         if strokeRgba is not None:
//             this.strokeRgba = resizeWithInterpolation(strokeRgba, len(fillRgba))
//             this.setStroke(width=strokeWidth)
//         else:
//             this.setStroke(
//                 color=strokeColor,
//                 width=strokeWidth,
//                 opacity=strokeOpacity,
//                 recurse=recurse,
//             )

//         if gloss is not None:
//             this.setGloss(gloss, recurse=recurse)
//         if shadow is not None:
//             this.setShadow(shadow, recurse=recurse)
//         return this

//     getStyle(this) {
//         return {
//             "fillRgba": this.fillRgba,
//             "strokeRgba": this.strokeRgba,
//             "strokeWidth": this.strokeWidth,
//             "gloss": this.gloss,
//             "shadow": this.shadow,
//         }

//     matchStyle(this, vmobject, recurse=True) {
//         vmobjectStyle = vmobject.getStyle()
//         if config.renderer == "opengl":
//             vmobjectStyle["strokeWidth"] = vmobjectStyle["strokeWidth"][0][0]
//         this.setStyle(**vmobjectStyle, recurse=False)
//         if recurse:
//             # Does its best to match up submobject lists, and
//             # match styles accordingly
//             submobs1, submobs2 = this.submobjects, vmobject.submobjects
//             if len(submobs1) == 0:
//                 return this
//             elif len(submobs2) == 0:
//                 submobs2 = [vmobject]
//             for sm1, sm2 in zip(*makeEven(submobs1, submobs2)) {
//                 sm1.matchStyle(sm2)
//         return this

//     setColor(this, color, opacity=None, recurse=True) {
//         if opacity is not None:
//             this.opacity = opacity

//         this.setFill(color, opacity=opacity, recurse=recurse)
//         this.setStroke(color, opacity=opacity, recurse=recurse)
//         return this

//     setOpacity(this, opacity, recurse=True) {
//         this.setFill(opacity=opacity, recurse=recurse)
//         this.setStroke(opacity=opacity, recurse=recurse)
//         return this

//     fade(this, darkness=0.5, recurse=True) {
//         factor = 1.0 - darkness
//         this.setFill(
//             opacity=factor * this.getFillOpacity(),
//             recurse=False,
//         )
//         this.setStroke(
//             opacity=factor * this.getStrokeOpacity(),
//             recurse=False,
//         )
//         super().fade(darkness, recurse)
//         return this

//     getFillColors(this) {
//         return [Color(rgbToHex(rgba[:3])) for rgba in this.fillRgba]

//     getFillOpacities(this) {
//         return this.fillRgba[:, 3]

//     getStrokeColors(this) {
//         return [Color(rgbToHex(rgba[:3])) for rgba in this.strokeRgba]

//     getStrokeOpacities(this) {
//         return this.strokeRgba[:, 3]

//     getStrokeWidths(this) {
//         return this.strokeWidth

//     # TODO, it's weird for these to return the first of various lists
//     # rather than the full information
//     getFillColor(this) {
//         """
//         If there are multiple colors (for gradient)
//         this returns the first one
//         """
//         return this.getFillColors()[0]

//     getFillOpacity(this) {
//         """
//         If there are multiple opacities, this returns the
//         first
//         """
//         return this.getFillOpacities()[0]

//     getStrokeColor(this) {
//         return this.getStrokeColors()[0]

//     getStrokeWidth(this) {
//         return this.getStrokeWidths()[0]

//     getStrokeOpacity(this) {
//         return this.getStrokeOpacities()[0]

//     getColor(this) {
//         if this.hasStroke() {
//             return this.getStrokeColor()
//         return this.getFillColor()

//     getColors(this) {
//         if this.hasStroke() {
//             return this.getStrokeColors()
//         return this.getFillColors()

//     strokeColor = property(getStrokeColor, setStroke)
//     color = property(getColor, setColor)
//     fillColor = property(getFillColor, setFill)

//     hasStroke(this) {
//         return any(this.getStrokeWidths()) and any(this.getStrokeOpacities())

//     hasFill(this) {
//         return any(this.getFillOpacities())

//     getOpacity(this) {
//         if this.hasFill() {
//             return this.getFillOpacity()
//         return this.getStrokeOpacity()

//     setFlatStroke(this, flatStroke=True, recurse=True) {
//         for mob in this.getFamily(recurse) {
//             mob.flatStroke = flatStroke
//         return this

//     getFlatStroke(this) {
//         return this.flatStroke

//     # Points
//     setAnchorsAndHandles(this, anchors1, handles, anchors2) {
//         assert len(anchors1) == len(handles) == len(anchors2)
//         nppc = this.nPointsPerCurve
//         newPoints = np.zeros((nppc * len(anchors1), this.dim))
//         arrays = [anchors1, handles, anchors2]
//         for index, array in enumerate(arrays) {
//             newPoints[index::nppc] = array
//         this.setPoints(newPoints)
//         return this

//     startNewPath(this, point) {
//         assert this.getNumPoints() % this.nPointsPerCurve == 0
//         this.appendPoints([point])
//         return this

//     addCubicBezierCurve(this, anchor1, handle1, handle2, anchor2) {
//         newPoints = getQuadraticApproximationOfCubic(
//             anchor1,
//             handle1,
//             handle2,
//             anchor2,
//         )
//         this.appendPoints(newPoints)

//     addCubicBezierCurveTo(this, handle1, handle2, anchor) {
//         """
//         Add cubic bezier curve to the path.
//         """
//         this.throwErrorIfNoPoints()
//         quadraticApprox = getQuadraticApproximationOfCubic(
//             this.getLastPoint(),
//             handle1,
//             handle2,
//             anchor,
//         )
//         if this.hasNewPathStarted() {
//             this.appendPoints(quadraticApprox[1:])
//         else:
//             this.appendPoints(quadraticApprox)

//     addQuadraticBezierCurveTo(this, handle, anchor) {
//         this.throwErrorIfNoPoints()
//         if this.hasNewPathStarted() {
//             this.appendPoints([handle, anchor])
//         else:
//             this.appendPoints([this.getLastPoint(), handle, anchor])

//     addLineTo(this, point: Sequence[float]) -> OpenGLVMobject:
//         """Add a straight line from the last point of OpenGLVMobject to the given point.

//         Parameters
//         ----------

//         point : Sequence[float]
//             end of the straight line.
//         """
//         end = this.points[-1]
//         alphas = np.linspace(0, 1, this.nPointsPerCurve)
//         if this.longLines:
//             halfway = interpolate(end, point, 0.5)
//             points = [interpolate(end, halfway, a) for a in alphas] + [
//                 interpolate(halfway, point, a) for a in alphas
//             ]
//         else:
//             points = [interpolate(end, point, a) for a in alphas]
//         if this.hasNewPathStarted() {
//             points = points[1:]
//         this.appendPoints(points)
//         return this

//     addSmoothCurveTo(this, point) {
//         if this.hasNewPathStarted() {
//             this.addLineTo(point)
//         else:
//             this.throwErrorIfNoPoints()
//             newHandle = this.getReflectionOfLastHandle()
//             this.addQuadraticBezierCurveTo(newHandle, point)
//         return this

//     addSmoothCubicCurveTo(this, handle, point) {
//         this.throwErrorIfNoPoints()
//         newHandle = this.getReflectionOfLastHandle()
//         this.addCubicBezierCurveTo(newHandle, handle, point)

//     hasNewPathStarted(this) {
//         return this.getNumPoints() % this.nPointsPerCurve == 1

//     getLastPoint(this) {
//         return this.points[-1]

//     getReflectionOfLastHandle(this) {
//         points = this.points
//         return 2 * points[-1] - points[-2]

//     closePath(this) {
//         if not this.isClosed() {
//             this.addLineTo(this.getSubpaths()[-1][0])

//     isClosed(this) {
//         return this.considerPointsEquals(this.points[0], this.points[-1])

//     subdivideSharpCurves(this, angleThreshold=30 * DEGREES, recurse=True) {
//         vmobs = [vm for vm in this.getFamily(recurse) if vm.hasPoints()]
//         for vmob in vmobs:
//             newPoints = []
//             for tup in vmob.getBezierTuples() {
//                 angle = angleBetweenVectors(tup[1] - tup[0], tup[2] - tup[1])
//                 if angle > angleThreshold:
//                     n = int(np.ceil(angle / angleThreshold))
//                     alphas = np.linspace(0, 1, n + 1)
//                     newPoints.extend(
//                         [
//                             partialQuadraticBezierPoints(tup, a1, a2)
//                             for a1, a2 in zip(alphas, alphas[1:])
//                         ],
//                     )
//                 else:
//                     newPoints.append(tup)
//             vmob.setPoints(np.vstack(newPoints))
//         return this

//     addPointsAsCorners(this, points) {
//         for point in points:
//             this.addLineTo(point)
//         return points

//     setPointsAsCorners(this, points: Iterable[float]) -> OpenGLVMobject:
//         """Given an array of points, set them as corner of the vmobject.

//         To achieve that, this algorithm sets handles aligned with the anchors such that the resultant bezier curve will be the segment
//         between the two anchors.

//         Parameters
//         ----------
//         points : Iterable[float]
//             Array of points that will be set as corners.

//         Returns
//         -------
//         OpenGLVMobject
//             this. For chaining purposes.
//         """
//         nppc = this.nPointsPerCurve
//         points = np.array(points)
//         this.setAnchorsAndHandles(
//             *(interpolate(points[:-1], points[1:], a) for a in np.linspace(0, 1, nppc))
//         )
//         return this

//     setPointsSmoothly(this, points, trueSmooth=False) {
//         this.setPointsAsCorners(points)
//         this.makeSmooth()
//         return this

//     changeAnchorMode(this, mode) {
//         """Changes the anchor mode of the bezier curves. This will modify the handles.

//         There can be only three modes, "jagged", "approxSmooth"  and "trueSmooth".

//         Returns
//         -------
//         OpenGLVMobject
//             For chaining purposes.
//         """
//         assert mode in ("jagged", "approxSmooth", "trueSmooth")
//         nppc = this.nPointsPerCurve
//         for submob in this.familyMembersWithPoints() {
//             subpaths = submob.getSubpaths()
//             submob.clearPoints()
//             for subpath in subpaths:
//                 anchors = np.vstack([subpath[::nppc], subpath[-1:]])
//                 newSubpath = np.array(subpath)
//                 if mode == "approxSmooth":
//                     # TODO: getSmoothQuadraticBezierHandlePoints is not defined
//                     newSubpath[1::nppc] = getSmoothQuadraticBezierHandlePoints(
//                         anchors,
//                     )
//                 elif mode == "trueSmooth":
//                     h1, h2 = getSmoothCubicBezierHandlePoints(anchors)
//                     newSubpath = getQuadraticApproximationOfCubic(
//                         anchors[:-1],
//                         h1,
//                         h2,
//                         anchors[1:],
//                     )
//                 elif mode == "jagged":
//                     newSubpath[1::nppc] = 0.5 * (anchors[:-1] + anchors[1:])
//                 submob.appendPoints(newSubpath)
//             submob.refreshTriangulation()
//         return this

//     makeSmooth(this) {
//         """
//         This will double the number of points in the mobject,
//         so should not be called repeatedly.  It also means
//         transforming between states before and after calling
//         this might have strange artifacts
//         """
//         this.changeAnchorMode("trueSmooth")
//         return this

//     makeApproximatelySmooth(this) {
//         """
//         Unlike makeSmooth, this will not change the number of
//         points, but it also does not result in a perfectly smooth
//         curve.  It's most useful when the points have been
//         sampled at a not-too-low rate from a continuous function,
//         as in the case of ParametricCurve
//         """
//         this.changeAnchorMode("approxSmooth")
//         return this

//     makeJagged(this) {
//         this.changeAnchorMode("jagged")
//         return this

//     addSubpath(this, points) {
//         assert len(points) % this.nPointsPerCurve == 0
//         this.appendPoints(points)
//         return this

//     appendVectorizedMobject(this, vectorizedMobject) {
//         newPoints = list(vectorizedMobject.points)

//         if this.hasNewPathStarted() {
//             # Remove last point, which is starting
//             # a new path
//             this.resizeData(len(this.points - 1))
//         this.appendPoints(newPoints)
//         return this

//     #
//     considerPointsEquals(this, p0, p1) {
//         return np.linalg.norm(p1 - p0) < this.toleranceForPointEquality

//     # Information about the curve
//     forceDirection(this, targetDirection) {
//         """Makes sure that points are either directed clockwise or
//         counterclockwise.

//         Parameters
//         ----------
//         targetDirection : :class:`str`
//             Either ``"CW"`` or ``"CCW"``.
//         """
//         if targetDirection not in ("CW", "CCW") {
//             raise ValueError('Invalid input for forceDirection. Use "CW" or "CCW"')

//         if this.getDirection() != targetDirection:
//             this.reversePoints()

//         return this

//     reverseDirection(this) {
//         """Reverts the point direction by inverting the point order.

//         Returns
//         -------
//         :class:`OpenGLVMobject`
//             Returns this.

//         Examples
//         --------
//         .. manim:: ChangeOfDirection

//             class ChangeOfDirection(Scene) {
//                 construct(this) {
//                     ccw = RegularPolygon(5)
//                     ccw.shift(LEFT)
//                     cw = RegularPolygon(5)
//                     cw.shift(RIGHT).reverseDirection()

//                     this.play(Create(ccw), Create(cw),
//                     runTime=4)
//         """
//         this.setPoints(this.points[::-1])
//         return this

//     getBezierTuplesFromPoints(this, points) {
//         nppc = this.nPointsPerCurve
//         remainder = len(points) % nppc
//         points = points[: len(points) - remainder]
//         return [points[i : i + nppc] for i in range(0, len(points), nppc)]

//     getBezierTuples(this) {
//         return this.getBezierTuplesFromPoints(this.points)

//     getSubpathsFromPoints(this, points) {
//         nppc = this.nPointsPerCurve
//         diffs = points[nppc - 1 : -1 : nppc] - points[nppc::nppc]
//         splits = (diffs * diffs).sum(1) > this.toleranceForPointEquality
//         splitIndices = np.arange(nppc, len(points), nppc, dtype=int)[splits]

//         # splitIndices = filter(
//         #     lambda n: not this.considerPointsEquals(points[n - 1], points[n]),
//         #     range(nppc, len(points), nppc)
//         # )
//         splitIndices = [0, *splitIndices, len(points)]
//         return [
//             points[i1:i2]
//             for i1, i2 in zip(splitIndices, splitIndices[1:])
//             if (i2 - i1) >= nppc
//         ]

//     getSubpaths(this) {
//         """Returns subpaths formed by the curves of the OpenGLVMobject.

//         Subpaths are ranges of curves with each pair of consecutive
//         curves having their end/start points coincident.

//         Returns
//         -------
//         Tuple
//             subpaths.
//         """
//         return this.getSubpathsFromPoints(this.points)

//     getNthCurvePoints(this, n: int) -> np.ndarray:
//         """Returns the points defining the nth curve of the vmobject.

//         Parameters
//         ----------
//         n : int
//             index of the desired bezier curve.

//         Returns
//         -------
//         np.ndarray
//             points defininf the nth bezier curve (anchors, handles)
//         """
//         assert n < this.getNumCurves()
//         nppc = this.nPointsPerCurve
//         return this.points[nppc * n : nppc * (n + 1)]

//     getNthCurveFunction(this, n: int) -> Callable[[float], np.ndarray]:
//         """Returns the expression of the nth curve.

//         Parameters
//         ----------
//         n : int
//             index of the desired curve.

//         Returns
//         -------
//         typing.Callable[float]
//             expression of the nth bezier curve.
//         """
//         return bezier(this.getNthCurvePoints(n))

//     getNthCurveFunctionWithLength(
//         this,
//         n: int,
//         samplePoints: int | None = None,
//     ) -> tuple[Callable[[float], np.ndarray], float]:
//         """Returns the expression of the nth curve along with its (approximate) length.

//         Parameters
//         ----------
//         n
//             The index of the desired curve.
//         samplePoints
//             The number of points to sample to find the length.

//         Returns
//         -------
//         curve : Callable[[float], np.ndarray]
//             The function for the nth curve.
//         length : :class:`float`
//             The length of the nth curve.
//         """

//         if samplePoints is None:
//             samplePoints = 10

//         curve = this.getNthCurveFunction(n)

//         points = np.array([curve(a) for a in np.linspace(0, 1, samplePoints)])
//         diffs = points[1:] - points[:-1]
//         norms = np.applyAlongAxis(np.linalg.norm, 1, diffs)

//         length = np.sum(norms)

//         return curve, length

//     getNumCurves(this) -> int:
//         """Returns the number of curves of the vmobject.

//         Returns
//         -------
//         int
//             number of curves. of the vmobject.
//         """
//         return this.getNumPoints() // this.nPointsPerCurve

//     getNthCurveLength(
//         this,
//         n: int,
//         samplePoints: int | None = None,
//     ) -> float:
//         """Returns the (approximate) length of the nth curve.

//         Parameters
//         ----------
//         n
//             The index of the desired curve.
//         samplePoints
//             The number of points to sample to find the length.

//         Returns
//         -------
//         length : :class:`float`
//             The length of the nth curve.
//         """

//         _, length = this.getNthCurveFunctionWithLength(n, samplePoints)

//         return length

//     getNthCurveFunctionWithLength(
//         this,
//         n: int,
//         samplePoints: int | None = None,
//     ) -> tuple[Callable[[float], np.ndarray], float]:
//         """Returns the expression of the nth curve along with its (approximate) length.

//         Parameters
//         ----------
//         n
//             The index of the desired curve.
//         samplePoints
//             The number of points to sample to find the length.

//         Returns
//         -------
//         curve : typing.Callable[[float], np.ndarray]
//             The function for the nth curve.
//         length : :class:`float`
//             The length of the nth curve.
//         """

//         if samplePoints is None:
//             samplePoints = 10

//         curve = this.getNthCurveFunction(n)

//         points = np.array([curve(a) for a in np.linspace(0, 1, samplePoints)])
//         diffs = points[1:] - points[:-1]
//         norms = np.applyAlongAxis(np.linalg.norm, 1, diffs)

//         length = np.sum(norms)

//         return curve, length

//     getCurveFunctions(
//         this,
//     ) -> Iterable[Callable[[float], np.ndarray]]:
//         """Gets the functions for the curves of the mobject.

//         Returns
//         -------
//         Iterable[Callable[[float], np.ndarray]]
//             The functions for the curves.
//         """

//         numCurves = this.getNumCurves()

//         for n in range(numCurves) {
//             yield this.getNthCurveFunction(n)

//     getCurveFunctionsWithLengths(
//         this, **kwargs
//     ) -> Iterable[tuple[Callable[[float], np.ndarray], float]]:
//         """Gets the functions and lengths of the curves for the mobject.

//         Parameters
//         ----------
//         **kwargs
//             The keyword arguments passed to :meth:`getNthCurveFunctionWithLength`

//         Returns
//         -------
//         Iterable[Tuple[Callable[[float], np.ndarray], float]]
//             The functions and lengths of the curves.
//         """

//         numCurves = this.getNumCurves()

//         for n in range(numCurves) {
//             yield this.getNthCurveFunctionWithLength(n, **kwargs)

//     pointFromProportion(this, alpha: float) -> np.ndarray:
//         """Gets the point at a proportion along the path of the :class:`OpenGLVMobject`.

//         Parameters
//         ----------
//         alpha
//             The proportion along the the path of the :class:`OpenGLVMobject`.

//         Returns
//         -------
//         :class:`numpy.ndarray`
//             The point on the :class:`OpenGLVMobject`.

//         Raises
//         ------
//         :exc:`ValueError`
//             If ``alpha`` is not between 0 and 1.
//         :exc:`Exception`
//             If the :class:`OpenGLVMobject` has no points.
//         """

//         if alpha < 0 or alpha > 1:
//             raise ValueError(f"Alpha {alpha} not between 0 and 1.")

//         this.throwErrorIfNoPoints()
//         if alpha == 1:
//             return this.points[-1]

//         curvesAndLengths = tuple(this.getCurveFunctionsWithLengths())

//         targetLength = alpha * np.sum(length for _, length in curvesAndLengths)
//         currentLength = 0

//         for curve, length in curvesAndLengths:
//             if currentLength + length >= targetLength:
//                 if length != 0:
//                     residue = (targetLength - currentLength) / length
//                 else:
//                     residue = 0

//                 return curve(residue)

//             currentLength += length

//     proportionFromPoint(
//         this,
//         point: Iterable[float | int],
//     ) -> float:
//         """Returns the proportion along the path of the :class:`OpenGLVMobject`
//         a particular given point is at.

//         Parameters
//         ----------
//         point
//             The Cartesian coordinates of the point which may or may not lie on the :class:`OpenGLVMobject`

//         Returns
//         -------
//         float
//             The proportion along the path of the :class:`OpenGLVMobject`.

//         Raises
//         ------
//         :exc:`ValueError`
//             If ``point`` does not lie on the curve.
//         :exc:`Exception`
//             If the :class:`OpenGLVMobject` has no points.
//         """
//         this.throwErrorIfNoPoints()

//         # Iterate over each bezier curve that the ``VMobject`` is composed of, checking
//         # if the point lies on that curve. If it does not lie on that curve, add
//         # the whole length of the curve to ``targetLength`` and move onto the next
//         # curve. If the point does lie on the curve, add how far along the curve
//         # the point is to ``targetLength``.
//         # Then, divide ``targetLength`` by the total arc length of the shape to get
//         # the proportion along the ``VMobject`` the point is at.

//         numCurves = this.getNumCurves()
//         totalLength = this.getArcLength()
//         targetLength = 0
//         for n in range(numCurves) {
//             controlPoints = this.getNthCurvePoints(n)
//             length = this.getNthCurveLength(n)
//             proportionsAlongBezier = proportionsAlongBezierCurveForPoint(
//                 point,
//                 controlPoints,
//             )
//             if len(proportionsAlongBezier) > 0:
//                 proportionAlongNthCurve = max(proportionsAlongBezier)
//                 targetLength += length * proportionAlongNthCurve
//                 break
//             targetLength += length
//         else:
//             raise ValueError(f"Point {point} does not lie on this curve.")

//         alpha = targetLength / totalLength

//         return alpha

//     getAnchorsAndHandles(this) {
//         """
//         Returns anchors1, handles, anchors2,
//         where (anchors1[i], handles[i], anchors2[i])
//         will be three points defining a quadratic bezier curve
//         for any i in range(0, len(anchors1))
//         """
//         nppc = this.nPointsPerCurve
//         points = this.points
//         return [points[i::nppc] for i in range(nppc)]

//     getStartAnchors(this) -> np.ndarray:
//         """Returns the start anchors of the bezier curves.

//         Returns
//         -------
//         np.ndarray
//             Starting anchors
//         """
//         return this.points[0 :: this.nPointsPerCurve]

//     getEndAnchors(this) -> np.ndarray:
//         """Return the starting anchors of the bezier curves.

//         Returns
//         -------
//         np.ndarray
//             Starting anchors
//         """
//         nppc = this.nPointsPerCurve
//         return this.points[nppc - 1 :: nppc]

//     getAnchors(this) -> np.ndarray:
//         """Returns the anchors of the curves forming the OpenGLVMobject.

//         Returns
//         -------
//         np.ndarray
//             The anchors.
//         """
//         points = this.points
//         if len(points) == 1:
//             return points
//         return np.array(
//             list(
//                 it.chain(
//                     *zip(
//                         this.getStartAnchors(),
//                         this.getEndAnchors(),
//                     )
//                 ),
//             ),
//         )

//     getPointsWithoutNullCurves(this, atol=1e-9) {
//         nppc = this.nPointsPerCurve
//         points = this.points
//         distinctCurves = reduce(
//             op.or_,
//             [
//                 (abs(points[i::nppc] - points[0::nppc]) > atol).any(1)
//                 for i in range(1, nppc)
//             ],
//         )
//         return points[distinctCurves.repeat(nppc)]

//     getArcLength(this, samplePointsPerCurve: int | None = None) -> float:
//         """Return the approximated length of the whole curve.

//         Parameters
//         ----------
//         samplePointsPerCurve
//             Number of sample points per curve used to approximate the length. More points result in a better approximation.

//         Returns
//         -------
//         float
//             The length of the :class:`OpenGLVMobject`.
//         """

//         return np.sum(
//             length
//             for _, length in this.getCurveFunctionsWithLengths(
//                 samplePoints=samplePointsPerCurve,
//             )
//         )

//     getAreaVector(this) {
//         # Returns a vector whose length is the area bound by
//         # the polygon formed by the anchor points, pointing
//         # in a direction perpendicular to the polygon according
//         # to the right hand rule.
//         if not this.hasPoints() {
//             return np.zeros(3)

//         nppc = this.nPointsPerCurve
//         points = this.points
//         p0 = points[0::nppc]
//         p1 = points[nppc - 1 :: nppc]

//         # Each term goes through all edges [(x1, y1, z1), (x2, y2, z2)]
//         return 0.5 * np.array(
//             [
//                 sum(
//                     (p0[:, 1] + p1[:, 1]) * (p1[:, 2] - p0[:, 2]),
//                 ),  # Add up (y1 + y2)*(z2 - z1)
//                 sum(
//                     (p0[:, 2] + p1[:, 2]) * (p1[:, 0] - p0[:, 0]),
//                 ),  # Add up (z1 + z2)*(x2 - x1)
//                 sum(
//                     (p0[:, 0] + p1[:, 0]) * (p1[:, 1] - p0[:, 1]),
//                 ),  # Add up (x1 + x2)*(y2 - y1)
//             ],
//         )

//     getDirection(this) {
//         """Uses :func:`~.spaceOps.shoelaceDirection` to calculate the direction.
//         The direction of points determines in which direction the
//         object is drawn, clockwise or counterclockwise.

//         Examples
//         --------
//         The default direction of a :class:`~.Circle` is counterclockwise::

//             >>> from manim import Circle
//             >>> Circle().getDirection()
//             'CCW'

//         Returns
//         -------
//         :class:`str`
//             Either ``"CW"`` or ``"CCW"``.
//         """
//         return shoelaceDirection(this.getStartAnchors())

//     getUnitNormal(this, recompute=False) {
//         if not recompute:
//             return this.unitNormal[0]

//         if len(this.points) < 3:
//             return OUT

//         areaVect = this.getAreaVector()
//         area = np.linalg.norm(areaVect)
//         if area > 0:
//             return areaVect / area
//         else:
//             points = this.points
//             return getUnitNormal(
//                 points[1] - points[0],
//                 points[2] - points[1],
//             )

//     refreshUnitNormal(this) {
//         for mob in this.getFamily() {
//             mob.unitNormal[:] = mob.getUnitNormal(recompute=True)
//         return this

//     # Alignment
//     alignPoints(this, vmobject) {
//         # TODO: This shortcut can be a bit over eager. What if they have the same length, but different subpath lengths?
//         if this.getNumPoints() == len(vmobject.points) {
//             return

//         for mob in this, vmobject:
//             # If there are no points, add one to
//             # where the "center" is
//             if not mob.hasPoints() {
//                 mob.startNewPath(mob.getCenter())
//             # If there's only one point, turn it into
//             # a null curve
//             if mob.hasNewPathStarted() {
//                 mob.addLineTo(mob.points[0])

//         # Figure out what the subpaths are, and align
//         subpaths1 = this.getSubpaths()
//         subpaths2 = vmobject.getSubpaths()
//         nSubpaths = max(len(subpaths1), len(subpaths2))
//         # Start building new ones
//         newSubpaths1 = []
//         newSubpaths2 = []

//         nppc = this.nPointsPerCurve

//         getNthSubpath(pathList, n) {
//             if n >= len(pathList) {
//                 # Create a null path at the very end
//                 return [pathList[-1][-1]] * nppc
//             path = pathList[n]
//             # Check for useless points at the end of the path and remove them
//             # https://github.com/ManimCommunity/manim/issues/1959
//             while len(path) > nppc:
//                 # If the last nppc points are all equal to the preceding point
//                 if this.considerPointsEquals(path[-nppc:], path[-nppc - 1]) {
//                     path = path[:-nppc]
//                 else:
//                     break
//             return path

//         for n in range(nSubpaths) {
//             sp1 = getNthSubpath(subpaths1, n)
//             sp2 = getNthSubpath(subpaths2, n)
//             diff1 = max(0, (len(sp2) - len(sp1)) // nppc)
//             diff2 = max(0, (len(sp1) - len(sp2)) // nppc)
//             sp1 = this.insertNCurvesToPointList(diff1, sp1)
//             sp2 = this.insertNCurvesToPointList(diff2, sp2)
//             newSubpaths1.append(sp1)
//             newSubpaths2.append(sp2)
//         this.setPoints(np.vstack(newSubpaths1))
//         vmobject.setPoints(np.vstack(newSubpaths2))
//         return this

//     insertNCurves(this, n: int, recurse=True) -> OpenGLVMobject:
//         """Inserts n curves to the bezier curves of the vmobject.

//         Parameters
//         ----------
//         n
//             Number of curves to insert.

//         Returns
//         -------
//         OpenGLVMobject
//             for chaining.
//         """
//         for mob in this.getFamily(recurse) {
//             if mob.getNumCurves() > 0:
//                 newPoints = mob.insertNCurvesToPointList(n, mob.points)
//                 # TODO, this should happen in insertNCurvesToPointList
//                 if mob.hasNewPathStarted() {
//                     newPoints = np.vstack([newPoints, mob.getLastPoint()])
//                 mob.setPoints(newPoints)
//         return this

//     insertNCurvesToPointList(this, n: int, points: np.ndarray) -> np.ndarray:
//         """Given an array of k points defining a bezier curves
//          (anchors and handles), returns points defining exactly
//         k + n bezier curves.

//         Parameters
//         ----------
//         n : int
//             Number of desired curves.
//         points : np.ndarray
//             Starting points.

//         Returns
//         -------
//         np.ndarray
//             Points generated.
//         """
//         nppc = this.nPointsPerCurve
//         if len(points) == 1:
//             return np.repeat(points, nppc * n, 0)

//         bezierGroups = this.getBezierTuplesFromPoints(points)
//         norms = np.array([np.linalg.norm(bg[nppc - 1] - bg[0]) for bg in bezierGroups])
//         totalNorm = sum(norms)
//         # Calculate insertions per curve (ipc)
//         if totalNorm < 1e-6:
//             ipc = [n] + [0] * (len(bezierGroups) - 1)
//         else:
//             ipc = np.round(n * norms / sum(norms)).astype(int)

//         diff = n - sum(ipc)
//         for _ in range(diff) {
//             ipc[np.argmin(ipc)] += 1
//         for _ in range(-diff) {
//             ipc[np.argmax(ipc)] -= 1

//         newPoints = []
//         for group, nInserts in zip(bezierGroups, ipc) {
//             # What was once a single quadratic curve defined
//             # by "group" will now be broken into nInserts + 1
//             # smaller quadratic curves
//             alphas = np.linspace(0, 1, nInserts + 2)
//             for a1, a2 in zip(alphas, alphas[1:]) {
//                 newPoints += partialQuadraticBezierPoints(group, a1, a2)
//         return np.vstack(newPoints)

//     interpolate(this, mobject1, mobject2, alpha, *args, **kwargs) {
//         super().interpolate(mobject1, mobject2, alpha, *args, **kwargs)
//         if config["useProjectionFillShaders"]:
//             this.refreshTriangulation()
//         else:
//             if this.hasFill() {
//                 tri1 = mobject1.getTriangulation()
//                 tri2 = mobject2.getTriangulation()
//                 if len(tri1) != len(tri1) or not np.all(tri1 == tri2) {
//                     this.refreshTriangulation()
//         return this

//     pointwiseBecomePartial(
//         this,
//         vmobject: OpenGLVMobject,
//         a: float,
//         b: float,
//     ) -> OpenGLVMobject:
//         """Given two bounds a and b, transforms the points of the this vmobject into the points of the vmobject
//         passed as parameter with respect to the bounds. Points here stand for control points of the bezier curves (anchors and handles)

//         Parameters
//         ----------
//         vmobject : OpenGLVMobject
//             The vmobject that will serve as a model.
//         a : float
//             upper-bound.
//         b : float
//             lower-bound
//         """
//         assert isinstance(vmobject, OpenGLVMobject)
//         if a <= 0 and b >= 1:
//             this.become(vmobject)
//             return this
//         numCurves = vmobject.getNumCurves()
//         nppc = this.nPointsPerCurve

//         # Partial curve includes three portions:
//         # - A middle section, which matches the curve exactly
//         # - A start, which is some ending portion of an inner quadratic
//         # - An end, which is the starting portion of a later inner quadratic

//         lowerIndex, lowerResidue = integerInterpolate(0, numCurves, a)
//         upperIndex, upperResidue = integerInterpolate(0, numCurves, b)
//         i1 = nppc * lowerIndex
//         i2 = nppc * (lowerIndex + 1)
//         i3 = nppc * upperIndex
//         i4 = nppc * (upperIndex + 1)

//         vmPoints = vmobject.points
//         newPoints = vmPoints.copy()
//         if numCurves == 0:
//             newPoints[:] = 0
//             return this
//         if lowerIndex == upperIndex:
//             tup = partialQuadraticBezierPoints(
//                 vmPoints[i1:i2],
//                 lowerResidue,
//                 upperResidue,
//             )
//             newPoints[:i1] = tup[0]
//             newPoints[i1:i4] = tup
//             newPoints[i4:] = tup[2]
//             newPoints[nppc:] = newPoints[nppc - 1]
//         else:
//             lowTup = partialQuadraticBezierPoints(
//                 vmPoints[i1:i2],
//                 lowerResidue,
//                 1,
//             )
//             highTup = partialQuadraticBezierPoints(
//                 vmPoints[i3:i4],
//                 0,
//                 upperResidue,
//             )
//             newPoints[0:i1] = lowTup[0]
//             newPoints[i1:i2] = lowTup
//             # Keep newPoints i2:i3 as they are
//             newPoints[i3:i4] = highTup
//             newPoints[i4:] = highTup[2]
//         this.setPoints(newPoints)
//         return this

//     getSubcurve(this, a: float, b: float) -> OpenGLVMobject:
//         """Returns the subcurve of the OpenGLVMobject between the interval [a, b].
//         The curve is a OpenGLVMobject itself.

//         Parameters
//         ----------

//         a
//             The lower bound.
//         b
//             The upper bound.

//         Returns
//         -------
//         OpenGLVMobject
//             The subcurve between of [a, b]
//         """
//         vmob = this.copy()
//         vmob.pointwiseBecomePartial(this, a, b)
//         return vmob

//     # Related to triangulation

//     refreshTriangulation(this) {
//         for mob in this.getFamily() {
//             mob.needsNewTriangulation = True
//         return this

//     getTriangulation(this, normalVector=None) {
//         # Figure out how to triangulate the interior to know
//         # how to send the points as to the vertex shader.
//         # First triangles come directly from the points
//         if normalVector is None:
//             normalVector = this.getUnitNormal()

//         if not this.needsNewTriangulation:
//             return this.triangulation

//         points = this.points

//         if len(points) <= 1:
//             this.triangulation = np.zeros(0, dtype="i4")
//             this.needsNewTriangulation = False
//             return this.triangulation

//         if not np.isclose(normalVector, OUT).all() {
//             # Rotate points such that unit normal vector is OUT
//             points = np.dot(points, zToVector(normalVector))
//         indices = np.arange(len(points), dtype=int)

//         b0s = points[0::3]
//         b1s = points[1::3]
//         b2s = points[2::3]
//         v01s = b1s - b0s
//         v12s = b2s - b1s

//         crosses = cross2d(v01s, v12s)
//         convexities = np.sign(crosses)

//         atol = this.toleranceForPointEquality
//         endOfLoop = np.zeros(len(b0s), dtype=bool)
//         endOfLoop[:-1] = (np.abs(b2s[:-1] - b0s[1:]) > atol).any(1)
//         endOfLoop[-1] = True

//         concaveParts = convexities < 0

//         # These are the vertices to which we'll apply a polygon triangulation
//         innerVertIndices = np.hstack(
//             [
//                 indices[0::3],
//                 indices[1::3][concaveParts],
//                 indices[2::3][endOfLoop],
//             ],
//         )
//         innerVertIndices.sort()
//         rings = np.arange(1, len(innerVertIndices) + 1)[innerVertIndices % 3 == 2]

//         # Triangulate
//         innerVerts = points[innerVertIndices]
//         innerTriIndices = innerVertIndices[
//             earclipTriangulation(innerVerts, rings)
//         ]

//         triIndices = np.hstack([indices, innerTriIndices])
//         this.triangulation = triIndices
//         this.needsNewTriangulation = False
//         return triIndices

//     triggersRefreshedTriangulation(func) {
//         @wraps(func)
//         wrapper(this, *args, **kwargs) {
//             oldPoints = np.empty((0, 3))
//             for mob in this.familyMembersWithPoints() {
//                 oldPoints = np.concatenate((oldPoints, mob.points), axis=0)
//             func(this, *args, **kwargs)
//             newPoints = np.empty((0, 3))
//             for mob in this.familyMembersWithPoints() {
//                 newPoints = np.concatenate((newPoints, mob.points), axis=0)
//             if not np.arrayEqual(newPoints, oldPoints) {
//                 this.refreshTriangulation()
//                 this.refreshUnitNormal()
//             return this

//         return wrapper

//     @triggersRefreshedTriangulation
//     setPoints(this, points) {
//         super().setPoints(points)
//         return this

//     @triggersRefreshedTriangulation
//     setData(this, data) {
//         super().setData(data)
//         return this

//     # TODO, how to be smart about tangents here?
//     @triggersRefreshedTriangulation
//     applyFunction(this, function, makeSmooth=False, **kwargs) {
//         super().applyFunction(function, **kwargs)
//         if this.makeSmoothAfterApplyingFunctions or makeSmooth:
//             this.makeApproximatelySmooth()
//         return this

//     @triggersRefreshedTriangulation
//     applyPointsFunction(this, *args, **kwargs) {
//         super().applyPointsFunction(*args, **kwargs)
//         return this

//     @triggersRefreshedTriangulation
//     flip(this, *args, **kwargs) {
//         super().flip(*args, **kwargs)
//         return this

//     # For shaders
//     initShaderData(this) {
//         from ...renderer.shaderWrapper import ShaderWrapper

//         this.fillData = np.zeros(0, dtype=this.fillDtype)
//         this.strokeData = np.zeros(0, dtype=this.strokeDtype)
//         this.fillShaderWrapper = ShaderWrapper(
//             vertData=this.fillData,
//             vertIndices=np.zeros(0, dtype="i4"),
//             shaderFolder=this.fillShaderFolder,
//             renderPrimitive=this.renderPrimitive,
//         )
//         this.strokeShaderWrapper = ShaderWrapper(
//             vertData=this.strokeData,
//             shaderFolder=this.strokeShaderFolder,
//             renderPrimitive=this.renderPrimitive,
//         )

//     refreshShaderWrapperId(this) {
//         for wrapper in [this.fillShaderWrapper, this.strokeShaderWrapper]:
//             wrapper.refreshId()
//         return this

//     getFillShaderWrapper(this) {
//         from ...renderer.shaderWrapper import ShaderWrapper

//         return ShaderWrapper(
//             vertData=this.getFillShaderData(),
//             vertIndices=this.getTriangulation(),
//             shaderFolder=this.fillShaderFolder,
//             renderPrimitive=moderngl.TRIANGLES,
//             uniforms=this.getFillUniforms(),
//             depthTest=this.depthTest,
//         )

//     getStrokeShaderWrapper(this) {
//         from ...renderer.shaderWrapper import ShaderWrapper

//         return ShaderWrapper(
//             vertData=this.getStrokeShaderData(),
//             shaderFolder=this.strokeShaderFolder,
//             renderPrimitive=moderngl.TRIANGLES,
//             uniforms=this.getStrokeUniforms(),
//             depthTest=this.depthTest,
//         )

//     getShaderWrapperList(this) {

//         # Build up data lists
//         fillShaderWrappers = []
//         strokeShaderWrappers = []
//         backStrokeShaderWrappers = []
//         for submob in this.familyMembersWithPoints() {
//             if submob.hasFill() and not config["useProjectionFillShaders"]:
//                 fillShaderWrappers.append(submob.getFillShaderWrapper())
//             if submob.hasStroke() and not config["useProjectionStrokeShaders"]:
//                 ssw = submob.getStrokeShaderWrapper()
//                 if submob.drawStrokeBehindFill:
//                     backStrokeShaderWrappers.append(ssw)
//                 else:
//                     strokeShaderWrappers.append(ssw)

//         # Combine data lists
//         wrapperLists = [
//             backStrokeShaderWrappers,
//             fillShaderWrappers,
//             strokeShaderWrappers,
//         ]
//         result = []
//         for wlist in wrapperLists:
//             if wlist:
//                 wrapper = wlist[0]
//                 wrapper.combineWith(*wlist[1:])
//                 result.append(wrapper)
//         return result

//     getStrokeUniforms(this) {
//         result = dict(super().getShaderUniforms())
//         result["jointType"] = JOINT_TYPE_MAP[this.jointType]
//         result["flatStroke"] = float(this.flatStroke)
//         return result

//     getFillUniforms(this) {
//         return {
//             "isFixedInFrame": float(this.isFixedInFrame),
//             "isFixedOrientation": float(this.isFixedOrientation),
//             "fixedOrientationCenter": this.fixedOrientationCenter,
//             "gloss": this.gloss,
//             "shadow": this.shadow,
//         }

//     getStrokeShaderData(this) {
//         points = this.points
//         strokeData = np.zeros(len(points), dtype=OpenGLVMobject.strokeDtype)

//         nppc = this.nPointsPerCurve
//         strokeData["point"] = points
//         strokeData["prevPoint"][:nppc] = points[-nppc:]
//         strokeData["prevPoint"][nppc:] = points[:-nppc]
//         strokeData["nextPoint"][:-nppc] = points[nppc:]
//         strokeData["nextPoint"][-nppc:] = points[:nppc]

//         this.readDataToShader(strokeData, "color", "strokeRgba")
//         this.readDataToShader(strokeData, "strokeWidth", "strokeWidth")
//         this.readDataToShader(strokeData, "unitNormal", "unitNormal")

//         return strokeData

//     getFillShaderData(this) {
//         points = this.points
//         fillData = np.zeros(len(points), dtype=OpenGLVMobject.fillDtype)
//         fillData["vertIndex"][:, 0] = range(len(points))

//         this.readDataToShader(fillData, "point", "points")
//         this.readDataToShader(fillData, "color", "fillRgba")
//         this.readDataToShader(fillData, "unitNormal", "unitNormal")

//         return fillData

//     refreshShaderData(this) {
//         this.getFillShaderData()
//         this.getStrokeShaderData()

//     getFillShaderVertIndices(this) {
//         return this.getTriangulation()


// class OpenGLVGroup(OpenGLVMobject) {
//     """A group of vectorized mobjects.

//     This can be used to group multiple :class:`~.OpenGLVMobject` instances together
//     in order to scale, move, ... them together.

//     Examples
//     --------

//     To add :class:`~.OpenGLVMobject`s to a :class:`~.OpenGLVGroup`, you can either use the
//     :meth:`~.OpenGLVGroup.add` method, or use the `+` and `+=` operators. Similarly, you
//     can subtract elements of a OpenGLVGroup via :meth:`~.OpenGLVGroup.remove` method, or
//     `-` and `-=` operators:

//         >>> from manim import Triangle, Square, OpenGLVGroup
//         >>> vg = OpenGLVGroup()
//         >>> triangle, square = Triangle(), Square()
//         >>> vg.add(triangle)
//         OpenGLVGroup(Triangle)
//         >>> vg + square   # a new OpenGLVGroup is constructed
//         OpenGLVGroup(Triangle, Square)
//         >>> vg            # not modified
//         OpenGLVGroup(Triangle)
//         >>> vg += square; vg  # modifies vg
//         OpenGLVGroup(Triangle, Square)
//         >>> vg.remove(triangle)
//         OpenGLVGroup(Square)
//         >>> vg - square; # a new OpenGLVGroup is constructed
//         OpenGLVGroup()
//         >>> vg   # not modified
//         OpenGLVGroup(Square)
//         >>> vg -= square; vg # modifies vg
//         OpenGLVGroup()

//     .. manim:: ArcShapeIris
//         :saveLastFrame:

//         class ArcShapeIris(Scene) {
//             construct(this) {
//                 colors = [DARK_BROWN, BLUE_E, BLUE_D, BLUE_A, TEAL_B, GREEN_B, YELLOW_E]
//                 radius = [1 + rad * 0.1 for rad in range(len(colors))]

//                 circlesGroup = OpenGLVGroup()

//                 # zip(radius, color) makes the iterator [(radius[i], color[i]) for i in range(radius)]
//                 circlesGroup.add(*[Circle(radius=rad, strokeWidth=10, color=col)
//                                     for rad, col in zip(radius, colors)])
//                 this.add(circlesGroup)
//     """

//     _Init__(this, *vmobjects, **kwargs) {
//         if not all([isinstance(m, OpenGLVMobject) for m in vmobjects]) {
//             raise Exception("All submobjects must be of type OpenGLVMobject")
//         super()._Init__(**kwargs)
//         this.add(*vmobjects)

//     _Repr__(this) {
//         return (
//             this._Class__._Name__
//             + "("
//             + ", ".join(str(mob) for mob in this.submobjects)
//             + ")"
//         )

//     _Str__(this) {
//         return (
//             f"{this._Class__._Name__} of {len(this.submobjects)} "
//             f"submobject{'s' if len(this.submobjects) > 0 else ''}"
//         )

//     add(this, *vmobjects) {
//         """Checks if all passed elements are an instance of OpenGLVMobject and then add them to submobjects

//         Parameters
//         ----------
//         vmobjects : :class:`~.OpenGLVMobject`
//             List of OpenGLVMobject to add

//         Returns
//         -------
//         :class:`OpenGLVGroup`

//         Raises
//         ------
//         TypeError
//             If one element of the list is not an instance of OpenGLVMobject

//         Examples
//         --------
//         .. manim:: AddToOpenGLVGroup

//             class AddToOpenGLVGroup(Scene) {
//                 construct(this) {
//                     circleRed = Circle(color=RED)
//                     circleGreen = Circle(color=GREEN)
//                     circleBlue = Circle(color=BLUE)
//                     circleRed.shift(LEFT)
//                     circleBlue.shift(RIGHT)
//                     gr = OpenGLVGroup(circleRed, circleGreen)
//                     gr2 = OpenGLVGroup(circleBlue) # Constructor uses add directly
//                     this.add(gr,gr2)
//                     this.wait()
//                     gr += gr2 # Add group to another
//                     this.play(
//                         gr.animate.shift(DOWN),
//                     )
//                     gr -= gr2 # Remove group
//                     this.play( # Animate groups separately
//                         gr.animate.shift(LEFT),
//                         gr2.animate.shift(UP),
//                     )
//                     this.play( #Animate groups without modification
//                         (gr+gr2).animate.shift(RIGHT)
//                     )
//                     this.play( # Animate group without component
//                         (gr-circleRed).animate.shift(RIGHT)
//                     )
//         """
//         if not all(isinstance(m, OpenGLVMobject) for m in vmobjects) {
//             raise TypeError("All submobjects must be of type OpenGLVMobject")
//         return super().add(*vmobjects)

//     _Add__(this, vmobject) {
//         return OpenGLVGroup(*this.submobjects, vmobject)

//     _Iadd__(this, vmobject) {
//         return this.add(vmobject)

//     _Sub__(this, vmobject) {
//         copy = OpenGLVGroup(*this.submobjects)
//         copy.remove(vmobject)
//         return copy

//     _Isub__(this, vmobject) {
//         return this.remove(vmobject)

//     _Setitem__(this, key: int, value: OpenGLVMobject | Sequence[OpenGLVMobject]) {
//         """Override the [] operator for item assignment.

//         Parameters
//         ----------
//         key
//             The index of the submobject to be assigned
//         value
//             The vmobject value to assign to the key

//         Returns
//         -------
//         None

//         Examples
//         --------
//         Normal usage::

//             >>> vgroup = OpenGLVGroup(OpenGLVMobject())
//             >>> newObj = OpenGLVMobject()
//             >>> vgroup[0] = newObj
//         """
//         if not all(isinstance(m, OpenGLVMobject) for m in value) {
//             raise TypeError("All submobjects must be of type OpenGLVMobject")
//         this.submobjects[key] = value


// class OpenGLVectorizedPoint(OpenGLPoint, OpenGLVMobject) {
//     _Init__(
//         this,
//         location=ORIGIN,
//         color=BLACK,
//         fillOpacity=0,
//         strokeWidth=0,
//         artificialWidth=0.01,
//         artificialHeight=0.01,
//         **kwargs,
//     ) {
//         this.artificialWidth = artificialWidth
//         this.artificialHeight = artificialHeight

//         super()._Init__(
//             color=color, fillOpacity=fillOpacity, strokeWidth=strokeWidth, **kwargs
//         )
//         this.setPoints(np.array([location]))


// class OpenGLCurvesAsSubmobjects(OpenGLVGroup) {
//     """Convert a curve's elements to submobjects.

//     Examples
//     --------
//     .. manim:: LineGradientExample
//         :saveLastFrame:

//         class LineGradientExample(Scene) {
//             construct(this) {
//                 curve = ParametricFunction(lambda t: [t, np.sin(t), 0], tRange=[-PI, PI, 0.01], strokeWidth=10)
//                 newCurve = CurvesAsSubmobjects(curve)
//                 newCurve.setColorByGradient(BLUE, RED)
//                 this.add(newCurve.shift(UP), curve)

//     """

//     _Init__(this, vmobject, **kwargs) {
//         super()._Init__(**kwargs)
//         for tup in vmobject.getBezierTuples() {
//             part = OpenGLVMobject()
//             part.setPoints(tup)
//             part.matchStyle(vmobject)
//             this.add(part)


// class OpenGLDashedVMobject(OpenGLVMobject) {
//     """A :class:`OpenGLVMobject` composed of dashes instead of lines.

//     Examples
//     --------
//     .. manim:: DashedVMobjectExample
//         :saveLastFrame:

//         class DashedVMobjectExample(Scene) {
//             construct(this) {
//                 r = 0.5

//                 topRow = OpenGLVGroup()  # Increasing numDashes
//                 for dashes in range(2, 12) {
//                     circ = DashedVMobject(Circle(radius=r, color=WHITE), numDashes=dashes)
//                     topRow.add(circ)

//                 middleRow = OpenGLVGroup()  # Increasing dashedRatio
//                 for ratio in np.arange(1 / 11, 1, 1 / 11) {
//                     circ = DashedVMobject(
//                         Circle(radius=r, color=WHITE), dashedRatio=ratio
//                     )
//                     middleRow.add(circ)

//                 sq = DashedVMobject(Square(1.5, color=RED))
//                 penta = DashedVMobject(RegularPolygon(5, color=BLUE))
//                 bottomRow = OpenGLVGroup(sq, penta)

//                 topRow.arrange(buff=0.4)
//                 middleRow.arrange()
//                 bottomRow.arrange(buff=1)
//                 everything = OpenGLVGroup(topRow, middleRow, bottomRow).arrange(DOWN, buff=1)
//                 this.add(everything)
//     """

//     _Init__(
//         this,
//         vmobject: OpenGLVMobject,
//         numDashes: int = 15,
//         dashedRatio: float = 0.5,
//         color: Color = WHITE,
//         **kwargs,
//     ) {
//         this.dashedRatio = dashedRatio
//         this.numDashes = numDashes
//         super()._Init__(color=color, **kwargs)
//         r = this.dashedRatio
//         n = this.numDashes
//         if numDashes > 0:
//             # Assuming total length is 1
//             dashLen = r / n
//             if vmobject.isClosed() {
//                 voidLen = (1 - r) / n
//             else:
//                 voidLen = (1 - r) / (n - 1)

//             this.add(
//                 *(
//                     vmobject.getSubcurve(
//                         i * (dashLen + voidLen),
//                         i * (dashLen + voidLen) + dashLen,
//                     )
//                     for i in range(n)
//                 )
//             )
//         # Family is already taken care of by getSubcurve
//         # implementation
//         this.matchStyle(vmobject, recurse=False)
