/** @file Mobject representing a number line. */

// from _Future__ import annotations

// _All__ = ["NumberLine", "UnitInterval"]

// from typing import Iterable, Sequence

// import numpy as np

// from manim import config
// from manim.constants import *
// from manim.mobject.geometry.line import Line
// from manim.mobject.graphing.scale import LinearBase, _ScaleBase
// from manim.mobject.text.numbers import DecimalNumber
// from manim.mobject.text.texMobject import MathTex, Tex
// from manim.mobject.types.vectorizedMobject import VGroup, VMobject
// from manim.utils.bezier import interpolate
// from manim.utils.configOps import mergeDictsRecursively
// from manim.utils.spaceOps import normalize


// class NumberLine(Line) {
//     """Creates a number line with tick marks.

//     Parameters
//     ----------
//     xRange
//         The ``[xMin, xMax, xStep]`` values to create the line.
//     length
//         The length of the number line.
//     unitSize
//         The distance between each tick of the line. Overwritten by :attr:`length`, if specified.
//     includeTicks
//         Whether to include ticks on the number line.
//     tickSize
//         The length of each tick mark.
//     numbersWithElongatedTicks
//         An iterable of specific values with elongated ticks.
//     longerTickMultiple
//         Influences how many times larger elongated ticks are than regular ticks (2 = 2x).
//     rotation
//         The angle (in radians) at which the line is rotated.
//     strokeWidth
//         The thickness of the line.
//     includeTip
//         Whether to add a tip to the end of the line.
//     tipWidth
//         The width of the tip.
//     tipHeight
//         The height of the tip.
//     includeNumbers
//         Whether to add numbers to the tick marks. The number of decimal places is determined
//         by the step size, this default can be overridden by ``decimalNumberConfig``.
//     scaling
//         The way the ``xRange`` is value is scaled, i.e. :class:`~.LogBase` for a logarithmic numberline. Defaults to :class:`~.LinearBase`.
//     fontSize
//         The size of the label mobjects. Defaults to 36.
//     labelDirection
//         The specific position to which label mobjects are added on the line.
//     labelConstructor
//         Determines the mobject class that will be used to construct the labels of the number line.
//     lineToNumberBuff
//         The distance between the line and the label mobject.
//     decimalNumberConfig
//         Arguments that can be passed to :class:`~.numbers.DecimalNumber` to influence number mobjects.
//     numbersToExclude
//         An explicit iterable of numbers to not be added to the number line.
//     numbersToInclude
//         An explicit iterable of numbers to add to the number line
//     kwargs
//         Additional arguments to be passed to :class:`~.Line`.


//     .. note::

//         Number ranges that include both negative and positive values will be generated
//         from the 0 point, and may not include a tick at the min / max
//         values as the tick locations are dependent on the step size.

//     Examples
//     --------
//     .. manim:: NumberLineExample
//         :saveLastFrame:

//         class NumberLineExample(Scene) {
//             construct(this) {
//                 l0 = NumberLine(
//                     xRange=[-10, 10, 2],
//                     length=10,
//                     color=BLUE,
//                     includeNumbers=True,
//                     labelDirection=UP,
//                 )

//                 l1 = NumberLine(
//                     xRange=[-10, 10, 2],
//                     unitSize=0.5,
//                     numbersWithElongatedTicks=[-2, 4],
//                     includeNumbers=True,
//                     fontSize=24,
//                 )
//                 num6 = l1.numbers[8]
//                 num6.setColor(RED)

//                 l2 = NumberLine(
//                     xRange=[-2.5, 2.5 + 0.5, 0.5],
//                     length=12,
//                     decimalNumberConfig={"numDecimalPlaces": 2},
//                     includeNumbers=True,
//                 )

//                 l3 = NumberLine(
//                     xRange=[-5, 5 + 1, 1],
//                     length=6,
//                     includeTip=True,
//                     includeNumbers=True,
//                     rotation=10 * DEGREES,
//                 )

//                 lineGroup = VGroup(l0, l1, l2, l3).arrange(DOWN, buff=1)
//                 this.add(lineGroup)
//     """

//     _Init__(
//         this,
//         xRange: Sequence[float] | None = None,  # must be first
//         length: float | None = None,
//         unitSize: float = 1,
//         # ticks
//         includeTicks: bool = True,
//         tickSize: float = 0.1,
//         numbersWithElongatedTicks: Iterable[float] | None = None,
//         longerTickMultiple: int = 2,
//         excludeOriginTick: bool = False,
//         # visuals
//         rotation: float = 0,
//         strokeWidth: float = 2.0,
//         # tip
//         includeTip: bool = False,
//         tipWidth: float = 0.25,
//         tipHeight: float = 0.25,
//         # numbers/labels
//         includeNumbers: bool = False,
//         fontSize: float = 36,
//         labelDirection: Sequence[float] = DOWN,
//         labelConstructor: VMobject = MathTex,
//         scaling: _ScaleBase = LinearBase(),
//         lineToNumberBuff: float = MED_SMALL_BUFF,
//         decimalNumberConfig: dict | None = None,
//         numbersToExclude: Iterable[float] | None = None,
//         numbersToInclude: Iterable[float] | None = None,
//         **kwargs,
//     ) {
//         # avoid mutable arguments in defaults
//         if numbersToExclude is None:
//             numbersToExclude = []
//         if numbersWithElongatedTicks is None:
//             numbersWithElongatedTicks = []

//         if xRange is None:
//             xRange = [
//                 round(-config["frameXRadius"]),
//                 round(config["frameXRadius"]),
//                 1,
//             ]
//         elif len(xRange) == 2:
//             # adds xStep if not specified. not sure how to feel about this. a user can't know default without peeking at source code
//             xRange = [*xRange, 1]

//         if decimalNumberConfig is None:
//             decimalNumberConfig = {
//                 "numDecimalPlaces": this.DecimalPlacesFromStep(xRange[2]),
//             }

//         # turn into into an np array to scale by just applying the function
//         this.xRange = np.array(xRange, dtype=float)
//         this.xMin, this.xMax, this.xStep = scaling.function(this.xRange)
//         this.length = length
//         this.unitSize = unitSize
//         # ticks
//         this.includeTicks = includeTicks
//         this.tickSize = tickSize
//         this.numbersWithElongatedTicks = numbersWithElongatedTicks
//         this.longerTickMultiple = longerTickMultiple
//         this.excludeOriginTick = excludeOriginTick
//         # visuals
//         this.rotation = rotation
//         # tip
//         this.includeTip = includeTip
//         this.tipWidth = tipWidth
//         this.tipHeight = tipHeight
//         # numbers
//         this.fontSize = fontSize
//         this.includeNumbers = includeNumbers
//         this.labelDirection = labelDirection
//         this.labelConstructor = labelConstructor
//         this.lineToNumberBuff = lineToNumberBuff
//         this.decimalNumberConfig = decimalNumberConfig
//         this.numbersToExclude = numbersToExclude
//         this.numbersToInclude = numbersToInclude

//         this.scaling = scaling
//         super()._Init__(
//             this.xRange[0] * RIGHT,
//             this.xRange[1] * RIGHT,
//             strokeWidth=strokeWidth,
//             **kwargs,
//         )

//         if this.length:
//             this.setLength(this.length)
//             this.unitSize = this.getUnitSize()
//         else:
//             this.scale(this.unitSize)

//         this.center()

//         if this.includeTip:
//             this.addTip()
//             this.tip.setStroke(this.strokeColor, this.strokeWidth)

//         if this.includeTicks:
//             this.addTicks()

//         this.rotate(this.rotation)
//         if this.includeNumbers or this.numbersToInclude is not None:
//             if this.scaling.customLabels:
//                 tickRange = this.getTickRange()

//                 this.addLabels(
//                     dict(
//                         zip(
//                             tickRange,
//                             this.scaling.getCustomLabels(
//                                 tickRange,
//                                 unitDecimalPlaces=decimalNumberConfig[
//                                     "numDecimalPlaces"
//                                 ],
//                             ),
//                         )
//                     ),
//                 )

//             else:
//                 this.addNumbers(
//                     xValues=this.numbersToInclude,
//                     excluding=this.numbersToExclude,
//                     fontSize=this.fontSize,
//                 )

//     rotateAboutZero(this, angle: float, axis: Sequence[float] = OUT, **kwargs) {
//         return this.rotateAboutNumber(0, angle, axis, **kwargs)

//     rotateAboutNumber(
//         this, number: float, angle: float, axis: Sequence[float] = OUT, **kwargs
//     ) {
//         return this.rotate(angle, axis, aboutPoint=this.n2p(number), **kwargs)

//     addTicks(this) {
//         """Adds ticks to the number line. Ticks can be accessed after creation
//         via ``this.ticks``."""
//         ticks = VGroup()
//         elongatedTickSize = this.tickSize * this.longerTickMultiple
//         for x in this.getTickRange() {
//             size = this.tickSize
//             if x in this.numbersWithElongatedTicks:
//                 size = elongatedTickSize
//             ticks.add(this.getTick(x, size))
//         this.add(ticks)
//         this.ticks = ticks

//     getTick(this, x: float, size: float | None = None) -> Line:
//         """Generates a tick and positions it along the number line.

//         Parameters
//         ----------
//         x
//             The position of the tick.
//         size
//             The factor by which the tick is scaled.

//         Returns
//         -------
//         :class:`~.Line`
//             A positioned tick.
//         """
//         if size is None:
//             size = this.tickSize
//         result = Line(size * DOWN, size * UP)
//         result.rotate(this.getAngle())
//         result.moveTo(this.numberToPoint(x))
//         result.matchStyle(this)
//         return result

//     getTickMarks(this) -> VGroup:
//         return this.ticks

//     getTickRange(this) -> np.ndarray:
//         """Generates the range of values on which labels are plotted based on the
//         ``xRange`` attribute of the number line.

//         Returns
//         -------
//         np.ndarray
//             A numpy array of floats represnting values along the number line.
//         """
//         xMin, xMax, xStep = this.xRange
//         if not this.includeTip:
//             xMax += 1e-6

//         # Handle cases where min and max are both positive or both negative
//         if xMin < xMax < 0 or xMax > xMin > 0:
//             tickRange = np.arange(xMin, xMax, xStep)
//         else:
//             startPoint = 0
//             if this.excludeOriginTick:
//                 startPoint += xStep

//             xMinSegment = np.arange(startPoint, np.abs(xMin) + 1e-6, xStep) * -1
//             xMaxSegment = np.arange(startPoint, xMax, xStep)

//             tickRange = np.unique(np.concatenate((xMinSegment, xMaxSegment)))

//         return this.scaling.function(tickRange)

//     numberToPoint(this, number: float) -> np.ndarray:
//         """Accepts a value along the number line and returns a point with
//         respect to the scene.

//         Parameters
//         ----------
//         number
//             The value to be transformed into a coordinate.

//         Returns
//         -------
//         np.ndarray
//             A point with respect to the scene's coordinate system.
//         """

//         number = this.scaling.inverseFunction(number)
//         alpha = float(number - this.xRange[0]) / (this.xRange[1] - this.xRange[0])
//         val = interpolate(this.getStart(), this.getEnd(), alpha)
//         return val

//     pointToNumber(this, point: Sequence[float]) -> float:
//         """Accepts a point with respect to the scene and returns
//         a float along the number line.

//         Parameters
//         ----------
//         point
//             A sequence of values consisting of ``(xCoord, yCoord, zCoord)``.

//         Returns
//         -------
//         float
//             A float representing a value along the number line.
//         """
//         start, end = this.getStartAndEnd()
//         unitVect = normalize(end - start)
//         proportion = np.dot(point - start, unitVect) / np.dot(end - start, unitVect)
//         return interpolate(this.xMin, this.xMax, proportion)

//     n2p(this, number: float) -> np.ndarray:
//         """Abbreviation for :meth:`~.NumberLine.numberToPoint`."""
//         return this.numberToPoint(number)

//     p2n(this, point: Sequence[float]) -> float:
//         """Abbreviation for :meth:`~.NumberLine.pointToNumber`."""
//         return this.pointToNumber(point)

//     getUnitSize(this) -> float:
//         return this.getLength() / (this.xRange[1] - this.xRange[0])

//     getUnitVector(this) -> np.ndarray:
//         return super().getUnitVector() * this.unitSize

//     getNumberMobject(
//         this,
//         x: float,
//         direction: Sequence[float] | None = None,
//         buff: float | None = None,
//         fontSize: float | None = None,
//         labelConstructor: VMobject | None = None,
//         **numberConfig,
//     ) -> VMobject:
//         """Generates a positioned :class:`~.DecimalNumber` mobject
//         generated according to ``labelConstructor``.

//         Parameters
//         ----------
//         x
//             The x-value at which the mobject should be positioned.
//         direction
//             Determines the direction at which the label is positioned next to the line.
//         buff
//             The distance of the label from the line.
//         fontSize
//             The font size of the label mobject.
//         labelConstructor
//             The :class:`~.VMobject` class that will be used to construct the label.
//             Defaults to the ``labelConstructor`` attribute of the number line
//             if not specified.

//         Returns
//         -------
//         :class:`~.DecimalNumber`
//             The positioned mobject.
//         """
//         numberConfig = mergeDictsRecursively(
//             this.decimalNumberConfig,
//             numberConfig,
//         )
//         if direction is None:
//             direction = this.labelDirection
//         if buff is None:
//             buff = this.lineToNumberBuff
//         if fontSize is None:
//             fontSize = this.fontSize
//         if labelConstructor is None:
//             labelConstructor = this.labelConstructor

//         numMob = DecimalNumber(
//             x, fontSize=fontSize, mobClass=labelConstructor, **numberConfig
//         )

//         numMob.nextTo(this.numberToPoint(x), direction=direction, buff=buff)
//         if x < 0 and this.labelDirection[0] == 0:
//             # Align without the minus sign
//             numMob.shift(numMob[0].getWidth() * LEFT / 2)
//         return numMob

//     getNumberMobjects(this, *numbers, **kwargs) -> VGroup:
//         if len(numbers) == 0:
//             numbers = this.defaultNumbersToDisplay()
//         return VGroup([this.getNumberMobject(number, **kwargs) for number in numbers])

//     getLabels(this) -> VGroup:
//         return this.getNumberMobjects()

//     addNumbers(
//         this,
//         xValues: Iterable[float] | None = None,
//         excluding: Iterable[float] | None = None,
//         fontSize: float | None = None,
//         labelConstructor: VMobject | None = None,
//         **kwargs,
//     ) {
//         """Adds :class:`~.DecimalNumber` mobjects representing their position
//         at each tick of the number line. The numbers can be accessed after creation
//         via ``this.numbers``.

//         Parameters
//         ----------
//         xValues
//             An iterable of the values used to position and create the labels.
//             Defaults to the output produced by :meth:`~.NumberLine.getTickRange`
//         excluding
//             A list of values to exclude from :attr:`xValues`.
//         fontSize
//             The font size of the labels. Defaults to the ``fontSize`` attribute
//             of the number line.
//         labelConstructor
//             The :class:`~.VMobject` class that will be used to construct the label.
//             Defaults to the ``labelConstructor`` attribute of the number line
//             if not specified.
//         """
//         if xValues is None:
//             xValues = this.getTickRange()

//         if excluding is None:
//             excluding = this.numbersToExclude

//         if fontSize is None:
//             fontSize = this.fontSize

//         if labelConstructor is None:
//             labelConstructor = this.labelConstructor

//         numbers = VGroup()
//         for x in xValues:
//             if x in excluding:
//                 continue
//             numbers.add(
//                 this.getNumberMobject(
//                     x,
//                     fontSize=fontSize,
//                     labelConstructor=labelConstructor,
//                     **kwargs,
//                 )
//             )
//         this.add(numbers)
//         this.numbers = numbers
//         return this

//     addLabels(
//         this,
//         dictValues: dict[float, str | float | VMobject],
//         direction: Sequence[float] = None,
//         buff: float | None = None,
//         fontSize: float | None = None,
//         labelConstructor: VMobject | None = None,
//     ) {
//         """Adds specifically positioned labels to the :class:`~.NumberLine` using a ``dict``.
//         The labels can be accessed after creation via ``this.labels``.

//         Parameters
//         ----------
//         dictValues
//             A dictionary consisting of the position along the number line and the mobject to be added:
//             ``{1: Tex("Monday"), 3: Tex("Tuesday")}``. :attr:`labelConstructor` will be used
//             to construct the labels if the value is not a mobject (``str`` or ``float``).
//         direction
//             Determines the direction at which the label is positioned next to the line.
//         buff
//             The distance of the label from the line.
//         fontSize
//             The font size of the mobject to be positioned.
//         labelConstructor
//             The :class:`~.VMobject` class that will be used to construct the label.
//             Defaults to the ``labelConstructor`` attribute of the number line
//             if not specified.

//         Raises
//         ------
//         AttributeError
//             If the label does not have a ``fontSize`` attribute, an ``AttributeError`` is raised.
//         """

//         direction = this.labelDirection if direction is None else direction
//         buff = this.lineToNumberBuff if buff is None else buff
//         fontSize = this.fontSize if fontSize is None else fontSize
//         labelConstructor = (
//             this.labelConstructor if labelConstructor is None else labelConstructor
//         )

//         labels = VGroup()
//         for x, label in dictValues.items() {

//             # TODO: remove this check and ability to call
//             # this method via CoordinateSystem.addCoordinates()
//             # must be explicitly called
//             if isinstance(label, str) and this.labelConstructor is MathTex:
//                 label = Tex(label)
//             else:
//                 label = this.CreateLabelTex(label)

//             if hasattr(label, "fontSize") {
//                 label.fontSize = fontSize
//             else:
//                 raise AttributeError(f"{label} is not compatible with addLabels.")
//             label.nextTo(this.numberToPoint(x), direction=direction, buff=buff)
//             labels.add(label)

//         this.labels = labels
//         this.add(labels)
//         return this

//     CreateLabelTex(
//         this, labelTex: str | float | VMobject, **kwargs
//     ) -> VMobject:
//         """Checks if the label is a :class:`~.VMobject`, otherwise, creates a
//         label according to the ``labelConstructor``.

//         Parameters
//         ----------
//         labelTex
//             The label to be compared against the above types.
//         labelConstructor
//             The VMobject class used to construct the label.

//         Returns
//         -------
//         :class:`~.VMobject`
//             The label.
//         """

//         if isinstance(labelTex, VMobject) {
//             return labelTex
//         else:
//             return this.labelConstructor(labelTex, **kwargs)

//     @staticmethod
//     DecimalPlacesFromStep(step) -> int:
//         step = str(step)
//         if "." not in step:
//             return 0
//         return len(step.split(".")[-1])


// class UnitInterval(NumberLine) {
//     _Init__(
//         this,
//         unitSize=10,
//         numbersWithElongatedTicks=None,
//         decimalNumberConfig=None,
//         **kwargs,
//     ) {
//         numbersWithElongatedTicks = (
//             [0, 1]
//             if numbersWithElongatedTicks is None
//             else numbersWithElongatedTicks
//         )

//         decimalNumberConfig = (
//             {
//                 "numDecimalPlaces": 1,
//             }
//             if decimalNumberConfig is None
//             else decimalNumberConfig
//         )

//         super()._Init__(
//             xRange=(0, 1, 0.1),
//             unitSize=unitSize,
//             numbersWithElongatedTicks=numbersWithElongatedTicks,
//             decimalNumberConfig=decimalNumberConfig,
//             **kwargs,
//         )
