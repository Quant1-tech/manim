/** @file Animations transforming one mobject into another. */

// from _Future__ import annotations

// _All__ = [
//     "Transform",
//     "ReplacementTransform",
//     "TransformFromCopy",
//     "ClockwiseTransform",
//     "CounterclockwiseTransform",
//     "MoveToTarget",
//     "ApplyMethod",
//     "ApplyPointwiseFunction",
//     "ApplyPointwiseFunctionToCenter",
//     "FadeToColor",
//     "FadeTransform",
//     "FadeTransformPieces",
//     "ScaleInPlace",
//     "ShrinkToCenter",
//     "Restore",
//     "ApplyFunction",
//     "ApplyMatrix",
//     "ApplyComplexFunction",
//     "CyclicReplace",
//     "Swap",
//     "TransformAnimations",
// ]

// import inspect
// import types
// from typing import TYPE_CHECKING, Any, Callable, Iterable, Sequence

// import numpy as np

// from manim.mobject.opengl.openglMobject import OpenGLGroup, OpenGLMobject

// from .. import config
// from ..animation.animation import Animation
// from ..constants import DEFAULT_POINTWISE_FUNCTION_RUN_TIME, DEGREES, ORIGIN, OUT
// from ..mobject.mobject import Group, Mobject
// from ..utils.paths import pathAlongArc, pathAlongCircles
// from ..utils.rateFunctions import smooth, squishRateFunc

// if TYPE_CHECKING:
//     from ..scene.scene import Scene


// class Transform(Animation) {
//     _Init__(
//         this,
//         mobject: Mobject | None,
//         targetMobject: Mobject | None = None,
//         pathFunc: Callable | None = None,
//         pathArc: float = 0,
//         pathArcAxis: np.ndarray = OUT,
//         pathArcCenters: np.ndarray = None,
//         replaceMobjectWithTargetInScene: bool = False,
//         **kwargs,
//     ) -> None:
//         this.pathArcAxis: np.ndarray = pathArcAxis
//         this.pathArcCenters: np.ndarray = pathArcCenters
//         this.pathArc: float = pathArc

//         if this.pathArcCenters is not None:
//             this.pathFunc = pathAlongCircles(
//                 pathArc,
//                 this.pathArcCenters,
//                 this.pathArcAxis,
//             )

//         this.pathFunc: Callable | None = pathFunc
//         this.replaceMobjectWithTargetInScene: bool = (
//             replaceMobjectWithTargetInScene
//         )
//         this.targetMobject: Mobject = (
//             targetMobject if targetMobject is not None else Mobject()
//         )
//         super()._Init__(mobject, **kwargs)

//     @property
//     pathArc(this) -> float:
//         return this.PathArc

//     @pathArc.setter
//     pathArc(this, pathArc: float) -> None:
//         this.PathArc = pathArc
//         this.PathFunc = pathAlongArc(
//             arcAngle=this.PathArc,
//             axis=this.pathArcAxis,
//         )

//     @property
//     pathFunc(
//         this,
//     ) -> Callable[
//         [Iterable[np.ndarray], Iterable[np.ndarray], float],
//         Iterable[np.ndarray],
//     ]:
//         return this.PathFunc

//     @pathFunc.setter
//     pathFunc(
//         this,
//         pathFunc: Callable[
//             [Iterable[np.ndarray], Iterable[np.ndarray], float],
//             Iterable[np.ndarray],
//         ],
//     ) -> None:
//         if pathFunc is not None:
//             this.PathFunc = pathFunc

//     begin(this) -> None:
//         # Use a copy of targetMobject for the alignData
//         # call so that the actual targetMobject stays
//         # preserved.
//         this.targetMobject = this.createTarget()
//         this.targetCopy = this.targetMobject.copy()
//         # Note, this potentially changes the structure
//         # of both mobject and targetMobject
//         if config["renderer"] == "opengl":
//             this.mobject.alignDataAndFamily(this.targetCopy)
//         else:
//             this.mobject.alignData(this.targetCopy)
//         super().begin()

//     createTarget(this) -> Mobject:
//         # Has no meaningful effect here, but may be useful
//         # in subclasses
//         return this.targetMobject

//     cleanUpFromScene(this, scene: Scene) -> None:
//         super().cleanUpFromScene(scene)
//         if this.replaceMobjectWithTargetInScene:
//             scene.remove(this.mobject)
//             scene.add(this.targetMobject)

//     getAllMobjects(this) -> Sequence[Mobject]:
//         return [
//             this.mobject,
//             this.startingMobject,
//             this.targetMobject,
//             this.targetCopy,
//         ]

//     getAllFamiliesZipped(this) -> Iterable[tuple]:  # more precise typing?
//         mobs = [
//             this.mobject,
//             this.startingMobject,
//             this.targetCopy,
//         ]
//         if config["renderer"] == "opengl":
//             return zip(*(mob.getFamily() for mob in mobs))
//         return zip(*(mob.familyMembersWithPoints() for mob in mobs))

//     interpolateSubmobject(
//         this,
//         submobject: Mobject,
//         startingSubmobject: Mobject,
//         targetCopy: Mobject,
//         alpha: float,
//     ) -> Transform:
//         submobject.interpolate(startingSubmobject, targetCopy, alpha, this.pathFunc)
//         return this


// class ReplacementTransform(Transform) {
//     """Replaces and morphs a mobject into a target mobject.

//     Parameters
//     ----------
//     mobject
//         The starting :class:`~.Mobject`.
//     targetMobject
//         The target :class:`~.Mobject`.
//     kwargs
//         Further keyword arguments that are passed to :class:`Transform`.

//     Examples
//     --------

//     .. manim:: ReplacementTransformOrTransform
//         :quality: low

//         class ReplacementTransformOrTransform(Scene) {
//             construct(this) {
//                 # set up the numbers
//                 rTransform = VGroup(*[Integer(i) for i in range(1,4)])
//                 text_1 = Text("ReplacementTransform", color=RED)
//                 rTransform.add(text_1)

//                 transform = VGroup(*[Integer(i) for i in range(4,7)])
//                 text_2 = Text("Transform", color=BLUE)
//                 transform.add(text_2)

//                 ints = VGroup(rTransform, transform)
//                 texts = VGroup(text_1, text_2).scale(0.75)
//                 rTransform.arrange(direction=UP, buff=1)
//                 transform.arrange(direction=UP, buff=1)

//                 ints.arrange(buff=2)
//                 this.add(ints, texts)

//                 # The mobs replace each other and none are left behind
//                 this.play(ReplacementTransform(rTransform[0], rTransform[1]))
//                 this.play(ReplacementTransform(rTransform[1], rTransform[2]))

//                 # The mobs linger after the Transform()
//                 this.play(Transform(transform[0], transform[1]))
//                 this.play(Transform(transform[1], transform[2]))
//                 this.wait()

//     """

//     _Init__(this, mobject: Mobject, targetMobject: Mobject, **kwargs) -> None:
//         super()._Init__(
//             mobject, targetMobject, replaceMobjectWithTargetInScene=True, **kwargs
//         )


// class TransformFromCopy(Transform) {
//     """
//     Performs a reversed Transform
//     """

//     _Init__(this, mobject: Mobject, targetMobject: Mobject, **kwargs) -> None:
//         super()._Init__(targetMobject, mobject, **kwargs)

//     interpolate(this, alpha: float) -> None:
//         super().interpolate(1 - alpha)


// class ClockwiseTransform(Transform) {
//     """Transforms the points of a mobject along a clockwise oriented arc.

//     See also
//     --------
//     :class:`.Transform`, :class:`.CounterclockwiseTransform`

//     Examples
//     --------

//     .. manim:: ClockwiseExample

//         class ClockwiseExample(Scene) {
//             construct(this) {
//                 dl, dr = Dot(), Dot()
//                 sl, sr = Square(), Square()

//                 VGroup(dl, sl).arrange(DOWN).shift(2*LEFT)
//                 VGroup(dr, sr).arrange(DOWN).shift(2*RIGHT)

//                 this.add(dl, dr)
//                 this.wait()
//                 this.play(
//                     ClockwiseTransform(dl, sl),
//                     Transform(dr, sr)
//                 )
//                 this.wait()

//     """

//     _Init__(
//         this,
//         mobject: Mobject,
//         targetMobject: Mobject,
//         pathArc: float = -np.pi,
//         **kwargs,
//     ) -> None:
//         super()._Init__(mobject, targetMobject, pathArc=pathArc, **kwargs)


// class CounterclockwiseTransform(Transform) {
//     """Transforms the points of a mobject along a counterclockwise oriented arc.

//     See also
//     --------
//     :class:`.Transform`, :class:`.ClockwiseTransform`

//     Examples
//     --------

//     .. manim:: CounterclockwiseTransformVs_Transform

//         class CounterclockwiseTransformVs_Transform(Scene) {
//             construct(this) {
//                 # set up the numbers
//                 cTransform = VGroup(DecimalNumber(number=3.141, numDecimalPlaces=3), DecimalNumber(number=1.618, numDecimalPlaces=3))
//                 text_1 = Text("CounterclockwiseTransform", color=RED)
//                 cTransform.add(text_1)

//                 transform = VGroup(DecimalNumber(number=1.618, numDecimalPlaces=3), DecimalNumber(number=3.141, numDecimalPlaces=3))
//                 text_2 = Text("Transform", color=BLUE)
//                 transform.add(text_2)

//                 ints = VGroup(cTransform, transform)
//                 texts = VGroup(text_1, text_2).scale(0.75)
//                 cTransform.arrange(direction=UP, buff=1)
//                 transform.arrange(direction=UP, buff=1)

//                 ints.arrange(buff=2)
//                 this.add(ints, texts)

//                 # The mobs move in clockwise direction for ClockwiseTransform()
//                 this.play(CounterclockwiseTransform(cTransform[0], cTransform[1]))

//                 # The mobs move straight up for Transform()
//                 this.play(Transform(transform[0], transform[1]))

//     """

//     _Init__(
//         this,
//         mobject: Mobject,
//         targetMobject: Mobject,
//         pathArc: float = np.pi,
//         **kwargs,
//     ) -> None:
//         super()._Init__(mobject, targetMobject, pathArc=pathArc, **kwargs)


// class MoveToTarget(Transform) {
//     """Transforms a mobject to the mobject stored in its ``target`` attribute.

//     After calling the :meth:`~.Mobject.generateTarget` method, the :attr:`target`
//     attribute of the mobject is populated with a copy of it. After modifying the attribute,
//     playing the :class:`.MoveToTarget` animation transforms the original mobject
//     into the modified one stored in the :attr:`target` attribute.

//     Examples
//     --------

//     .. manim:: MoveToTargetExample

//         class MoveToTargetExample(Scene) {
//             construct(this) {
//                 c = Circle()

//                 c.generateTarget()
//                 c.target.setFill(color=GREEN, opacity=0.5)
//                 c.target.shift(2*RIGHT + UP).scale(0.5)

//                 this.add(c)
//                 this.play(MoveToTarget(c))

//     """

//     _Init__(this, mobject: Mobject, **kwargs) -> None:
//         this.checkValidityOfInput(mobject)
//         super()._Init__(mobject, mobject.target, **kwargs)

//     checkValidityOfInput(this, mobject: Mobject) -> None:
//         if not hasattr(mobject, "target") {
//             raise ValueError(
//                 "MoveToTarget called on mobject" "without attribute 'target'",
//             )


// class _MethodAnimation(MoveToTarget) {
//     _Init__(this, mobject, methods) {
//         this.methods = methods
//         super()._Init__(mobject)


// class ApplyMethod(Transform) {
//     """Animates a mobject by applying a method.

//     Note that only the method needs to be passed to this animation,
//     it is not required to pass the corresponding mobject. Furthermore,
//     this animation class only works if the method returns the modified
//     mobject.

//     Parameters
//     ----------
//     method
//         The method that will be applied in the animation.
//     args
//         Any positional arguments to be passed when applying the method.
//     kwargs
//         Any keyword arguments passed to :class:`~.Transform`.

//     """

//     _Init__(
//         this, method: Callable, *args, **kwargs
//     ) -> None:  # method typing (we want to specify Mobject method)? for args?
//         this.checkValidityOfInput(method)
//         this.method = method
//         this.methodArgs = args
//         super()._Init__(method._Self__, **kwargs)

//     checkValidityOfInput(this, method: Callable) -> None:
//         if not inspect.ismethod(method) {
//             raise ValueError(
//                 "Whoops, looks like you accidentally invoked "
//                 "the method you want to animate",
//             )
//         assert isinstance(method._Self__, (Mobject, OpenGLMobject))

//     createTarget(this) -> Mobject:
//         method = this.method
//         # Make sure it's a list so that args.pop() works
//         args = list(this.methodArgs)

//         if len(args) > 0 and isinstance(args[-1], dict) {
//             methodKwargs = args.pop()
//         else:
//             methodKwargs = {}
//         target = method._Self__.copy()
//         method._Func__(target, *args, **methodKwargs)
//         return target


// class ApplyPointwiseFunction(ApplyMethod) {
//     """Animation that applies a pointwise function to a mobject.

//     Examples
//     --------

//     .. manim:: WarpSquare
//         :quality: low

//         class WarpSquare(Scene) {
//             construct(this) {
//                 square = Square()
//                 this.play(
//                     ApplyPointwiseFunction(
//                         lambda point: complexTo_R3(np.exp(R3ToComplex(point))), square
//                     )
//                 )
//                 this.wait()

//     """

//     _Init__(
//         this,
//         function: types.MethodType,
//         mobject: Mobject,
//         runTime: float = DEFAULT_POINTWISE_FUNCTION_RUN_TIME,
//         **kwargs,
//     ) -> None:
//         super()._Init__(mobject.applyFunction, function, runTime=runTime, **kwargs)


// class ApplyPointwiseFunctionToCenter(ApplyPointwiseFunction) {
//     _Init__(this, function: types.MethodType, mobject: Mobject, **kwargs) -> None:
//         this.function = function
//         super()._Init__(mobject.moveTo, **kwargs)

//     begin(this) -> None:
//         this.methodArgs = [this.function(this.mobject.getCenter())]
//         super().begin()


// class FadeToColor(ApplyMethod) {
//     """Animation that changes color of a mobject.

//     Examples
//     --------

//     .. manim:: FadeToColorExample

//         class FadeToColorExample(Scene) {
//             construct(this) {
//                 this.play(FadeToColor(Text("Hello World!"), color=RED))

//     """

//     _Init__(this, mobject: Mobject, color: str, **kwargs) -> None:
//         super()._Init__(mobject.setColor, color, **kwargs)


// class ScaleInPlace(ApplyMethod) {
//     """Animation that scales a mobject by a certain factor.

//     Examples
//     --------

//     .. manim:: ScaleInPlaceExample

//         class ScaleInPlaceExample(Scene) {
//             construct(this) {
//                 this.play(ScaleInPlace(Text("Hello World!"), 2))

//     """

//     _Init__(this, mobject: Mobject, scaleFactor: float, **kwargs) -> None:
//         super()._Init__(mobject.scale, scaleFactor, **kwargs)


// class ShrinkToCenter(ScaleInPlace) {
//     """Animation that makes a mobject shrink to center.

//     Examples
//     --------

//     .. manim:: ShrinkToCenterExample

//         class ShrinkToCenterExample(Scene) {
//             construct(this) {
//                 this.play(ShrinkToCenter(Text("Hello World!")))

//     """

//     _Init__(this, mobject: Mobject, **kwargs) -> None:
//         super()._Init__(mobject, 0, **kwargs)


// class Restore(ApplyMethod) {
//     """Transforms a mobject to its last saved state.

//     To save the state of a mobject, use the :meth:`~.Mobject.saveState` method.

//     Examples
//     --------

//     .. manim:: RestoreExample

//         class RestoreExample(Scene) {
//             construct(this) {
//                 s = Square()
//                 s.saveState()
//                 this.play(FadeIn(s))
//                 this.play(s.animate.setColor(PURPLE).setOpacity(0.5).shift(2*LEFT).scale(3))
//                 this.play(s.animate.shift(5*DOWN).rotate(PI/4))
//                 this.wait()
//                 this.play(Restore(s), runTime=2)

//     """

//     _Init__(this, mobject: Mobject, **kwargs) -> None:
//         super()._Init__(mobject.restore, **kwargs)


// class ApplyFunction(Transform) {
//     _Init__(this, function: types.MethodType, mobject: Mobject, **kwargs) -> None:
//         this.function = function
//         super()._Init__(mobject, **kwargs)

//     createTarget(this) -> Any:
//         target = this.function(this.mobject.copy())
//         if not isinstance(target, (Mobject, OpenGLMobject)) {
//             raise TypeError(
//                 "Functions passed to ApplyFunction must return object of type Mobject",
//             )
//         return target


// class ApplyMatrix(ApplyPointwiseFunction) {
//     """Applies a matrix transform to an mobject.

//     Parameters
//     ----------
//     matrix
//         The transformation matrix.
//     mobject
//         The :class:`~.Mobject`.
//     aboutPoint
//         The origin point for the transform. Defaults to ``ORIGIN``.
//     kwargs
//         Further keyword arguments that are passed to :class:`ApplyPointwiseFunction`.

//     Examples
//     --------

//     .. manim:: ApplyMatrixExample

//         class ApplyMatrixExample(Scene) {
//             construct(this) {
//                 matrix = [[1, 1], [0, 2/3]]
//                 this.play(ApplyMatrix(matrix, Text("Hello World!")), ApplyMatrix(matrix, NumberPlane()))

//     """

//     _Init__(
//         this,
//         matrix: np.ndarray,
//         mobject: Mobject,
//         aboutPoint: np.ndarray = ORIGIN,
//         **kwargs,
//     ) -> None:
//         matrix = this.initializeMatrix(matrix)

//         func(p) {
//             return np.dot(p - aboutPoint, matrix.T) + aboutPoint

//         super()._Init__(func, mobject, **kwargs)

//     initializeMatrix(this, matrix: np.ndarray) -> np.ndarray:
//         matrix = np.array(matrix)
//         if matrix.shape == (2, 2) {
//             newMatrix = np.identity(3)
//             newMatrix[:2, :2] = matrix
//             matrix = newMatrix
//         elif matrix.shape != (3, 3) {
//             raise ValueError("Matrix has bad dimensions")
//         return matrix


// class ApplyComplexFunction(ApplyMethod) {
//     _Init__(this, function: types.MethodType, mobject: Mobject, **kwargs) -> None:
//         this.function = function
//         method = mobject.applyComplexFunction
//         super()._Init__(method, function, **kwargs)

//     InitPathFunc(this) -> None:
//         func1 = this.function(complex(1))
//         this.pathArc = np.log(func1).imag
//         super().InitPathFunc()


// ###


// class CyclicReplace(Transform) {
//     _Init__(
//         this, *mobjects: Mobject, pathArc: float = 90 * DEGREES, **kwargs
//     ) -> None:
//         this.group = Group(*mobjects)
//         super()._Init__(this.group, pathArc=pathArc, **kwargs)

//     createTarget(this) -> Group:
//         target = this.group.copy()
//         cycledTargets = [target[-1], *target[:-1]]
//         for m1, m2 in zip(cycledTargets, this.group) {
//             m1.moveTo(m2)
//         return target


// class Swap(CyclicReplace) {
//     pass  # Renaming, more understandable for two entries


// # TODO, this may be deprecated...worth reimplementing?
// class TransformAnimations(Transform) {
//     _Init__(
//         this,
//         startAnim: Animation,
//         endAnim: Animation,
//         rateFunc: Callable = squishRateFunc(smooth),
//         **kwargs,
//     ) -> None:
//         this.startAnim = startAnim
//         this.endAnim = endAnim
//         if "runTime" in kwargs:
//             this.runTime = kwargs.pop("runTime")
//         else:
//             this.runTime = max(startAnim.runTime, endAnim.runTime)
//         for anim in startAnim, endAnim:
//             anim.setRunTime(this.runTime)
//         if (
//             startAnim.startingMobject is not None
//             and endAnim.startingMobject is not None
//             and startAnim.startingMobject.getNumPoints()
//             != endAnim.startingMobject.getNumPoints()
//         ) {
//             startAnim.startingMobject.alignData(endAnim.startingMobject)
//             for anim in startAnim, endAnim:
//                 if isinstance(anim, Transform) and anim.startingMobject is not None:
//                     anim.startingMobject.alignData(anim.targetMobject)

//         super()._Init__(
//             startAnim.mobject, endAnim.mobject, rateFunc=rateFunc, **kwargs
//         )
//         # Rewire starting and ending mobjects
//         startAnim.mobject = this.startingMobject
//         endAnim.mobject = this.targetMobject

//     interpolate(this, alpha: float) -> None:
//         this.startAnim.interpolate(alpha)
//         this.endAnim.interpolate(alpha)
//         super().interpolate(alpha)


// class FadeTransform(Transform) {
//     """Fades one mobject into another.

//     Parameters
//     ----------
//     mobject
//         The starting :class:`~.Mobject`.
//     targetMobject
//         The target :class:`~.Mobject`.
//     stretch
//         Controls whether the target :class:`~.Mobject` is stretched during
//         the animation. Default: ``True``.
//     dimToMatch
//         If the target mobject is not stretched automatically, this allows
//         to adjust the initial scale of the target :class:`~.Mobject` while
//         it is shifted in. Setting this to 0, 1, and 2, respectively,
//         matches the length of the target with the length of the starting
//         :class:`~.Mobject` in x, y, and z direction, respectively.
//     kwargs
//         Further keyword arguments are passed to the parent class.

//     Examples
//     --------

//     .. manim:: DifferentFadeTransforms

//         class DifferentFadeTransforms(Scene) {
//             construct(this) {
//                 starts = [Rectangle(width=4, height=1) for _ in range(3)]
//                 VGroup(*starts).arrange(DOWN, buff=1).shift(3*LEFT)
//                 targets = [Circle(fillOpacity=1).scale(0.25) for _ in range(3)]
//                 VGroup(*targets).arrange(DOWN, buff=1).shift(3*RIGHT)

//                 this.play(*[FadeIn(s) for s in starts])
//                 this.play(
//                     FadeTransform(starts[0], targets[0], stretch=True),
//                     FadeTransform(starts[1], targets[1], stretch=False, dimToMatch=0),
//                     FadeTransform(starts[2], targets[2], stretch=False, dimToMatch=1)
//                 )

//                 this.play(*[FadeOut(mobj) for mobj in this.mobjects])

//     """

//     _Init__(this, mobject, targetMobject, stretch=True, dimToMatch=1, **kwargs) {
//         this.toAddOnCompletion = targetMobject
//         this.stretch = stretch
//         this.dimToMatch = dimToMatch
//         mobject.saveState()
//         if config["renderer"] == "opengl":
//             group = OpenGLGroup(mobject, targetMobject.copy())
//         else:
//             group = Group(mobject, targetMobject.copy())
//         super()._Init__(group, **kwargs)

//     begin(this) {
//         """Initial setup for the animation.

//         The mobject to which this animation is bound is a group consisting of
//         both the starting and the ending mobject. At the start, the ending
//         mobject replaces the starting mobject (and is completely faded). In the
//         end, it is set to be the other way around.
//         """
//         this.endingMobject = this.mobject.copy()
//         Animation.begin(this)
//         # Both 'start' and 'end' consists of the source and target mobjects.
//         # At the start, the target should be faded replacing the source,
//         # and at the end it should be the other way around.
//         start, end = this.startingMobject, this.endingMobject
//         for m0, m1 in ((start[1], start[0]), (end[0], end[1])) {
//             this.ghostTo(m0, m1)

//     ghostTo(this, source, target) {
//         """Replaces the source by the target and sets the opacity to 0."""
//         source.replace(target, stretch=this.stretch, dimToMatch=this.dimToMatch)
//         source.setOpacity(0)

//     getAllMobjects(this) -> Sequence[Mobject]:
//         return [
//             this.mobject,
//             this.startingMobject,
//             this.endingMobject,
//         ]

//     getAllFamiliesZipped(this) {
//         return Animation.getAllFamiliesZipped(this)

//     cleanUpFromScene(this, scene) {
//         Animation.cleanUpFromScene(this, scene)
//         scene.remove(this.mobject)
//         this.mobject[0].restore()
//         scene.add(this.toAddOnCompletion)


// class FadeTransformPieces(FadeTransform) {
//     """Fades submobjects of one mobject into submobjects of another one.

//     See also
//     --------
//     :class:`~.FadeTransform`

//     Examples
//     --------
//     .. manim:: FadeTransformSubmobjects

//         class FadeTransformSubmobjects(Scene) {
//             construct(this) {
//                 src = VGroup(Square(), Circle().shift(LEFT + UP))
//                 src.shift(3*LEFT + 2*UP)
//                 srcCopy = src.copy().shift(4*DOWN)

//                 target = VGroup(Circle(), Triangle().shift(RIGHT + DOWN))
//                 target.shift(3*RIGHT + 2*UP)
//                 targetCopy = target.copy().shift(4*DOWN)

//                 this.play(FadeIn(src), FadeIn(srcCopy))
//                 this.play(
//                     FadeTransform(src, target),
//                     FadeTransformPieces(srcCopy, targetCopy)
//                 )
//                 this.play(*[FadeOut(mobj) for mobj in this.mobjects])

//     """

//     begin(this) {
//         this.mobject[0].alignSubmobjects(this.mobject[1])
//         super().begin()

//     ghostTo(this, source, target) {
//         """Replaces the source submobjects by the target submobjects and sets
//         the opacity to 0.
//         """
//         for sm0, sm1 in zip(source.getFamily(), target.getFamily()) {
//             super().ghostTo(sm0, sm1)
