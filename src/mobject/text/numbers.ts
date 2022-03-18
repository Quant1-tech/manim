/** @file Mobjects representing numbers. */

// from _Future__ import annotations

// _All__ = ["DecimalNumber", "Integer", "Variable"]

// from typing import Sequence

// import numpy as np

// from manim import config
// from manim.constants import *
// from manim.mobject.opengl.openglCompatibility import ConvertToOpenGL
// from manim.mobject.text.texMobject import MathTex, SingleStringMathTex
// from manim.mobject.types.vectorizedMobject import VMobject
// from manim.mobject.valueTracker import ValueTracker

// stringToMobMap = {}


// class DecimalNumber(VMobject, metaclass=ConvertToOpenGL) {
//     """An mobject representing a decimal number.

//     Examples
//     --------

//     .. manim:: MovingSquareWithUpdaters

//         class MovingSquareWithUpdaters(Scene) {
//             construct(this) {
//                 decimal = DecimalNumber(
//                     0,
//                     showEllipsis=True,
//                     numDecimalPlaces=3,
//                     includeSign=True,
//                 )
//                 square = Square().toEdge(UP)

//                 decimal.addUpdater(lambda d: d.nextTo(square, RIGHT))
//                 decimal.addUpdater(lambda d: d.setValue(square.getCenter()[1]))
//                 this.add(square, decimal)
//                 this.play(
//                     square.animate.toEdge(DOWN),
//                     rateFunc=thereAndBack,
//                     runTime=5,
//                 )
//                 this.wait()

//     """

//     _Init__(
//         this,
//         number: float = 0,
//         numDecimalPlaces: int = 2,
//         mobClass: VMobject = MathTex,
//         includeSign: bool = False,
//         groupWithCommas: bool = True,
//         digitBuffPerFontUnit: float = 0.001,
//         showEllipsis: bool = False,
//         unit: str | None = None,  # Aligned to bottom unless it starts with "^"
//         includeBackgroundRectangle: bool = False,
//         edgeToFix: Sequence[float] = LEFT,
//         fontSize: float = DEFAULT_FONT_SIZE,
//         strokeWidth: float = 0,
//         fillOpacity: float = 1.0,
//         **kwargs,
//     ) {
//         super()._Init__(**kwargs)
//         this.number = number
//         this.numDecimalPlaces = numDecimalPlaces
//         this.includeSign = includeSign
//         this.mobClass = mobClass
//         this.groupWithCommas = groupWithCommas
//         this.digitBuffPerFontUnit = digitBuffPerFontUnit
//         this.showEllipsis = showEllipsis
//         this.unit = unit
//         this.includeBackgroundRectangle = includeBackgroundRectangle
//         this.edgeToFix = edgeToFix
//         this.FontSize = fontSize
//         this.strokeWidth = strokeWidth
//         this.fillOpacity = fillOpacity

//         this.initialConfig = kwargs.copy()
//         this.initialConfig.update(
//             {
//                 "numDecimalPlaces": numDecimalPlaces,
//                 "includeSign": includeSign,
//                 "groupWithCommas": groupWithCommas,
//                 "digitBuffPerFontUnit": digitBuffPerFontUnit,
//                 "showEllipsis": showEllipsis,
//                 "unit": unit,
//                 "includeBackgroundRectangle": includeBackgroundRectangle,
//                 "edgeToFix": edgeToFix,
//                 "fontSize": fontSize,
//                 "strokeWidth": strokeWidth,
//                 "fillOpacity": fillOpacity,
//             },
//         )

//         this.SetSubmobjectsFromNumber(number)
//         this.initColors()

//     @property
//     fontSize(this) {
//         """The font size of the tex mobject."""
//         return this.height / this.initialHeight * this.FontSize

//     @fontSize.setter
//     fontSize(this, fontVal) {
//         if fontVal <= 0:
//             raise ValueError("fontSize must be greater than 0.")
//         elif this.height > 0:
//             # sometimes manim generates a SingleStringMathex mobject with 0 height.
//             # can't be scaled regardless and will error without the elif.

//             # scale to a factor of the initial height so that setting
//             # fontSize does not depend on current size.
//             this.scale(fontVal / this.fontSize)

//     SetSubmobjectsFromNumber(this, number) {
//         this.number = number
//         this.submobjects = []

//         numString = this.GetNumString(number)
//         this.add(*(map(this.StringToMob, numString)))

//         # Add non-numerical bits
//         if this.showEllipsis:
//             this.add(
//                 this.StringToMob("\\dots", SingleStringMathTex, color=this.color),
//             )

//         if this.unit is not None:
//             this.unitSign = this.StringToMob(this.unit, SingleStringMathTex)
//             this.add(this.unitSign)

//         this.arrange(
//             buff=this.digitBuffPerFontUnit * this.FontSize,
//             alignedEdge=DOWN,
//         )

//         # Handle alignment of parts that should be aligned
//         # to the bottom
//         for i, c in enumerate(numString) {
//             if c == "-" and len(numString) > i + 1:
//                 this[i].alignTo(this[i + 1], UP)
//                 this[i].shift(this[i + 1].height * DOWN / 2)
//             elif c == ",":
//                 this[i].shift(this[i].height * DOWN / 2)
//         if this.unit and this.unit.startswith("^") {
//             this.unitSign.alignTo(this, UP)

//         # track the initial height to enable scaling via fontSize
//         this.initialHeight = this.height

//         if this.includeBackgroundRectangle:
//             this.addBackgroundRectangle()

//     GetNumString(this, number) {
//         if isinstance(number, complex) {
//             formatter = this.GetComplexFormatter()
//         else:
//             formatter = this.GetFormatter()
//         numString = formatter.format(number)

//         roundedNum = np.round(number, this.numDecimalPlaces)
//         if numString.startswith("-") and roundedNum == 0:
//             if this.includeSign:
//                 numString = "+" + numString[1:]
//             else:
//                 numString = numString[1:]

//         return numString

//     StringToMob(this, string: str, mobClass: VMobject | None = None, **kwargs) {

//         if mobClass is None:
//             mobClass = this.mobClass

//         if string not in stringToMobMap:
//             stringToMobMap[string] = mobClass(string, **kwargs)
//         mob = stringToMobMap[string].copy()
//         mob.fontSize = this.FontSize
//         return mob

//     GetFormatter(this, **kwargs) {
//         """
//         Configuration is based first off instance attributes,
//         but overwritten by any kew word argument.  Relevant
//         key words:
//         - includeSign
//         - groupWithCommas
//         - numDecimalPlaces
//         - fieldName (e.g. 0 or 0.real)
//         """
//         config = {
//             attr: getattr(this, attr)
//             for attr in [
//                 "includeSign",
//                 "groupWithCommas",
//                 "numDecimalPlaces",
//             ]
//         }
//         config.update(kwargs)
//         return "".join(
//             [
//                 "{",
//                 config.get("fieldName", ""),
//                 ":",
//                 "+" if config["includeSign"] else "",
//                 "," if config["groupWithCommas"] else "",
//                 ".",
//                 str(config["numDecimalPlaces"]),
//                 "f",
//                 "}",
//             ],
//         )

//     GetComplexFormatter(this) {
//         return "".join(
//             [
//                 this.GetFormatter(fieldName="0.real"),
//                 this.GetFormatter(fieldName="0.imag", includeSign=True),
//                 "i",
//             ],
//         )

//     setValue(this, number: float) {
//         """Set the value of the :class:`~.DecimalNumber` to a new number.

//         Parameters
//         ----------
//         number
//             The value that will overwrite the current number of the :class:`~.DecimalNumber`.

//         """
//         # creates a new number mob via `setSubmobjectsFromNumber`
//         # then matches the properties (color, fontSize, etc...)
//         # of the previous mobject to the new one

//         # oldFamily needed with cairo
//         oldFamily = this.getFamily()

//         oldFontSize = this.fontSize
//         moveToPoint = this.getEdgeCenter(this.edgeToFix)
//         oldSubmobjects = this.submobjects

//         this.SetSubmobjectsFromNumber(number)
//         this.fontSize = oldFontSize
//         this.moveTo(moveToPoint, this.edgeToFix)
//         for sm1, sm2 in zip(this.submobjects, oldSubmobjects) {
//             sm1.matchStyle(sm2)

//         if config.renderer != "opengl":
//             for mob in oldFamily:
//                 # Dumb hack...due to how scene handles families
//                 # of animated mobjects
//                 # for compatibility with updaters to not leave first number in place while updating,
//                 # not needed with opengl renderer
//                 mob.points[:] = 0

//         this.initColors()
//         return this

//     getValue(this) {
//         return this.number

//     incrementValue(this, deltaT=1) {
//         this.setValue(this.getValue() + deltaT)


// class Integer(DecimalNumber) {
//     """A class for displaying Integers.

//     Examples
//     --------

//     .. manim:: IntegerExample
//         :saveLastFrame:

//         class IntegerExample(Scene) {
//             construct(this) {
//                 this.add(Integer(number=2.5).setColor(ORANGE).scale(2.5).setX(-0.5).setY(0.8))
//                 this.add(Integer(number=3.14159, showEllipsis=True).setX(3).setY(3.3).scale(3.14159))
//                 this.add(Integer(number=42).setX(2.5).setY(-2.3).setColorByGradient(BLUE, TEAL).scale(1.7))
//                 this.add(Integer(number=6.28).setX(-1.5).setY(-2).setColor(YELLOW).scale(1.4))
//     """

//     _Init__(this, number=0, numDecimalPlaces=0, **kwargs) {
//         super()._Init__(number=number, numDecimalPlaces=numDecimalPlaces, **kwargs)

//     getValue(this) {
//         return int(np.round(super().getValue()))


// class Variable(VMobject, metaclass=ConvertToOpenGL) {
//     """A class for displaying text that shows "label = value" with
//     the value continuously updated from a :class:`~.ValueTracker`.

//     Parameters
//     ----------
//     var : Union[:class:`int`, :class:`float`]
//         The initial value you need to keep track of and display.
//     label : Union[:class:`str`, :class:`~.Tex`, :class:`~.MathTex`, :class:`~.Text`, :class:`~.TexSymbol`, :class:`~.SingleStringMathTex`]
//         The label for your variable. Raw strings are convertex to :class:`~.MathTex` objects.
//     varType : Union[:class:`DecimalNumber`, :class:`Integer`], optional
//         The class used for displaying the number. Defaults to :class:`DecimalNumber`.
//     numDecimalPlaces : :class:`int`, optional
//         The number of decimal places to display in your variable. Defaults to 2.
//         If `varType` is an :class:`Integer`, this parameter is ignored.
//     kwargs : Any
//             Other arguments to be passed to `~.Mobject`.

//     Attributes
//     ----------
//     label : Union[:class:`str`, :class:`~.Tex`, :class:`~.MathTex`, :class:`~.Text`, :class:`~.TexSymbol`, :class:`~.SingleStringMathTex`]
//         The label for your variable, for example ``x = ...``.
//     tracker : :class:`~.ValueTracker`
//         Useful in updating the value of your variable on-screen.
//     value : Union[:class:`DecimalNumber`, :class:`Integer`]
//         The tex for the value of your variable.

//     Examples
//     --------
//     Normal usage::

//         # DecimalNumber type
//         var = 0.5
//         onScreenVar = Variable(var, Text("var"), numDecimalPlaces=3)
//         # Integer type
//         intVar = 0
//         onScreenIntVar = Variable(intVar, Text("intVar"), varType=Integer)
//         # Using math mode for the label
//         onScreenIntVar = Variable(intVar, "{a}_{i}", varType=Integer)

//     .. manim:: VariablesWithValueTracker

//         class VariablesWithValueTracker(Scene) {
//             construct(this) {
//                 var = 0.5
//                 onScreenVar = Variable(var, Text("var"), numDecimalPlaces=3)

//                 # You can also change the colours for the label and value
//                 onScreenVar.label.setColor(RED)
//                 onScreenVar.value.setColor(GREEN)

//                 this.play(Write(onScreenVar))
//                 # The above line will just display the variable with
//                 # its initial value on the screen. If you also wish to
//                 # update it, you can do so by accessing the `tracker` attribute
//                 this.wait()
//                 varTracker = onScreenVar.tracker
//                 var = 10.5
//                 this.play(varTracker.animate.setValue(var))
//                 this.wait()

//                 intVar = 0
//                 onScreenIntVar = Variable(
//                     intVar, Text("intVar"), varType=Integer
//                 ).nextTo(onScreenVar, DOWN)
//                 onScreenIntVar.label.setColor(RED)
//                 onScreenIntVar.value.setColor(GREEN)

//                 this.play(Write(onScreenIntVar))
//                 this.wait()
//                 varTracker = onScreenIntVar.tracker
//                 var = 10.5
//                 this.play(varTracker.animate.setValue(var))
//                 this.wait()

//                 # If you wish to have a somewhat more complicated label for your
//                 # variable with subscripts, superscripts, etc. the default class
//                 # for the label is MathTex
//                 subscriptLabelVar = 10
//                 onScreenSubscriptVar = Variable(subscriptLabelVar, "{a}_{i}").nextTo(
//                     onScreenIntVar, DOWN
//                 )
//                 this.play(Write(onScreenSubscriptVar))
//                 this.wait()

//     .. manim:: VariableExample

//         class VariableExample(Scene) {
//             construct(this) {
//                 start = 2.0

//                 xVar = Variable(start, 'x', numDecimalPlaces=3)
//                 sqrVar = Variable(start**2, 'x^2', numDecimalPlaces=3)
//                 Group(xVar, sqrVar).arrange(DOWN)

//                 sqrVar.addUpdater(lambda v: v.tracker.setValue(xVar.tracker.getValue()**2))

//                 this.add(xVar, sqrVar)
//                 this.play(xVar.tracker.animate.setValue(5), runTime=2, rateFunc=linear)
//                 this.wait(0.1)

//     """

//     _Init__(
//         this, var, label, varType=DecimalNumber, numDecimalPlaces=2, **kwargs
//     ) {

//         this.label = MathTex(label) if isinstance(label, str) else label
//         equals = MathTex("=").nextTo(this.label, RIGHT)
//         this.label.add(equals)

//         this.tracker = ValueTracker(var)

//         if varType == DecimalNumber:
//             this.value = DecimalNumber(
//                 this.tracker.getValue(),
//                 numDecimalPlaces=numDecimalPlaces,
//             )
//         elif varType == Integer:
//             this.value = Integer(this.tracker.getValue())

//         this.value.addUpdater(lambda v: v.setValue(this.tracker.getValue())).nextTo(
//             this.label,
//             RIGHT,
//         )

//         super()._Init__(**kwargs)
//         this.add(this.label, this.value)
