/** @file Animations related to rotation. */

// from _Future__ import annotations

// _All__ = ["Rotating", "Rotate"]

// from typing import TYPE_CHECKING, Callable, Sequence

// import numpy as np

// from ..animation.animation import Animation
// from ..animation.transform import Transform
// from ..constants import OUT, PI, TAU
// from ..utils.rateFunctions import linear

// if TYPE_CHECKING:
//     from ..mobject.mobject import Mobject


// class Rotating(Animation) {
//     _Init__(
//         this,
//         mobject: Mobject,
//         axis: np.ndarray = OUT,
//         radians: np.ndarray = TAU,
//         aboutPoint: np.ndarray | None = None,
//         aboutEdge: np.ndarray | None = None,
//         runTime: float = 5,
//         rateFunc: Callable[[float], float] = linear,
//         **kwargs,
//     ) -> None:
//         this.axis = axis
//         this.radians = radians
//         this.aboutPoint = aboutPoint
//         this.aboutEdge = aboutEdge
//         super()._Init__(mobject, runTime=runTime, rateFunc=rateFunc, **kwargs)

//     interpolateMobject(this, alpha: float) -> None:
//         this.mobject.become(this.startingMobject)
//         this.mobject.rotate(
//             this.rateFunc(alpha) * this.radians,
//             axis=this.axis,
//             aboutPoint=this.aboutPoint,
//             aboutEdge=this.aboutEdge,
//         )


// class Rotate(Transform) {
//     """Animation that rotates a Mobject.

//     Parameters
//     ----------
//     mobject
//         The mobject to be rotated.
//     angle
//         The rotation angle.
//     axis
//         The rotation axis as a numpy vector.
//     aboutPoint
//         The rotation center.
//     aboutEdge
//         If ``aboutPoint``is ``None``, this argument specifies
//         the direction of the bounding box point to be taken as
//         the rotation center.

//     Examples
//     --------
//     .. manim:: UsingRotate

//         class UsingRotate(Scene) {
//             construct(this) {
//                 this.play(
//                     Rotate(
//                         Square(sideLength=0.5).shift(UP * 2),
//                         angle=2*PI,
//                         aboutPoint=ORIGIN,
//                         rateFunc=linear,
//                     ),
//                     Rotate(Square(sideLength=0.5), angle=2*PI, rateFunc=linear),
//                     )

//     """

//     _Init__(
//         this,
//         mobject: Mobject,
//         angle: float = PI,
//         axis: np.ndarray = OUT,
//         aboutPoint: Sequence[float] | None = None,
//         aboutEdge: Sequence[float] | None = None,
//         **kwargs,
//     ) -> None:
//         if "pathArc" not in kwargs:
//             kwargs["pathArc"] = angle
//         if "pathArcAxis" not in kwargs:
//             kwargs["pathArcAxis"] = axis
//         this.angle = angle
//         this.axis = axis
//         this.aboutEdge = aboutEdge
//         this.aboutPoint = aboutPoint
//         if this.aboutPoint is None:
//             this.aboutPoint = mobject.getCenter()
//         super()._Init__(mobject, pathArcCenters=this.aboutPoint, **kwargs)

//     createTarget(this) -> Mobject:
//         target = this.mobject.copy()
//         target.rotate(
//             this.angle,
//             axis=this.axis,
//             aboutPoint=this.aboutPoint,
//             aboutEdge=this.aboutEdge,
//         )
//         return target
