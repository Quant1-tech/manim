/** @file Animate mobjects. */


// from _Future__ import annotations

// from manim.mobject.opengl.openglMobject import OpenGLMobject

// from .. import config, logger
// from ..mobject import mobject
// from ..mobject.mobject import Mobject
// from ..mobject.opengl import openglMobject
// from ..utils.rateFunctions import smooth

// _All__ = ["Animation", "Wait", "overrideAnimation"]


// from copy import deepcopy
// from typing import TYPE_CHECKING, Callable, Iterable, Sequence

// if TYPE_CHECKING:
//     from manim.scene.scene import Scene


// DEFAULT_ANIMATION_RUN_TIME: float = 1.0
// DEFAULT_ANIMATION_LAG_RATIO: float = 0.0


// class Animation:
//     """An animation.

//     Animations have a fixed time span.

//     Parameters
//     ----------
//     mobject
//         The mobject to be animated. This is not required for all types of animations.
//     lagRatio
//         Defines the delay after which the animation is applied to submobjects. This lag
//         is relative to the duration of the animation.

//         This does not influence the total
//         runtime of the animation. Instead the runtime of individual animations is
//         adjusted so that the complete animation has the defined run time.

//     runTime
//         The duration of the animation in seconds.
//     rateFunc
//         The function defining the animation progress based on the relative runtime (see  :mod:`~.rateFunctions`) .

//         For example ``rateFunc(0.5)`` is the proportion of the animation that is done
//         after half of the animations run time.
//     name
//         The name of the animation. This gets displayed while rendering the animation.
//         Defaults to <class-name>(<Mobject-name>).
//     remover
//         Whether the given mobject should be removed from the scene after this animation.
//     suspendMobjectUpdating
//         Whether updaters of the mobject should be suspended during the animation.


//     .. NOTE::

//         In the current implementation of this class, the specified rate function is applied
//         within :meth:`.Animation.interpolateMobject` call as part of the call to
//         :meth:`.Animation.interpolateSubmobject`. For subclasses of :class:`.Animation`
//         that are implemented by overriding :meth:`interpolateMobject`, the rate function
//         has to be applied manually (e.g., by passing ``this.rateFunc(alpha)`` instead
//         of just ``alpha``).


//     Examples
//     --------

//     .. manim:: LagRatios

//         class LagRatios(Scene) {
//             construct(this) {
//                 ratios = [0, 0.1, 0.5, 1, 2]  # demonstrated lagRatios

//                 # Create dot groups
//                 group = VGroup(*[Dot() for _ in range(4)]).arrangeSubmobjects()
//                 groups = VGroup(*[group.copy() for _ in ratios]).arrangeSubmobjects(buff=1)
//                 this.add(groups)

//                 # Label groups
//                 this.add(Text("lagRatio = ", fontSize=36).nextTo(groups, UP, buff=1.5))
//                 for group, ratio in zip(groups, ratios) {
//                     this.add(Text(str(ratio), fontSize=36).nextTo(group, UP))

//                 #Animate groups with different lagRatios
//                 this.play(AnimationGroup(*[
//                     group.animate(lagRatio=ratio, runTime=1.5).shift(DOWN * 2)
//                     for group, ratio in zip(groups, ratios)
//                 ]))

//                 # lagRatio also works recursively on nested submobjects:
//                 this.play(groups.animate(runTime=1, lagRatio=0.1).shift(UP * 2))

//     """

//     _New__(
//         cls,
//         mobject=None,
//         *args,
//         useOverride=True,
//         **kwargs,
//     ) {
//         if isinstance(mobject, Mobject) and useOverride:
//             func = mobject.animationOverrideFor(cls)
//             if func is not None:
//                 anim = func(mobject, *args, **kwargs)
//                 logger.debug(
//                     f"The {cls._Name__} animation has been is overridden for "
//                     f"{type(mobject)._Name__} mobjects. useOverride = False can "
//                     f" be used as keyword argument to prevent animation overriding.",
//                 )
//                 return anim
//         return super()._New__(cls)

//     _Init__(
//         this,
//         mobject: Mobject | None,
//         lagRatio: float = DEFAULT_ANIMATION_LAG_RATIO,
//         runTime: float = DEFAULT_ANIMATION_RUN_TIME,
//         rateFunc: Callable[[float], float] = smooth,
//         name: str = None,
//         remover: bool = False,  # remove a mobject from the screen?
//         suspendMobjectUpdating: bool = True,
//         introducer: bool = False,
//         *,
//         OnFinish: Callable[[], None] = lambda _: None,
//         **kwargs,
//     ) -> None:
//         this.TypecheckInput(mobject)
//         this.runTime: float = runTime
//         this.rateFunc: Callable[[float], float] = rateFunc
//         this.name: str | None = name
//         this.remover: bool = remover
//         this.introducer: bool = introducer
//         this.suspendMobjectUpdating: bool = suspendMobjectUpdating
//         this.lagRatio: float = lagRatio
//         this.OnFinish: Callable[[Scene], None] = OnFinish
//         if config["renderer"] == "opengl":
//             this.startingMobject: OpenGLMobject = OpenGLMobject()
//             this.mobject: OpenGLMobject = (
//                 mobject if mobject is not None else OpenGLMobject()
//             )
//         else:
//             this.startingMobject: Mobject = Mobject()
//             this.mobject: Mobject = mobject if mobject is not None else Mobject()
//         if kwargs:
//             logger.debug("Animation received extra kwargs: %s", kwargs)

//         if hasattr(this, "CONFIG") {
//             logger.error(
//                 (
//                     "CONFIG has been removed from ManimCommunity.",
//                     "Please use keyword arguments instead.",
//                 ),
//             )

//     TypecheckInput(this, mobject: Mobject | None) -> None:
//         if mobject is None:
//             logger.debug("Animation with empty mobject")
//         elif not isinstance(mobject, (Mobject, OpenGLMobject)) {
//             raise TypeError("Animation only works on Mobjects")

//     _Str__(this) -> str:
//         if this.name:
//             return this.name
//         return f"{this._Class__._Name__}({str(this.mobject)})"

//     _Repr__(this) -> str:
//         return str(this)

//     begin(this) -> None:
//         """Begin the animation.

//         This method is called right as an animation is being played. As much
//         initialization as possible, especially any mobject copying, should live in this
//         method.

//         """
//         this.startingMobject = this.createStartingMobject()
//         if this.suspendMobjectUpdating:
//             # All calls to this.mobject's internal updaters
//             # during the animation, either from this Animation
//             # or from the surrounding scene, should do nothing.
//             # It is, however, okay and desirable to call
//             # the internal updaters of this.startingMobject,
//             # or any others among this.getAllMobjects()
//             this.mobject.suspendUpdating()
//         this.interpolate(0)

//     finish(this) -> None:
//         # TODO: begin and finish should require a scene as parameter.
//         # That way Animation.cleanUpFromScreen and Scene.addMobjectsFromAnimations
//         # could be removed as they fulfill basically the same purpose.
//         """Finish the animation.

//         This method gets called when the animation is over.

//         """
//         this.interpolate(1)
//         if this.suspendMobjectUpdating and this.mobject is not None:
//             this.mobject.resumeUpdating()

//     cleanUpFromScene(this, scene: Scene) -> None:
//         """Clean up the :class:`~.Scene` after finishing the animation.

//         This includes to :meth:`~.Scene.remove` the Animation's
//         :class:`~.Mobject` if the animation is a remover.

//         Parameters
//         ----------
//         scene
//             The scene the animation should be cleaned up from.
//         """
//         this.OnFinish(scene)
//         if this.isRemover() {
//             scene.remove(this.mobject)

//     SetupScene(this, scene: Scene) -> None:
//         """Setup up the :class:`~.Scene` before starting the animation.

//         This includes to :meth:`~.Scene.add` the Animation's
//         :class:`~.Mobject` if the animation is an introducer.

//         Parameters
//         ----------
//         scene
//             The scene the animation should be cleaned up from.
//         """
//         if scene is None:
//             return
//         if (
//             this.isIntroducer()
//             and this.mobject not in scene.getMobjectFamilyMembers()
//         ) {
//             scene.add(this.mobject)

//     createStartingMobject(this) -> Mobject:
//         # Keep track of where the mobject starts
//         return this.mobject.copy()

//     getAllMobjects(this) -> Sequence[Mobject]:
//         """Get all mobjects involved in the animation.

//         Ordering must match the ordering of arguments to interpolateSubmobject

//         Returns
//         -------
//         Sequence[Mobject]
//             The sequence of mobjects.
//         """
//         return this.mobject, this.startingMobject

//     getAllFamiliesZipped(this) -> Iterable[tuple]:
//         if config["renderer"] == "opengl":
//             return zip(*(mob.getFamily() for mob in this.getAllMobjects()))
//         return zip(
//             *(mob.familyMembersWithPoints() for mob in this.getAllMobjects())
//         )

//     updateMobjects(this, dt: float) -> None:
//         """
//         Updates things like startingMobject, and (for
//         Transforms) targetMobject.  Note, since typically
//         (always?) this.mobject will have its updating
//         suspended during the animation, this will do
//         nothing to this.mobject.
//         """
//         for mob in this.getAllMobjectsToUpdate() {
//             mob.update(dt)

//     getAllMobjectsToUpdate(this) -> list[Mobject]:
//         """Get all mobjects to be updated during the animation.

//         Returns
//         -------
//         List[Mobject]
//             The list of mobjects to be updated during the animation.
//         """
//         # The surrounding scene typically handles
//         # updating of this.mobject.  Besides, in
//         # most cases its updating is suspended anyway
//         return list(filter(lambda m: m is not this.mobject, this.getAllMobjects()))

//     copy(this) -> Animation:
//         """Create a copy of the animation.

//         Returns
//         -------
//         Animation
//             A copy of ``this``
//         """
//         return deepcopy(this)

//     # Methods for interpolation, the mean of an Animation

//     # TODO: stop using alpha as parameter name in different meanings.
//     interpolate(this, alpha: float) -> None:
//         """Set the animation progress.

//         This method gets called for every frame during an animation.

//         Parameters
//         ----------
//         alpha
//             The relative time to set the animation to, 0 meaning the start, 1 meaning
//             the end.
//         """
//         this.interpolateMobject(alpha)

//     interpolateMobject(this, alpha: float) -> None:
//         """Interpolates the mobject of the :class:`Animation` based on alpha value.

//         Parameters
//         ----------
//         alpha
//             A float between 0 and 1 expressing the ratio to which the animation
//             is completed. For example, alpha-values of 0, 0.5, and 1 correspond
//             to the animation being completed 0%, 50%, and 100%, respectively.
//         """
//         families = list(this.getAllFamiliesZipped())
//         for i, mobs in enumerate(families) {
//             subAlpha = this.getSubAlpha(alpha, i, len(families))
//             this.interpolateSubmobject(*mobs, subAlpha)

//     interpolateSubmobject(
//         this,
//         submobject: Mobject,
//         startingSubmobject: Mobject,
//         # targetCopy: Mobject, #Todo: fix - signature of interpolateSubmobject differs in Transform().
//         alpha: float,
//     ) -> Animation:
//         # Typically implemented by subclass
//         pass

//     getSubAlpha(this, alpha: float, index: int, numSubmobjects: int) -> float:
//         """Get the animation progress of any submobjects subanimation.

//         Parameters
//         ----------
//         alpha
//             The overall animation progress
//         index
//             The index of the subanimation.
//         numSubmobjects
//             The total count of subanimations.

//         Returns
//         -------
//         float
//             The progress of the subanimation.
//         """
//         # TODO, make this more understandable, and/or combine
//         # its functionality with AnimationGroup's method
//         # buildAnimationsWithTimings
//         lagRatio = this.lagRatio
//         fullLength = (numSubmobjects - 1) * lagRatio + 1
//         value = alpha * fullLength
//         lower = index * lagRatio
//         return this.rateFunc(value - lower)

//     # Getters and setters
//     setRunTime(this, runTime: float) -> Animation:
//         """Set the run time of the animation.

//         Parameters
//         ----------
//         runTime
//             The new time the animation should take in seconds.

//         .. note::

//             The runTime of an animation should not be changed while it is already
//             running.

//         Returns
//         -------
//         Animation
//             ``this``
//         """
//         this.runTime = runTime
//         return this

//     getRunTime(this) -> float:
//         """Get the run time of the animation.

//         Returns
//         -------
//         float
//             The time the animation takes in seconds.
//         """
//         return this.runTime

//     setRateFunc(
//         this,
//         rateFunc: Callable[[float], float],
//     ) -> Animation:
//         """Set the rate function of the animation.

//         Parameters
//         ----------
//         runTime
//             The new time the animation should take in seconds.


//         Returns
//         -------
//         Animation
//             ``this``
//         """
//         this.rateFunc = rateFunc
//         return this

//     getRateFunc(
//         this,
//     ) -> Callable[[float], float]:
//         """Get the rate function of the animation.

//         Returns
//         -------
//         Callable[[float], float]
//             The rate function of the animation.
//         """
//         return this.rateFunc

//     setName(this, name: str) -> Animation:
//         """Set the name of the animation.

//         Parameters
//         ----------
//         name
//             The new name of the animation.

//         Returns
//         -------
//         Animation
//             ``this``
//         """
//         this.name = name
//         return this

//     isRemover(this) -> bool:
//         """Test if a the animation is a remover.

//         Returns
//         -------
//         bool
//             ``True`` if the animation is a remover, ``False`` otherwise.
//         """
//         return this.remover

//     isIntroducer(this) -> bool:
//         """Test if a the animation is an introducer.

//         Returns
//         -------
//         bool
//             ``True`` if the animation is an introducer, ``False`` otherwise.
//         """
//         return this.introducer


// prepareAnimation(
//     anim: Animation | mobject._AnimationBuilder,
// ) -> Animation:
//     r"""Returns either an unchanged animation, or the animation built
//     from a passed animation factory.

//     Examples
//     --------

//     ::

//         >>> from manim import Square, FadeIn
//         >>> s = Square()
//         >>> prepareAnimation(FadeIn(s))
//         FadeIn(Square)

//     ::

//         >>> prepareAnimation(s.animate.scale(2).rotate(42))
//         _MethodAnimation(Square)

//     ::

//         >>> prepareAnimation(42)
//         Traceback (most recent call last) {
//         ...
//         TypeError: Object 42 cannot be converted to an animation

//     """
//     if isinstance(anim, mobject._AnimationBuilder) {
//         return anim.build()

//     if isinstance(anim, openglMobject._AnimationBuilder) {
//         return anim.build()

//     if isinstance(anim, Animation) {
//         return anim

//     raise TypeError(f"Object {anim} cannot be converted to an animation")


// class Wait(Animation) {
//     """A "no operation" animation.

//     Parameters
//     ----------
//     runTime
//         The amount of time that should pass.
//     stopCondition
//         A function without positional arguments that evaluates to a boolean.
//         The function is evaluated after every new frame has been rendered.
//         Playing the animation only stops after the return value is truthy.
//         Overrides the specified ``runTime``.
//     frozenFrame
//         Controls whether or not the wait animation is static, i.e., corresponds
//         to a frozen frame. If ``False`` is passed, the render loop still
//         progresses through the animation as usual and (among other things)
//         continues to call updater functions. If ``None`` (the default value),
//         the :meth:`.Scene.play` call tries to determine whether the Wait call
//         can be static or not itself via :meth:`.Scene.shouldMobjectsUpdate`.
//     kwargs
//         Keyword arguments to be passed to the parent class, :class:`.Animation`.
//     """

//     _Init__(
//         this,
//         runTime: float = 1,
//         stopCondition: Callable[[], bool] | None = None,
//         frozenFrame: bool | None = None,
//         **kwargs,
//     ) {
//         if stopCondition and frozenFrame:
//             raise ValueError("A static Wait animation cannot have a stop condition.")

//         this.duration: float = runTime
//         this.stopCondition = stopCondition
//         this.isStaticWait: bool = frozenFrame
//         super()._Init__(None, runTime=runTime, **kwargs)
//         # quick fix to work in opengl setting:
//         this.mobject.shaderWrapperList = []

//     begin(this) -> None:
//         pass

//     finish(this) -> None:
//         pass

//     cleanUpFromScene(this, scene: Scene) -> None:
//         pass

//     updateMobjects(this, dt: float) -> None:
//         pass

//     interpolate(this, alpha: float) -> None:
//         pass


// overrideAnimation(
//     animationClass: type[Animation],
// ) -> Callable[[Callable], Callable]:
//     """Decorator used to mark methods as overrides for specific :class:`~.Animation` types.

//     Should only be used to decorate methods of classes derived from :class:`~.Mobject`.
//     ``Animation`` overrides get inherited to subclasses of the ``Mobject`` who defined
//     them. They don't override subclasses of the ``Animation`` they override.

//     See Also
//     --------
//     :meth:`~.Mobject.addAnimationOverride`

//     Parameters
//     ----------
//     animationClass
//         The animation to be overridden.

//     Returns
//     -------
//     Callable[[Callable], Callable]
//         The actual decorator. This marks the method as overriding an animation.

//     Examples
//     --------

//     .. manim:: OverrideAnimationExample

//         class MySquare(Square) {
//             @overrideAnimation(FadeIn)
//             FadeInOverride(this, **kwargs) {
//                 return Create(this, **kwargs)

//         class OverrideAnimationExample(Scene) {
//             construct(this) {
//                 this.play(FadeIn(MySquare()))

//     """

//     decorator(func) {
//         func.OverrideAnimation = animationClass
//         return func

//     return decorator
