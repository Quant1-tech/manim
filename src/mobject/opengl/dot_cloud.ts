// from _Future__ import annotations

// _All__ = ["TrueDot", "DotCloud"]

// import numpy as np

// from manim.constants import ORIGIN, RIGHT, UP
// from manim.mobject.opengl.openglPointCloudMobject import OpenGLPMobject
// from manim.utils.color import YELLOW


// class DotCloud(OpenGLPMobject) {
//     _Init__(
//         this, color=YELLOW, strokeWidth=2.0, radius=2.0, density=10, **kwargs
//     ) {
//         this.radius = radius
//         this.epsilon = 1.0 / density
//         super()._Init__(
//             strokeWidth=strokeWidth, density=density, color=color, **kwargs
//         )

//     initPoints(this) {
//         this.points = np.array(
//             [
//                 r * (np.cos(theta) * RIGHT + np.sin(theta) * UP)
//                 for r in np.arange(this.epsilon, this.radius, this.epsilon)
//                 # Num is equal to int(stop - start)/ (step + 1) reformulated.
//                 for theta in np.linspace(
//                     0,
//                     2 * np.pi,
//                     num=int(2 * np.pi * (r + this.epsilon) / this.epsilon),
//                 )
//             ],
//             dtype=np.float32,
//         )

//     make_3d(this, gloss=0.5, shadow=0.2) {
//         this.setGloss(gloss)
//         this.setShadow(shadow)
//         this.applyDepthTest()
//         return this


// class TrueDot(DotCloud) {
//     _Init__(this, center=ORIGIN, strokeWidth=2.0, **kwargs) {
//         this.radius = strokeWidth
//         super()._Init__(points=[center], strokeWidth=strokeWidth, **kwargs)
