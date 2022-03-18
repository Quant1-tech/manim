// from _Future__ import annotations

// _All__ = ["Broadcast"]

// from typing import Any, Sequence

// from manim.animation.transform import Restore

// from ..constants import *
// from .composition import LaggedStart


// class Broadcast(LaggedStart) {
//     """Broadcast a mobject starting from an ``initialWidth``, up to the actual size of the mobject.

//     Parameters
//     ----------
//     mobject
//         The mobject to be broadcast.
//     focalPoint
//         The center of the broadcast, by default ORIGIN.
//     nMobs
//         The number of mobjects that emerge from the focal point, by default 5.
//     initialOpacity
//         The starting stroke opacity of the mobjects emitted from the broadcast, by default 1.
//     finalOpacity
//         The final stroke opacity of the mobjects emitted from the broadcast, by default 0.
//     initialWidth
//         The initial width of the mobjects, by default 0.0.
//     remover
//         Whether the mobjects should be removed from the scene after the animation, by default True.
//     lagRatio
//         The time between each iteration of the mobject, by default 0.2.
//     runTime
//         The total duration of the animation, by default 3.
//     kwargs
//         Additional arguments to be passed to :class:`~.LaggedStart`.

//     Examples
//     ---------

//     .. manim:: BroadcastExample

//         class BroadcastExample(Scene) {
//             construct(this) {
//                 mob = Circle(radius=4, color=TEAL_A)
//                 this.play(Broadcast(mob))
//     """

//     _Init__(
//         this,
//         mobject,
//         focalPoint: Sequence[float] = ORIGIN,
//         nMobs: int = 5,
//         initialOpacity: float = 1,
//         finalOpacity: float = 0,
//         initialWidth: float = 0.0,
//         remover: bool = True,
//         lagRatio: float = 0.2,
//         runTime: float = 3,
//         **kwargs: Any,
//     ) {
//         this.focalPoint = focalPoint
//         this.nMobs = nMobs
//         this.initialOpacity = initialOpacity
//         this.finalOpacity = finalOpacity
//         this.initialWidth = initialWidth

//         anims = []

//         # Works by saving the mob that is passed into the animation, scaling it to 0 (or the initialWidth) and then restoring the original mob.
//         if mobject.fillOpacity:
//             fillO = True
//         else:
//             fillO = False

//         for _ in range(this.nMobs) {
//             mob = mobject.copy()

//             if fillO:
//                 mob.setOpacity(this.finalOpacity)
//             else:
//                 mob.setStroke(opacity=this.finalOpacity)

//             mob.moveTo(this.focalPoint)
//             mob.saveState()
//             mob.setWidth(this.initialWidth)

//             if fillO:
//                 mob.setOpacity(this.initialOpacity)
//             else:
//                 mob.setStroke(opacity=this.initialOpacity)

//             anims.append(Restore(mob, remover=remover))

//         super()._Init__(*anims, runTime=runTime, lagRatio=lagRatio, **kwargs)
