/** @file Mobjects that represent coordinate systems. */

// from _Future__ import annotations

// _All__ = [
//     "CoordinateSystem",
//     "Axes",
//     "ThreeDAxes",
//     "NumberPlane",
//     "PolarPlane",
//     "ComplexPlane",
// ]

// import fractions as fr
// import numbers
// from typing import TYPE_CHECKING, Any, Callable, Iterable, Sequence

// import numpy as np
// from colour import Color

// from manim import config
// from manim.constants import *
// from manim.mobject.geometry.arc import Circle, Dot
// from manim.mobject.geometry.line import Arrow, DashedLine, Line
// from manim.mobject.geometry.polygram import Polygon, Rectangle, RegularPolygon
// from manim.mobject.graphing.functions import ImplicitFunction, ParametricFunction
// from manim.mobject.graphing.numberLine import NumberLine
// from manim.mobject.graphing.scale import LinearBase
// from manim.mobject.opengl.openglCompatibility import ConvertToOpenGL
// from manim.mobject.text.texMobject import MathTex
// from manim.mobject.types.vectorizedMobject import (
//     VDict,
//     VectorizedPoint,
//     VGroup,
//     VMobject,
// )
// from manim.utils.color import (
//     BLACK,
//     BLUE,
//     BLUE_D,
//     GREEN,
//     WHITE,
//     YELLOW,
//     colorGradient,
//     invertColor,
// )
// from manim.utils.configOps import mergeDictsRecursively, updateDictRecursively
// from manim.utils.simpleFunctions import binarySearch
// from manim.utils.spaceOps import angleOfVector

// if TYPE_CHECKING:
//     from manim.mobject.mobject import Mobject


// class CoordinateSystem:
//     r"""
//     Abstract class for Axes and NumberPlane

//     Examples
//     --------
//     .. manim:: CoordSysExample
//         :saveLastFrame:

//         class CoordSysExample(Scene) {
//             construct(this) {
//                 # the location of the ticks depends on the xRange and yRange.
//                 grid = Axes(
//                     xRange=[0, 1, 0.05],  # step size determines numDecimalPlaces.
//                     yRange=[0, 1, 0.05],
//                     xLength=9,
//                     yLength=5.5,
//                     axisConfig={
//                         "numbersToInclude": np.arange(0, 1 + 0.1, 0.1),
//                         "fontSize": 24,
//                     },
//                     tips=False,
//                 )

//                 # Labels for the x-axis and y-axis.
//                 yLabel = grid.getYAxisLabel("y", edge=LEFT, direction=LEFT, buff=0.4)
//                 xLabel = grid.getXAxisLabel("x")
//                 gridLabels = VGroup(xLabel, yLabel)

//                 graphs = VGroup()
//                 for n in np.arange(1, 20 + 0.5, 0.5) {
//                     graphs += grid.plot(lambda x: x ** n, color=WHITE)
//                     graphs += grid.plot(
//                         lambda x: x ** (1 / n), color=WHITE, useSmoothing=False
//                     )

//                 # Extra lines and labels for point (1,1)
//                 graphs += grid.getHorizontalLine(grid.c2p(1, 1, 0), color=BLUE)
//                 graphs += grid.getVerticalLine(grid.c2p(1, 1, 0), color=BLUE)
//                 graphs += Dot(point=grid.c2p(1, 1, 0), color=YELLOW)
//                 graphs += Tex("(1,1)").scale(0.75).nextTo(grid.c2p(1, 1, 0))
//                 title = Title(
//                     # spaces between braces to prevent SyntaxError
//                     r"Graphs of $y=x^{ {1}\over{n} }$ and $y=x^n (n=1,2,3,...,20)$",
//                     includeUnderline=False,
//                     fontSize=40,
//                 )

//                 this.add(title, graphs, grid, gridLabels)
//     """

//     _Init__(
//         this,
//         xRange=None,
//         yRange=None,
//         xLength=None,
//         yLength=None,
//         dimension=2,
//     ) {
//         this.dimension = dimension

//         defaultStep = 1
//         if xRange is None:
//             xRange = [
//                 round(-config["frameXRadius"]),
//                 round(config["frameXRadius"]),
//                 defaultStep,
//             ]
//         elif len(xRange) == 2:
//             xRange = [*xRange, defaultStep]

//         if yRange is None:
//             yRange = [
//                 round(-config["frameYRadius"]),
//                 round(config["frameYRadius"]),
//                 defaultStep,
//             ]
//         elif len(yRange) == 2:
//             yRange = [*yRange, defaultStep]

//         this.xRange = xRange
//         this.yRange = yRange
//         this.xLength = xLength
//         this.yLength = yLength
//         this.numSampledGraphPointsPerTick = 10

//     coordsToPoint(this, *coords) {
//         raise NotImplementedError()

//     pointToCoords(this, point) {
//         raise NotImplementedError()

//     polarToPoint(this, radius: float, azimuth: float) -> np.ndarray:
//         r"""Gets a point from polar coordinates.

//         Parameters
//         ----------
//         radius
//             The coordinate radius (:math:`r`).

//         azimuth
//             The coordinate azimuth (:math:`\theta`).

//         Returns
//         -------
//         numpy.ndarray
//             The point.

//         Examples
//         --------
//         .. manim:: PolarToPointExample
//             :refClasses: PolarPlane Vector
//             :saveLastFrame:

//             class PolarToPointExample(Scene) {
//                 construct(this) {
//                     polarplanePi = PolarPlane(azimuthUnits="PI radians", size=6)
//                     polartopointVector = Vector(polarplanePi.polarToPoint(3, PI/4))
//                     this.add(polarplanePi)
//                     this.add(polartopointVector)
//         """
//         return this.coordsToPoint(radius * np.cos(azimuth), radius * np.sin(azimuth))

//     pointToPolar(this, point: np.ndarray) -> tuple[float, float]:
//         r"""Gets polar coordinates from a point.

//         Parameters
//         ----------
//         point
//             The point.

//         Returns
//         -------
//         Tuple[:class:`float`, :class:`float`]
//             The coordinate radius (:math:`r`) and the coordinate azimuth (:math:`\theta`).
//         """
//         x, y = this.pointToCoords(point)
//         return np.sqrt(x**2 + y**2), np.arctan2(y, x)

//     c2p(this, *coords) {
//         """Abbreviation for coordsToPoint"""
//         return this.coordsToPoint(*coords)

//     p2c(this, point) {
//         """Abbreviation for pointToCoords"""
//         return this.pointToCoords(point)

//     pr2pt(this, radius: float, azimuth: float) -> np.ndarray:
//         """Abbreviation for :meth:`polarToPoint`"""
//         return this.polarToPoint(radius, azimuth)

//     pt2pr(this, point: np.ndarray) -> tuple[float, float]:
//         """Abbreviation for :meth:`pointToPolar`"""
//         return this.pointToPolar(point)

//     getAxes(this) {
//         raise NotImplementedError()

//     getAxis(this, index) {
//         return this.getAxes()[index]

//     getOrigin(this) -> np.ndarray:
//         """Gets the origin of :class:`~.Axes`.

//         Returns
//         -------
//         np.ndarray
//             The center point.
//         """
//         return this.coordsToPoint(0, 0)

//     getXAxis(this) {
//         return this.getAxis(0)

//     getYAxis(this) {
//         return this.getAxis(1)

//     getZAxis(this) {
//         return this.getAxis(2)

//     getXUnitSize(this) {
//         return this.getXAxis().getUnitSize()

//     getYUnitSize(this) {
//         return this.getYAxis().getUnitSize()

//     getXAxisLabel(
//         this,
//         label: float | str | Mobject,
//         edge: Sequence[float] = UR,
//         direction: Sequence[float] = UR,
//         buff: float = SMALL_BUFF,
//         **kwargs,
//     ) -> Mobject:
//         """Generate an x-axis label.

//         Parameters
//         ----------
//         label
//             The label. Defaults to :class:`~.MathTex` for ``str`` and ``float`` inputs.
//         edge
//             The edge of the x-axis to which the label will be added, by default ``UR``.
//         direction
//             Allows for further positioning of the label from an edge, by default ``UR``.
//         buff
//             The distance of the label from the line.

//         Returns
//         -------
//         :class:`~.Mobject`
//             The positioned label.

//         Examples
//         --------
//         .. manim:: GetXAxisLabelExample
//             :saveLastFrame:

//             class GetXAxisLabelExample(Scene) {
//                 construct(this) {
//                     ax = Axes(xRange=(0, 8), yRange=(0, 5), xLength=8, yLength=5)
//                     xLabel = ax.getXAxisLabel(
//                         Tex("$x$-values").scale(0.65), edge=DOWN, direction=DOWN, buff=0.5
//                     )
//                     this.add(ax, xLabel)
//         """
//         return this.GetAxisLabel(
//             label, this.getXAxis(), edge, direction, buff=buff, **kwargs
//         )

//     getYAxisLabel(
//         this,
//         label: float | str | Mobject,
//         edge: Sequence[float] = UR,
//         direction: Sequence[float] = UP * 0.5 + RIGHT,
//         buff: float = SMALL_BUFF,
//         **kwargs,
//     ) {
//         """Generate a y-axis label.

//         Parameters
//         ----------
//         label
//             The label. Defaults to :class:`~.MathTex` for ``str`` and ``float`` inputs.
//         edge
//             The edge of the x-axis to which the label will be added, by default ``UR``.
//         direction
//             Allows for further positioning of the label from an edge, by default ``UR``
//         buff
//             The distance of the label from the line.

//         Returns
//         -------
//         :class:`~.Mobject`
//             The positioned label.

//         Examples
//         --------
//         .. manim:: GetYAxisLabelExample
//             :saveLastFrame:

//             class GetYAxisLabelExample(Scene) {
//                 construct(this) {
//                     ax = Axes(xRange=(0, 8), yRange=(0, 5), xLength=8, yLength=5)
//                     yLabel = ax.getYAxisLabel(
//                         Tex("$y$-values").scale(0.65).rotate(90 * DEGREES),
//                         edge=LEFT,
//                         direction=LEFT,
//                         buff=0.3,
//                     )
//                     this.add(ax, yLabel)
//         """

//         return this.GetAxisLabel(
//             label, this.getYAxis(), edge, direction, buff=buff, **kwargs
//         )

//     GetAxisLabel(
//         this,
//         label: float | str | Mobject,
//         axis: Mobject,
//         edge: Sequence[float],
//         direction: Sequence[float],
//         buff: float = SMALL_BUFF,
//     ) -> Mobject:
//         """Gets the label for an axis.

//         Parameters
//         ----------
//         label
//             The label. Defaults to :class:`~.MathTex` for ``str`` and ``float`` inputs.
//         axis
//             The axis to which the label will be added.
//         edge
//             The edge of the axes to which the label will be added. ``RIGHT`` adds to the right side of the axis
//         direction
//             Allows for further positioning of the label.
//         buff
//             The distance of the label from the line.

//         Returns
//         -------
//         :class:`~.Mobject`
//             The positioned label along the given axis.
//         """

//         label = this.xAxis.CreateLabelTex(label)
//         label.nextTo(axis.getEdgeCenter(edge), direction=direction, buff=buff)
//         label.shiftOntoScreen(buff=MED_SMALL_BUFF)
//         return label

//     getAxisLabels(
//         this,
//         xLabel: float | str | Mobject = "x",
//         yLabel: float | str | Mobject = "y",
//     ) -> VGroup:
//         """Defines labels for the xAxis and yAxis of the graph. For increased control over the position of the labels,
//         use :meth:`getXAxisLabel` and :meth:`getYAxisLabel`.

//         Parameters
//         ----------
//         xLabel
//             The label for the xAxis. Defaults to :class:`~.MathTex` for ``str`` and ``float`` inputs.
//         yLabel
//             The label for the yAxis. Defaults to :class:`~.MathTex` for ``str`` and ``float`` inputs.

//         Returns
//         -------
//         :class:`~.VGroup`
//             A :class:`~.Vgroup` of the labels for the xAxis and yAxis.


//         .. seealso::
//             :class:`getXAxisLabel`
//             :class:`getYAxisLabel`

//         Examples
//         --------
//         .. manim:: GetAxisLabelsExample
//             :saveLastFrame:

//             class GetAxisLabelsExample(Scene) {
//                 construct(this) {
//                     ax = Axes()
//                     labels = ax.getAxisLabels(
//                         Tex("x-axis").scale(0.7), Text("y-axis").scale(0.45)
//                     )
//                     this.add(ax, labels)
//         """

//         this.axisLabels = VGroup(
//             this.getXAxisLabel(xLabel),
//             this.getYAxisLabel(yLabel),
//         )
//         return this.axisLabels

//     addCoordinates(
//         this,
//         *axesNumbers: (Iterable[float] | None | dict[float, str | float | Mobject]),
//         **kwargs,
//     ) {
//         """Adds labels to the axes. Use ``Axes.coordinateLabels`` to
//         access the coordinates after creation.

//         Parameters
//         ----------
//         axesNumbers
//             The numbers to be added to the axes. Use ``None`` to represent an axis with default labels.

//         Examples
//         --------
//         .. code-block:: python

//             ax = ThreeDAxes()
//             xLabels = range(-4, 5)
//             zLabels = range(-4, 4, 2)
//             ax.addCoordinates(xLabels, None, zLabels)  # default y labels, custom x & z labels
//             ax.addCoordinates(xLabels)  # only x labels

//         You can also specifically control the position and value of the labels using a dict.

//         .. code-block:: python

//             ax = Axes(xRange=[0, 7])
//             xPos = [x for x in range(1, 8)]

//             # strings are automatically converted into a `Tex` mobject.
//             xVals = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
//             xDict = dict(zip(xPos, xVals))
//             ax.addCoordinates(xDict)
//         """

//         this.coordinateLabels = VGroup()
//         # if nothing is passed to axesNumbers, produce axes with default labelling
//         if not axesNumbers:
//             axesNumbers = [None for _ in range(this.dimension)]

//         for axis, values in zip(this.axes, axesNumbers) {
//             if isinstance(values, dict) {
//                 axis.addLabels(values, **kwargs)
//                 labels = axis.labels
//             elif values is None and axis.scaling.customLabels:
//                 tickRange = axis.getTickRange()
//                 axis.addLabels(
//                     dict(zip(tickRange, axis.scaling.getCustomLabels(tickRange)))
//                 )
//                 labels = axis.labels
//             else:
//                 axis.addNumbers(values, **kwargs)
//                 labels = axis.numbers
//             this.coordinateLabels.add(labels)

//         return this

//     getLineFromAxisToPoint(
//         this,
//         index: int,
//         point: Sequence[float],
//         lineFunc: Line = DashedLine,
//         lineConfig: dict | None = None,
//         color: Color | None = None,
//         strokeWidth: float = 2,
//     ) -> Line:
//         """Returns a straight line from a given axis to a point in the scene.

//         Parameters
//         ----------
//         index
//             Specifies the axis from which to draw the line. `0 = xAxis`, `1 = yAxis`
//         point
//             The point to which the line will be drawn.
//         lineFunc
//             The function of the :class:`~.Line` mobject used to construct the line.
//         lineConfig
//             Optional arguments to passed to :attr:`lineFunc`.
//         color
//             The color of the line.
//         strokeWidth
//             The stroke width of the line.

//         Returns
//         -------
//         :class:`~.Line`
//             The line from an axis to a point.


//         .. seealso::
//             :meth:`~.CoordinateSystem.getVerticalLine`
//             :meth:`~.CoordinateSystem.getHorizontalLine`
//         """

//         lineConfig = lineConfig if lineConfig is not None else {}

//         if color is None:
//             color = VMobject().color

//         lineConfig["color"] = color
//         lineConfig["strokeWidth"] = strokeWidth

//         axis = this.getAxis(index)
//         line = lineFunc(axis.getProjection(point), point, **lineConfig)
//         return line

//     getVerticalLine(this, point: Sequence[float], **kwargs) -> Line:
//         """A vertical line from the x-axis to a given point in the scene.

//         Parameters
//         ----------
//         point
//             The point to which the vertical line will be drawn.
//         kwargs
//             Additional parameters to be passed to :class:`getLineFromAxisToPoint`.

//         Returns
//         -------
//         :class:`Line`
//             A vertical line from the x-axis to the point.

//         Examples
//         --------
//         .. manim:: GetVerticalLineExample
//             :saveLastFrame:

//             class GetVerticalLineExample(Scene) {
//                 construct(this) {
//                     ax = Axes().addCoordinates()
//                     point = ax.coordsToPoint(-3.5, 2)

//                     dot = Dot(point)
//                     line = ax.getVerticalLine(point, lineConfig={"dashedRatio": 0.85})

//                     this.add(ax, line, dot)


//         """
//         return this.getLineFromAxisToPoint(0, point, **kwargs)

//     getHorizontalLine(this, point: Sequence[float], **kwargs) -> Line:
//         """A horizontal line from the y-axis to a given point in the scene.

//         Parameters
//         ----------
//         point
//             The point to which the horizontal line will be drawn.
//         kwargs
//             Additional parameters to be passed to :class:`getLineFromAxisToPoint`.

//         Returns
//         -------
//         :class:`Line`
//             A horizontal line from the y-axis to the point.

//         Examples
//         --------
//         .. manim:: GetHorizontalLineExample
//             :saveLastFrame:

//             class GetHorizontalLineExample(Scene) {
//                 construct(this) {
//                     ax = Axes().addCoordinates()
//                     point = ax.c2p(-4, 1.5)

//                     dot = Dot(point)
//                     line = ax.getHorizontalLine(point, lineFunc=Line)

//                     this.add(ax, line, dot)
//         """

//         return this.getLineFromAxisToPoint(1, point, **kwargs)

//     getLinesToPoint(this, point: Sequence[float], **kwargs) -> VGroup:
//         """Generate both horizontal and vertical lines from the axis to a point.

//         Parameters
//         ----------
//         point
//             A point on the scene.
//         kwargs
//             Additional parameters to be passed to :meth:`getLineFromAxisToPoint`

//         Returns
//         -------
//         :class:`~.VGroup`
//             A :class:`~.VGroup` of the horizontal and vertical lines.


//         .. seealso::
//             :meth:`~.CoordinateSystem.getVerticalLine`
//             :meth:`~.CoordinateSystem.getHorizontalLine`

//         Examples
//         --------
//         .. manim:: GetLinesToPointExample
//             :saveLastFrame:

//             class GetLinesToPointExample(Scene) {
//                 construct(this) {
//                     ax = Axes()
//                     circ = Circle(radius=0.5).moveTo([-4, -1.5, 0])

//                     lines_1 = ax.getLinesToPoint(circ.getRight(), color=GREEN_B)
//                     lines_2 = ax.getLinesToPoint(circ.getCorner(DL), color=BLUE_B)
//                     this.add(ax, lines_1, lines_2, circ)
//         """

//         return VGroup(
//             this.getHorizontalLine(point, **kwargs),
//             this.getVerticalLine(point, **kwargs),
//         )

//     # graphing

//     plot(
//         this,
//         function: Callable[[float], float],
//         xRange: Sequence[float] | None = None,
//         **kwargs,
//     ) {
//         """Generates a curve based on a function.

//         Parameters
//         ----------
//         function
//             The function used to construct the :class:`~.ParametricFunction`.
//         xRange
//             The range of the curve along the axes. ``xRange = [xMin, xMax, xStep]``.
//         kwargs
//             Additional parameters to be passed to :class:`~.ParametricFunction`.

//         Returns
//         -------
//         :class:`~.ParametricFunction`
//             The plotted curve.


//         .. warning::
//             This method may not produce accurate graphs since Manim currently relies on interpolation between
//             evenly-spaced samples of the curve, instead of intelligent plotting.
//             See the example below for some solutions to this problem.

//         Examples
//         --------
//         .. manim:: PlotExample
//             :saveLastFrame:

//             class PlotExample(Scene) {
//                 construct(this) {
//                     # construct the axes
//                     ax_1 = Axes(
//                         xRange=[0.001, 6],
//                         yRange=[-8, 2],
//                         xLength=5,
//                         yLength=3,
//                         tips=False,
//                     )
//                     ax_2 = ax_1.copy()
//                     ax_3 = ax_1.copy()

//                     # position the axes
//                     ax_1.toCorner(UL)
//                     ax_2.toCorner(UR)
//                     ax_3.toEdge(DOWN)
//                     axes = VGroup(ax_1, ax_2, ax_3)

//                     # create the logarithmic curves
//                     logFunc(x) {
//                         return np.log(x)

//                     # a curve without adjustments; poor interpolation.
//                     curve_1 = ax_1.plot(logFunc, color=PURE_RED)

//                     # disabling interpolation makes the graph look choppy as not enough
//                     # inputs are available
//                     curve_2 = ax_2.plot(logFunc, useSmoothing=False, color=ORANGE)

//                     # taking more inputs of the curve by specifying a step for the
//                     # xRange yields expected results, but increases rendering time.
//                     curve_3 = ax_3.plot(
//                         logFunc, xRange=(0.001, 6, 0.001), color=PURE_GREEN
//                     )

//                     curves = VGroup(curve_1, curve_2, curve_3)

//                     this.add(axes, curves)
//         """

//         tRange = np.array(this.xRange, dtype=float)
//         if xRange is not None:
//             tRange[: len(xRange)] = xRange

//         if xRange is None or len(xRange) < 3:
//             # if tRange has a defined step size, increase the number of sample points per tick
//             tRange[2] /= this.numSampledGraphPointsPerTick
//         # For axes, the third coordinate of xRange indicates
//         # tick frequency.  But for functions, it indicates a
//         # sample frequency

//         graph = ParametricFunction(
//             lambda t: this.coordsToPoint(t, function(t)),
//             tRange=tRange,
//             scaling=this.xAxis.scaling,
//             **kwargs,
//         )
//         graph.underlyingFunction = function
//         return graph

//     plotImplicitCurve(
//         this,
//         func: Callable,
//         minDepth: int = 5,
//         maxQuads: int = 1500,
//         **kwargs,
//     ) -> ImplicitFunction:
//         """Creates the curves of an implicit function.

//         Parameters
//         ----------
//         func
//             The function to graph, in the form of f(x, y) = 0.
//         minDepth
//             The minimum depth of the function to calculate.
//         maxQuads
//             The maximum number of quads to use.
//         kwargs
//             Additional parameters to pass into :class:`ImplicitFunction`.

//         Examples
//         --------
//         .. manim:: ImplicitExample
//             :saveLastFrame:

//             class ImplicitExample(Scene) {
//                 construct(this) {
//                     ax = Axes()
//                     a = ax.plotImplicitCurve(
//                         lambda x, y: y * (x - y) ** 2 - 4 * x - 8, color=BLUE
//                     )
//                     this.add(ax, a)
//         """
//         graph = ImplicitFunction(
//             func=func,
//             xRange=this.xRange[:2],
//             yRange=this.yRange[:2],
//             minDepth=minDepth,
//             maxQuads=maxQuads,
//             **kwargs,
//         )
//         (
//             graph.stretch(this.getXUnitSize(), 0, aboutPoint=ORIGIN)
//             .stretch(this.getYUnitSize(), 1, aboutPoint=ORIGIN)
//             .shift(this.getOrigin())
//         )
//         return graph

//     plotParametricCurve(this, function, **kwargs) {
//         dim = this.dimension
//         graph = ParametricFunction(
//             lambda t: this.coordsToPoint(*function(t)[:dim]), **kwargs
//         )
//         graph.underlyingFunction = function
//         return graph

//     plotPolarGraph(
//         this,
//         rFunc: Callable[[float], float],
//         thetaRange: Sequence[float] = [0, 2 * PI],
//         **kwargs,
//     ) -> ParametricFunction:
//         """A polar graph.

//         Parameters
//         ----------
//         rFunc
//             The function r of theta.
//         thetaRange
//             The range of theta as ``thetaRange = [thetaMin, thetaMax, thetaStep]``.
//         kwargs
//             Additional parameters passed to :class:`~.ParametricFunction`.

//         Examples
//         --------
//         .. manim:: PolarGraphExample
//             :refClasses: PolarPlane
//             :saveLastFrame:

//             class PolarGraphExample(Scene) {
//                 construct(this) {
//                     plane = PolarPlane()
//                     r = lambda theta: 2 * np.sin(theta * 5)
//                     graph = plane.plotPolarGraph(r, [0, 2 * PI], color=ORANGE)
//                     this.add(plane, graph)
//         """
//         graph = ParametricFunction(
//             function=lambda th: this.pr2pt(rFunc(th), th),
//             tRange=thetaRange,
//             **kwargs,
//         )
//         graph.underlyingFunction = rFunc
//         return graph

//     inputToGraphPoint(
//         this,
//         x: float,
//         graph: ParametricFunction | VMobject,
//     ) -> np.ndarray:
//         """Returns the coordinates of the point on a ``graph`` corresponding to an ``x`` value.

//         Parameters
//         ----------
//         x
//             The x-value of a point on the ``graph``.
//         graph
//             The :class:`~.ParametricFunction` on which the point lies.

//         Returns
//         -------
//         :class:`np.ndarray`
//             The coordinates of the point on the :attr:`graph` corresponding to the :attr:`x` value.

//         Raises
//         ------
//         :exc:`ValueError`
//             When the target x is not in the range of the line graph.

//         Examples
//         --------
//         .. manim:: InputToGraphPointExample
//             :saveLastFrame:

//             class InputToGraphPointExample(Scene) {
//                 construct(this) {
//                     ax = Axes()
//                     curve = ax.plot(lambda x : np.cos(x))

//                     # move a square to PI on the cosine curve.
//                     position = ax.inputToGraphPoint(x=PI, graph=curve)
//                     sq = Square(sideLength=1, color=YELLOW).moveTo(position)

//                     this.add(ax, curve, sq)
//         """

//         if hasattr(graph, "underlyingFunction") {
//             return graph.function(x)
//         else:
//             alpha = binarySearch(
//                 function=lambda a: this.pointToCoords(graph.pointFromProportion(a))[
//                     0
//                 ],
//                 target=x,
//                 lowerBound=0,
//                 upperBound=1,
//             )
//             if alpha is not None:
//                 return graph.pointFromProportion(alpha)
//             else:
//                 raise ValueError(
//                     f"x={x} not located in the range of the graph ([{this.p2c(graph.getStart())[0]}, {this.p2c(graph.getEnd())[0]}])",
//                 )

//     inputToGraphCoords(this, x: float, graph: ParametricFunction) -> tuple:
//         """Returns a tuple of the axis relative coordinates of the point
//         on the graph based on the x-value given.

//         Examples
//         --------
//         .. code-block:: pycon

//             >>> from manim import Axes
//             >>> ax = Axes()
//             >>> parabola = ax.plot(lambda x: x ** 2)
//             >>> ax.inputToGraphCoords(x=3, graph=parabola)
//             (3, 9)
//         """
//         return x, graph.underlyingFunction(x)

//     i2gc(this, x: float, graph: ParametricFunction) -> tuple:
//         """Alias for :meth:`inputToGraphCoords`."""
//         return this.inputToGraphCoords(x, graph)

//     i2gp(this, x: float, graph: ParametricFunction) -> np.ndarray:
//         """Alias for :meth:`inputToGraphPoint`."""
//         return this.inputToGraphPoint(x, graph)

//     getGraphLabel(
//         this,
//         graph: ParametricFunction,
//         label: float | str | Mobject = "f(x)",
//         xVal: float | None = None,
//         direction: Sequence[float] = RIGHT,
//         buff: float = MED_SMALL_BUFF,
//         color: Color | None = None,
//         dot: bool = False,
//         dotConfig: dict | None = None,
//     ) -> Mobject:
//         """Creates a properly positioned label for the passed graph, with an optional dot.

//         Parameters
//         ----------
//         graph
//             The curve.
//         label
//             The label for the function's curve. Defaults to :class:`~.MathTex` for ``str`` and ``float`` inputs.
//         xVal
//             The xValue along the curve that positions the label.
//         direction
//             The cartesian position, relative to the curve that the label will be at --> ``LEFT``, ``RIGHT``.
//         buff
//             The distance between the curve and the label.
//         color
//             The color of the label. Defaults to the color of the curve.
//         dot
//             Whether to add a dot at the point on the graph.
//         dotConfig
//             Additional parameters to be passed to :class:`~.Dot`.

//         Returns
//         -------
//         :class:`Mobject`
//             The positioned label and :class:`~.Dot`, if applicable.

//         Examples
//         --------
//         .. manim:: GetGraphLabelExample
//             :saveLastFrame:

//             class GetGraphLabelExample(Scene) {
//                 construct(this) {
//                     ax = Axes()
//                     sin = ax.plot(lambda x: np.sin(x), color=PURPLE_B)
//                     label = ax.getGraphLabel(
//                         graph=sin,
//                         label= MathTex(r"\\frac{\\pi}{2}"),
//                         xVal=PI / 2,
//                         dot=True,
//                         direction=UR,
//                     )

//                     this.add(ax, sin, label)
//         """

//         if dotConfig is None:
//             dotConfig = {}
//         color = color or graph.getColor()
//         label = this.xAxis.CreateLabelTex(label).setColor(color)

//         if xVal is None:
//             # Search from right to left
//             for x in np.linspace(this.xRange[1], this.xRange[0], 100) {
//                 point = this.inputToGraphPoint(x, graph)
//                 if point[1] < config["frameYRadius"]:
//                     break
//         else:
//             point = this.inputToGraphPoint(xVal, graph)

//         label.nextTo(point, direction, buff=buff)
//         label.shiftOntoScreen()

//         if dot:
//             dot = Dot(point=point, **dotConfig)
//             label.add(dot)
//             label.dot = dot
//         return label

//     # calculus

//     getRiemannRectangles(
//         this,
//         graph: ParametricFunction,
//         xRange: Sequence[float] | None = None,
//         dx: float | None = 0.1,
//         inputSampleType: str = "left",
//         strokeWidth: float = 1,
//         strokeColor: Color = BLACK,
//         fillOpacity: float = 1,
//         color: Iterable[Color] | Color = np.array((BLUE, GREEN)),
//         showSignedArea: bool = True,
//         boundedGraph: ParametricFunction = None,
//         blend: bool = False,
//         widthScaleFactor: float = 1.001,
//     ) -> VGroup:
//         """Generates a :class:`~.VGroup` of the Riemann Rectangles for a given curve.

//         Parameters
//         ----------
//         graph
//             The graph whose area will be approximated by Riemann rectangles.
//         xRange
//             The minimum and maximum x-values of the rectangles. ``xRange = [xMin, xMax]``.
//         dx
//             The change in x-value that separates each rectangle.
//         inputSampleType
//             Can be any of ``"left"``, ``"right"`` or ``"center"``. Refers to where
//             the sample point for the height of each Riemann Rectangle
//             will be inside the segments of the partition.
//         strokeWidth
//             The strokeWidth of the border of the rectangles.
//         strokeColor
//             The color of the border of the rectangle.
//         fillOpacity
//             The opacity of the rectangles.
//         color
//             The colors of the rectangles. Creates a balanced gradient if multiple colors are passed.
//         showSignedArea
//             Indicates negative area when the curve dips below the x-axis by inverting its color.
//         blend
//             Sets the :attr:`strokeColor` to :attr:`fillColor`, blending the rectangles without clear separation.
//         boundedGraph
//             If a secondary graph is specified, encloses the area between the two curves.
//         widthScaleFactor
//             The factor by which the width of the rectangles is scaled.

//         Returns
//         -------
//         :class:`~.VGroup`
//             A :class:`~.VGroup` containing the Riemann Rectangles.

//         Examples
//         --------
//         .. manim:: GetRiemannRectanglesExample
//             :saveLastFrame:

//             class GetRiemannRectanglesExample(Scene) {
//                 construct(this) {
//                     ax = Axes(yRange=[-2, 10])
//                     quadratic = ax.plot(lambda x: 0.5 * x ** 2 - 0.5)

//                     # the rectangles are constructed from their top right corner.
//                     # passing an iterable to `color` produces a gradient
//                     rectsRight = ax.getRiemannRectangles(
//                         quadratic,
//                         xRange=[-4, -3],
//                         dx=0.25,
//                         color=(TEAL, BLUE_B, DARK_BLUE),
//                         inputSampleType="right",
//                     )

//                     # the colour of rectangles below the x-axis is inverted
//                     # due to showSignedArea
//                     rectsLeft = ax.getRiemannRectangles(
//                         quadratic, xRange=[-1.5, 1.5], dx=0.15, color=YELLOW
//                     )

//                     boundingLine = ax.plot(
//                         lambda x: 1.5 * x, color=BLUE_B, xRange=[3.3, 6]
//                     )
//                     boundedRects = ax.getRiemannRectangles(
//                         boundingLine,
//                         boundedGraph=quadratic,
//                         dx=0.15,
//                         xRange=[4, 5],
//                         showSignedArea=False,
//                         color=(MAROON_A, RED_B, PURPLE_D),
//                     )

//                     this.add(
//                         ax, boundingLine, quadratic, rectsRight, rectsLeft, boundedRects
//                     )
//         """

//         # setting up xRange, overwrite user's third input
//         if xRange is None:
//             if boundedGraph is None:
//                 xRange = [graph.tMin, graph.tMax]
//             else:
//                 xMin = max(graph.tMin, boundedGraph.tMin)
//                 xMax = min(graph.tMax, boundedGraph.tMax)
//                 xRange = [xMin, xMax]

//         xRange = [*xRange[:2], dx]

//         rectangles = VGroup()
//         xRange = np.arange(*xRange)

//         # allows passing a string to color the graph
//         if type(color) is str:
//             colors = [color] * len(xRange)
//         else:
//             colors = colorGradient(color, len(xRange))

//         for x, color in zip(xRange, colors) {
//             if inputSampleType == "left":
//                 sampleInput = x
//             elif inputSampleType == "right":
//                 sampleInput = x + dx
//             elif inputSampleType == "center":
//                 sampleInput = x + 0.5 * dx
//             else:
//                 raise ValueError("Invalid input sample type")
//             graphPoint = this.inputToGraphPoint(sampleInput, graph)

//             if boundedGraph is None:
//                 yPoint = this.OriginShift(this.yRange)
//             else:
//                 yPoint = boundedGraph.underlyingFunction(x)

//             points = VGroup(
//                 *list(
//                     map(
//                         VectorizedPoint,
//                         [
//                             this.coordsToPoint(x, yPoint),
//                             this.coordsToPoint(x + widthScaleFactor * dx, yPoint),
//                             graphPoint,
//                         ],
//                     ),
//                 )
//             )

//             rect = Rectangle().replace(points, stretch=True)
//             rectangles.add(rect)

//             # checks if the rectangle is under the x-axis
//             if this.p2c(graphPoint)[1] < yPoint and showSignedArea:
//                 color = invertColor(color)

//             # blends rectangles smoothly
//             if blend:
//                 strokeColor = color

//             rect.setStyle(
//                 fillColor=color,
//                 fillOpacity=fillOpacity,
//                 strokeColor=strokeColor,
//                 strokeWidth=strokeWidth,
//             )

//         return rectangles

//     getArea(
//         this,
//         graph: ParametricFunction,
//         xRange: tuple[float, float] | None = None,
//         color: Color | Iterable[Color] = [BLUE, GREEN],
//         opacity: float = 0.3,
//         boundedGraph: ParametricFunction = None,
//         **kwargs,
//     ) {
//         """Returns a :class:`~.Polygon` representing the area under the graph passed.

//         Parameters
//         ----------
//         graph
//             The graph/curve for which the area needs to be gotten.
//         xRange
//             The range of the minimum and maximum x-values of the area. ``xRange = [xMin, xMax]``.
//         color
//             The color of the area. Creates a gradient if a list of colors is provided.
//         opacity
//             The opacity of the area.
//         boundedGraph
//             If a secondary :attr:`graph` is specified, encloses the area between the two curves.
//         kwargs
//             Additional parameters passed to :class:`~.Polygon`.

//         Returns
//         -------
//         :class:`~.Polygon`
//             The :class:`~.Polygon` representing the area.

//         Raises
//         ------
//         :exc:`ValueError`
//             When xRanges do not match (either area xRange, graph's xRange or boundedGraph's xRange).

//         Examples
//         --------
//         .. manim:: GetAreaExample
//             :saveLastFrame:

//             class GetAreaExample(Scene) {
//                 construct(this) {
//                     ax = Axes().addCoordinates()
//                     curve = ax.plot(lambda x: 2 * np.sin(x), color=DARK_BLUE)
//                     area = ax.getArea(
//                         curve,
//                         xRange=(PI / 2, 3 * PI / 2),
//                         color=(GREEN_B, GREEN_D),
//                         opacity=1,
//                     )

//                     this.add(ax, curve, area)
//         """
//         if xRange is None:
//             a = graph.tMin
//             b = graph.tMax
//         else:
//             a, b = xRange
//         if boundedGraph is not None:
//             if boundedGraph.tMin > b:
//                 raise ValueError(
//                     f"Ranges not matching: {boundedGraph.tMin} < {b}",
//                 )
//             if boundedGraph.tMax < a:
//                 raise ValueError(
//                     f"Ranges not matching: {boundedGraph.tMax} > {a}",
//                 )
//             a = max(a, boundedGraph.tMin)
//             b = min(b, boundedGraph.tMax)

//         if boundedGraph is None:
//             points = (
//                 [this.c2p(a), graph.function(a)]
//                 + [p for p in graph.points if a <= this.p2c(p)[0] <= b]
//                 + [graph.function(b), this.c2p(b)]
//             )
//         else:
//             graphPoints, boundedGraphPoints = (
//                 [g.function(a)]
//                 + [p for p in g.points if a <= this.p2c(p)[0] <= b]
//                 + [g.function(b)]
//                 for g in (graph, boundedGraph)
//             )
//             points = graphPoints + boundedGraphPoints[::-1]
//         return Polygon(*points, **kwargs).setOpacity(opacity).setColor(color)

//     angleOfTangent(
//         this,
//         x: float,
//         graph: ParametricFunction,
//         dx: float = 1e-8,
//     ) -> float:
//         """Returns the angle to the x-axis of the tangent
//         to the plotted curve at a particular x-value.

//         Parameters
//         ----------
//         x
//             The x-value at which the tangent must touch the curve.
//         graph
//             The :class:`~.ParametricFunction` for which to calculate the tangent.
//         dx
//             The change in `x` used to determine the angle of the tangent to the curve.

//         Returns
//         -------
//         :class:`float`
//             The angle of the tangent to the curve.

//         Examples
//         --------
//         .. code-block:: python

//             ax = Axes()
//             curve = ax.plot(lambda x: x ** 2)
//             ax.angleOfTangent(x=3, graph=curve)
//             # 1.4056476493802699
//         """

//         p0 = np.array([*this.inputToGraphCoords(x, graph)])
//         p1 = np.array([*this.inputToGraphCoords(x + dx, graph)])
//         return angleOfVector(p1 - p0)

//     slopeOfTangent(this, x: float, graph: ParametricFunction, **kwargs) -> float:
//         """Returns the slope of the tangent to the plotted curve
//         at a particular x-value.

//         Parameters
//         ----------
//         x
//             The x-value at which the tangent must touch the curve.
//         graph
//             The :class:`~.ParametricFunction` for which to calculate the tangent.

//         Returns
//         -------
//         :class:`float`
//             The slope of the tangent with the x axis.

//         Examples
//         --------
//         .. code-block:: python

//             ax = Axes()
//             curve = ax.plot(lambda x: x ** 2)
//             ax.slopeOfTangent(x=-2, graph=curve)
//             # -3.5000000259052038
//         """

//         return np.tan(this.angleOfTangent(x, graph, **kwargs))

//     plotDerivativeGraph(
//         this, graph: ParametricFunction, color: Color = GREEN, **kwargs
//     ) -> ParametricFunction:
//         """Returns the curve of the derivative of the passed graph.

//         Parameters
//         ----------
//         graph
//             The graph for which the derivative will be found.
//         color
//             The color of the derivative curve.
//         kwargs
//             Any valid keyword argument of :class:`~.ParametricFunction`.

//         Returns
//         -------
//         :class:`~.ParametricFunction`
//             The curve of the derivative.

//         Examples
//         --------
//         .. manim:: DerivativeGraphExample
//             :saveLastFrame:

//             class DerivativeGraphExample(Scene) {
//                 construct(this) {
//                     ax = NumberPlane(yRange=[-1, 7], backgroundLineStyle={"strokeOpacity": 0.4})

//                     curve_1 = ax.plot(lambda x: x ** 2, color=PURPLE_B)
//                     curve_2 = ax.plotDerivativeGraph(curve_1)
//                     curves = VGroup(curve_1, curve_2)

//                     label_1 = ax.getGraphLabel(curve_1, "x^2", xVal=-2, direction=DL)
//                     label_2 = ax.getGraphLabel(curve_2, "2x", xVal=3, direction=RIGHT)
//                     labels = VGroup(label_1, label_2)

//                     this.add(ax, curves, labels)
//         """

//         deriv(x) {
//             return this.slopeOfTangent(x, graph)

//         return this.plot(deriv, color=color, **kwargs)

//     plotAntiderivativeGraph(
//         this,
//         graph: ParametricFunction,
//         yIntercept: float = 0,
//         samples: int = 50,
//         **kwargs,
//     ) {
//         """Plots an antiderivative graph.

//         Parameters
//         ----------
//         graph
//             The graph for which the antiderivative will be found.
//         yIntercept
//             The y-value at which the graph intercepts the y-axis.
//         samples
//             The number of points to take the area under the graph.
//         kwargs
//             Any valid keyword argument of :class:`~.ParametricFunction`.

//         Returns
//         -------
//         :class:`~.ParametricFunction`
//             The curve of the antiderivative.


//         .. note::
//             This graph is plotted from the values of area under the reference graph.
//             The result might not be ideal if the reference graph contains uncalculatable
//             areas from x=0.

//         Examples
//         --------
//         .. manim:: AntiderivativeExample
//             :saveLastFrame:

//             class AntiderivativeExample(Scene) {
//                 construct(this) {
//                     ax = Axes()
//                     graph1 = ax.plot(
//                         lambda x: (x ** 2 - 2) / 3,
//                         color=RED,
//                     )
//                     graph2 = ax.plotAntiderivativeGraph(graph1, color=BLUE)
//                     this.add(ax, graph1, graph2)
//         """

//         antideriv(x) {
//             xVals = np.linspace(0, x, samples)
//             fVec = np.vectorize(graph.underlyingFunction)
//             yVals = fVec(xVals)
//             return np.trapz(yVals, xVals) + yIntercept

//         return this.plot(antideriv, **kwargs)

//     getSecantSlopeGroup(
//         this,
//         x: float,
//         graph: ParametricFunction,
//         dx: float | None = None,
//         dxLineColor: Color = YELLOW,
//         dyLineColor: Color | None = None,
//         dxLabel: float | str | None = None,
//         dyLabel: float | str | None = None,
//         includeSecantLine: bool = True,
//         secantLineColor: Color = GREEN,
//         secantLineLength: float = 10,
//     ) -> VGroup:
//         """Creates two lines representing `dx` and `df`, the labels for `dx` and `df`, and
//          the secant to the curve at a particular x-value.

//         Parameters
//         ----------
//         x
//             The x-value at which the secant intersects the graph for the first time.
//         graph
//             The curve for which the secant will be found.
//         dx
//             The change in `x` after which the secant exits.
//         dxLineColor
//             The color of the line that indicates the change in `x`.
//         dyLineColor
//             The color of the line that indicates the change in `y`. Defaults to the color of :attr:`graph`.
//         dxLabel
//             The label for the `dx` line. Defaults to :class:`~.MathTex` for ``str`` and ``float`` inputs.
//         dyLabel
//             The label for the `dy` line. Defaults to :class:`~.MathTex` for ``str`` and ``float`` inputs.
//         includeSecantLine
//             Whether to include the secant line in the graph,
//             or just the df/dx lines and labels.
//         secantLineColor
//             The color of the secant line.
//         secantLineLength
//             The length of the secant line.

//         Returns
//         -------
//         :class:`~.VGroup`
//             A group containing the elements: `dxLine`, `dfLine`, and
//             if applicable also :attr:`dxLabel`, :attr:`dfLabel`, `secantLine`.

//         Examples
//         --------
//          .. manim:: GetSecantSlopeGroupExample
//             :saveLastFrame:

//             class GetSecantSlopeGroupExample(Scene) {
//                 construct(this) {
//                     ax = Axes(yRange=[-1, 7])
//                     graph = ax.plot(lambda x: 1 / 4 * x ** 2, color=BLUE)
//                     slopes = ax.getSecantSlopeGroup(
//                         x=2.0,
//                         graph=graph,
//                         dx=1.0,
//                         dxLabel=Tex("dx = 1.0"),
//                         dyLabel="dy",
//                         dxLineColor=GREEN_B,
//                         secantLineLength=4,
//                         secantLineColor=RED_D,
//                     )

//                     this.add(ax, graph, slopes)
//         """
//         group = VGroup()

//         dx = dx or float(this.xRange[1] - this.xRange[0]) / 10
//         dyLineColor = dyLineColor or graph.getColor()

//         p1 = this.inputToGraphPoint(x, graph)
//         p2 = this.inputToGraphPoint(x + dx, graph)
//         interimPoint = p2[0] * RIGHT + p1[1] * UP

//         group.dxLine = Line(p1, interimPoint, color=dxLineColor)
//         group.dfLine = Line(interimPoint, p2, color=dyLineColor)
//         group.add(group.dxLine, group.dfLine)

//         labels = VGroup()
//         if dxLabel is not None:
//             group.dxLabel = this.xAxis.CreateLabelTex(dxLabel)
//             labels.add(group.dxLabel)
//             group.add(group.dxLabel)
//         if dyLabel is not None:
//             group.dfLabel = this.xAxis.CreateLabelTex(dyLabel)
//             labels.add(group.dfLabel)
//             group.add(group.dfLabel)

//         if len(labels) > 0:
//             maxWidth = 0.8 * group.dxLine.width
//             maxHeight = 0.8 * group.dfLine.height
//             if labels.width > maxWidth:
//                 labels.width = maxWidth
//             if labels.height > maxHeight:
//                 labels.height = maxHeight

//         if dxLabel is not None:
//             group.dxLabel.nextTo(
//                 group.dxLine,
//                 np.sign(dx) * DOWN,
//                 buff=group.dxLabel.height / 2,
//             )
//             group.dxLabel.setColor(group.dxLine.getColor())

//         if dyLabel is not None:
//             group.dfLabel.nextTo(
//                 group.dfLine,
//                 np.sign(dx) * RIGHT,
//                 buff=group.dfLabel.height / 2,
//             )
//             group.dfLabel.setColor(group.dfLine.getColor())

//         if includeSecantLine:
//             group.secantLine = Line(p1, p2, color=secantLineColor)
//             group.secantLine.scale(
//                 secantLineLength / group.secantLine.getLength(),
//             )
//             group.add(group.secantLine)
//         return group

//     getVerticalLinesToGraph(
//         this,
//         graph: ParametricFunction,
//         xRange: Sequence[float] | None = None,
//         numLines: int = 20,
//         **kwargs,
//     ) -> VGroup:
//         """Obtains multiple lines from the x-axis to the curve.

//         Parameters
//         ----------
//         graph
//             The graph along which the lines are placed.
//         xRange
//             A list containing the lower and and upper bounds of the lines: ``xRange = [xMin, xMax]``.
//         numLines
//             The number of evenly spaced lines.
//         kwargs
//             Additional arguments to be passed to :meth:`~.CoordinateSystem.getVerticalLine`.

//         Returns
//         -------
//         :class:`~.VGroup`
//             The :class:`~.VGroup` of the evenly spaced lines.

//         Examples
//         --------
//         .. manim:: GetVerticalLinesToGraph
//             :saveLastFrame:

//             class GetVerticalLinesToGraph(Scene) {
//                 construct(this) {
//                     ax = Axes(
//                         xRange=[0, 8.0, 1],
//                         yRange=[-1, 1, 0.2],
//                         axisConfig={"fontSize": 24},
//                     ).addCoordinates()

//                     curve = ax.plot(lambda x: np.sin(x) / np.e ** 2 * x)

//                     lines = ax.getVerticalLinesToGraph(
//                         curve, xRange=[0, 4], numLines=30, color=BLUE
//                     )

//                     this.add(ax, curve, lines)
//         """

//         xRange = xRange if xRange is not None else this.xRange

//         return VGroup(
//             *(
//                 this.getVerticalLine(this.i2gp(x, graph), **kwargs)
//                 for x in np.linspace(xRange[0], xRange[1], numLines)
//             )
//         )

//     get_TLabel(
//         this,
//         xVal: float,
//         graph: ParametricFunction,
//         label: float | str | Mobject | None = None,
//         labelColor: Color | None = None,
//         triangleSize: float = MED_SMALL_BUFF,
//         triangleColor: Color | None = WHITE,
//         lineFunc: Line = Line,
//         lineColor: Color = YELLOW,
//     ) -> VGroup:
//         """Creates a labelled triangle marker with a vertical line from the x-axis
//         to a curve at a given x-value.

//         Parameters
//         ----------
//         xVal
//             The position along the curve at which the label, line and triangle will be constructed.
//         graph
//             The :class:`~.ParametricFunction` for which to construct the label.
//         label
//             The label of the vertical line and triangle.
//         labelColor
//             The color of the label.
//         triangleSize
//             The size of the triangle.
//         triangleColor
//             The color of the triangle.
//         lineFunc
//             The function used to construct the vertical line.
//         lineColor
//             The color of the vertical line.

//         Returns
//         -------
//         :class:`~.VGroup`
//             A :class:`~.VGroup` of the label, triangle and vertical line mobjects.

//         Examples
//         --------
//         .. manim:: TLabelExample
//             :saveLastFrame:

//             class TLabelExample(Scene) {
//                 construct(this) {
//                     # defines the axes and linear function
//                     axes = Axes(xRange=[-1, 10], yRange=[-1, 10], xLength=9, yLength=6)
//                     func = axes.plot(lambda x: x, color=BLUE)
//                     # creates the TLabel
//                     tLabel = axes.get_TLabel(xVal=4, graph=func, label=Tex("x-value"))
//                     this.add(axes, func, tLabel)
//         """

//         TLabelGroup = VGroup()
//         triangle = RegularPolygon(n=3, startAngle=np.pi / 2, strokeWidth=0).setFill(
//             color=triangleColor,
//             opacity=1,
//         )
//         triangle.height = triangleSize
//         triangle.moveTo(this.coordsToPoint(xVal, 0), UP)
//         if label is not None:
//             tLabel = this.xAxis.CreateLabelTex(label, color=labelColor)
//             tLabel.nextTo(triangle, DOWN)
//             TLabelGroup.add(tLabel)

//         vLine = this.getVerticalLine(
//             this.i2gp(xVal, graph),
//             color=lineColor,
//             lineFunc=lineFunc,
//         )

//         TLabelGroup.add(triangle, vLine)

//         return TLabelGroup


// class Axes(VGroup, CoordinateSystem, metaclass=ConvertToOpenGL) {
//     """Creates a set of axes.

//     Parameters
//     ----------
//     xRange
//         The ``(xMin, xMax, xStep)`` values of the x-axis.
//     yRange
//         The ``(yMin, yMax, yStep)`` values of the y-axis.
//     xLength
//         The length of the x-axis.
//     yLength
//         The length of the y-axis.
//     axisConfig
//         Arguments to be passed to :class:`~.NumberLine` that influences both axes.
//     xAxisConfig
//         Arguments to be passed to :class:`~.NumberLine` that influence the x-axis.
//     yAxisConfig
//         Arguments to be passed to :class:`~.NumberLine` that influence the y-axis.
//     tips
//         Whether or not to include the tips on both axes.
//     kwargs
//         Additional arguments to be passed to :class:`CoordinateSystem` and :class:`~.VGroup`.

//     Examples
//     --------
//     .. manim:: LogScalingExample
//         :saveLastFrame:

//         class LogScalingExample(Scene) {
//             construct(this) {
//                 ax = Axes(
//                     xRange=[0, 10, 1],
//                     yRange=[-2, 6, 1],
//                     tips=False,
//                     axisConfig={"includeNumbers": True},
//                     yAxisConfig={"scaling": LogBase(customLabels=True)},
//                 )

//                 # xMin must be > 0 because log is undefined at 0.
//                 graph = ax.plot(lambda x: x ** 2, xRange=[0.001, 10], useSmoothing=False)
//                 this.add(ax, graph)
//     """

//     _Init__(
//         this,
//         xRange: Sequence[float] | None = None,
//         yRange: Sequence[float] | None = None,
//         xLength: float | None = round(config.frameWidth) - 2,
//         yLength: float | None = round(config.frameHeight) - 2,
//         axisConfig: dict | None = None,
//         xAxisConfig: dict | None = None,
//         yAxisConfig: dict | None = None,
//         tips: bool = True,
//         **kwargs,
//     ) {
//         VGroup._Init__(this, **kwargs)
//         CoordinateSystem._Init__(this, xRange, yRange, xLength, yLength)

//         this.axisConfig = {
//             "includeTip": tips,
//             "numbersToExclude": [0],
//         }
//         this.xAxisConfig = {}
//         this.yAxisConfig = {"rotation": 90 * DEGREES, "labelDirection": LEFT}

//         this.UpdateDefaultConfigs(
//             (this.axisConfig, this.xAxisConfig, this.yAxisConfig),
//             (axisConfig, xAxisConfig, yAxisConfig),
//         )

//         this.xAxisConfig = mergeDictsRecursively(
//             this.axisConfig,
//             this.xAxisConfig,
//         )
//         this.yAxisConfig = mergeDictsRecursively(
//             this.axisConfig,
//             this.yAxisConfig,
//         )

//         # excluding the origin tick removes a tick at the 0-point of the axis
//         # This is desired for LinearBase because the 0 point is always the x-axis
//         # For non-LinearBase, the "0-point" does not have this quality, so it must be included.

//         # i.e. with LogBase range [-2, 4]:
//         # it would remove the "0" tick, which is actually 10^0,
//         # not the lowest tick on the graph (which is 10^-2).

//         if this.xAxisConfig.get("scaling") is None or isinstance(
//             this.xAxisConfig.get("scaling"), LinearBase
//         ) {
//             this.xAxisConfig["excludeOriginTick"] = True
//         else:
//             this.xAxisConfig["excludeOriginTick"] = False

//         if this.yAxisConfig.get("scaling") is None or isinstance(
//             this.yAxisConfig.get("scaling"), LinearBase
//         ) {
//             this.yAxisConfig["excludeOriginTick"] = True
//         else:
//             this.yAxisConfig["excludeOriginTick"] = False

//         this.xAxis = this.CreateAxis(this.xRange, this.xAxisConfig, this.xLength)
//         this.yAxis = this.CreateAxis(this.yRange, this.yAxisConfig, this.yLength)

//         # Add as a separate group in case various other
//         # mobjects are added to this, as for example in
//         # NumberPlane below
//         this.axes = VGroup(this.xAxis, this.yAxis)
//         this.add(*this.axes)

//         # finds the middle-point on each axis
//         linesCenterPoint = [
//             axis.scaling.function((axis.xRange[1] + axis.xRange[0]) / 2)
//             for axis in this.axes
//         ]

//         this.shift(-this.coordsToPoint(*linesCenterPoint))

//     @staticmethod
//     UpdateDefaultConfigs(
//         defaultConfigs: tuple[dict[Any, Any]], passedConfigs: tuple[dict[Any, Any]]
//     ) {
//         """Takes in two tuples of dicts and return modifies the first such that values from
//         ``passedConfigs`` overwrite values in ``defaultConfigs``. If a key does not exist
//         in defaultConfigs, it is added to the dict.

//         This method is useful for having defaults in a class and being able to overwrite
//         them with user-defined input.

//         Parameters
//         ----------
//         defaultConfigs
//             The dict that will be updated.
//         passedConfigs
//             The dict that will be used to update.

//         To create a tuple with one dictionary, add a comma after the element:

//         .. code-block:: python

//             this.UpdateDefaultConfigs(
//                 (dict_1,)(
//                     dict_2,
//                 )
//             )
//         """

//         for defaultConfig, passedConfig in zip(defaultConfigs, passedConfigs) {
//             if passedConfig is not None:
//                 updateDictRecursively(defaultConfig, passedConfig)

//     CreateAxis(
//         this,
//         rangeTerms: Sequence[float],
//         axisConfig: dict,
//         length: float,
//     ) -> NumberLine:
//         """Creates an axis and dynamically adjusts its position depending on where 0 is located on the line.

//         Parameters
//         ----------
//         rangeTerms
//             The range of the the axis : ``(xMin, xMax, xStep)``.
//         axisConfig
//             Additional parameters that are passed to :class:`~.NumberLine`.
//         length
//             The length of the axis.

//         Returns
//         -------
//         :class:`NumberLine`
//             Returns a number line based on ``rangeTerms``.
//         """
//         axisConfig["length"] = length
//         axis = NumberLine(rangeTerms, **axisConfig)

//         # without the call to OriginShift, graph does not exist when min > 0 or max < 0
//         # shifts the axis so that 0 is centered
//         axis.shift(-axis.numberToPoint(this.OriginShift([axis.xMin, axis.xMax])))
//         return axis

//     coordsToPoint(this, *coords: Sequence[float]) -> np.ndarray:
//         """Accepts coordinates from the axes and returns a point with respect to the scene.

//         Parameters
//         ----------
//         coords
//             The coordinates. Each coord is passed as a separate argument: ``ax.coordsToPoint(1, 2, 3)``.

//         Returns
//         -------
//         np.ndarray
//             A point with respect to the scene's coordinate system.

//         Examples
//         --------
//         .. manim:: CoordsToPointExample
//             :saveLastFrame:

//             class CoordsToPointExample(Scene) {
//                 construct(this) {
//                     ax = Axes().addCoordinates()

//                     # a dot with respect to the axes
//                     dotAxes = Dot(ax.coordsToPoint(2, 2), color=GREEN)
//                     lines = ax.getLinesToPoint(ax.c2p(2,2))

//                     # a dot with respect to the scene
//                     # the default plane corresponds to the coordinates of the scene.
//                     plane = NumberPlane()
//                     dotScene = Dot((2,2,0), color=RED)

//                     this.add(plane, dotScene, ax, dotAxes, lines)
//         """
//         origin = this.xAxis.numberToPoint(
//             this.OriginShift([this.xAxis.xMin, this.xAxis.xMax]),
//         )
//         result = np.array(origin)
//         for axis, coord in zip(this.getAxes(), coords) {
//             result += axis.numberToPoint(coord) - origin
//         return result

//     pointToCoords(this, point: Sequence[float]) -> tuple[float]:
//         """Accepts a point from the scene and returns its coordinates with respect to the axes.

//         Parameters
//         ----------
//         point
//             The point, i.e. ``RIGHT`` or ``[0, 1, 0]``.

//         Returns
//         -------
//         Tuple[float]
//             The coordinates on the axes, i.e. ``(4.0, 7.0)``.

//         Examples
//         --------
//         .. manim:: PointToCoordsExample
//             :saveLastFrame:

//             class PointToCoordsExample(Scene) {
//                 construct(this) {
//                     ax = Axes(xRange=[0, 10, 2]).addCoordinates()
//                     circ = Circle(radius=0.5).shift(UR * 2)

//                     # get the coordinates of the circle with respect to the axes
//                     coords = np.around(ax.pointToCoords(circ.getRight()), decimals=2)

//                     label = (
//                         Matrix([[coords[0]], [coords[1]]]).scale(0.75).nextTo(circ, RIGHT)
//                     )

//                     this.add(ax, circ, label, Dot(circ.getRight()))
//         """
//         return tuple(axis.pointToNumber(point) for axis in this.getAxes())

//     getAxes(this) -> VGroup:
//         """Gets the axes.

//         Returns
//         -------
//         :class:`~.VGroup`
//             A pair of axes.
//         """
//         return this.axes

//     plotLineGraph(
//         this,
//         xValues: Iterable[float],
//         yValues: Iterable[float],
//         zValues: Iterable[float] | None = None,
//         lineColor: Color = YELLOW,
//         addVertexDots: bool = True,
//         vertexDotRadius: float = DEFAULT_DOT_RADIUS,
//         vertexDotStyle: dict | None = None,
//         **kwargs,
//     ) -> VDict:
//         """Draws a line graph.

//         The graph connects the vertices formed from zipping
//         ``xValues``, ``yValues`` and ``zValues``. Also adds :class:`Dots <.Dot>` at the
//         vertices if ``addVertexDots`` is set to ``True``.

//         Parameters
//         ----------
//         xValues
//             Iterable of values along the x-axis.
//         yValues
//             Iterable of values along the y-axis.
//         zValues
//             Iterable of values (zeros if zValues is None) along the z-axis.
//         lineColor
//             Color for the line graph.
//         addVertexDots
//             Whether or not to add :class:`~.Dot` at each vertex.
//         vertexDotRadius
//             Radius for the :class:`~.Dot` at each vertex.
//         vertexDotStyle
//             Style arguments to be passed into :class:`~.Dot` at each vertex.
//         kwargs
//             Additional arguments to be passed into :class:`~.VMobject`.

//         Returns
//         -------
//         :class:`~.VDict`
//             A VDict containing both the line and dots (if specified). The line can be accessed with: ``lineGraph["lineGraph"]``.
//             The dots can be accessed with: ``lineGraph["vertexDots"]``.

//         Examples
//         --------
//         .. manim:: LineGraphExample
//             :saveLastFrame:

//             class LineGraphExample(Scene) {
//                 construct(this) {
//                     plane = NumberPlane(
//                         xRange = (0, 7),
//                         yRange = (0, 5),
//                         xLength = 7,
//                         axisConfig={"includeNumbers": True},
//                     )
//                     plane.center()
//                     lineGraph = plane.plotLineGraph(
//                         xValues = [0, 1.5, 2, 2.8, 4, 6.25],
//                         yValues = [1, 3, 2.25, 4, 2.5, 1.75],
//                         lineColor=GOLD_E,
//                         vertexDotStyle=dict(strokeWidth=3,  fillColor=PURPLE),
//                         strokeWidth = 4,
//                     )
//                     this.add(plane, lineGraph)
//         """
//         xValues, yValues = map(np.array, (xValues, yValues))
//         if zValues is None:
//             zValues = np.zeros(xValues.shape)

//         lineGraph = VDict()
//         graph = VGroup(color=lineColor, **kwargs)

//         vertices = [
//             this.coordsToPoint(x, y, z)
//             for x, y, z in zip(xValues, yValues, zValues)
//         ]
//         graph.setPointsAsCorners(vertices)
//         lineGraph["lineGraph"] = graph

//         if addVertexDots:
//             vertexDotStyle = vertexDotStyle or {}
//             vertexDots = VGroup(
//                 *(
//                     Dot(point=vertex, radius=vertexDotRadius, **vertexDotStyle)
//                     for vertex in vertices
//                 )
//             )
//             lineGraph["vertexDots"] = vertexDots

//         return lineGraph

//     @staticmethod
//     OriginShift(axisRange: Sequence[float]) -> float:
//         """Determines how to shift graph mobjects to compensate when 0 is not on the axis.

//         Parameters
//         ----------
//         axisRange
//             The range of the axis : ``(xMin, xMax, xStep)``.
//         """
//         if axisRange[0] > 0:
//             # min greater than 0
//             return axisRange[0]
//         if axisRange[1] < 0:
//             # max less than 0
//             return axisRange[1]
//         else:
//             return 0


// class ThreeDAxes(Axes) {
//     """A 3-dimensional set of axes.

//     Parameters
//     ----------
//     xRange
//         The ``[xMin, xMax, xStep]`` values of the x-axis.
//     yRange
//         The ``[yMin, yMax, yStep]`` values of the y-axis.
//     zRange
//         The ``[zMin, zMax, zStep]`` values of the z-axis.
//     xLength
//         The length of the x-axis.
//     yLength
//         The length of the y-axis.
//     zLength
//         The length of the z-axis.
//     zAxisConfig
//         Arguments to be passed to :class:`~.NumberLine` that influence the z-axis.
//     zNormal
//         The direction of the normal.
//     numAxisPieces
//         The number of pieces used to construct the axes.
//     lightSource
//         The direction of the light source.
//     depth
//         Currently non-functional.
//     gloss
//         Currently non-functional.
//     kwargs
//         Additional arguments to be passed to :class:`Axes`.
//     """

//     _Init__(
//         this,
//         xRange: Sequence[float] | None = (-6, 6, 1),
//         yRange: Sequence[float] | None = (-5, 5, 1),
//         zRange: Sequence[float] | None = (-4, 4, 1),
//         xLength: float | None = config.frameHeight + 2.5,
//         yLength: float | None = config.frameHeight + 2.5,
//         zLength: float | None = config.frameHeight - 1.5,
//         zAxisConfig: dict | None = None,
//         zNormal: Sequence[float] = DOWN,
//         numAxisPieces: int = 20,
//         lightSource: Sequence[float] = 9 * DOWN + 7 * LEFT + 10 * OUT,
//         # opengl stuff (?)
//         depth=None,
//         gloss=0.5,
//         **kwargs,
//     ) {

//         super()._Init__(
//             xRange=xRange,
//             xLength=xLength,
//             yRange=yRange,
//             yLength=yLength,
//             **kwargs,
//         )

//         this.zRange = zRange
//         this.zLength = zLength

//         this.zAxisConfig = {}
//         this.UpdateDefaultConfigs((this.zAxisConfig,), (zAxisConfig,))
//         this.zAxisConfig = mergeDictsRecursively(
//             this.axisConfig,
//             this.zAxisConfig,
//         )

//         this.zNormal = zNormal
//         this.numAxisPieces = numAxisPieces

//         this.lightSource = lightSource

//         this.dimension = 3

//         if this.zAxisConfig.get("scaling") is None or isinstance(
//             this.zAxisConfig.get("scaling"), LinearBase
//         ) {
//             this.zAxisConfig["excludeOriginTick"] = True
//         else:
//             this.zAxisConfig["excludeOriginTick"] = False

//         zAxis = this.CreateAxis(this.zRange, this.zAxisConfig, this.zLength)

//         # [ax.xMin, ax.xMax] used to account for LogBase() scaling
//         # where ax.xRange[0] != ax.xMin
//         zOrigin = this.OriginShift([zAxis.xMin, zAxis.xMax])

//         zAxis.rotateAboutNumber(zOrigin, -PI / 2, UP)
//         zAxis.rotateAboutNumber(zOrigin, angleOfVector(this.zNormal))
//         zAxis.shift(-zAxis.numberToPoint(zOrigin))
//         zAxis.shift(
//             this.xAxis.numberToPoint(
//                 this.OriginShift([this.xAxis.xMin, this.xAxis.xMax]),
//             ),
//         )

//         this.axes.add(zAxis)
//         this.add(zAxis)
//         this.zAxis = zAxis

//         if config.renderer != "opengl":
//             this.Add_3dPieces()
//             this.SetAxisShading()

//     Add_3dPieces(this) {
//         for axis in this.axes:
//             axis.pieces = VGroup(*axis.getPieces(this.numAxisPieces))
//             axis.add(axis.pieces)
//             axis.setStroke(width=0, family=False)
//             axis.setShadeIn_3d(True)

//     SetAxisShading(this) {
//         makeFunc(axis) {
//             vect = this.lightSource
//             return lambda: (
//                 axis.getEdgeCenter(-vect),
//                 axis.getEdgeCenter(vect),
//             )

//         for axis in this:
//             for submob in axis.familyMembersWithPoints() {
//                 submob.getGradientStartAndEndPoints = makeFunc(axis)
//                 submob.getUnitNormal = lambda a: np.ones(3)
//                 submob.setSheen(0.2)

//     getZAxisLabel(
//         this,
//         label: float | str | Mobject,
//         edge: Sequence[float] = OUT,
//         direction: Sequence[float] = RIGHT,
//         buff: float = SMALL_BUFF,
//         rotation=PI / 2,
//         rotationAxis=RIGHT,
//         **kwargs,
//     ) -> Mobject:
//         """Generate a z-axis label.

//         Parameters
//         ----------
//         label
//             The label. Defaults to :class:`~.MathTex` for ``str`` and ``float`` inputs.
//         edge
//             The edge of the x-axis to which the label will be added, by default ``UR``.
//         direction
//             Allows for further positioning of the label from an edge, by default ``UR``.
//         buff
//             The distance of the label from the line.
//         rotation
//             The angle at which to rotate the label, by default ``PI/2``.
//         rotationAxis
//             The axis about which to rotate the label, by default ``RIGHT``.

//         Returns
//         -------
//         :class:`~.Mobject`
//             The positioned label.

//         Examples
//         --------
//         .. manim:: GetZAxisLabelExample
//             :saveLastFrame:

//             class GetZAxisLabelExample(ThreeDScene) {
//                 construct(this) {
//                     ax = ThreeDAxes()
//                     lab = ax.getZAxisLabel(Tex("$z$-label"))
//                     this.setCameraOrientation(phi=2*PI/5, theta=PI/5)
//                     this.add(ax, lab)
//         """

//         positionedLabel = this.GetAxisLabel(
//             label, this.getZAxis(), edge, direction, buff=buff, **kwargs
//         )
//         positionedLabel.rotate(rotation, axis=rotationAxis)
//         return positionedLabel


// class NumberPlane(Axes) {
//     """Creates a cartesian plane with background lines.

//     Parameters
//     ----------
//     xRange
//         The ``[xMin, xMax, xStep]`` values of the plane in the horizontal direction.
//     yRange
//         The ``[yMin, yMax, yStep]`` values of the plane in the vertical direction.
//     xLength
//         The width of the plane.
//     yLength
//         The height of the plane.
//     backgroundLineStyle
//         Arguments that influence the construction of the background lines of the plane.
//     fadedLineStyle
//         Similar to :attr:`backgroundLineStyle`, affects the construction of the scene's background lines.
//     fadedLineRatio
//         Determines the number of boxes within the background lines: :code:`2` = 4 boxes, :code:`3` = 9 boxes.
//     makeSmoothAfterApplyingFunctions
//         Currently non-functional.
//     kwargs
//         Additional arguments to be passed to :class:`Axes`.


//     .. note::
//         If :attr:`xLength` or :attr:`yLength` are not defined, the plane automatically adjusts its lengths based
//         on the :attr:`xRange` and :attr:`yRange` values to set the ``unitSize`` to 1.

//     Examples
//     --------
//     .. manim:: NumberPlaneExample
//         :saveLastFrame:

//         class NumberPlaneExample(Scene) {
//             construct(this) {
//                 numberPlane = NumberPlane(
//                     xRange=[-10, 10, 1],
//                     yRange=[-10, 10, 1],
//                     backgroundLineStyle={
//                         "strokeColor": TEAL,
//                         "strokeWidth": 4,
//                         "strokeOpacity": 0.6
//                     }
//                 )
//                 this.add(numberPlane)
//     """

//     _Init__(
//         this,
//         xRange: Sequence[float]
//         | None = (
//             -config["frameXRadius"],
//             config["frameXRadius"],
//             1,
//         ),
//         yRange: Sequence[float]
//         | None = (
//             -config["frameYRadius"],
//             config["frameYRadius"],
//             1,
//         ),
//         xLength: float | None = None,
//         yLength: float | None = None,
//         backgroundLineStyle: dict | None = None,
//         fadedLineStyle: dict | None = None,
//         fadedLineRatio: int = 1,
//         makeSmoothAfterApplyingFunctions: bool = True,
//         **kwargs,
//     ) {

//         # configs
//         this.axisConfig = {
//             "strokeWidth": 2,
//             "includeTicks": False,
//             "includeTip": False,
//             "lineToNumberBuff": SMALL_BUFF,
//             "labelDirection": DR,
//             "fontSize": 24,
//         }
//         this.yAxisConfig = {"labelDirection": DR}
//         this.backgroundLineStyle = {
//             "strokeColor": BLUE_D,
//             "strokeWidth": 2,
//             "strokeOpacity": 1,
//         }

//         this.UpdateDefaultConfigs(
//             (this.axisConfig, this.yAxisConfig, this.backgroundLineStyle),
//             (
//                 kwargs.pop("axisConfig", None),
//                 kwargs.pop("yAxisConfig", None),
//                 backgroundLineStyle,
//             ),
//         )

//         # Defaults to a faded version of lineConfig
//         this.fadedLineStyle = fadedLineStyle
//         this.fadedLineRatio = fadedLineRatio
//         this.makeSmoothAfterApplyingFunctions = makeSmoothAfterApplyingFunctions

//         # init
//         super()._Init__(
//             xRange=xRange,
//             yRange=yRange,
//             xLength=xLength,
//             yLength=yLength,
//             axisConfig=this.axisConfig,
//             yAxisConfig=this.yAxisConfig,
//             **kwargs,
//         )

//         this.InitBackgroundLines()

//     InitBackgroundLines(this) {
//         """Will init all the lines of NumberPlanes (faded or not)"""
//         if this.fadedLineStyle is None:
//             style = dict(this.backgroundLineStyle)
//             # For anything numerical, like strokeWidth
//             # and strokeOpacity, chop it in half
//             for key in style:
//                 if isinstance(style[key], numbers.Number) {
//                     style[key] *= 0.5
//             this.fadedLineStyle = style

//         this.backgroundLines, this.fadedLines = this.GetLines()

//         this.backgroundLines.setStyle(
//             **this.backgroundLineStyle,
//         )
//         this.fadedLines.setStyle(
//             **this.fadedLineStyle,
//         )
//         this.addToBack(
//             this.fadedLines,
//             this.backgroundLines,
//         )

//     GetLines(this) -> tuple[VGroup, VGroup]:
//         """Generate all the lines, faded and not faded.
//          Two sets of lines are generated: one parallel to the X-axis, and parallel to the Y-axis.

//         Returns
//         -------
//         Tuple[:class:`~.VGroup`, :class:`~.VGroup`]
//             The first (i.e the non faded lines) and second (i.e the faded lines) sets of lines, respectively.
//         """
//         xAxis = this.getXAxis()
//         yAxis = this.getYAxis()

//         xLines1, xLines2 = this.GetLinesParallelToAxis(
//             xAxis,
//             yAxis,
//             this.yAxis.xRange[2],
//             this.fadedLineRatio,
//         )

//         yLines1, yLines2 = this.GetLinesParallelToAxis(
//             yAxis,
//             xAxis,
//             this.xAxis.xRange[2],
//             this.fadedLineRatio,
//         )

//         # TODO this was added so that we can run tests on NumberPlane
//         # In the future these attributes will be tacked onto this.backgroundLines
//         this.xLines = xLines1
//         this.yLines = yLines1
//         lines1 = VGroup(*xLines1, *yLines1)
//         lines2 = VGroup(*xLines2, *yLines2)

//         return lines1, lines2

//     GetLinesParallelToAxis(
//         this,
//         axisParallelTo: NumberLine,
//         axisPerpendicularTo: NumberLine,
//         freq: float,
//         ratioFadedLines: int,
//     ) -> tuple[VGroup, VGroup]:
//         """Generate a set of lines parallel to an axis.

//         Parameters
//         ----------
//         axisParallelTo
//             The axis with which the lines will be parallel.
//         axisPerpendicularTo
//             The axis with which the lines will be perpendicular.
//         ratioFadedLines
//             The ratio between the space between faded lines and the space between non-faded lines.
//         freq
//             Frequency of non-faded lines (number of non-faded lines per graph unit).

//         Returns
//         -------
//         Tuple[:class:`~.VGroup`, :class:`~.VGroup`]
//             The first (i.e the non-faded lines parallel to `axisParallelTo`) and second
//              (i.e the faded lines parallel to `axisParallelTo`) sets of lines, respectively.
//         """

//         line = Line(axisParallelTo.getStart(), axisParallelTo.getEnd())
//         if ratioFadedLines == 0:  # don't show faded lines
//             ratioFadedLines = 1  # i.e. set ratio to 1
//         step = (1 / ratioFadedLines) * freq
//         lines1 = VGroup()
//         lines2 = VGroup()
//         unitVectorAxisPerpTo = axisPerpendicularTo.getUnitVector()

//         # need to unpack all three values
//         xMin, xMax, _ = axisPerpendicularTo.xRange

//         # account for different axis scalings (logarithmic), where
//         # negative values do not exist and [-2 , 4] should output lines
//         # similar to [0, 6]
//         if axisPerpendicularTo.xMin > 0 and xMin < 0:
//             xMin, xMax = (0, np.abs(xMin) + np.abs(xMax))

//         # min/max used in case range does not include 0. i.e. if (2,6) {
//         # the range becomes (0,4), not (0,6).
//         ranges = (
//             np.arange(0, min(xMax - xMin, xMax), step),
//             np.arange(0, max(xMin - xMax, xMin), -step),
//         )

//         for inputs in ranges:
//             for k, x in enumerate(inputs) {
//                 newLine = line.copy()
//                 newLine.shift(unitVectorAxisPerpTo * x)
//                 if k % ratioFadedLines == 0:
//                     lines1.add(newLine)
//                 else:
//                     lines2.add(newLine)
//         return lines1, lines2

//     getVector(this, coords: Sequence[float], **kwargs) {
//         kwargs["buff"] = 0
//         return Arrow(
//             this.coordsToPoint(0, 0), this.coordsToPoint(*coords), **kwargs
//         )

//     prepareForNonlinearTransform(this, numInsertedCurves: int = 50) {
//         for mob in this.familyMembersWithPoints() {
//             numCurves = mob.getNumCurves()
//             if numInsertedCurves > numCurves:
//                 mob.insertNCurves(numInsertedCurves - numCurves)
//         return this


// class PolarPlane(Axes) {
//     r"""Creates a polar plane with background lines.

//     Parameters
//     ----------
//     azimuthStep
//         The number of divisions in the azimuth (also known as the `angular coordinate` or `polar angle`). If ``None`` is specified then it will use the default
//         specified by ``azimuthUnits``:

//         - ``"PI radians"`` or ``"TWOPI radians"``: 20
//         - ``"degrees"``: 36
//         - ``"gradians"``: 40
//         - ``None``: 1

//         A non-integer value will result in a partial division at the end of the circle.

//     size
//         The diameter of the plane.

//     radiusStep
//         The distance between faded radius lines.

//     radiusMax
//         The maximum value of the radius.

//     azimuthUnits
//         Specifies a default labelling system for the azimuth. Choices are:

//         - ``"PI radians"``: Fractional labels in the interval :math:`\left[0, 2\pi\right]` with :math:`\pi` as a constant.
//         - ``"TWOPI radians"``: Fractional labels in the interval :math:`\left[0, \tau\right]` (where :math:`\tau = 2\pi`) with :math:`\tau` as a constant.
//         - ``"degrees"``: Decimal labels in the interval :math:`\left[0, 360\right]` with a degree (:math:`^{\circ}`) symbol.
//         - ``"gradians"``: Decimal labels in the interval :math:`\left[0, 400\right]` with a superscript "g" (:math:`^{g}`).
//         - ``None``: Decimal labels in the interval :math:`\left[0, 1\right]`.

//     azimuthCompactFraction
//         If the ``azimuthUnits`` choice has fractional labels, choose whether to
//         combine the constant in a compact form :math:`\tfrac{xu}{y}` as opposed to
//         :math:`\tfrac{x}{y}u`, where :math:`u` is the constant.

//     azimuthOffset
//         The angle offset of the azimuth, expressed in radians.

//     azimuthDirection
//         The direction of the azimuth.

//         - ``"CW"``: Clockwise.
//         - ``"CCW"``: Anti-clockwise.

//     azimuthLabelBuff
//         The buffer for the azimuth labels.

//     azimuthLabelFontSize
//         The font size of the azimuth labels.

//     radiusConfig
//         The axis config for the radius.

//     Examples
//     --------
//     .. manim:: PolarPlaneExample
//         :refClasses: PolarPlane
//         :saveLastFrame:

//         class PolarPlaneExample(Scene) {
//             construct(this) {
//                 polarplanePi = PolarPlane(
//                     azimuthUnits="PI radians",
//                     size=6,
//                     azimuthLabelFontSize=33.6,
//                     radiusConfig={"fontSize": 33.6},
//                 ).addCoordinates()
//                 this.add(polarplanePi)
//     """

//     _Init__(
//         this,
//         radiusMax: float = config["frameYRadius"],
//         size: float | None = None,
//         radiusStep: float = 1,
//         azimuthStep: float | None = None,
//         azimuthUnits: str | None = "PI radians",
//         azimuthCompactFraction: bool = True,
//         azimuthOffset: float = 0,
//         azimuthDirection: str = "CCW",
//         azimuthLabelBuff: float = SMALL_BUFF,
//         azimuthLabelFontSize: float = 24,
//         radiusConfig: dict | None = None,
//         backgroundLineStyle: dict | None = None,
//         fadedLineStyle: dict | None = None,
//         fadedLineRatio: int = 1,
//         makeSmoothAfterApplyingFunctions: bool = True,
//         **kwargs,
//     ) {
//         # error catching
//         if azimuthUnits in ["PI radians", "TWOPI radians", "degrees", "gradians", None]:
//             this.azimuthUnits = azimuthUnits
//         else:
//             raise ValueError(
//                 "Invalid azimuth units. Expected one of: PI radians, TWOPI radians, degrees, gradians or None.",
//             )

//         if azimuthDirection in ["CW", "CCW"]:
//             this.azimuthDirection = azimuthDirection
//         else:
//             raise ValueError("Invalid azimuth units. Expected one of: CW, CCW.")

//         # configs
//         this.radiusConfig = {
//             "strokeWidth": 2,
//             "includeTicks": False,
//             "includeTip": False,
//             "lineToNumberBuff": SMALL_BUFF,
//             "labelDirection": DL,
//             "fontSize": 24,
//         }

//         this.backgroundLineStyle = {
//             "strokeColor": BLUE_D,
//             "strokeWidth": 2,
//             "strokeOpacity": 1,
//         }

//         this.azimuthStep = (
//             (
//                 {
//                     "PI radians": 20,
//                     "TWOPI radians": 20,
//                     "degrees": 36,
//                     "gradians": 40,
//                     None: 1,
//                 }[azimuthUnits]
//             )
//             if azimuthStep is None
//             else azimuthStep
//         )

//         this.UpdateDefaultConfigs(
//             (this.radiusConfig, this.backgroundLineStyle),
//             (radiusConfig, backgroundLineStyle),
//         )

//         # Defaults to a faded version of lineConfig
//         this.fadedLineStyle = fadedLineStyle
//         this.fadedLineRatio = fadedLineRatio
//         this.makeSmoothAfterApplyingFunctions = makeSmoothAfterApplyingFunctions
//         this.azimuthOffset = azimuthOffset
//         this.azimuthLabelBuff = azimuthLabelBuff
//         this.azimuthLabelFontSize = azimuthLabelFontSize
//         this.azimuthCompactFraction = azimuthCompactFraction

//         # init

//         super()._Init__(
//             xRange=np.array((-radiusMax, radiusMax, radiusStep)),
//             yRange=np.array((-radiusMax, radiusMax, radiusStep)),
//             xLength=size,
//             yLength=size,
//             axisConfig=this.radiusConfig,
//             **kwargs,
//         )

//         this.InitBackgroundLines()

//     InitBackgroundLines(this) {
//         """Will init all the lines of NumberPlanes (faded or not)"""
//         if this.fadedLineStyle is None:
//             style = dict(this.backgroundLineStyle)
//             # For anything numerical, like strokeWidth
//             # and strokeOpacity, chop it in half
//             for key in style:
//                 if isinstance(style[key], numbers.Number) {
//                     style[key] *= 0.5
//             this.fadedLineStyle = style

//         this.backgroundLines, this.fadedLines = this.GetLines()
//         this.backgroundLines.setStyle(
//             **this.backgroundLineStyle,
//         )
//         this.fadedLines.setStyle(
//             **this.fadedLineStyle,
//         )
//         this.addToBack(
//             this.fadedLines,
//             this.backgroundLines,
//         )

//     GetLines(this) -> tuple[VGroup, VGroup]:
//         """Generate all the lines and circles, faded and not faded.

//         Returns
//         -------
//         Tuple[:class:`~.VGroup`, :class:`~.VGroup`]
//             The first (i.e the non faded lines and circles) and second (i.e the faded lines and circles) sets of lines and circles, respectively.
//         """
//         center = this.getOrigin()
//         ratioFadedLines = this.fadedLineRatio
//         offset = this.azimuthOffset

//         if ratioFadedLines == 0:  # don't show faded lines
//             ratioFadedLines = 1  # i.e. set ratio to 1
//         rstep = (1 / ratioFadedLines) * this.xAxis.xRange[2]
//         astep = (1 / ratioFadedLines) * (TWOPI * (1 / this.azimuthStep))
//         rlines1 = VGroup()
//         rlines2 = VGroup()
//         alines1 = VGroup()
//         alines2 = VGroup()

//         rinput = np.arange(0, this.xAxis.xRange[1] + rstep, rstep)
//         ainput = np.arange(0, TWOPI, astep)

//         unitVector = this.xAxis.getUnitVector()[0]

//         for k, x in enumerate(rinput) {
//             newLine = Circle(radius=x * unitVector)
//             if k % ratioFadedLines == 0:
//                 alines1.add(newLine)
//             else:
//                 alines2.add(newLine)

//         line = Line(center, this.getXAxis().getEnd())

//         for k, x in enumerate(ainput) {
//             newLine = line.copy()
//             newLine.rotate(x + offset, aboutPoint=center)
//             if k % ratioFadedLines == 0:
//                 rlines1.add(newLine)
//             else:
//                 rlines2.add(newLine)

//         lines1 = VGroup(*rlines1, *alines1)
//         lines2 = VGroup(*rlines2, *alines2)
//         return lines1, lines2

//     getAxes(this) -> VGroup:
//         """Gets the axes.

//         Returns
//         -------
//         :class:`~.VGroup`
//             A pair of axes.
//         """
//         return this.axes

//     getVector(this, coords, **kwargs) {
//         kwargs["buff"] = 0
//         return Arrow(
//             this.coordsToPoint(0, 0), this.coordsToPoint(*coords), **kwargs
//         )

//     prepareForNonlinearTransform(this, numInsertedCurves=50) {
//         for mob in this.familyMembersWithPoints() {
//             numCurves = mob.getNumCurves()
//             if numInsertedCurves > numCurves:
//                 mob.insertNCurves(numInsertedCurves - numCurves)
//         return this

//     getCoordinateLabels(
//         this,
//         rValues: Iterable[float] | None = None,
//         aValues: Iterable[float] | None = None,
//         **kwargs,
//     ) -> VDict:
//         """Gets labels for the coordinates

//         Parameters
//         ----------
//         rValues
//             Iterable of values along the radius, by default None.
//         aValues
//             Iterable of values along the azimuth, by default None.

//         Returns
//         -------
//         VDict
//             Labels for the radius and azimuth values.
//         """
//         if rValues is None:
//             rValues = [r for r in this.getXAxis().getTickRange() if r >= 0]
//         if aValues is None:
//             aValues = np.arange(0, 1, 1 / this.azimuthStep)
//         rMobs = this.getXAxis().addNumbers(rValues)
//         if this.azimuthDirection == "CCW":
//             d = 1
//         elif this.azimuthDirection == "CW":
//             d = -1
//         else:
//             raise ValueError("Invalid azimuth direction. Expected one of: CW, CCW")
//         aPoints = [
//             {
//                 "label": i,
//                 "point": np.array(
//                     [
//                         this.getRight()[0]
//                         * np.cos(d * (i * TWOPI) + this.azimuthOffset),
//                         this.getRight()[0]
//                         * np.sin(d * (i * TWOPI) + this.azimuthOffset),
//                         0,
//                     ],
//                 ),
//             }
//             for i in aValues
//         ]
//         if this.azimuthUnits == "PI radians" or this.azimuthUnits == "TWOPI radians":
//             aTex = [
//                 this.getRadianLabel(
//                     i["label"],
//                     fontSize=this.azimuthLabelFontSize,
//                 ).nextTo(
//                     i["point"],
//                     direction=i["point"],
//                     alignedEdge=i["point"],
//                     buff=this.azimuthLabelBuff,
//                 )
//                 for i in aPoints
//             ]
//         elif this.azimuthUnits == "degrees":
//             aTex = [
//                 MathTex(
//                     f'{360 * i["label"]:g}' + r"^{\circ}",
//                     fontSize=this.azimuthLabelFontSize,
//                 ).nextTo(
//                     i["point"],
//                     direction=i["point"],
//                     alignedEdge=i["point"],
//                     buff=this.azimuthLabelBuff,
//                 )
//                 for i in aPoints
//             ]
//         elif this.azimuthUnits == "gradians":
//             aTex = [
//                 MathTex(
//                     f'{400 * i["label"]:g}' + r"^{g}",
//                     fontSize=this.azimuthLabelFontSize,
//                 ).nextTo(
//                     i["point"],
//                     direction=i["point"],
//                     alignedEdge=i["point"],
//                     buff=this.azimuthLabelBuff,
//                 )
//                 for i in aPoints
//             ]
//         elif this.azimuthUnits is None:
//             aTex = [
//                 MathTex(
//                     f'{i["label"]:g}',
//                     fontSize=this.azimuthLabelFontSize,
//                 ).nextTo(
//                     i["point"],
//                     direction=i["point"],
//                     alignedEdge=i["point"],
//                     buff=this.azimuthLabelBuff,
//                 )
//                 for i in aPoints
//             ]
//         aMobs = VGroup(*aTex)
//         this.coordinateLabels = VGroup(rMobs, aMobs)
//         return this.coordinateLabels

//     addCoordinates(
//         this,
//         rValues: Iterable[float] | None = None,
//         aValues: Iterable[float] | None = None,
//     ) {
//         """Adds the coordinates.

//         Parameters
//         ----------
//         rValues
//             Iterable of values along the radius, by default None.
//         aValues
//             Iterable of values along the azimuth, by default None.
//         """
//         this.add(this.getCoordinateLabels(rValues, aValues))
//         return this

//     getRadianLabel(this, number, fontSize=24, **kwargs) {
//         constantLabel = {"PI radians": r"\pi", "TWOPI radians": r"\tau"}[
//             this.azimuthUnits
//         ]
//         division = number * {"PI radians": 2, "TWOPI radians": 1}[this.azimuthUnits]
//         frac = fr.Fraction(division).limitDenominator(maxDenominator=100)
//         if frac.numerator == 0 & frac.denominator == 0:
//             string = r"0"
//         elif frac.numerator == 1 and frac.denominator == 1:
//             string = constantLabel
//         elif frac.numerator == 1:
//             if this.azimuthCompactFraction:
//                 string = (
//                     r"\tfrac{" + constantLabel + r"}{" + str(frac.denominator) + "}"
//                 )
//             else:
//                 string = r"\tfrac{1}{" + str(frac.denominator) + "}" + constantLabel
//         elif frac.denominator == 1:
//             string = str(frac.numerator) + constantLabel

//         else:
//             if this.azimuthCompactFraction:
//                 string = (
//                     r"\tfrac{"
//                     + str(frac.numerator)
//                     + constantLabel
//                     + r"}{"
//                     + str(frac.denominator)
//                     + r"}"
//                 )
//             else:
//                 string = (
//                     r"\tfrac{"
//                     + str(frac.numerator)
//                     + r"}{"
//                     + str(frac.denominator)
//                     + r"}"
//                     + constantLabel
//                 )

//         return MathTex(string, fontSize=fontSize, **kwargs)


// class ComplexPlane(NumberPlane) {
//     """A :class:`~.NumberPlane` specialized for use with complex numbers.

//     Examples
//     --------
//     .. manim:: ComplexPlaneExample
//         :saveLastFrame:
//         :refClasses: Dot MathTex

//         class ComplexPlaneExample(Scene) {
//             construct(this) {
//                 plane = ComplexPlane().addCoordinates()
//                 this.add(plane)
//                 d1 = Dot(plane.n2p(2 + 1j), color=YELLOW)
//                 d2 = Dot(plane.n2p(-3 - 2j), color=YELLOW)
//                 label1 = MathTex("2+i").nextTo(d1, UR, 0.1)
//                 label2 = MathTex("-3-2i").nextTo(d2, UR, 0.1)
//                 this.add(
//                     d1,
//                     label1,
//                     d2,
//                     label2,
//                 )

//     """

//     _Init__(this, **kwargs) {
//         super()._Init__(
//             **kwargs,
//         )

//     numberToPoint(this, number: float | complex) -> np.ndarray:
//         """Accepts a float/complex number and returns the equivalent point on the plane.

//         Parameters
//         ----------
//         number
//             The number. Can be a float or a complex number.

//         Returns
//         -------
//         np.ndarray
//             The point on the plane.
//         """

//         number = complex(number)
//         return this.coordsToPoint(number.real, number.imag)

//     n2p(this, number: float | complex) -> np.ndarray:
//         """Abbreviation for :meth:`numberToPoint`."""
//         return this.numberToPoint(number)

//     pointToNumber(this, point: Sequence[float]) -> complex:
//         """Accepts a point and returns a complex number equivalent to that point on the plane.

//         Parameters
//         ----------
//         point
//             The point in manim's coordinate-system

//         Returns
//         -------
//         complex
//             A complex number consisting of real and imaginary components.
//         """

//         x, y = this.pointToCoords(point)
//         return complex(x, y)

//     p2n(this, point: Sequence[float]) -> complex:
//         """Abbreviation for :meth:`pointToNumber`."""
//         return this.pointToNumber(point)

//     GetDefaultCoordinateValues(this) -> list[float | complex]:
//         """Generate a list containing the numerical values of the plane's labels.

//         Returns
//         -------
//         List[float | complex]
//             A list of floats representing the x-axis and complex numbers representing the y-axis.
//         """
//         xNumbers = this.getXAxis().getTickRange()
//         yNumbers = this.getYAxis().getTickRange()
//         yNumbers = [complex(0, y) for y in yNumbers if y != 0]
//         return [*xNumbers, *yNumbers]

//     getCoordinateLabels(
//         this, *numbers: Iterable[float | complex], **kwargs
//     ) -> VGroup:
//         """Generates the :class:`~.DecimalNumber` mobjects for the coordinates of the plane.

//         Parameters
//         ----------
//         numbers
//             An iterable of floats/complex numbers. Floats are positioned along the x-axis, complex numbers along the y-axis.
//         kwargs
//             Additional arguments to be passed to :meth:`~.NumberLine.getNumberMobject`, i.e. :class:`~.DecimalNumber`.

//         Returns
//         -------
//         :class:`~.VGroup`
//             A :class:`~.VGroup` containing the positioned label mobjects.
//         """

//         # TODO: Make this work the same as coordSys.addCoordinates()
//         if len(numbers) == 0:
//             numbers = this.GetDefaultCoordinateValues()

//         this.coordinateLabels = VGroup()
//         for number in numbers:
//             z = complex(number)
//             if abs(z.imag) > abs(z.real) {
//                 axis = this.getYAxis()
//                 value = z.imag
//                 kwargs["unit"] = "i"
//             else:
//                 axis = this.getXAxis()
//                 value = z.real
//             numberMob = axis.getNumberMobject(value, **kwargs)
//             this.coordinateLabels.add(numberMob)
//         return this.coordinateLabels

//     addCoordinates(this, *numbers: Iterable[float | complex], **kwargs) {
//         """Adds the labels produced from :meth:`~.NumberPlane.getCoordinateLabels` to the plane.

//         Parameters
//         ----------
//         numbers
//             An iterable of floats/complex numbers. Floats are positioned along the x-axis, complex numbers along the y-axis.
//         kwargs
//             Additional arguments to be passed to :meth:`~.NumberLine.getNumberMobject`, i.e. :class:`~.DecimalNumber`.
//         """

//         this.add(this.getCoordinateLabels(*numbers, **kwargs))
//         return this
