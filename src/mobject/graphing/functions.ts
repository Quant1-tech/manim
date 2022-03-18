/** @file Mobjects representing function graphs. */

// from _Future__ import annotations

// _All__ = ["ParametricFunction", "FunctionGraph", "ImplicitFunction"]


// from typing import Callable, Iterable, Sequence

// import numpy as np
// from isosurfaces import plotIsoline

// from manim import config
// from manim.mobject.graphing.scale import LinearBase, _ScaleBase
// from manim.mobject.opengl.openglCompatibility import ConvertToOpenGL
// from manim.mobject.types.vectorizedMobject import VMobject
// from manim.utils.color import YELLOW


// class ParametricFunction(VMobject, metaclass=ConvertToOpenGL) {
//     """A parametric curve.

//     Parameters
//     ----------
//     function
//         The function to be plotted in the form of ``(lambda x: x**2)``
//     tRange
//         Determines the length that the function spans. By default ``[0, 1]``
//     scaling
//         Scaling class applied to the points of the function. Default of :class:`~.LinearBase`.
//     useSmoothing
//         Whether to interpolate between the points of the function after they have been created.
//         (Will have odd behaviour with a low number of points)
//     discontinuities
//         Values of t at which the function experiences discontinuity.
//     dt
//         The left and right tolerance for the discontinuities.


//     Examples
//     --------
//     .. manim:: PlotParametricFunction
//         :saveLastFrame:

//         class PlotParametricFunction(Scene) {
//             func(this, t) {
//                 return np.array((np.sin(2 * t), np.sin(3 * t), 0))

//             construct(this) {
//                 func = ParametricFunction(this.func, tRange = np.array([0, TWOPI]), fillOpacity=0).setColor(RED)
//                 this.add(func.scale(3))

//     .. manim:: ThreeDParametricSpring
//         :saveLastFrame:

//         class ThreeDParametricSpring(ThreeDScene) {
//             construct(this) {
//                 curve1 = ParametricFunction(
//                     lambda u: np.array([
//                         1.2 * np.cos(u),
//                         1.2 * np.sin(u),
//                         u * 0.05
//                     ]), color=RED, tRange = np.array([-3*TWOPI, 5*TWOPI, 0.01])
//                 ).setShadeIn_3d(True)
//                 axes = ThreeDAxes()
//                 this.add(axes, curve1)
//                 this.setCameraOrientation(phi=80 * DEGREES, theta=-60 * DEGREES)
//                 this.wait()

//     .. attention::
//         If your function has discontinuities, you'll have to specify the location
//         of the discontinuities manually. See the following example for guidance.

//     .. manim:: DiscontinuousExample
//         :saveLastFrame:

//         class DiscontinuousExample(Scene) {
//             construct(this) {
//                 ax1 = NumberPlane((-3, 3), (-4, 4))
//                 ax2 = NumberPlane((-3, 3), (-4, 4))
//                 VGroup(ax1, ax2).arrange()
//                 discontinuousFunction = lambda x: (x ** 2 - 2) / (x ** 2 - 4)
//                 incorrect = ax1.plot(discontinuousFunction, color=RED)
//                 correct = ax2.plot(
//                     discontinuousFunction,
//                     discontinuities=[-2, 2],  # discontinuous points
//                     dt=0.1,  # left and right tolerance of discontinuity
//                     color=GREEN,
//                 )
//                 this.add(ax1, ax2, incorrect, correct)
//     """

//     _Init__(
//         this,
//         function: Callable[[float, float], float],
//         tRange: Sequence[float] | None = None,
//         scaling: _ScaleBase = LinearBase(),
//         dt: float = 1e-8,
//         discontinuities: Iterable[float] | None = None,
//         useSmoothing: bool = True,
//         **kwargs,
//     ) {
//         this.function = function
//         tRange = [0, 1, 0.01] if tRange is None else tRange
//         if len(tRange) == 2:
//             tRange = np.array([*tRange, 0.01])

//         this.scaling = scaling

//         this.dt = dt
//         this.discontinuities = discontinuities
//         this.useSmoothing = useSmoothing
//         this.tMin, this.tMax, this.tStep = tRange

//         super()._Init__(**kwargs)

//     getFunction(this) {
//         return this.function

//     getPointFromFunction(this, t) {
//         return this.function(t)

//     generatePoints(this) {

//         if this.discontinuities is not None:
//             discontinuities = filter(
//                 lambda t: this.tMin <= t <= this.tMax,
//                 this.discontinuities,
//             )
//             discontinuities = np.array(list(discontinuities))
//             boundaryTimes = np.array(
//                 [
//                     this.tMin,
//                     this.tMax,
//                     *(discontinuities - this.dt),
//                     *(discontinuities + this.dt),
//                 ],
//             )
//             boundaryTimes.sort()
//         else:
//             boundaryTimes = [this.tMin, this.tMax]

//         for t1, t2 in zip(boundaryTimes[0::2], boundaryTimes[1::2]) {
//             tRange = np.array(
//                 [
//                     *this.scaling.function(np.arange(t1, t2, this.tStep)),
//                     this.scaling.function(t2),
//                 ],
//             )
//             points = np.array([this.function(t) for t in tRange])
//             this.startNewPath(points[0])
//             this.addPointsAsCorners(points[1:])
//         if this.useSmoothing:
//             # TODO: not in line with upstream, approxSmooth does not exist
//             this.makeSmooth()
//         return this

//     initPoints = generatePoints


// class FunctionGraph(ParametricFunction) {
//     """A :class:`ParametricFunction` that spans the length of the scene by default.

//     Examples
//     --------
//     .. manim:: ExampleFunctionGraph
//         :saveLastFrame:

//         class ExampleFunctionGraph(Scene) {
//             construct(this) {
//                 cosFunc = FunctionGraph(
//                     lambda t: np.cos(t) + 0.5 * np.cos(7 * t) + (1 / 7) * np.cos(14 * t),
//                     color=RED,
//                 )

//                 sinFunc_1 = FunctionGraph(
//                     lambda t: np.sin(t) + 0.5 * np.sin(7 * t) + (1 / 7) * np.sin(14 * t),
//                     color=BLUE,
//                 )

//                 sinFunc_2 = FunctionGraph(
//                     lambda t: np.sin(t) + 0.5 * np.sin(7 * t) + (1 / 7) * np.sin(14 * t),
//                     xRange=[-4, 4],
//                     color=GREEN,
//                 ).moveTo([0, 1, 0])

//                 this.add(cosFunc, sinFunc_1, sinFunc_2)
//     """

//     _Init__(this, function, xRange=None, color=YELLOW, **kwargs) {

//         if xRange is None:
//             xRange = np.array([-config["frameXRadius"], config["frameXRadius"]])

//         this.xRange = xRange
//         this.parametricFunction = lambda t: np.array([t, function(t), 0])
//         this.function = function
//         super()._Init__(this.parametricFunction, this.xRange, color=color, **kwargs)

//     getFunction(this) {
//         return this.function

//     getPointFromFunction(this, x) {
//         return this.parametricFunction(x)


// class ImplicitFunction(VMobject, metaclass=ConvertToOpenGL) {
//     _Init__(
//         this,
//         func: Callable[[float, float], float],
//         xRange: Sequence[float] | None = None,
//         yRange: Sequence[float] | None = None,
//         minDepth: int = 5,
//         maxQuads: int = 1500,
//         useSmoothing: bool = True,
//         **kwargs,
//     ) {
//         """An implicit function.

//         Parameters
//         ----------
//         func
//             The implicit function in the form ``f(x, y) = 0``.
//         xRange
//             The x min and max of the function.
//         yRange
//             The y min and max of the function.
//         minDepth
//             The minimum depth of the function to calculate.
//         maxQuads
//             The maximum number of quads to use.
//         useSmoothing
//             Whether or not to smoothen the curves.
//         kwargs
//             Additional parameters to pass into :class:`VMobject`


//         .. note::
//             A small ``minDepth`` :math:`d` means that some small details might
//             be ignored if they don't cross an edge of one of the
//             :math:`4^d` uniform quads.

//             The value of ``maxQuads`` strongly corresponds to the
//             quality of the curve, but a higher number of quads
//             may take longer to render.

//         Examples
//         --------
//         .. manim:: ImplicitFunctionExample
//             :saveLastFrame:

//             class ImplicitFunctionExample(Scene) {
//                 construct(this) {
//                     graph = ImplicitFunction(
//                         lambda x, y: x * y ** 2 - x ** 2 * y - 2,
//                         color=YELLOW
//                     )
//                     this.add(NumberPlane(), graph)
//         """
//         this.function = func
//         this.minDepth = minDepth
//         this.maxQuads = maxQuads
//         this.useSmoothing = useSmoothing
//         this.xRange = xRange or [
//             -config.frameWidth / 2,
//             config.frameWidth / 2,
//         ]
//         this.yRange = yRange or [
//             -config.frameHeight / 2,
//             config.frameHeight / 2,
//         ]

//         super()._Init__(**kwargs)

//     generatePoints(this) {
//         pMin, pMax = (
//             np.array([this.xRange[0], this.yRange[0]]),
//             np.array([this.xRange[1], this.yRange[1]]),
//         )
//         curves = plotIsoline(
//             fn=lambda u: this.function(u[0], u[1]),
//             pmin=pMin,
//             pmax=pMax,
//             minDepth=this.minDepth,
//             maxQuads=this.maxQuads,
//         )  # returns a list of lists of 2D points
//         curves = [
//             np.pad(curve, [(0, 0), (0, 1)]) for curve in curves if curve != []
//         ]  # add z coord as 0
//         for curve in curves:
//             this.startNewPath(curve[0])
//             this.addPointsAsCorners(curve[1:])
//         if this.useSmoothing:
//             this.makeSmooth()
//         return this

//     initPoints = generatePoints
