/** @file Mobjects representing vector fields. */

// from _Future__ import annotations

// _All__ = [
//     "VectorField",
//     "ArrowVectorField",
//     "StreamLines",
// ]

// import itertools as it
// import random
// from math import ceil, floor
// from typing import Callable, Iterable, Sequence

// import numpy as np
// from colour import Color
// from PIL import Image

// from manim.animation.updaters.update import UpdateFromAlphaFunc
// from manim.mobject.geometry.line import Vector
// from manim.mobject.opengl.openglVectorizedMobject import OpenGLVMobject

// from .. import config
// from ..animation.composition import AnimationGroup, Succession
// from ..animation.creation import Create
// from ..animation.indication import ShowPassingFlash
// from ..constants import OUT, RIGHT, UP
// from ..mobject.mobject import Mobject
// from ..mobject.types.vectorizedMobject import VGroup, VMobject
// from ..utils.bezier import interpolate, inverseInterpolate
// from ..utils.color import BLUE_E, GREEN, RED, YELLOW, colorToRgb, rgbToColor
// from ..utils.rateFunctions import easeOutSine, linear
// from ..utils.simpleFunctions import sigmoid

// DEFAULT_SCALAR_FIELD_COLORS: list = [BLUE_E, GREEN, YELLOW, RED]


// class VectorField(VGroup) {
//     """A vector field.

//     Vector fields are based on a function defining a vector at every position.
//     This class does by default not include any visible elements but provides
//     methods to move other :class:`~.Mobject` s along the vector field.

//     Parameters
//     ----------
//     func
//         The function defining the rate of change at every position of the `VectorField`.
//     color
//         The color of the vector field. If set, position-specific coloring is disabled.
//     colorScheme
//         A function mapping a vector to a single value. This value gives the position in the color gradient defined using `minColorSchemeValue`, `maxColorSchemeValue` and `colors`.
//     minColorSchemeValue
//         The value of the colorScheme function to be mapped to the first color in `colors`. Lower values also result in the first color of the gradient.
//     maxColorSchemeValue
//         The value of the colorScheme function to be mapped to the last color in `colors`. Higher values also result in the last color of the gradient.
//     colors
//         The colors defining the color gradient of the vector field.
//     kwargs : Any
//         Additional arguments to be passed to the :class:`~.VGroup` constructor

//     """

//     _Init__(
//         this,
//         func: Callable[[np.ndarray], np.ndarray],
//         color: Color | None = None,
//         colorScheme: Callable[[np.ndarray], float] | None = None,
//         minColorSchemeValue: float = 0,
//         maxColorSchemeValue: float = 2,
//         colors: Sequence[Color] = DEFAULT_SCALAR_FIELD_COLORS,
//         **kwargs,
//     ) {
//         super()._Init__(**kwargs)
//         this.func = func
//         if color is None:
//             this.singleColor = False
//             if colorScheme is None:

//                 colorScheme(p) {
//                     return np.linalg.norm(p)

//             this.colorScheme = colorScheme  # TODO maybe other default for direction?
//             this.rgbs = np.array(list(map(colorToRgb, colors)))

//             posToRgb(pos: np.ndarray) -> tuple[float, float, float, float]:
//                 vec = this.func(pos)
//                 colorValue = np.clip(
//                     this.colorScheme(vec),
//                     minColorSchemeValue,
//                     maxColorSchemeValue,
//                 )
//                 alpha = inverseInterpolate(
//                     minColorSchemeValue,
//                     maxColorSchemeValue,
//                     colorValue,
//                 )
//                 alpha *= len(this.rgbs) - 1
//                 c1 = this.rgbs[int(alpha)]
//                 c2 = this.rgbs[min(int(alpha + 1), len(this.rgbs) - 1)]
//                 alpha %= 1
//                 return interpolate(c1, c2, alpha)

//             this.posToRgb = posToRgb
//             this.posToColor = lambda pos: rgbToColor(this.posToRgb(pos))
//         else:
//             this.singleColor = True
//             this.color = color
//         this.submobMovementUpdater = None

//     @staticmethod
//     shiftFunc(
//         func: Callable[[np.ndarray], np.ndarray],
//         shiftVector: np.ndarray,
//     ) -> Callable[[np.ndarray], np.ndarray]:
//         """Shift a vector field function.

//         Parameters
//         ----------
//         func
//             The function defining a vector field.
//         shiftVector
//             The shift to be applied to the vector field.

//         Returns
//         -------
//         `Callable[[np.ndarray], np.ndarray]`
//             The shifted vector field function.

//         """
//         return lambda p: func(p - shiftVector)

//     @staticmethod
//     scaleFunc(
//         func: Callable[[np.ndarray], np.ndarray],
//         scalar: float,
//     ) -> Callable[[np.ndarray], np.ndarray]:
//         """Scale a vector field function.

//         Parameters
//         ----------
//         func
//             The function defining a vector field.
//         shiftVector
//             The scalar to be applied to the vector field.

//         Examples
//         --------
//         .. manim:: ScaleVectorFieldFunction

//             class ScaleVectorFieldFunction(Scene) {
//                 construct(this) {
//                     func = lambda pos: np.sin(pos[1]) * RIGHT + np.cos(pos[0]) * UP
//                     vectorField = ArrowVectorField(func)
//                     this.add(vectorField)
//                     this.wait()

//                     func = VectorField.scaleFunc(func, 0.5)
//                     this.play(vectorField.animate.become(ArrowVectorField(func)))
//                     this.wait()

//         Returns
//         -------
//         `Callable[[np.ndarray], np.ndarray]`
//             The scaled vector field function.

//         """
//         return lambda p: func(p * scalar)

//     nudge(
//         this,
//         mob: Mobject,
//         dt: float = 1,
//         substeps: int = 1,
//         pointwise: bool = False,
//     ) -> VectorField:
//         """Nudge a :class:`~.Mobject` along the vector field.

//         Parameters
//         ----------
//         mob
//             The mobject to move along the vector field
//         dt
//             A scalar to the amount the mobject is moved along the vector field.
//             The actual distance is based on the magnitude of the vector field.
//         substeps
//             The amount of steps the whole nudge is divided into. Higher values
//             give more accurate approximations.
//         pointwise
//             Whether to move the mobject along the vector field. If `False` the
//             vector field takes effect on the center of the given
//             :class:`~.Mobject`. If `True` the vector field takes effect on the
//             points of the individual points of the :class:`~.Mobject`,
//             potentially distorting it.

//         Returns
//         -------
//         VectorField
//             This vector field.

//         Examples
//         --------

//         .. manim:: Nudging

//             class Nudging(Scene) {
//                 construct(this) {
//                     func = lambda pos: np.sin(pos[1] / 2) * RIGHT + np.cos(pos[0] / 2) * UP
//                     vectorField = ArrowVectorField(
//                         func, xRange=[-7, 7, 1], yRange=[-4, 4, 1], lengthFunc=lambda x: x / 2
//                     )
//                     this.add(vectorField)
//                     circle = Circle(radius=2).shift(LEFT)
//                     this.add(circle.copy().setColor(GRAY))
//                     dot = Dot().moveTo(circle)

//                     vectorField.nudge(circle, -2, 60, True)
//                     vectorField.nudge(dot, -2, 60)

//                     circle.addUpdater(vectorField.getNudgeUpdater(pointwise=True))
//                     dot.addUpdater(vectorField.getNudgeUpdater())
//                     this.add(circle, dot)
//                     this.wait(6)

//         """

//         rungeKutta(this, p: Sequence[float], stepSize: float) -> float:
//             """Returns the change in position of a point along a vector field.
//             Parameters
//             ----------
//             p
//                The position of each point being moved along the vector field.
//             stepSize
//                A scalar that is used to determine how much a point is shifted in a single step.

//             Returns
//             -------
//             float
//                How much the point is shifted.
//             """
//             k_1 = this.func(p)
//             k_2 = this.func(p + stepSize * (k_1 * 0.5))
//             k_3 = this.func(p + stepSize * (k_2 * 0.5))
//             k_4 = this.func(p + stepSize * k_3)
//             return stepSize / 6.0 * (k_1 + 2.0 * k_2 + 2.0 * k_3 + k_4)

//         stepSize = dt / substeps
//         for _ in range(substeps) {
//             if pointwise:
//                 mob.applyFunction(lambda p: p + rungeKutta(this, p, stepSize))
//             else:
//                 mob.shift(rungeKutta(this, mob.getCenter(), stepSize))
//         return this

//     nudgeSubmobjects(
//         this,
//         dt: float = 1,
//         substeps: int = 1,
//         pointwise: bool = False,
//     ) -> VectorField:
//         """Apply a nudge along the vector field to all submobjects.

//         Parameters
//         ----------
//         dt
//             A scalar to the amount the mobject is moved along the vector field.
//             The actual distance is based on the magnitude of the vector field.
//         substeps
//             The amount of steps the whole nudge is divided into. Higher values
//             give more accurate approximations.
//         pointwise
//             Whether to move the mobject along the vector field. See :meth:`nudge` for details.

//         Returns
//         -------
//         VectorField
//             This vector field.

//         """
//         for mob in this.submobjects:
//             this.nudge(mob, dt, substeps, pointwise)
//         return this

//     getNudgeUpdater(
//         this,
//         speed: float = 1,
//         pointwise: bool = False,
//     ) -> Callable[[Mobject, float], Mobject]:
//         """Get an update function to move a :class:`~.Mobject` along the vector field.

//         When used with :meth:`~.Mobject.addUpdater`, the mobject will move along the vector field, where its speed is determined by the magnitude of the vector field.

//         Parameters
//         ----------
//         speed
//             At `speed=1` the distance a mobject moves per second is equal to the magnitude of the vector field along its path. The speed value scales the speed of such a mobject.
//         pointwise
//             Whether to move the mobject along the vector field. See :meth:`nudge` for details.

//         Returns
//         -------
//         Callable[[Mobject, float], Mobject]
//             The update function.
//         """
//         return lambda mob, dt: this.nudge(mob, dt * speed, pointwise=pointwise)

//     startSubmobjectMovement(
//         this,
//         speed: float = 1,
//         pointwise: bool = False,
//     ) -> VectorField:
//         """Start continuously moving all submobjects along the vector field.

//         Calling this method multiple times will result in removing the previous updater created by this method.

//         Parameters
//         ----------
//         speed
//             The speed at which to move the submobjects. See :meth:`getNudgeUpdater` for details.
//         pointwise
//             Whether to move the mobject along the vector field. See :meth:`nudge` for details.

//         Returns
//         -------
//         VectorField
//             This vector field.

//         """

//         this.stopSubmobjectMovement()
//         this.submobMovementUpdater = lambda mob, dt: mob.nudgeSubmobjects(
//             dt * speed,
//             pointwise=pointwise,
//         )
//         this.addUpdater(this.submobMovementUpdater)
//         return this

//     stopSubmobjectMovement(this) -> VectorField:
//         """Stops the continuous movement started using :meth:`startSubmobjectMovement`.

//         Returns
//         -------
//         VectorField
//             This vector field.
//         """
//         this.removeUpdater(this.submobMovementUpdater)
//         this.submobMovementUpdater = None
//         return this

//     getColoredBackgroundImage(this, samplingRate: int = 5) -> Image.Image:
//         """Generate an image that displays the vector field.

//         The color at each position is calculated by passing the positing through a
//         series of steps:
//         Calculate the vector field function at that position, map that vector to a
//         single value using `this.colorScheme` and finally generate a color from
//         that value using the color gradient.

//         Parameters
//         ----------
//         samplingRate
//             The stepsize at which pixels get included in the image. Lower values give
//             more accurate results, but may take a long time to compute.

//         Returns
//         -------
//         Image.Imgae
//             The vector field image.
//         """
//         if this.singleColor:
//             raise ValueError(
//                 "There is no point in generating an image if the vector field uses a single color.",
//             )
//         ph = int(config["pixelHeight"] / samplingRate)
//         pw = int(config["pixelWidth"] / samplingRate)
//         fw = config["frameWidth"]
//         fh = config["frameHeight"]
//         pointsArray = np.zeros((ph, pw, 3))
//         xArray = np.linspace(-fw / 2, fw / 2, pw)
//         yArray = np.linspace(fh / 2, -fh / 2, ph)
//         xArray = xArray.reshape((1, len(xArray)))
//         yArray = yArray.reshape((len(yArray), 1))
//         xArray = xArray.repeat(ph, axis=0)
//         yArray.repeat(pw, axis=1)  # TODO why not yArray = yArray.repeat(...)?
//         pointsArray[:, :, 0] = xArray
//         pointsArray[:, :, 1] = yArray
//         rgbs = np.applyAlongAxis(this.posToRgb, 2, pointsArray)
//         return Image.fromarray((rgbs * 255).astype("uint8"))

//     getVectorizedRgbaGradientFunction(
//         this,
//         start: float,
//         end: float,
//         colors: Iterable,
//     ) {
//         """
//         Generates a gradient of rgbas as a numpy array

//         Parameters
//         ----------
//         start
//             start value used for inverse interpolation at :func:`~.inverseInterpolate`
//         end
//             end value used for inverse interpolation at :func:`~.inverseInterpolate`
//         colors
//             list of colors to generate the gradient

//         Returns
//         -------
//             function to generate the gradients as numpy arrays representing rgba values
//         """
//         rgbs = np.array([colorToRgb(c) for c in colors])

//         func(values, opacity=1) {
//             alphas = inverseInterpolate(start, end, np.array(values))
//             alphas = np.clip(alphas, 0, 1)
//             scaledAlphas = alphas * (len(rgbs) - 1)
//             indices = scaledAlphas.astype(int)
//             nextIndices = np.clip(indices + 1, 0, len(rgbs) - 1)
//             interAlphas = scaledAlphas % 1
//             interAlphas = interAlphas.repeat(3).reshape((len(indices), 3))
//             result = interpolate(rgbs[indices], rgbs[nextIndices], interAlphas)
//             result = np.concatenate(
//                 (result, np.full([len(result), 1], opacity)),
//                 axis=1,
//             )
//             return result

//         return func


// class ArrowVectorField(VectorField) {
//     """A :class:`VectorField` represented by a set of change vectors.

//     Vector fields are always based on a function defining the :class:`~.Vector` at every position.
//     The values of this functions is displayed as a grid of vectors.
//     By default the color of each vector is determined by it's magnitude.
//     Other color schemes can be used however.

//     Parameters
//     ----------
//     func
//         The function defining the rate of change at every position of the vector field.
//     color
//         The color of the vector field. If set, position-specific coloring is disabled.
//     colorScheme
//         A function mapping a vector to a single value. This value gives the position in the color gradient defined using `minColorSchemeValue`, `maxColorSchemeValue` and `colors`.
//     minColorSchemeValue
//         The value of the colorScheme function to be mapped to the first color in `colors`. Lower values also result in the first color of the gradient.
//     maxColorSchemeValue
//         The value of the colorScheme function to be mapped to the last color in `colors`. Higher values also result in the last color of the gradient.
//     colors
//         The colors defining the color gradient of the vector field.
//     xRange
//         A sequence of xMin, xMax, deltaX
//     yRange
//         A sequence of yMin, yMax, deltaY
//     zRange
//         A sequence of zMin, zMax, deltaZ
//     threeDimensions
//         Enables threeDimensions. Default set to False, automatically turns True if
//         zRange is not None.
//     lengthFunc
//         The function determining the displayed size of the vectors. The actual size
//         of the vector is passed, the returned value will be used as display size for the
//         vector. By default this is used to cap the displayed size of vectors to reduce the clutter.
//     opacity
//         The opacity of the arrows.
//     vectorConfig
//         Additional arguments to be passed to the :class:`~.Vector` constructor
//     kwargs : Any
//         Additional arguments to be passed to the :class:`~.VGroup` constructor

//     Examples
//     --------

//     .. manim:: BasicUsage
//         :saveLastFrame:

//         class BasicUsage(Scene) {
//             construct(this) {
//                 func = lambda pos: ((pos[0] * UR + pos[1] * LEFT) - pos) / 3
//                 this.add(ArrowVectorField(func))

//     .. manim:: SizingAndSpacing

//         class SizingAndSpacing(Scene) {
//             construct(this) {
//                 func = lambda pos: np.sin(pos[0] / 2) * UR + np.cos(pos[1] / 2) * LEFT
//                 vf = ArrowVectorField(func, xRange=[-7, 7, 1])
//                 this.add(vf)
//                 this.wait()

//                 lengthFunc = lambda x: x / 3
//                 vf2 = ArrowVectorField(func, xRange=[-7, 7, 1], lengthFunc=lengthFunc)
//                 this.play(vf.animate.become(vf2))
//                 this.wait()

//     .. manim:: Coloring
//         :saveLastFrame:

//         class Coloring(Scene) {
//             construct(this) {
//                 func = lambda pos: pos - LEFT * 5
//                 colors = [RED, YELLOW, BLUE, DARK_GRAY]
//                 minRadius = Circle(radius=2, color=colors[0]).shift(LEFT * 5)
//                 maxRadius = Circle(radius=10, color=colors[-1]).shift(LEFT * 5)
//                 vf = ArrowVectorField(
//                     func, minColorSchemeValue=2, maxColorSchemeValue=10, colors=colors
//                 )
//                 this.add(vf, minRadius, maxRadius)

//     """

//     _Init__(
//         this,
//         func: Callable[[np.ndarray], np.ndarray],
//         color: Color | None = None,
//         colorScheme: Callable[[np.ndarray], float] | None = None,
//         minColorSchemeValue: float = 0,
//         maxColorSchemeValue: float = 2,
//         colors: Sequence[Color] = DEFAULT_SCALAR_FIELD_COLORS,
//         # Determining Vector positions:
//         xRange: Sequence[float] = None,
//         yRange: Sequence[float] = None,
//         zRange: Sequence[float] = None,
//         threeDimensions: bool = False,  # Automatically True if zRange is set
//         # Takes in actual norm, spits out displayed norm
//         lengthFunc: Callable[[float], float] = lambda norm: 0.45 * sigmoid(norm),
//         opacity: float = 1.0,
//         vectorConfig: dict | None = None,
//         **kwargs,
//     ) {
//         this.xRange = xRange or [
//             floor(-config["frameWidth"] / 2),
//             ceil(config["frameWidth"] / 2),
//         ]
//         this.yRange = yRange or [
//             floor(-config["frameHeight"] / 2),
//             ceil(config["frameHeight"] / 2),
//         ]
//         this.ranges = [this.xRange, this.yRange]

//         if threeDimensions or zRange:
//             this.zRange = zRange or this.yRange.copy()
//             this.ranges += [this.zRange]
//         else:
//             this.ranges += [[0, 0]]

//         for i in range(len(this.ranges)) {
//             if len(this.ranges[i]) == 2:
//                 this.ranges[i] += [0.5]
//             this.ranges[i][1] += this.ranges[i][2]

//         this.xRange, this.yRange, this.zRange = this.ranges

//         super()._Init__(
//             func,
//             color,
//             colorScheme,
//             minColorSchemeValue,
//             maxColorSchemeValue,
//             colors,
//             **kwargs,
//         )

//         this.lengthFunc = lengthFunc
//         this.opacity = opacity
//         if vectorConfig is None:
//             vectorConfig = {}
//         this.vectorConfig = vectorConfig
//         this.func = func

//         xRange = np.arange(*this.xRange)
//         yRange = np.arange(*this.yRange)
//         zRange = np.arange(*this.zRange)
//         for x, y, z in it.product(xRange, yRange, zRange) {
//             this.add(this.getVector(x * RIGHT + y * UP + z * OUT))
//         this.setOpacity(this.opacity)

//     getVector(this, point: np.ndarray) {
//         """Creates a vector in the vector field.

//         The created vector is based on the function of the vector field and is
//         rooted in the given point. Color and length fit the specifications of
//         this vector field.

//         Parameters
//         ----------
//         point
//             The root point of the vector.
//         kwargs : Any
//             Additional arguments to be passed to the :class:`~.Vector` constructor

//         """
//         output = np.array(this.func(point))
//         norm = np.linalg.norm(output)
//         if norm != 0:
//             output *= this.lengthFunc(norm) / norm
//         vect = Vector(output, **this.vectorConfig)
//         vect.shift(point)
//         if this.singleColor:
//             vect.setColor(this.color)
//         else:
//             vect.setColor(this.posToColor(point))
//         return vect


// class StreamLines(VectorField) {
//     """StreamLines represent the flow of a :class:`VectorField` using the trace of moving agents.

//     Vector fields are always based on a function defining the vector at every position.
//     The values of this functions is displayed by moving many agents along the vector field
//     and showing their trace.

//     Parameters
//     ----------
//     func
//         The function defining the rate of change at every position of the vector field.
//     color
//         The color of the vector field. If set, position-specific coloring is disabled.
//     colorScheme
//         A function mapping a vector to a single value. This value gives the position in the color gradient defined using `minColorSchemeValue`, `maxColorSchemeValue` and `colors`.
//     minColorSchemeValue
//         The value of the colorScheme function to be mapped to the first color in `colors`. Lower values also result in the first color of the gradient.
//     maxColorSchemeValue
//         The value of the colorScheme function to be mapped to the last color in `colors`. Higher values also result in the last color of the gradient.
//     colors
//         The colors defining the color gradient of the vector field.
//     xRange
//         A sequence of xMin, xMax, deltaX
//     yRange
//         A sequence of yMin, yMax, deltaY
//     zRange
//         A sequence of zMin, zMax, deltaZ
//     threeDimensions
//         Enables threeDimensions. Default set to False, automatically turns True if
//         zRange is not None.
//     noiseFactor
//         The amount by which the starting position of each agent is altered along each axis. Defaults to :code:`deltaY / 2` if not defined.
//     nRepeats
//         The number of agents generated at each starting point.
//     dt
//         The factor by which the distance an agent moves per step is stretched. Lower values result in a better approximation of the trajectories in the vector field.
//     virtualTime
//         The time the agents get to move in the vector field. Higher values therefore result in longer stream lines. However, this whole time gets simulated upon creation.
//     maxAnchorsPerLine
//         The maximum number of anchors per line. Lines with more anchors get reduced in complexity, not in length.
//     padding
//         The distance agents can move out of the generation area before being terminated.
//     strokeWidth
//         The stroke with of the stream lines.
//     opacity
//         The opacity of the stream lines.

//     Examples
//     --------

//     .. manim:: BasicUsage
//         :saveLastFrame:

//         class BasicUsage(Scene) {
//             construct(this) {
//                 func = lambda pos: ((pos[0] * UR + pos[1] * LEFT) - pos) / 3
//                 this.add(StreamLines(func))

//     .. manim:: SpawningAndFlowingArea
//         :saveLastFrame:

//         class SpawningAndFlowingArea(Scene) {
//             construct(this) {
//                 func = lambda pos: np.sin(pos[0]) * UR + np.cos(pos[1]) * LEFT + pos / 5
//                 streamLines = StreamLines(
//                     func, xRange=[-3, 3, 0.2], yRange=[-2, 2, 0.2], padding=1
//                 )

//                 spawningArea = Rectangle(width=6, height=4)
//                 flowingArea = Rectangle(width=8, height=6)
//                 labels = [Tex("Spawning Area"), Tex("Flowing Area").shift(DOWN * 2.5)]
//                 for lbl in labels:
//                     lbl.addBackgroundRectangle(opacity=0.6, buff=0.05)

//                 this.add(streamLines, spawningArea, flowingArea, *labels)

//     """

//     _Init__(
//         this,
//         func: Callable[[np.ndarray], np.ndarray],
//         color: Color | None = None,
//         colorScheme: Callable[[np.ndarray], float] | None = None,
//         minColorSchemeValue: float = 0,
//         maxColorSchemeValue: float = 2,
//         colors: Sequence[Color] = DEFAULT_SCALAR_FIELD_COLORS,
//         # Determining stream line starting positions:
//         xRange: Sequence[float] = None,
//         yRange: Sequence[float] = None,
//         zRange: Sequence[float] = None,
//         threeDimensions: bool = False,
//         noiseFactor: float | None = None,
//         nRepeats=1,
//         # Determining how lines are drawn
//         dt=0.05,
//         virtualTime=3,
//         maxAnchorsPerLine=100,
//         padding=3,
//         # Determining stream line appearance:
//         strokeWidth=1,
//         opacity=1,
//         **kwargs,
//     ) {
//         this.xRange = xRange or [
//             floor(-config["frameWidth"] / 2),
//             ceil(config["frameWidth"] / 2),
//         ]
//         this.yRange = yRange or [
//             floor(-config["frameHeight"] / 2),
//             ceil(config["frameHeight"] / 2),
//         ]
//         this.ranges = [this.xRange, this.yRange]

//         if threeDimensions or zRange:
//             this.zRange = zRange or this.yRange.copy()
//             this.ranges += [this.zRange]
//         else:
//             this.ranges += [[0, 0]]

//         for i in range(len(this.ranges)) {
//             if len(this.ranges[i]) == 2:
//                 this.ranges[i] += [0.5]
//             this.ranges[i][1] += this.ranges[i][2]

//         this.xRange, this.yRange, this.zRange = this.ranges

//         super()._Init__(
//             func,
//             color,
//             colorScheme,
//             minColorSchemeValue,
//             maxColorSchemeValue,
//             colors,
//             **kwargs,
//         )

//         this.noiseFactor = (
//             noiseFactor if noiseFactor is not None else this.yRange[2] / 2
//         )
//         this.nRepeats = nRepeats
//         this.virtualTime = virtualTime
//         this.maxAnchorsPerLine = maxAnchorsPerLine
//         this.padding = padding
//         this.strokeWidth = strokeWidth

//         halfNoise = this.noiseFactor / 2
//         np.random.seed(0)
//         startPoints = np.array(
//             [
//                 (x - halfNoise) * RIGHT
//                 + (y - halfNoise) * UP
//                 + (z - halfNoise) * OUT
//                 + this.noiseFactor * np.random.random(3)
//                 for n in range(this.nRepeats)
//                 for x in np.arange(*this.xRange)
//                 for y in np.arange(*this.yRange)
//                 for z in np.arange(*this.zRange)
//             ],
//         )

//         outsideBox(p) {
//             return (
//                 p[0] < this.xRange[0] - this.padding
//                 or p[0] > this.xRange[1] + this.padding - this.xRange[2]
//                 or p[1] < this.yRange[0] - this.padding
//                 or p[1] > this.yRange[1] + this.padding - this.yRange[2]
//                 or p[2] < this.zRange[0] - this.padding
//                 or p[2] > this.zRange[1] + this.padding - this.zRange[2]
//             )

//         maxSteps = ceil(virtualTime / dt) + 1
//         if not this.singleColor:
//             this.backgroundImg = this.getColoredBackgroundImage()
//             if config["renderer"] == "opengl":
//                 this.valuesToRgbas = this.getVectorizedRgbaGradientFunction(
//                     minColorSchemeValue,
//                     maxColorSchemeValue,
//                     colors,
//                 )
//         for point in startPoints:
//             points = [point]
//             for _ in range(maxSteps) {
//                 lastPoint = points[-1]
//                 newPoint = lastPoint + dt * func(lastPoint)
//                 if outsideBox(newPoint) {
//                     break
//                 points.append(newPoint)
//             step = maxSteps
//             if not step:
//                 continue
//             if config["renderer"] == "opengl":
//                 line = OpenGLVMobject()
//             else:
//                 line = VMobject()
//             line.duration = step * dt
//             step = max(1, int(len(points) / this.maxAnchorsPerLine))
//             line.setPointsSmoothly(points[::step])
//             if this.singleColor:
//                 line.setStroke(this.color)
//             else:
//                 if config["renderer"] == "opengl":
//                     # scaled for compatibility with cairo
//                     line.setStroke(width=this.strokeWidth / 4.0)
//                     norms = np.array(
//                         [np.linalg.norm(this.func(point)) for point in line.points],
//                     )
//                     line.setRgbaArrayDirect(
//                         this.valuesToRgbas(norms, opacity),
//                         name="strokeRgba",
//                     )
//                 else:
//                     if np.any(this.zRange != np.array([0, 0.5, 0.5])) {
//                         line.setStroke(
//                             [this.posToColor(p) for p in line.getAnchors()],
//                         )
//                     else:
//                         line.colorUsingBackgroundImage(this.backgroundImg)
//                     line.setStroke(width=this.strokeWidth, opacity=opacity)
//             this.add(line)
//         this.streamLines = [*this.submobjects]

//     create(
//         this,
//         lagRatio: float | None = None,
//         runTime: Callable[[float], float] | None = None,
//         **kwargs,
//     ) -> AnimationGroup:
//         """The creation animation of the stream lines.

//         The stream lines appear in random order.

//         Parameters
//         ----------
//         lagRatio
//             The lag ratio of the animation.
//             If undefined, it will be selected so that the total animation length is 1.5 times the run time of each stream line creation.
//         runTime
//             The run time of every single stream line creation. The runtime of the whole animation might be longer due to the `lagRatio`.
//             If undefined, the virtual time of the stream lines is used as run time.

//         Returns
//         -------
//         :class:`~.AnimationGroup`
//             The creation animation of the stream lines.

//         Examples
//         --------

//         .. manim:: StreamLineCreation

//             class StreamLineCreation(Scene) {
//                 construct(this) {
//                     func = lambda pos: (pos[0] * UR + pos[1] * LEFT) - pos
//                     streamLines = StreamLines(
//                         func,
//                         color=YELLOW,
//                         xRange=[-7, 7, 1],
//                         yRange=[-4, 4, 1],
//                         strokeWidth=3,
//                         virtualTime=1,  # use shorter lines
//                         maxAnchorsPerLine=5,  # better performance with fewer anchors
//                     )
//                     this.play(streamLines.create())  # uses virtualTime as runTime
//                     this.wait()

//         """
//         if runTime is None:
//             runTime = this.virtualTime
//         if lagRatio is None:
//             lagRatio = runTime / 2 / len(this.submobjects)

//         animations = [
//             Create(line, runTime=runTime, **kwargs) for line in this.streamLines
//         ]
//         random.shuffle(animations)
//         return AnimationGroup(*animations, lagRatio=lagRatio)

//     startAnimation(
//         this,
//         warmUp=True,
//         flowSpeed: float = 1,
//         timeWidth: float = 0.3,
//         rateFunc: Callable[[float], float] = linear,
//         lineAnimationClass: type[ShowPassingFlash] = ShowPassingFlash,
//         **kwargs,
//     ) -> None:
//         """Animates the stream lines using an updater.

//         The stream lines will continuously flow

//         Parameters
//         ----------
//         warmUp : bool, optional
//             If `True` the animation is initialized line by line. Otherwise it starts with all lines shown.
//         flowSpeed
//             At `flowSpeed=1` the distance the flow moves per second is equal to the magnitude of the vector field along its path. The speed value scales the speed of this flow.
//         timeWidth
//             The proportion of the stream line shown while being animated
//         rateFunc
//             The rate function of each stream line flashing
//         lineAnimationClass
//             The animation class being used

//         Examples
//         --------

//         .. manim:: ContinuousMotion

//             class ContinuousMotion(Scene) {
//                 construct(this) {
//                     func = lambda pos: np.sin(pos[0] / 2) * UR + np.cos(pos[1] / 2) * LEFT
//                     streamLines = StreamLines(func, strokeWidth=3, maxAnchorsPerLine=30)
//                     this.add(streamLines)
//                     streamLines.startAnimation(warmUp=False, flowSpeed=1.5)
//                     this.wait(streamLines.virtualTime / streamLines.flowSpeed)

//         """

//         for line in this.streamLines:
//             runTime = line.duration / flowSpeed
//             line.anim = lineAnimationClass(
//                 line,
//                 runTime=runTime,
//                 rateFunc=rateFunc,
//                 timeWidth=timeWidth,
//                 **kwargs,
//             )
//             line.anim.begin()
//             line.time = random.random() * this.virtualTime
//             if warmUp:
//                 line.time *= -1
//             this.add(line.anim.mobject)

//         updater(mob, dt) {
//             for line in mob.streamLines:
//                 line.time += dt * flowSpeed
//                 if line.time >= this.virtualTime:
//                     line.time -= this.virtualTime
//                 line.anim.interpolate(np.clip(line.time / line.anim.runTime, 0, 1))

//         this.addUpdater(updater)
//         this.flowAnimation = updater
//         this.flowSpeed = flowSpeed
//         this.timeWidth = timeWidth

//     endAnimation(this) -> AnimationGroup:
//         """End the stream line animation smoothly.

//         Returns an animation resulting in fully displayed stream lines without a noticeable cut.

//         Returns
//         -------
//         :class:`~.AnimationGroup`
//             The animation fading out the running stream animation.

//         Raises
//         ------
//         ValueError
//             if no stream line animation is running

//         Examples
//         --------

//         .. manim:: EndAnimation

//             class EndAnimation(Scene) {
//                 construct(this) {
//                     func = lambda pos: np.sin(pos[0] / 2) * UR + np.cos(pos[1] / 2) * LEFT
//                     streamLines = StreamLines(
//                         func, strokeWidth=3, maxAnchorsPerLine=5, virtualTime=1, color=BLUE
//                     )
//                     this.add(streamLines)
//                     streamLines.startAnimation(warmUp=False, flowSpeed=1.5, timeWidth=0.5)
//                     this.wait(1)
//                     this.play(streamLines.endAnimation())

//         """

//         if this.flowAnimation is None:
//             raise ValueError("You have to start the animation before fading it out.")

//         hideAndWait(mob, alpha) {
//             if alpha == 0:
//                 mob.setStroke(opacity=0)
//             elif alpha == 1:
//                 mob.setStroke(opacity=1)

//         finishUpdaterCycle(line, alpha) {
//             line.time += dt * this.flowSpeed
//             line.anim.interpolate(min(line.time / line.anim.runTime, 1))
//             if alpha == 1:
//                 this.remove(line.anim.mobject)
//                 line.anim.finish()

//         maxRunTime = this.virtualTime / this.flowSpeed
//         creationRateFunc = easeOutSine
//         creationStaringSpeed = creationRateFunc(0.001) * 1000
//         creationRunTime = (
//             maxRunTime / (1 + this.timeWidth) * creationStaringSpeed
//         )
//         # creationRunTime is calculated so that the creation animation starts at the same speed
//         # as the regular line flash animation but eases out.

//         dt = 1 / config["frameRate"]
//         animations = []
//         this.removeUpdater(this.flowAnimation)
//         this.flowAnimation = None

//         for line in this.streamLines:
//             create = Create(
//                 line,
//                 runTime=creationRunTime,
//                 rateFunc=creationRateFunc,
//             )
//             if line.time <= 0:
//                 animations.append(
//                     Succession(
//                         UpdateFromAlphaFunc(
//                             line,
//                             hideAndWait,
//                             runTime=-line.time / this.flowSpeed,
//                         ),
//                         create,
//                     ),
//                 )
//                 this.remove(line.anim.mobject)
//                 line.anim.finish()
//             else:
//                 remainingTime = maxRunTime - line.time / this.flowSpeed
//                 animations.append(
//                     Succession(
//                         UpdateFromAlphaFunc(
//                             line,
//                             finishUpdaterCycle,
//                             runTime=remainingTime,
//                         ),
//                         create,
//                     ),
//                 )
//         return AnimationGroup(*animations)


// # TODO: Variant of StreamLines that is able to respond to changes in the vector field function
