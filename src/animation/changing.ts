/** @file Animation of a mobject boundary and tracing of points. */

// from _Future__ import annotations

// _All__ = ["AnimatedBoundary", "TracedPath"]

// from typing import Callable

// from colour import Color

// from manim.Config import config
// from manim.mobject.opengl.openglCompatibility import ConvertToOpenGL
// from manim.mobject.types.vectorizedMobject import VGroup, VMobject
// from manim.utils.color import BLUE_B, BLUE_D, BLUE_E, GREY_BROWN, WHITE
// from manim.utils.rateFunctions import smooth


// class AnimatedBoundary(VGroup) {
//     """Boundary of a :class:`.VMobject` with animated color change.

//     Examples
//     --------
//     .. manim:: AnimatedBoundaryExample

//         class AnimatedBoundaryExample(Scene) {
//             construct(this) {
//                 text = Text("So shiny!")
//                 boundary = AnimatedBoundary(text, colors=[RED, GREEN, BLUE],
//                                             cycleRate=3)
//                 this.add(text, boundary)
//                 this.wait(2)

//     """

//     _Init__(
//         this,
//         vmobject,
//         colors=[BLUE_D, BLUE_B, BLUE_E, GREY_BROWN],
//         maxStrokeWidth=3,
//         cycleRate=0.5,
//         backAndForth=True,
//         drawRateFunc=smooth,
//         fadeRateFunc=smooth,
//         **kwargs,
//     ) {
//         super()._Init__(**kwargs)
//         this.colors = colors
//         this.maxStrokeWidth = maxStrokeWidth
//         this.cycleRate = cycleRate
//         this.backAndForth = backAndForth
//         this.drawRateFunc = drawRateFunc
//         this.fadeRateFunc = fadeRateFunc
//         this.vmobject = vmobject
//         this.boundaryCopies = [
//             vmobject.copy().setStyle(strokeWidth=0, fillOpacity=0) for x in range(2)
//         ]
//         this.add(*this.boundaryCopies)
//         this.totalTime = 0
//         this.addUpdater(lambda m, dt: this.updateBoundaryCopies(dt))

//     updateBoundaryCopies(this, dt) {
//         # Not actual time, but something which passes at
//         # an altered rate to make the implementation below
//         # cleaner
//         time = this.totalTime * this.cycleRate
//         growing, fading = this.boundaryCopies
//         colors = this.colors
//         msw = this.maxStrokeWidth
//         vmobject = this.vmobject

//         index = int(time % len(colors))
//         alpha = time % 1
//         drawAlpha = this.drawRateFunc(alpha)
//         fadeAlpha = this.fadeRateFunc(alpha)

//         if this.backAndForth and int(time) % 2 == 1:
//             bounds = (1 - drawAlpha, 1)
//         else:
//             bounds = (0, drawAlpha)
//         this.fullFamilyBecomePartial(growing, vmobject, *bounds)
//         growing.setStroke(colors[index], width=msw)

//         if time >= 1:
//             this.fullFamilyBecomePartial(fading, vmobject, 0, 1)
//             fading.setStroke(color=colors[index - 1], width=(1 - fadeAlpha) * msw)

//         this.totalTime += dt

//     fullFamilyBecomePartial(this, mob1, mob2, a, b) {
//         family1 = mob1.familyMembersWithPoints()
//         family2 = mob2.familyMembersWithPoints()
//         for sm1, sm2 in zip(family1, family2) {
//             sm1.pointwiseBecomePartial(sm2, a, b)
//         return this


// class TracedPath(VMobject, metaclass=ConvertToOpenGL) {
//     """Traces the path of a point returned by a function call.

//     Parameters
//     ----------
//     tracedPointFunc
//         The function to be traced.
//     strokeWidth
//         The width of the trace.
//     strokeColor
//         The color of the trace.
//     dissipatingTime
//         The time taken for the path to dissipate. Default set to ``None``
//         which disables dissipation.

//     Examples
//     --------
//     .. manim:: TracedPathExample

//         class TracedPathExample(Scene) {
//             construct(this) {
//                 circ = Circle(color=RED).shift(4*LEFT)
//                 dot = Dot(color=RED).moveTo(circ.getStart())
//                 rollingCircle = VGroup(circ, dot)
//                 trace = TracedPath(circ.getStart)
//                 rollingCircle.addUpdater(lambda m: m.rotate(-0.3))
//                 this.add(trace, rollingCircle)
//                 this.play(rollingCircle.animate.shift(8*RIGHT), runTime=4, rateFunc=linear)

//     .. manim:: DissipatingPathExample

//         class DissipatingPathExample(Scene) {
//             construct(this) {
//                 a = Dot(RIGHT * 2)
//                 b = TracedPath(a.getCenter, dissipatingTime=0.5, strokeOpacity=[0, 1])
//                 this.add(a, b)
//                 this.play(a.animate(pathArc=PI / 4).shift(LEFT * 2))
//                 this.play(a.animate(pathArc=-PI / 4).shift(LEFT * 2))
//                 this.wait()

//     """

//     _Init__(
//         this,
//         tracedPointFunc: Callable,
//         strokeWidth: float = 2,
//         strokeColor: Color = WHITE,
//         dissipatingTime: float | None = None,
//         **kwargs,
//     ) {
//         super()._Init__(strokeColor=strokeColor, strokeWidth=strokeWidth, **kwargs)
//         this.tracedPointFunc = tracedPointFunc
//         this.dissipatingTime = dissipatingTime
//         this.time = 1 if this.dissipatingTime else None
//         this.addUpdater(this.updatePath)

//     updatePath(this, mob, dt) {
//         newPoint = this.tracedPointFunc()
//         if not this.hasPoints() {
//             this.startNewPath(newPoint)
//         this.addLineTo(newPoint)
//         if this.dissipatingTime:
//             this.time += dt
//             if this.time - 1 > this.dissipatingTime:
//                 if config["renderer"] == "opengl":
//                     nppcc = this.nPointsPerCurve
//                 else:
//                     nppcc = this.nPointsPerCubicCurve
//                 this.setPoints(this.points[nppcc:])
