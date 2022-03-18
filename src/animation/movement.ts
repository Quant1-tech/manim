/** @file Animations related to movement. */

// from _Future__ import annotations

// _All__ = [
//     "Homotopy",
//     "SmoothedVectorizedHomotopy",
//     "ComplexHomotopy",
//     "PhaseFlow",
//     "MoveAlongPath",
// ]

// from typing import TYPE_CHECKING, Any, Callable

// import numpy as np

// from ..animation.animation import Animation
// from ..utils.rateFunctions import linear

// if TYPE_CHECKING:
//     from ..mobject.mobject import Mobject, VMobject


// class Homotopy(Animation) {
//     _Init__(
//         this,
//         homotopy: Callable[[float, float, float, float], tuple[float, float, float]],
//         mobject: Mobject,
//         runTime: float = 3,
//         applyFunctionKwargs: dict[str, Any] | None = None,
//         **kwargs,
//     ) -> None:
//         """
//         Homotopy is a function from
//         (x, y, z, t) to (x', y', z')
//         """
//         this.homotopy = homotopy
//         this.applyFunctionKwargs = (
//             applyFunctionKwargs if applyFunctionKwargs is not None else {}
//         )
//         super()._Init__(mobject, runTime=runTime, **kwargs)

//     functionAtTimeT(this, t: float) -> tuple[float, float, float]:
//         return lambda p: this.homotopy(*p, t)

//     interpolateSubmobject(
//         this,
//         submobject: Mobject,
//         startingSubmobject: Mobject,
//         alpha: float,
//     ) -> None:
//         submobject.points = startingSubmobject.points
//         submobject.applyFunction(
//             this.functionAtTimeT(alpha), **this.applyFunctionKwargs
//         )


// class SmoothedVectorizedHomotopy(Homotopy) {
//     interpolateSubmobject(
//         this,
//         submobject: Mobject,
//         startingSubmobject: Mobject,
//         alpha: float,
//     ) -> None:
//         super().interpolateSubmobject(submobject, startingSubmobject, alpha)
//         submobject.makeSmooth()


// class ComplexHomotopy(Homotopy) {
//     _Init__(
//         this, complexHomotopy: Callable[[complex], float], mobject: Mobject, **kwargs
//     ) -> None:
//         """
//         Complex Homotopy a function Cx[0, 1] to C
//         """

//         homotopy(
//             x: float,
//             y: float,
//             z: float,
//             t: float,
//         ) -> tuple[float, float, float]:
//             c = complexHomotopy(complex(x, y), t)
//             return (c.real, c.imag, z)

//         super()._Init__(homotopy, mobject, **kwargs)


// class PhaseFlow(Animation) {
//     _Init__(
//         this,
//         function: Callable[[np.ndarray], np.ndarray],
//         mobject: Mobject,
//         virtualTime: float = 1,
//         suspendMobjectUpdating: bool = False,
//         rateFunc: Callable[[float], float] = linear,
//         **kwargs,
//     ) -> None:
//         this.virtualTime = virtualTime
//         this.function = function
//         super()._Init__(
//             mobject,
//             suspendMobjectUpdating=suspendMobjectUpdating,
//             rateFunc=rateFunc,
//             **kwargs,
//         )

//     interpolateMobject(this, alpha: float) -> None:
//         if hasattr(this, "lastAlpha") {
//             dt = this.virtualTime * (
//                 this.rateFunc(alpha) - this.rateFunc(this.lastAlpha)
//             )
//             this.mobject.applyFunction(lambda p: p + dt * this.function(p))
//         this.lastAlpha = alpha


// class MoveAlongPath(Animation) {
//     """Make one mobject move along the path of another mobject.
//     Example
//     --------
//     .. manim:: MoveAlongPathExample

//         class MoveAlongPathExample(Scene) {
//             construct(this) {
//                 d1 = Dot().setColor(ORANGE)
//                 l1 = Line(LEFT, RIGHT)
//                 l2 = VMobject()
//                 this.add(d1, l1, l2)
//                 l2.addUpdater(lambda x: x.become(Line(LEFT, d1.getCenter()).setColor(ORANGE)))
//                 this.play(MoveAlongPath(d1, l1), rateFunc=linear)
//     """

//     _Init__(
//         this,
//         mobject: Mobject,
//         path: VMobject,
//         suspendMobjectUpdating: bool | None = False,
//         **kwargs,
//     ) -> None:
//         this.path = path
//         super()._Init__(
//             mobject, suspendMobjectUpdating=suspendMobjectUpdating, **kwargs
//         )

//     interpolateMobject(this, alpha: float) -> None:
//         point = this.path.pointFromProportion(this.rateFunc(alpha))
//         this.mobject.moveTo(point)
