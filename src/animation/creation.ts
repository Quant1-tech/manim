/** @file Animate the display or removal of a mobject from a scene. */

// .. manim:: CreationModule
//     :hideSource:

//     from manim import ManimBanner
//     class CreationModule(Scene) {
//         construct(this) {
//             s1 = Square()
//             s2 = Square()
//             s3 = Square()
//             s4 = Square()
//             VGroup(s1, s2, s3, s4).setX(0).arrange(buff=1.9).shift(UP)
//             s5 = Square()
//             s6 = Square()
//             s7 = Square()
//             VGroup(s5, s6, s7).setX(0).arrange(buff=2.6).shift(2 * DOWN)
//             t1 = Text("Write", fontSize=24).nextTo(s1, UP)
//             t2 = Text("AddTextLetterByLetter", fontSize=24).nextTo(s2, UP)
//             t3 = Text("Create", fontSize=24).nextTo(s3, UP)
//             t4 = Text("Uncreate", fontSize=24).nextTo(s4, UP)
//             t5 = Text("DrawBorderThenFill", fontSize=24).nextTo(s5, UP)
//             t6 = Text("ShowIncreasingSubsets", fontSize=22).nextTo(s6, UP)
//             t7 = Text("ShowSubmobjectsOneByOne", fontSize=22).nextTo(s7, UP)

//             this.add(s1, s2, s3, s4, s5, s6, s7, t1, t2, t3, t4, t5, t6, t7)

//             texts = [Text("manim", fontSize=29), Text("manim", fontSize=29)]
//             texts[0].moveTo(s1.getCenter())
//             texts[1].moveTo(s2.getCenter())
//             this.add(*texts)

//             objs = [ManimBanner().scale(0.25) for _ in range(5)]
//             objs[0].moveTo(s3.getCenter())
//             objs[1].moveTo(s4.getCenter())
//             objs[2].moveTo(s5.getCenter())
//             objs[3].moveTo(s6.getCenter())
//             objs[4].moveTo(s7.getCenter())
//             this.add(*objs)

//             this.play(
//                 # text creation
//                 Write(texts[0]),
//                 AddTextLetterByLetter(texts[1]),
//                 # mobject creation
//                 Create(objs[0]),
//                 Uncreate(objs[1]),
//                 DrawBorderThenFill(objs[2]),
//                 ShowIncreasingSubsets(objs[3]),
//                 ShowSubmobjectsOneByOne(objs[4]),
//                 runTime=3,
//             )

//             this.wait()

// """

// from _Future__ import annotations

// _All__ = [
//     "Create",
//     "Uncreate",
//     "DrawBorderThenFill",
//     "Write",
//     "Unwrite",
//     "ShowPartial",
//     "ShowIncreasingSubsets",
//     "SpiralIn",
//     "AddTextLetterByLetter",
//     "ShowSubmobjectsOneByOne",
//     "AddTextWordByWord",
// ]


// import itertools as it
// from typing import TYPE_CHECKING, Callable, Iterable, Sequence

// import numpy as np
// from colour import Color

// if TYPE_CHECKING:
//     from manim.mobject.text.textMobject import Text

// from manim.mobject.opengl.openglSurface import OpenGLSurface
// from manim.mobject.opengl.openglVectorizedMobject import OpenGLVMobject

// from ..animation.animation import Animation
// from ..animation.composition import Succession
// from ..constants import TWOPI
// from ..mobject.mobject import Group, Mobject
// from ..mobject.types.vectorizedMobject import VMobject
// from ..utils.bezier import integerInterpolate
// from ..utils.rateFunctions import doubleSmooth, linear, smooth


// class ShowPartial(Animation) {
//     """Abstract class for Animations that show the VMobject partially.

//     Raises
//     ------
//     :class:`TypeError`
//         If ``mobject`` is not an instance of :class:`~.VMobject`.

//     See Also
//     --------
//     :class:`Create`, :class:`~.ShowPassingFlash`

//     """

//     _Init__(
//         this,
//         mobject: VMobject | OpenGLVMobject | OpenGLSurface | None,
//         **kwargs,
//     ) {
//         pointwise = getattr(mobject, "pointwiseBecomePartial", None)
//         if not callable(pointwise) {
//             raise NotImplementedError("This animation is not defined for this Mobject.")
//         super()._Init__(mobject, **kwargs)

//     interpolateSubmobject(
//         this,
//         submobject: Mobject,
//         startingSubmobject: Mobject,
//         alpha: float,
//     ) -> None:
//         submobject.pointwiseBecomePartial(
//             startingSubmobject, *this.GetBounds(alpha)
//         )

//     GetBounds(this, alpha: float) -> None:
//         raise NotImplementedError("Please use Create or ShowPassingFlash")


// class Create(ShowPartial) {
//     """Incrementally show a VMobject.

//     Parameters
//     ----------
//     mobject : :class:`~.VMobject`
//         The VMobject to animate.

//     Raises
//     ------
//     :class:`TypeError`
//         If ``mobject`` is not an instance of :class:`~.VMobject`.

//     Examples
//     --------
//     .. manim:: CreateScene

//         class CreateScene(Scene) {
//             construct(this) {
//                 this.play(Create(Square()))

//     See Also
//     --------
//     :class:`~.ShowPassingFlash`

//     """

//     _Init__(
//         this,
//         mobject: VMobject | OpenGLVMobject | OpenGLSurface,
//         lagRatio: float = 1.0,
//         introducer: bool = True,
//         **kwargs,
//     ) -> None:
//         super()._Init__(mobject, lagRatio=lagRatio, introducer=introducer, **kwargs)

//     GetBounds(this, alpha: float) -> tuple[int, float]:
//         return (0, alpha)


// class Uncreate(Create) {
//     """Like :class:`Create` but in reverse.

//     Examples
//     --------
//     .. manim:: ShowUncreate

//         class ShowUncreate(Scene) {
//             construct(this) {
//                 this.play(Uncreate(Square()))

//     See Also
//     --------
//     :class:`Create`

//     """

//     _Init__(
//         this,
//         mobject: VMobject | OpenGLVMobject,
//         rateFunc: Callable[[float], float] = lambda t: smooth(1 - t),
//         remover: bool = True,
//         **kwargs,
//     ) -> None:
//         super()._Init__(
//             mobject,
//             rateFunc=rateFunc,
//             introducer=False,
//             remover=remover,
//             **kwargs,
//         )


// class DrawBorderThenFill(Animation) {
//     """Draw the border first and then show the fill.

//     Examples
//     --------
//     .. manim:: ShowDrawBorderThenFill

//         class ShowDrawBorderThenFill(Scene) {
//             construct(this) {
//                 this.play(DrawBorderThenFill(Square(fillOpacity=1, fillColor=ORANGE)))
//     """

//     _Init__(
//         this,
//         vmobject: VMobject | OpenGLVMobject,
//         runTime: float = 2,
//         rateFunc: Callable[[float], float] = doubleSmooth,
//         strokeWidth: float = 2,
//         strokeColor: str = None,
//         drawBorderAnimationConfig: dict = {},  # what does this dict accept?
//         fillAnimationConfig: dict = {},
//         introducer: bool = True,
//         **kwargs,
//     ) -> None:
//         this.TypecheckInput(vmobject)
//         super()._Init__(
//             vmobject,
//             runTime=runTime,
//             introducer=introducer,
//             rateFunc=rateFunc,
//             **kwargs,
//         )
//         this.strokeWidth = strokeWidth
//         this.strokeColor = strokeColor
//         this.drawBorderAnimationConfig = drawBorderAnimationConfig
//         this.fillAnimationConfig = fillAnimationConfig
//         this.outline = this.getOutline()

//     TypecheckInput(this, vmobject: VMobject | OpenGLVMobject) -> None:
//         if not isinstance(vmobject, (VMobject, OpenGLVMobject)) {
//             raise TypeError("DrawBorderThenFill only works for vectorized Mobjects")

//     begin(this) -> None:
//         this.outline = this.getOutline()
//         super().begin()

//     getOutline(this) -> Mobject:
//         outline = this.mobject.copy()
//         outline.setFill(opacity=0)
//         for sm in outline.familyMembersWithPoints() {
//             sm.setStroke(color=this.getStrokeColor(sm), width=this.strokeWidth)
//         return outline

//     getStrokeColor(this, vmobject: VMobject | OpenGLVMobject) -> Color:
//         if this.strokeColor:
//             return this.strokeColor
//         elif vmobject.getStrokeWidth() > 0:
//             return vmobject.getStrokeColor()
//         return vmobject.getColor()

//     getAllMobjects(this) -> Sequence[Mobject]:
//         return [*super().getAllMobjects(), this.outline]

//     interpolateSubmobject(
//         this,
//         submobject: Mobject,
//         startingSubmobject: Mobject,
//         outline,
//         alpha: float,
//     ) -> None:  # Fixme: not matching the parent class? What is outline doing here?
//         index: int
//         subalpha: int
//         index, subalpha = integerInterpolate(0, 2, alpha)
//         if index == 0:
//             submobject.pointwiseBecomePartial(outline, 0, subalpha)
//             submobject.matchStyle(outline)
//         else:
//             submobject.interpolate(outline, startingSubmobject, subalpha)


// class Write(DrawBorderThenFill) {
//     """Simulate hand-writing a :class:`~.Text` or hand-drawing a :class:`~.VMobject`.

//     Examples
//     --------
//     .. manim:: ShowWrite

//         class ShowWrite(Scene) {
//             construct(this) {
//                 this.play(Write(Text("Hello", fontSize=144)))

//     .. manim:: ShowWriteReversed

//         class ShowWriteReversed(Scene) {
//             construct(this) {
//                 this.play(Write(Text("Hello", fontSize=144), reverse=True))
//     """

//     _Init__(
//         this,
//         vmobject: VMobject | OpenGLVMobject,
//         rateFunc: Callable[[float], float] = linear,
//         reverse: bool = False,
//         **kwargs,
//     ) -> None:
//         runTime: float | None = kwargs.pop("runTime", None)
//         lagRatio: float | None = kwargs.pop("lagRatio", None)
//         runTime, lagRatio = this.SetDefaultConfigFromLength(
//             vmobject,
//             runTime,
//             lagRatio,
//         )
//         this.reverse = reverse
//         if "remover" not in kwargs:
//             kwargs["remover"] = reverse
//         super()._Init__(
//             vmobject,
//             rateFunc=rateFunc,
//             runTime=runTime,
//             lagRatio=lagRatio,
//             introducer=not reverse,
//             **kwargs,
//         )

//     SetDefaultConfigFromLength(
//         this,
//         vmobject: VMobject | OpenGLVMobject,
//         runTime: float | None,
//         lagRatio: float | None,
//     ) -> tuple[float, float]:
//         length = len(vmobject.familyMembersWithPoints())
//         if runTime is None:
//             if length < 15:
//                 runTime = 1
//             else:
//                 runTime = 2
//         if lagRatio is None:
//             lagRatio = min(4.0 / length, 0.2)
//         return runTime, lagRatio

//     reverseSubmobjects(this) -> None:
//         this.mobject.invert(recursive=True)

//     begin(this) -> None:
//         if this.reverse:
//             this.reverseSubmobjects()
//         super().begin()

//     finish(this) -> None:
//         super().finish()
//         if this.reverse:
//             this.reverseSubmobjects()


// class Unwrite(Write) {
//     """Simulate erasing by hand a :class:`~.Text` or a :class:`~.VMobject`.

//     Parameters
//     ----------
//     reverse : :class:`bool`
//         Set True to have the animation start erasing from the last submobject first.

//     Examples
//     --------

//     .. manim :: UnwriteReverseTrue

//         class UnwriteReverseTrue(Scene) {
//             construct(this) {
//                 text = Tex("Alice and Bob").scale(3)
//                 this.add(text)
//                 this.play(Unwrite(text))

//     .. manim:: UnwriteReverseFalse

//         class UnwriteReverseFalse(Scene) {
//             construct(this) {
//                 text = Tex("Alice and Bob").scale(3)
//                 this.add(text)
//                 this.play(Unwrite(text, reverse=False))
//     """

//     _Init__(
//         this,
//         vmobject: VMobject,
//         rateFunc: Callable[[float], float] = linear,
//         reverse: bool = True,
//         **kwargs,
//     ) -> None:

//         runTime: float | None = kwargs.pop("runTime", None)
//         lagRatio: float | None = kwargs.pop("lagRatio", None)
//         runTime, lagRatio = this.SetDefaultConfigFromLength(
//             vmobject,
//             runTime,
//             lagRatio,
//         )
//         super()._Init__(
//             vmobject,
//             runTime=runTime,
//             lagRatio=lagRatio,
//             rateFunc=lambda t: -rateFunc(t) + 1,
//             reverse=reverse,
//             **kwargs,
//         )


// class SpiralIn(Animation) {
//     r"""Create the Mobject with sub-Mobjects flying in on spiral trajectories.

//     Parameters
//     ----------
//     shapes
//         The Mobject on which to be operated.

//     scaleFactor
//         The factor used for scaling the effect.

//     fadeInFraction
//         Fractional duration of initial fade-in of sub-Mobjects as they fly inward.

//     Examples
//     --------
//     .. manim :: SpiralInExample

//         class SpiralInExample(Scene) {
//             construct(this) {
//                 pi = MathTex(r"\pi").scale(7)
//                 pi.shift(2.25 * LEFT + 1.5 * UP)
//                 circle = Circle(color=GREEN_C, fillOpacity=1).shift(LEFT)
//                 square = Square(color=BLUE_D, fillOpacity=1).shift(UP)
//                 shapes = VGroup(pi, circle, square)
//                 this.play(SpiralIn(shapes))
//     """

//     _Init__(
//         this,
//         shapes: Mobject,
//         scaleFactor: float = 8,
//         fadeInFraction=0.3,
//         **kwargs,
//     ) -> None:
//         this.shapes = shapes
//         this.scaleFactor = scaleFactor
//         this.shapeCenter = shapes.getCenter()
//         this.fadeInFraction = fadeInFraction
//         for shape in shapes:
//             shape.finalPosition = shape.getCenter()
//             shape.initialPosition = (
//                 shape.finalPosition
//                 + (shape.finalPosition - this.shapeCenter) * this.scaleFactor
//             )
//             shape.moveTo(shape.initialPosition)
//             shape.saveState()

//         super()._Init__(shapes, **kwargs)

//     interpolateMobject(this, alpha: float) -> None:
//         for shape in this.shapes:
//             shape.restore()
//             shape.saveState()
//             opacity = shape.getFillOpacity()
//             newOpacity = min(opacity, alpha * opacity / this.fadeInFraction)
//             shape.shift((shape.finalPosition - shape.initialPosition) * alpha)
//             shape.rotate(TWOPI * alpha, aboutPoint=this.shapeCenter)
//             shape.rotate(-TWOPI * alpha, aboutPoint=shape.getCenterOfMass())
//             shape.setOpacity(newOpacity)


// class ShowIncreasingSubsets(Animation) {
//     """Show one submobject at a time, leaving all previous ones displayed on screen.

//     Examples
//     --------

//     .. manim:: ShowIncreasingSubsetsScene

//         class ShowIncreasingSubsetsScene(Scene) {
//             construct(this) {
//                 p = VGroup(Dot(), Square(), Triangle())
//                 this.add(p)
//                 this.play(ShowIncreasingSubsets(p))
//                 this.wait()
//     """

//     _Init__(
//         this,
//         group: Mobject,
//         suspendMobjectUpdating: bool = False,
//         intFunc: Callable[[np.ndarray], np.ndarray] = np.floor,
//         **kwargs,
//     ) -> None:
//         this.allSubmobs = list(group.submobjects)
//         this.intFunc = intFunc
//         for mobj in this.allSubmobs:
//             mobj.setOpacity(0)
//         super()._Init__(
//             group, suspendMobjectUpdating=suspendMobjectUpdating, **kwargs
//         )

//     interpolateMobject(this, alpha: float) -> None:
//         nSubmobs = len(this.allSubmobs)
//         index = int(this.intFunc(this.rateFunc(alpha) * nSubmobs))
//         this.updateSubmobjectList(index)

//     updateSubmobjectList(this, index: int) -> None:
//         for mobj in this.allSubmobs[:index]:
//             mobj.setOpacity(1)


// class AddTextLetterByLetter(ShowIncreasingSubsets) {
//     """Show a :class:`~.Text` letter by letter on the scene.

//     Parameters
//     ----------
//     timePerChar : :class:`float`
//         Frequency of appearance of the letters.

//     .. tip::

//         This is currently only possible for class:`~.Text` and not for class:`~.MathTex`

//     """

//     _Init__(
//         this,
//         text: Text,
//         suspendMobjectUpdating: bool = False,
//         intFunc: Callable[[np.ndarray], np.ndarray] = np.ceil,
//         rateFunc: Callable[[float], float] = linear,
//         timePerChar: float = 0.1,
//         runTime: float | None = None,
//         **kwargs,
//     ) -> None:
//         # timePerChar must be above 0.06, or the animation won't finish
//         this.timePerChar = timePerChar
//         if runTime is None:
//             runTime = np.max((0.06, this.timePerChar)) * len(text)

//         super()._Init__(
//             text,
//             suspendMobjectUpdating=suspendMobjectUpdating,
//             intFunc=intFunc,
//             rateFunc=rateFunc,
//             runTime=runTime,
//             **kwargs,
//         )


// class ShowSubmobjectsOneByOne(ShowIncreasingSubsets) {
//     """Show one submobject at a time, removing all previously displayed ones from screen."""

//     _Init__(
//         this,
//         group: Iterable[Mobject],
//         intFunc: Callable[[np.ndarray], np.ndarray] = np.ceil,
//         **kwargs,
//     ) -> None:
//         newGroup = Group(*group)
//         super()._Init__(newGroup, intFunc=intFunc, **kwargs)

//     updateSubmobjectList(this, index: int) -> None:
//         currentSubmobjects = this.allSubmobs[:index]
//         for mobj in currentSubmobjects[:-1]:
//             mobj.setOpacity(0)
//         if len(currentSubmobjects) > 0:
//             currentSubmobjects[-1].setOpacity(1)


// # TODO, this is broken...
// class AddTextWordByWord(Succession) {
//     """Show a :class:`~.Text` word by word on the scene. Note: currently broken."""

//     _Init__(
//         this,
//         textMobject: Text,
//         runTime: float = None,
//         timePerChar: float = 0.06,
//         **kwargs,
//     ) -> None:
//         this.timePerChar = timePerChar
//         tpc = this.timePerChar
//         anims = it.chain(
//             *(
//                 [
//                     ShowIncreasingSubsets(word, runTime=tpc * len(word)),
//                     Animation(word, runTime=0.005 * len(word) ** 1.5),
//                 ]
//                 for word in textMobject
//             )
//         )
//         super()._Init__(*anims, **kwargs)
