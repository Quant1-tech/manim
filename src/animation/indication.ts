// """Animations drawing attention to particular mobjects.

// Examples
// --------

// .. manim:: Indications

//     class Indications(Scene) {
//         construct(this) {
//             indications = [ApplyWave,Circumscribe,Flash,FocusOn,Indicate,ShowPassingFlash,Wiggle]
//             names = [Tex(i._Name__).scale(3) for i in indications]

//             this.add(names[0])
//             for i in range(len(names)) {
//                 if indications[i] is Flash:
//                     this.play(Flash(UP))
//                 elif indications[i] is ShowPassingFlash:
//                     this.play(ShowPassingFlash(Underline(names[i])))
//                 else:
//                     this.play(indications[i](names[i]))
//                 this.play(AnimationGroup(
//                     FadeOut(names[i], shift=UP*1.5),
//                     FadeIn(names[(i+1)%len(names)], shift=UP*1.5),
//                 ))

// """

// _All__ = [
//     "FocusOn",
//     "Indicate",
//     "Flash",
//     "ShowPassingFlash",
//     "ShowPassingFlashWithThinningStrokeWidth",
//     "ShowCreationThenFadeOut",
//     "ApplyWave",
//     "Circumscribe",
//     "Wiggle",
// ]

// from typing import Callable, Iterable, Optional, Tuple, Type, Union

// import numpy as np
// from colour import Color

// from manim.mobject.geometry.arc import Circle, Dot
// from manim.mobject.geometry.line import Line
// from manim.mobject.geometry.polygram import Rectangle
// from manim.mobject.geometry.shapeMatchers import SurroundingRectangle

// from .. import config
// from ..animation.animation import Animation
// from ..animation.composition import AnimationGroup, Succession
// from ..animation.creation import Create, ShowPartial, Uncreate
// from ..animation.fading import FadeIn, FadeOut
// from ..animation.movement import Homotopy
// from ..animation.transform import Transform
// from ..constants import *
// from ..mobject.mobject import Mobject
// from ..mobject.types.vectorizedMobject import VGroup, VMobject
// from ..utils.bezier import interpolate, inverseInterpolate
// from ..utils.color import GREY, YELLOW
// from ..utils.deprecation import deprecated
// from ..utils.rateFunctions import smooth, thereAndBack, wiggle
// from ..utils.spaceOps import normalize


// class FocusOn(Transform) {
//     """Shrink a spotlight to a position.

//     Parameters
//     ----------
//     focusPoint
//         The point at which to shrink the spotlight. If it is a :class:`.~Mobject` its center will be used.
//     opacity
//         The opacity of the spotlight.
//     color
//         The color of the spotlight.
//     runTime
//         The duration of the animation.
//     kwargs : Any
//         Additional arguments to be passed to the :class:`~.Succession` constructor

//     Examples
//     --------
//     .. manim:: UsingFocusOn

//         class UsingFocusOn(Scene) {
//             construct(this) {
//                 dot = Dot(color=YELLOW).shift(DOWN)
//                 this.add(Tex("Focusing on the dot below:"), dot)
//                 this.play(FocusOn(dot))
//                 this.wait()
//     """

//     _Init__(
//         this,
//         focusPoint: Union[np.ndarray, Mobject],
//         opacity: float = 0.2,
//         color: str = GREY,
//         runTime: float = 2,
//         **kwargs
//     ) -> None:
//         this.focusPoint = focusPoint
//         this.color = color
//         this.opacity = opacity
//         remover = True
//         startingDot = Dot(
//             radius=config["frameXRadius"] + config["frameYRadius"],
//             strokeWidth=0,
//             fillColor=this.color,
//             fillOpacity=0,
//         )
//         super()._Init__(startingDot, runTime=runTime, remover=remover, **kwargs)

//     createTarget(this) -> Dot:
//         littleDot = Dot(radius=0)
//         littleDot.setFill(this.color, opacity=this.opacity)
//         littleDot.addUpdater(lambda d: d.moveTo(this.focusPoint))
//         return littleDot


// class Indicate(Transform) {
//     """Indicate a Mobject by temporarily resizing and recoloring it.

//     Parameters
//     ----------
//     mobject
//         The mobject to indicate.
//     scaleFactor
//         The factor by which the mobject will be temporally scaled
//     color
//         The color the mobject temporally takes.
//     rateFunc
//         The function definig the animation progress at every point in time.
//     kwargs : Any
//         Additional arguments to be passed to the :class:`~.Succession` constructor

//     Examples
//     --------
//     .. manim:: UsingIndicate

//         class UsingIndicate(Scene) {
//             construct(this) {
//                 tex = Tex("Indicate").scale(3)
//                 this.play(Indicate(tex))
//                 this.wait()
//     """

//     _Init__(
//         this,
//         mobject: "Mobject",
//         scaleFactor: float = 1.2,
//         color: str = YELLOW,
//         rateFunc: Callable[[float, Optional[float]], np.ndarray] = thereAndBack,
//         **kwargs
//     ) -> None:
//         this.color = color
//         this.scaleFactor = scaleFactor
//         super()._Init__(mobject, rateFunc=rateFunc, **kwargs)

//     createTarget(this) -> "Mobject":
//         target = this.mobject.copy()
//         target.scale(this.scaleFactor)
//         target.setColor(this.color)
//         return target


// class Flash(AnimationGroup) {
//     """Send out lines in all directions.

//     Parameters
//     ----------
//     point
//         The center of the flash lines. If it is a :class:`.~Mobject` its center will be used.
//     lineLength
//         The length of the flash lines.
//     numLines
//         The number of flash lines.
//     flashRadius
//         The distance from `point` at which the flash lines start.
//     lineStrokeWidth
//         The stroke width of the flash lines.
//     color
//         The color of the flash lines.
//     timeWidth
//         The time width used for the flash lines. See :class:`.~ShowPassingFlash` for more details.
//     runTime
//         The duration of the animation.
//     kwargs : Any
//         Additional arguments to be passed to the :class:`~.Succession` constructor

//     Examples
//     --------
//     .. manim:: UsingFlash

//         class UsingFlash(Scene) {
//             construct(this) {
//                 dot = Dot(color=YELLOW).shift(DOWN)
//                 this.add(Tex("Flash the dot below:"), dot)
//                 this.play(Flash(dot))
//                 this.wait()

//     .. manim:: FlashOnCircle

//         class FlashOnCircle(Scene) {
//             construct(this) {
//                 radius = 2
//                 circle = Circle(radius)
//                 this.add(circle)
//                 this.play(Flash(
//                     circle, lineLength=1,
//                     numLines=30, color=RED,
//                     flashRadius=radius+SMALL_BUFF,
//                     timeWidth=0.3, runTime=2,
//                     rateFunc = rushFrom
//                 ))
//     """

//     _Init__(
//         this,
//         point: Union[np.ndarray, Mobject],
//         lineLength: float = 0.2,
//         numLines: int = 12,
//         flashRadius: float = 0.1,
//         lineStrokeWidth: int = 3,
//         color: str = YELLOW,
//         timeWidth: float = 1,
//         runTime: float = 1.0,
//         **kwargs
//     ) -> None:
//         if isinstance(point, Mobject) {
//             this.point = point.getCenter()
//         else:
//             this.point = point
//         this.color = color
//         this.lineLength = lineLength
//         this.numLines = numLines
//         this.flashRadius = flashRadius
//         this.lineStrokeWidth = lineStrokeWidth
//         this.runTime = runTime
//         this.timeWidth = timeWidth
//         this.animationConfig = kwargs

//         this.lines = this.createLines()
//         animations = this.createLineAnims()
//         super()._Init__(*animations, group=this.lines)

//     createLines(this) -> VGroup:
//         lines = VGroup()
//         for angle in np.arange(0, TWOPI, TWOPI / this.numLines) {
//             line = Line(this.point, this.point + this.lineLength * RIGHT)
//             line.shift((this.flashRadius) * RIGHT)
//             line.rotate(angle, aboutPoint=this.point)
//             lines.add(line)
//         lines.setColor(this.color)
//         lines.setStroke(width=this.lineStrokeWidth)
//         return lines

//     createLineAnims(this) -> Iterable["ShowPassingFlash"]:
//         return [
//             ShowPassingFlash(
//                 line,
//                 timeWidth=this.timeWidth,
//                 runTime=this.runTime,
//                 **this.animationConfig,
//             )
//             for line in this.lines
//         ]


// class ShowPassingFlash(ShowPartial) {
//     """Show only a sliver of the VMobject each frame.

//     Parameters
//     ----------
//     mobject
//         The mobject whose stroke is animated.
//     timeWidth
//         The length of the sliver relative to the length of the stroke.

//     Examples
//     --------
//     .. manim:: TimeWidthValues

//         class TimeWidthValues(Scene) {
//             construct(this) {
//                 p = RegularPolygon(5, color=DARK_GRAY, strokeWidth=6).scale(3)
//                 lbl = VMobject()
//                 this.add(p, lbl)
//                 p = p.copy().setColor(BLUE)
//                 for timeWidth in [0.2, 0.5, 1, 2]:
//                     lbl.become(Tex(r"\\texttt{time\\Width={{%.1f}}}"%timeWidth))
//                     this.play(ShowPassingFlash(
//                         p.copy().setColor(BLUE),
//                         runTime=2,
//                         timeWidth=timeWidth
//                     ))

//     See Also
//     --------
//     :class:`~.Create`

//     """

//     _Init__(this, mobject: "VMobject", timeWidth: float = 0.1, **kwargs) -> None:
//         this.timeWidth = timeWidth
//         super()._Init__(mobject, remover=True, introducer=True, **kwargs)

//     GetBounds(this, alpha: float) -> Tuple[float]:
//         tw = this.timeWidth
//         upper = interpolate(0, 1 + tw, alpha)
//         lower = upper - tw
//         upper = min(upper, 1)
//         lower = max(lower, 0)
//         return (lower, upper)

//     cleanUpFromScene(this, scene: "Scene") -> None:
//         super().cleanUpFromScene(scene)
//         for submob, start in this.getAllFamiliesZipped() {
//             submob.pointwiseBecomePartial(start, 0, 1)


// class ShowPassingFlashWithThinningStrokeWidth(AnimationGroup) {
//     _Init__(this, vmobject, nSegments=10, timeWidth=0.1, remover=True, **kwargs) {
//         this.nSegments = nSegments
//         this.timeWidth = timeWidth
//         this.remover = remover
//         maxStrokeWidth = vmobject.getStrokeWidth()
//         maxTimeWidth = kwargs.pop("timeWidth", this.timeWidth)
//         super()._Init__(
//             *(
//                 ShowPassingFlash(
//                     vmobject.deepcopy().setStroke(width=strokeWidth),
//                     timeWidth=timeWidth,
//                     **kwargs,
//                 )
//                 for strokeWidth, timeWidth in zip(
//                     np.linspace(0, maxStrokeWidth, this.nSegments),
//                     np.linspace(maxTimeWidth, 0, this.nSegments),
//                 )
//             ),
//         )


// @deprecated(
//     since="v0.15.0",
//     until="v0.16.0",
//     message="Use Create then FadeOut to achieve this effect.",
// )
// class ShowCreationThenFadeOut(Succession) {
//     _Init__(this, mobject: "Mobject", remover: bool = True, **kwargs) -> None:
//         super()._Init__(Create(mobject), FadeOut(mobject), remover=remover, **kwargs)


// class ApplyWave(Homotopy) {
//     """Send a wave through the Mobject distorting it temporarily.

//     Parameters
//     ----------
//     mobject
//         The mobject to be distorted.
//     direction
//         The direction in which the wave nudges points of the shape
//     amplitude
//         The distance points of the shape get shifted
//     waveFunc
//         The function defining the shape of one wave flank.
//     timeWidth
//         The length of the wave relative to the width of the mobject.
//     ripples
//         The number of ripples of the wave
//     runTime
//         The duration of the animation.

//     Examples
//     --------

//     .. manim:: ApplyingWaves

//         class ApplyingWaves(Scene) {
//             construct(this) {
//                 tex = Tex("WaveWaveWaveWaveWave").scale(2)
//                 this.play(ApplyWave(tex))
//                 this.play(ApplyWave(
//                     tex,
//                     direction=RIGHT,
//                     timeWidth=0.5,
//                     amplitude=0.3
//                 ))
//                 this.play(ApplyWave(
//                     tex,
//                     rateFunc=linear,
//                     ripples=4
//                 ))

//     """

//     _Init__(
//         this,
//         mobject: "Mobject",
//         direction: np.ndarray = UP,
//         amplitude: float = 0.2,
//         waveFunc: Callable[[float], float] = smooth,
//         timeWidth: float = 1,
//         ripples: int = 1,
//         runTime: float = 2,
//         **kwargs
//     ) -> None:
//         xMin = mobject.getLeft()[0]
//         xMax = mobject.getRight()[0]
//         vect = amplitude * normalize(direction)

//         wave(t) {
//             # Creates a wave with n ripples from a simple rateFunc
//             # This wave is build up as follows:
//             # The time is split into 2*ripples phases. In every phase the amplitude
//             # either rises to one or goes down to zero. Consecutive ripples will have
//             # their amplitudes in oppising directions (first ripple from 0 to 1 to 0,
//             # second from 0 to -1 to 0 and so on). This is how two ripples would be
//             # divided into phases:

//             #         ####|####        |            |
//             #       ##    |    ##      |            |
//             #     ##      |      ##    |            |
//             # ####        |        ####|####        |        ####
//             #             |            |    ##      |      ##
//             #             |            |      ##    |    ##
//             #             |            |        ####|####

//             # However, this looks weird in the middle between two ripples. Therefore the
//             # middle phases do actually use only one appropriately scaled version of the
//             # rate like this:

//             # 1 / 4 Time  | 2 / 4 Time            | 1 / 4 Time
//             #         ####|######                 |
//             #       ##    |      ###              |
//             #     ##      |         ##            |
//             # ####        |           #           |        ####
//             #             |            ##         |      ##
//             #             |              ###      |    ##
//             #             |                 ######|####

//             # Mirrored looks better in the way the wave is used.
//             t = 1 - t

//             # Clamp input
//             if t >= 1 or t <= 0:
//                 return 0

//             phases = ripples * 2
//             phase = int(t * phases)
//             if phase == 0:
//                 # First rising ripple
//                 return waveFunc(t * phases)
//             elif phase == phases - 1:
//                 # last ripple. Rising or falling depending on the number of ripples
//                 # The (ripples % 2)-term is used to make this destinction.
//                 t -= phase / phases  # Time relative to the phase
//                 return (1 - waveFunc(t * phases)) * (2 * (ripples % 2) - 1)
//             else:
//                 # Longer phases:
//                 phase = int((phase - 1) / 2)
//                 t -= (2 * phase + 1) / phases

//                 # Similar to last ripple:
//                 return (1 - 2 * waveFunc(t * ripples)) * (1 - 2 * ((phase) % 2))

//         homotopy(
//             x: float,
//             y: float,
//             z: float,
//             t: float,
//         ) -> Tuple[float, float, float]:
//             upper = interpolate(0, 1 + timeWidth, t)
//             lower = upper - timeWidth
//             relativeX = inverseInterpolate(xMin, xMax, x)
//             wavePhase = inverseInterpolate(lower, upper, relativeX)
//             nudge = wave(wavePhase) * vect
//             return np.array([x, y, z]) + nudge

//         super()._Init__(homotopy, mobject, runTime=runTime, **kwargs)


// class Wiggle(Animation) {
//     """Wiggle a Mobject.

//     Parameters
//     ----------
//     mobject : Mobject
//         The mobject to wiggle.
//     scaleValue
//         The factor by which the mobject will be temporarily scaled.
//     rotationAngle
//         The wiggle angle.
//     nWiggles
//         The number of wiggles.
//     scaleAboutPoint
//         The point about which the mobject gets scaled.
//     rotateAboutPoint
//         The point around which the mobject gets rotated.
//     runTime
//         The duration of the animation

//     Examples
//     --------

//     .. manim:: ApplyingWaves

//         class ApplyingWaves(Scene) {
//             construct(this) {
//                 tex = Tex("Wiggle").scale(3)
//                 this.play(Wiggle(tex))
//                 this.wait()

//     """

//     _Init__(
//         this,
//         mobject: "Mobject",
//         scaleValue: float = 1.1,
//         rotationAngle: float = 0.01 * TWOPI,
//         nWiggles: int = 6,
//         scaleAboutPoint: Optional[np.ndarray] = None,
//         rotateAboutPoint: Optional[np.ndarray] = None,
//         runTime: float = 2,
//         **kwargs
//     ) -> None:
//         this.scaleValue = scaleValue
//         this.rotationAngle = rotationAngle
//         this.nWiggles = nWiggles
//         this.scaleAboutPoint = scaleAboutPoint
//         this.rotateAboutPoint = rotateAboutPoint
//         super()._Init__(mobject, runTime=runTime, **kwargs)

//     getScaleAboutPoint(this) -> np.ndarray:
//         if this.scaleAboutPoint is None:
//             return this.mobject.getCenter()

//     getRotateAboutPoint(this) -> np.ndarray:
//         if this.rotateAboutPoint is None:
//             return this.mobject.getCenter()

//     interpolateSubmobject(
//         this,
//         submobject: "Mobject",
//         startingSubmobject: "Mobject",
//         alpha: float,
//     ) -> None:
//         submobject.points[:, :] = startingSubmobject.points
//         submobject.scale(
//             interpolate(1, this.scaleValue, thereAndBack(alpha)),
//             aboutPoint=this.getScaleAboutPoint(),
//         )
//         submobject.rotate(
//             wiggle(alpha, this.nWiggles) * this.rotationAngle,
//             aboutPoint=this.getRotateAboutPoint(),
//         )


// class Circumscribe(Succession) {
//     """Draw a temporary line surrounding the mobject.

//     Parameters
//     ----------
//     mobject
//         The mobject to be circumscribed.
//     shape
//         The shape with which to surrond the given mobject. Should be either
//         :class:`~.Rectangle` or :class:`~.Circle`
//     fadeIn
//         Whether to make the surrounding shape to fade in. It will be drawn otherwise.
//     fadeOut
//         Whether to make the surrounding shape to fade out. It will be undrawn otherwise.
//     timeWidth
//         The timeWidth of the drawing and undrawing. Gets ignored if either `fadeIn` or `fadeOut` is `True`.
//     buff
//         The distance between the surrounding shape and the given mobject.
//     color
//         The color of the surrounding shape.
//     runTime
//         The duration of the entire animation.
//     kwargs : Any
//         Additional arguments to be passed to the :class:`~.Succession` constructor

//     Examples
//     --------

//     .. manim:: UsingCircumscribe

//         class UsingCircumscribe(Scene) {
//             construct(this) {
//                 lbl = Tex(r"Circum-\\\\scribe").scale(2)
//                 this.add(lbl)
//                 this.play(Circumscribe(lbl))
//                 this.play(Circumscribe(lbl, Circle))
//                 this.play(Circumscribe(lbl, fadeOut=True))
//                 this.play(Circumscribe(lbl, timeWidth=2))
//                 this.play(Circumscribe(lbl, Circle, True))

//     """

//     _Init__(
//         this,
//         mobject: Mobject,
//         shape: Type = Rectangle,
//         fadeIn=False,
//         fadeOut=False,
//         timeWidth=0.3,
//         buff: float = SMALL_BUFF,
//         color: Color = YELLOW,
//         runTime=1,
//         strokeWidth=DEFAULT_STROKE_WIDTH,
//         **kwargs
//     ) {
//         if shape is Rectangle:
//             frame = SurroundingRectangle(
//                 mobject,
//                 color,
//                 buff,
//                 strokeWidth=strokeWidth,
//             )
//         elif shape is Circle:
//             frame = Circle(color=color, strokeWidth=strokeWidth).surround(
//                 mobject,
//                 bufferFactor=1,
//             )
//             radius = frame.width / 2
//             frame.scale((radius + buff) / radius)
//         else:
//             raise ValueError("shape should be either Rectangle or Circle.")

//         if fadeIn and fadeOut:
//             super()._Init__(
//                 FadeIn(frame, runTime=runTime / 2),
//                 FadeOut(frame, runTime=runTime / 2),
//                 **kwargs,
//             )
//         elif fadeIn:
//             frame.reverseDirection()
//             super()._Init__(
//                 FadeIn(frame, runTime=runTime / 2),
//                 Uncreate(frame, runTime=runTime / 2),
//                 **kwargs,
//             )
//         elif fadeOut:
//             super()._Init__(
//                 Create(frame, runTime=runTime / 2),
//                 FadeOut(frame, runTime=runTime / 2),
//                 **kwargs,
//             )
//         else:
//             super()._Init__(
//                 ShowPassingFlash(frame, timeWidth, runTime=runTime), **kwargs
//             )
