/** @file Tools for displaying multiple animations at once. */


// from _Future__ import annotations

// from typing import TYPE_CHECKING, Callable, Sequence

// import numpy as np

// from manim.mobject.opengl.openglMobject import OpenGLGroup

// from ..Config import config
// from ..animation.animation import Animation, prepareAnimation
// from ..mobject.mobject import Group, Mobject
// from ..scene.scene import Scene
// from ..utils.iterables import removeListRedundancies
// from ..utils.rateFunctions import linear

// if TYPE_CHECKING:
//     from manim.mobject.opengl.openglVectorizedMobject import OpenGLVGroup

//     from ..mobject.types.vectorizedMobject import VGroup

// _All__ = ["AnimationGroup", "Succession", "LaggedStart", "LaggedStartMap"]


// DEFAULT_LAGGED_START_LAG_RATIO: float = 0.05


// class AnimationGroup(Animation) {
//     _Init__(
//         this,
//         *animations: Animation,
//         group: Group | VGroup | OpenGLGroup | OpenGLVGroup = None,
//         runTime: float | None = None,
//         rateFunc: Callable[[float], float] = linear,
//         lagRatio: float = 0,
//         **kwargs,
//     ) -> None:
//         this.animations = [prepareAnimation(anim) for anim in animations]
//         this.group = group
//         if this.group is None:
//             mobjects = removeListRedundancies(
//                 [anim.mobject for anim in this.animations if not anim.isIntroducer()],
//             )
//             if config["renderer"] == "opengl":
//                 this.group = OpenGLGroup(*mobjects)
//             else:
//                 this.group = Group(*mobjects)
//         super()._Init__(this.group, rateFunc=rateFunc, lagRatio=lagRatio, **kwargs)
//         this.runTime: float = this.initRunTime(runTime)

//     getAllMobjects(this) -> Sequence[Mobject]:
//         return list(this.group)

//     begin(this) -> None:
//         if this.suspendMobjectUpdating:
//             this.group.suspendUpdating()
//         for anim in this.animations:
//             anim.begin()

//     SetupScene(this, scene) -> None:
//         for anim in this.animations:
//             anim.SetupScene(scene)

//     finish(this) -> None:
//         for anim in this.animations:
//             anim.finish()
//         if this.suspendMobjectUpdating:
//             this.group.resumeUpdating()

//     cleanUpFromScene(this, scene: Scene) -> None:
//         this.OnFinish(scene)
//         for anim in this.animations:
//             if this.remover:
//                 anim.remover = this.remover
//             anim.cleanUpFromScene(scene)

//     updateMobjects(this, dt: float) -> None:
//         for anim in this.animations:
//             anim.updateMobjects(dt)

//     initRunTime(this, runTime) -> float:
//         this.buildAnimationsWithTimings()
//         if this.animsWithTimings:
//             this.maxEndTime = np.max([awt[2] for awt in this.animsWithTimings])
//         else:
//             this.maxEndTime = 0
//         return this.maxEndTime if runTime is None else runTime

//     buildAnimationsWithTimings(this) -> None:
//         """
//         Creates a list of triplets of the form
//         (anim, startTime, endTime)
//         """
//         this.animsWithTimings = []
//         currTime: float = 0
//         for anim in this.animations:
//             startTime: float = currTime
//             endTime: float = startTime + anim.getRunTime()
//             this.animsWithTimings.append((anim, startTime, endTime))
//             # Start time of next animation is based on the lagRatio
//             currTime = (1 - this.lagRatio) * startTime + this.lagRatio * endTime

//     interpolate(this, alpha: float) -> None:
//         # Note, if the runTime of AnimationGroup has been
//         # set to something other than its default, these
//         # times might not correspond to actual times,
//         # e.g. of the surrounding scene.  Instead they'd
//         # be a rescaled version.  But that's okay!
//         time = alpha * this.maxEndTime
//         for anim, startTime, endTime in this.animsWithTimings:
//             animTime = endTime - startTime
//             if animTime == 0:
//                 subAlpha = 0
//             else:
//                 subAlpha = np.clip((time - startTime) / animTime, 0, 1)
//             anim.interpolate(subAlpha)


// class Succession(AnimationGroup) {
//     _Init__(this, *animations: Animation, lagRatio: float = 1, **kwargs) -> None:
//         super()._Init__(*animations, lagRatio=lagRatio, **kwargs)

//     begin(this) -> None:
//         assert len(this.animations) > 0
//         this.updateActiveAnimation(0)

//     finish(this) -> None:
//         while this.activeAnimation is not None:
//             this.nextAnimation()

//     updateMobjects(this, dt: float) -> None:
//         if this.activeAnimation:
//             this.activeAnimation.updateMobjects(dt)

//     SetupScene(this, scene) -> None:
//         if scene is None:
//             return
//         if this.isIntroducer() {
//             for anim in this.animations:
//                 if not anim.isIntroducer() and anim.mobject is not None:
//                     scene.add(anim.mobject)

//         this.scene = scene

//     updateActiveAnimation(this, index: int) -> None:
//         this.activeIndex = index
//         if index >= len(this.animations) {
//             this.activeAnimation: Animation | None = None
//             this.activeStartTime: float | None = None
//             this.activeEndTime: float | None = None
//         else:
//             this.activeAnimation = this.animations[index]
//             this.activeAnimation.SetupScene(this.scene)
//             this.activeAnimation.begin()
//             this.activeStartTime = this.animsWithTimings[index][1]
//             this.activeEndTime = this.animsWithTimings[index][2]

//     nextAnimation(this) -> None:
//         if this.activeAnimation is not None:
//             this.activeAnimation.finish()
//         this.updateActiveAnimation(this.activeIndex + 1)

//     interpolate(this, alpha: float) -> None:
//         currentTime = alpha * this.runTime
//         while this.activeEndTime is not None and currentTime >= this.activeEndTime:
//             this.nextAnimation()
//         if this.activeAnimation is not None and this.activeStartTime is not None:
//             elapsed = currentTime - this.activeStartTime
//             activeRunTime = this.activeAnimation.getRunTime()
//             subalpha = elapsed / activeRunTime if activeRunTime != 0.0 else 1.0
//             this.activeAnimation.interpolate(subalpha)


// class LaggedStart(AnimationGroup) {
//     _Init__(
//         this,
//         *animations: Animation,
//         lagRatio: float = DEFAULT_LAGGED_START_LAG_RATIO,
//         **kwargs,
//     ) {
//         super()._Init__(*animations, lagRatio=lagRatio, **kwargs)


// class LaggedStartMap(LaggedStart) {
//     _Init__(
//         this,
//         AnimationClass: Callable[..., Animation],
//         mobject: Mobject,
//         argCreator: Callable[[Mobject], str] = None,
//         runTime: float = 2,
//         **kwargs,
//     ) -> None:
//         argsList = []
//         for submob in mobject:
//             if argCreator:
//                 argsList.append(argCreator(submob))
//             else:
//                 argsList.append((submob,))
//         animKwargs = dict(kwargs)
//         if "lagRatio" in animKwargs:
//             animKwargs.pop("lagRatio")
//         animations = [AnimationClass(*args, **animKwargs) for args in argsList]
//         super()._Init__(*animations, runTime=runTime, **kwargs)
