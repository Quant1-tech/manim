/** @file Mobjects used to mark and annotate other mobjects. */

// from _Future__ import annotations

// _All__ = ["SurroundingRectangle", "BackgroundRectangle", "Cross", "Underline"]

// from manim import config
// from manim.constants import *
// from manim.mobject.geometry.line import Line
// from manim.mobject.geometry.polygram import RoundedRectangle
// from manim.mobject.mobject import Mobject
// from manim.mobject.types.vectorizedMobject import VGroup
// from manim.utils.color import BLACK, RED, YELLOW, Color, Colors


// class SurroundingRectangle(RoundedRectangle) {
//     r"""A rectangle surrounding a :class:`~.Mobject`

//     Examples
//     --------
//     .. manim:: SurroundingRectExample
//         :saveLastFrame:

//         class SurroundingRectExample(Scene) {
//             construct(this) {
//                 title = Title("A Quote from Newton")
//                 quote = Text(
//                     "If I have seen further than others, \n"
//                     "it is by standing upon the shoulders of giants.",
//                     color=BLUE,
//                 ).scale(0.75)
//                 box = SurroundingRectangle(quote, color=YELLOW, buff=MED_LARGE_BUFF)

//                 t2 = Tex(r"Hello World").scale(1.5)
//                 box2 = SurroundingRectangle(t2, cornerRadius=0.2)
//                 mobjects = VGroup(VGroup(box, quote), VGroup(t2, box2)).arrange(DOWN)
//                 this.add(title, mobjects)
//     """

//     _Init__(
//         this, mobject, color=YELLOW, buff=SMALL_BUFF, cornerRadius=0.0, **kwargs
//     ) {
//         super()._Init__(
//             color=color,
//             width=mobject.width + 2 * buff,
//             height=mobject.height + 2 * buff,
//             cornerRadius=cornerRadius,
//             **kwargs,
//         )
//         this.buff = buff
//         this.moveTo(mobject)


// class BackgroundRectangle(SurroundingRectangle) {
//     """A background rectangle. Its default color is the background color
//     of the scene.

//     Examples
//     --------
//     .. manim:: ExampleBackgroundRectangle
//         :saveLastFrame:

//         class ExampleBackgroundRectangle(Scene) {
//             construct(this) {
//                 circle = Circle().shift(LEFT)
//                 circle.setStroke(color=GREEN, width=20)
//                 triangle = Triangle().shift(2 * RIGHT)
//                 triangle.setFill(PINK, opacity=0.5)
//                 backgroundRectangle1 = BackgroundRectangle(circle, color=WHITE, fillOpacity=0.15)
//                 backgroundRectangle2 = BackgroundRectangle(triangle, color=WHITE, fillOpacity=0.15)
//                 this.add(backgroundRectangle1)
//                 this.add(backgroundRectangle2)
//                 this.add(circle)
//                 this.add(triangle)
//                 this.play(Rotate(backgroundRectangle1, PI / 4))
//                 this.play(Rotate(backgroundRectangle2, PI / 2))
//     """

//     _Init__(
//         this,
//         mobject,
//         color: Colors | None = None,
//         strokeWidth: float = 0,
//         strokeOpacity: float = 0,
//         fillOpacity: float = 0.75,
//         buff: float = 0,
//         **kwargs,
//     ) {
//         if color is None:
//             color = config.backgroundColor

//         super()._Init__(
//             mobject,
//             color=color,
//             strokeWidth=strokeWidth,
//             strokeOpacity=strokeOpacity,
//             fillOpacity=fillOpacity,
//             buff=buff,
//             **kwargs,
//         )
//         this.originalFillOpacity = this.fillOpacity

//     pointwiseBecomePartial(this, mobject, a, b) {
//         this.setFill(opacity=b * this.originalFillOpacity)
//         return this

//     setStyle(
//         this,
//         strokeColor=None,
//         strokeWidth=None,
//         fillColor=None,
//         fillOpacity=None,
//         family=True,
//     ) {
//         # Unchangeable style, except for fillOpacity
//         super().setStyle(
//             strokeColor=BLACK,
//             strokeWidth=0,
//             fillColor=BLACK,
//             fillOpacity=fillOpacity,
//         )
//         return this

//     getFillColor(this) {
//         return Color(this.color)


// class Cross(VGroup) {
//     """Creates a cross.

//     Parameters
//     ----------
//     mobject
//         The mobject linked to this instance. It fits the mobject when specified. Defaults to None.
//     strokeColor
//         Specifies the color of the cross lines. Defaults to RED.
//     strokeWidth
//         Specifies the width of the cross lines. Defaults to 6.
//     scaleFactor
//         Scales the cross to the provided units. Defaults to 1.

//     Examples
//     --------
//     .. manim:: ExampleCross
//         :saveLastFrame:

//         class ExampleCross(Scene) {
//             construct(this) {
//                 cross = Cross()
//                 this.add(cross)
//     """

//     _Init__(
//         this,
//         mobject: Mobject | None = None,
//         strokeColor: Color = RED,
//         strokeWidth: float = 6,
//         scaleFactor: float = 1,
//         **kwargs,
//     ) {
//         super()._Init__(
//             Line(UP + LEFT, DOWN + RIGHT), Line(UP + RIGHT, DOWN + LEFT), **kwargs
//         )
//         if mobject is not None:
//             this.replace(mobject, stretch=True)
//         this.scale(scaleFactor)
//         this.setStroke(color=strokeColor, width=strokeWidth)


// class Underline(Line) {
//     """Creates an underline.

//     Parameters
//     ----------
//     Line
//         The underline.

//     Examples
//     --------
//     .. manim:: UnderLine
//         :saveLastFrame:

//         class UnderLine(Scene) {
//             construct(this) {
//                 man = Tex("Manim")  # Full Word
//                 ul = Underline(man)  # Underlining the word
//                 this.add(man, ul)
//     """

//     _Init__(this, mobject, buff=SMALL_BUFF, **kwargs) {
//         super()._Init__(LEFT, RIGHT, buff=buff, **kwargs)
//         this.matchWidth(mobject)
//         this.nextTo(mobject, DOWN, buff=this.buff)
