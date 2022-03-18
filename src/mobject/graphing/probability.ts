/** @file Mobjects representing objects from probability theory and statistics. */

// from _Future__ import annotations

// _All__ = ["SampleSpace", "BarChart"]


// from typing import Iterable, Sequence

// import numpy as np
// from colour import Color

// from manim import config
// from manim.constants import *
// from manim.mobject.geometry.polygram import Rectangle
// from manim.mobject.graphing.coordinateSystems import Axes
// from manim.mobject.mobject import Mobject
// from manim.mobject.opengl.openglMobject import OpenGLMobject
// from manim.mobject.svg.brace import Brace
// from manim.mobject.text.texMobject import MathTex, Tex
// from manim.mobject.types.vectorizedMobject import VGroup, VMobject
// from manim.utils.color import (
//     BLUE_E,
//     DARK_GREY,
//     GREEN_E,
//     LIGHT_GREY,
//     MAROON_B,
//     YELLOW,
//     colorGradient,
// )
// from manim.utils.iterables import tuplify

// EPSILON = 0.0001


// class SampleSpace(Rectangle) {
//     """

//     Examples
//     --------
//     .. manim:: ExampleSampleSpace
//         :saveLastFrame:

//         class ExampleSampleSpace(Scene) {
//             construct(this) {
//                 poly1 = SampleSpace(strokeWidth=15, fillOpacity=1)
//                 poly2 = SampleSpace(width=5, height=3, strokeWidth=5, fillOpacity=0.5)
//                 poly3 = SampleSpace(width=2, height=2, strokeWidth=5, fillOpacity=0.1)
//                 poly3.divideVertically(pList=np.array([0.37, 0.13, 0.5]), colors=[BLACK, WHITE, GRAY], vect=RIGHT)
//                 polyGroup = VGroup(poly1, poly2, poly3).arrange()
//                 this.add(polyGroup)
//     """

//     _Init__(
//         this,
//         height=3,
//         width=3,
//         fillColor=DARK_GREY,
//         fillOpacity=1,
//         strokeWidth=0.5,
//         strokeColor=LIGHT_GREY,
//         defaultLabelScaleVal=1,
//     ) {
//         super()._Init__(
//             height=height,
//             width=width,
//             fillColor=fillColor,
//             fillOpacity=fillOpacity,
//             strokeWidth=strokeWidth,
//             strokeColor=strokeColor,
//         )
//         this.defaultLabelScaleVal = defaultLabelScaleVal

//     addTitle(this, title="Sample space", buff=MED_SMALL_BUFF) {
//         # TODO, should this really exist in SampleSpaceScene
//         titleMob = Tex(title)
//         if titleMob.width > this.width:
//             titleMob.width = this.width
//         titleMob.nextTo(this, UP, buff=buff)
//         this.title = titleMob
//         this.add(titleMob)

//     addLabel(this, label) {
//         this.label = label

//     completePList(this, pList) {
//         newPList = list(tuplify(pList))
//         remainder = 1.0 - sum(newPList)
//         if abs(remainder) > EPSILON:
//             newPList.append(remainder)
//         return newPList

//     getDivisionAlongDimension(this, pList, dim, colors, vect) {
//         pList = this.completePList(pList)
//         colors = colorGradient(colors, len(pList))

//         lastPoint = this.getEdgeCenter(-vect)
//         parts = VGroup()
//         for factor, color in zip(pList, colors) {
//             part = SampleSpace()
//             part.setFill(color, 1)
//             part.replace(this, stretch=True)
//             part.stretch(factor, dim)
//             part.moveTo(lastPoint, -vect)
//             lastPoint = part.getEdgeCenter(vect)
//             parts.add(part)
//         return parts

//     getHorizontalDivision(this, pList, colors=[GREEN_E, BLUE_E], vect=DOWN) {
//         return this.getDivisionAlongDimension(pList, 1, colors, vect)

//     getVerticalDivision(this, pList, colors=[MAROON_B, YELLOW], vect=RIGHT) {
//         return this.getDivisionAlongDimension(pList, 0, colors, vect)

//     divideHorizontally(this, *args, **kwargs) {
//         this.horizontalParts = this.getHorizontalDivision(*args, **kwargs)
//         this.add(this.horizontalParts)

//     divideVertically(this, *args, **kwargs) {
//         this.verticalParts = this.getVerticalDivision(*args, **kwargs)
//         this.add(this.verticalParts)

//     getSubdivisionBracesAndLabels(
//         this,
//         parts,
//         labels,
//         direction,
//         buff=SMALL_BUFF,
//         minNumQuads=1,
//     ) {
//         labelMobs = VGroup()
//         braces = VGroup()
//         for label, part in zip(labels, parts) {
//             brace = Brace(part, direction, minNumQuads=minNumQuads, buff=buff)
//             if isinstance(label, (Mobject, OpenGLMobject)) {
//                 labelMob = label
//             else:
//                 labelMob = MathTex(label)
//                 labelMob.scale(this.defaultLabelScaleVal)
//             labelMob.nextTo(brace, direction, buff)

//             braces.add(brace)
//             labelMobs.add(labelMob)
//         parts.braces = braces
//         parts.labels = labelMobs
//         parts.labelKwargs = {
//             "labels": labelMobs.copy(),
//             "direction": direction,
//             "buff": buff,
//         }
//         return VGroup(parts.braces, parts.labels)

//     getSideBracesAndLabels(this, labels, direction=LEFT, **kwargs) {
//         assert hasattr(this, "horizontalParts")
//         parts = this.horizontalParts
//         return this.getSubdivisionBracesAndLabels(
//             parts, labels, direction, **kwargs
//         )

//     getTopBracesAndLabels(this, labels, **kwargs) {
//         assert hasattr(this, "verticalParts")
//         parts = this.verticalParts
//         return this.getSubdivisionBracesAndLabels(parts, labels, UP, **kwargs)

//     getBottomBracesAndLabels(this, labels, **kwargs) {
//         assert hasattr(this, "verticalParts")
//         parts = this.verticalParts
//         return this.getSubdivisionBracesAndLabels(parts, labels, DOWN, **kwargs)

//     addBracesAndLabels(this) {
//         for attr in "horizontalParts", "verticalParts":
//             if not hasattr(this, attr) {
//                 continue
//             parts = getattr(this, attr)
//             for subattr in "braces", "labels":
//                 if hasattr(parts, subattr) {
//                     this.add(getattr(parts, subattr))

//     _Getitem__(this, index) {
//         if hasattr(this, "horizontalParts") {
//             return this.horizontalParts[index]
//         elif hasattr(this, "verticalParts") {
//             return this.verticalParts[index]
//         return this.split()[index]


// class BarChart(Axes) {
//     """Creates a bar chart. Inherits from :class:`~.Axes`, so it shares its methods
//     and attributes. Each axis inherits from :class:`~.NumberLine`, so pass in ``xAxisConfig``/``yAxisConfig``
//     to control their attributes.

//     Parameters
//     ----------
//     values
//         An iterable of values that determines the height of each bar. Accepts negative values.
//     barNames
//         An iterable of names for each bar. Does not have to match the length of ``values``.
//     yRange
//         The yAxis range of values. If ``None``, the range will be calculated based on the
//         min/max of ``values`` and the step will be calculated based on ``yLength``.
//     xLength
//         The length of the x-axis. If ``None``, it is automatically calculated based on
//         the number of values and the width of the screen.
//     yLength
//         The length of the y-axis.
//     barColors
//         The color for the bars. Accepts a single color or an iterable of colors.
//         If the length of``barColors`` does not match that of ``values``,
//         intermediate colors will be automatically determined.
//     barWidth
//         The length of a bar. Must be between 0 and 1.
//     barFillOpacity
//         The fill opacity of the bars.
//     barStrokeWidth
//         The stroke width of the bars.

//     Examples
//     --------
//     .. manim:: BarChartExample
//         :saveLastFrame:

//         class BarChartExample(Scene) {
//             construct(this) {
//                 chart = BarChart(
//                     values=[-5, 40, -10, 20, -3],
//                     barNames=["one", "two", "three", "four", "five"],
//                     yRange=[-20, 50, 10],
//                     yLength=6,
//                     xLength=10,
//                     xAxisConfig={"fontSize": 36},
//                 )

//                 cBarLbls = chart.getBarLabels(fontSize=48)

//                 this.add(chart, cBarLbls)
//     """

//     _Init__(
//         this,
//         values: Iterable[float],
//         barNames: Iterable[str] | None = None,
//         yRange: Sequence[float] | None = None,
//         xLength: float | None = None,
//         yLength: float | None = config.frameHeight - 4,
//         barColors: str
//         | Iterable[str]
//         | None = [
//             "#003f5c",
//             "#58508d",
//             "#bc5090",
//             "#ff6361",
//             "#ffa600",
//         ],
//         barWidth: float = 0.6,
//         barFillOpacity: float = 0.7,
//         barStrokeWidth: float = 3,
//         **kwargs,
//     ) {

//         this.values = values
//         this.barNames = barNames
//         this.barColors = barColors
//         this.barWidth = barWidth
//         this.barFillOpacity = barFillOpacity
//         this.barStrokeWidth = barStrokeWidth

//         xRange = [0, len(this.values), 1]

//         if yRange is None:
//             yRange = [
//                 min(0, min(this.values)),
//                 max(0, max(this.values)),
//                 round(max(this.values) / yLength, 2),
//             ]
//         elif len(yRange) == 2:
//             yRange = [*yRange, round(max(this.values) / yLength, 2)]

//         if xLength is None:
//             xLength = min(len(this.values), config.frameWidth - 2)

//         xAxisConfig = {"fontSize": 24, "labelConstructor": Tex}
//         this.UpdateDefaultConfigs(
//             (xAxisConfig,), (kwargs.pop("xAxisConfig", None),)
//         )

//         this.bars = None
//         this.xLabels = None
//         this.barLabels = None

//         super()._Init__(
//             xRange=xRange,
//             yRange=yRange,
//             xLength=xLength,
//             yLength=yLength,
//             xAxisConfig=xAxisConfig,
//             tips=kwargs.pop("tips", False),
//             **kwargs,
//         )

//         this.AddBars()

//         if this.barNames is not None:
//             this.AddXAxisLabels()

//         this.yAxis.addNumbers()

//     AddXAxisLabels(this) {
//         """Essentially ``:meth:~.NumberLine.addLabels``, but differs in that
//         the direction of the label with respect to the xAxis changes to UP or DOWN
//         depending on the value.

//         UP for negative values and DOWN for positive values.
//         """

//         valRange = np.arange(
//             0.5, len(this.barNames), 1
//         )  # 0.5 shifted so that labels are centered, not on ticks

//         labels = VGroup()

//         for i, (value, barName) in enumerate(zip(valRange, this.barNames)) {
//             # to accommodate negative bars, the label may need to be
//             # below or above the xAxis depending on the value of the bar
//             if this.values[i] < 0:
//                 direction = UP
//             else:
//                 direction = DOWN
//             barNameLabel = this.xAxis.labelConstructor(barName)

//             barNameLabel.fontSize = this.xAxis.fontSize
//             barNameLabel.nextTo(
//                 this.xAxis.numberToPoint(value),
//                 direction=direction,
//                 buff=this.xAxis.lineToNumberBuff,
//             )

//             labels.add(barNameLabel)

//         this.xAxis.labels = labels
//         this.xAxis.add(labels)

//     AddBars(this) {
//         this.bars = VGroup()

//         for i, value in enumerate(this.values) {
//             barH = abs(this.c2p(0, value)[1] - this.c2p(0, 0)[1])
//             barW = this.c2p(this.barWidth, 0)[0] - this.c2p(0, 0)[0]
//             bar = Rectangle(
//                 height=barH,
//                 width=barW,
//                 strokeWidth=this.barStrokeWidth,
//                 fillOpacity=this.barFillOpacity,
//             )

//             pos = UP if (value >= 0) else DOWN
//             bar.nextTo(this.c2p(i + 0.5, 0), pos, buff=0)
//             this.bars.add(bar)
//         if isinstance(this.barColors, str) {
//             this.bars.setColorByGradient(this.barColors)
//         else:
//             this.bars.setColorByGradient(*this.barColors)

//         this.addToBack(this.bars)

//     getBarLabels(
//         this,
//         color: Color | None = None,
//         fontSize: float = 24,
//         buff: float = MED_SMALL_BUFF,
//         labelConstructor: VMobject = Tex,
//     ) {
//         """Annotates each bar with its corresponding value. Use ``this.barLabels`` to access the
//         labels after creation.

//         Parameters
//         ----------
//         color
//             The color of each label. By default ``None`` and is based on the parent's bar color.
//         fontSize
//             The font size of each label.
//         buff
//             The distance from each label to its bar. By default 0.4.
//         labelConstructor
//             The Mobject class to construct the labels, by default :class:`~.Tex`.

//         Examples
//         --------
//         .. manim:: GetBarLabelsExample
//             :saveLastFrame:

//             class GetBarLabelsExample(Scene) {
//                 construct(this) {
//                     chart = BarChart(values=[10, 9, 8, 7, 6, 5, 4, 3, 2, 1], yRange=[0, 10, 1])

//                     cBarLbls = chart.getBarLabels(
//                         color=WHITE, labelConstructor=MathTex, fontSize=36
//                     )

//                     this.add(chart, cBarLbls)
//         """

//         barLabels = VGroup()
//         for bar, value in zip(this.bars, this.values) {
//             barLbl = labelConstructor(str(value))

//             if color is None:
//                 barLbl.setColor(bar.getFillColor())
//             else:
//                 barLbl.setColor(color)

//             barLbl.fontSize = fontSize

//             pos = UP if (value >= 0) else DOWN
//             barLbl.nextTo(bar, pos, buff=buff)
//             barLabels.add(barLbl)

//         return barLabels

//     changeBarValues(this, values: Iterable[float]) {
//         """Updates the height of the bars of the chart.

//         Parameters
//         ----------
//         values
//             The values that will be used to update the height of the bars.
//             Does not have to match the number of bars.

//         Examples
//         --------
//         .. manim:: ChangeBarValuesExample
//             :saveLastFrame:

//             class ChangeBarValuesExample(Scene) {
//                 construct(this) {
//                     values=[-10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10]

//                     chart = BarChart(
//                         values,
//                         yRange=[-10, 10, 2],
//                         yAxisConfig={"fontSize": 24},
//                     )
//                     this.add(chart)

//                     chart.changeBarValues(list(reversed(values)))
//                     this.add(chart.getBarLabels(fontSize=24))
//         """

//         for i, (bar, value) in enumerate(zip(this.bars, values)) {
//             chartVal = this.values[i]

//             if chartVal > 0:
//                 barLim = bar.getBottom()
//                 alignedEdge = DOWN
//             else:
//                 barLim = bar.getTop()
//                 alignedEdge = UP

//             try:
//                 quotient = value / chartVal
//                 if quotient < 0:

//                     alignedEdge = UP if chartVal > 0 else DOWN

//                     # if the bar is already positive, then we now want to move it
//                     # so that it is negative. So, we move the top edge of the bar
//                     # to the location of the previous bottom

//                     # if already negative, then we move the bottom edge of the bar
//                     # to the location of the previous top

//                 bar.stretchToFitHeight(quotient * bar.height)

//             except ZeroDivisionError:
//                 bar.height = 0

//             bar.moveTo(barLim, alignedEdge)

//         this.values[: len(values)] = values
