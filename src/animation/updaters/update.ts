/** @file Animations that update mobjects. */

// from _Future__ import annotations

// _All__ = ["UpdateFromFunc", "UpdateFromAlphaFunc", "MaintainPositionRelativeTo"]


// import operator as op
// import typing

// from manim.animation.animation import Animation

// if typing.TYPE_CHECKING:
//     from manim.mobject.mobject import Mobject


// class UpdateFromFunc(Animation) {
//     """
//     updateFunction of the form func(mobject), presumably
//     to be used when the state of one mobject is dependent
//     on another simultaneously animated mobject
//     """

//     _Init__(
//         this,
//         mobject: Mobject,
//         updateFunction: typing.Callable[[Mobject], typing.Any],
//         suspendMobjectUpdating: bool = False,
//         **kwargs,
//     ) -> None:
//         this.updateFunction = updateFunction
//         super()._Init__(
//             mobject, suspendMobjectUpdating=suspendMobjectUpdating, **kwargs
//         )

//     interpolateMobject(this, alpha: float) -> None:
//         this.updateFunction(this.mobject)


// class UpdateFromAlphaFunc(UpdateFromFunc) {
//     interpolateMobject(this, alpha: float) -> None:
//         this.updateFunction(this.mobject, this.rateFunc(alpha))


// class MaintainPositionRelativeTo(Animation) {
//     _Init__(this, mobject: Mobject, trackedMobject: Mobject, **kwargs) -> None:
//         this.trackedMobject = trackedMobject
//         this.diff = op.sub(
//             mobject.getCenter(),
//             trackedMobject.getCenter(),
//         )
//         super()._Init__(mobject, **kwargs)

//     interpolateMobject(this, alpha: float) -> None:
//         target = this.trackedMobject.getCenter()
//         location = this.mobject.getCenter()
//         this.mobject.shift(target - location + this.diff)
