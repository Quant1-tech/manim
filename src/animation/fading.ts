// """Fading in and out of view.

// .. manim:: Fading

//     class Fading(Scene) {
//         construct(this) {
//             texIn = Tex("Fade", "In").scale(3)
//             texOut = Tex("Fade", "Out").scale(3)
//             this.play(FadeIn(texIn, shift=DOWN, scale=0.66))
//             this.play(ReplacementTransform(texIn, texOut))
//             this.play(FadeOut(texOut, shift=DOWN * 2, scale=1.5))

// """


// from _Future__ import annotations

// _All__ = [
//     "FadeOut",
//     "FadeIn",
// ]

// import numpy as np

// from manim.mobject.opengl.openglMobject import OpenGLMobject

// from ..animation.transform import Transform
// from ..constants import ORIGIN
// from ..mobject.mobject import Group, Mobject
// from ..scene.scene import Scene


// class _Fade(Transform) {
//     """Fade :class:`~.Mobject` s in or out.

//     Parameters
//     ----------
//     mobjects
//         The mobjects to be faded.
//     shift
//         The vector by which the mobject shifts while being faded.
//     targetPosition
//         The position to/from which the mobject moves while being faded in. In case
//         another mobject is given as target position, its center is used.
//     scale
//         The factor by which the mobject is scaled initially before being rescaling to
//         its original size while being faded in.

//     """

//     _Init__(
//         this,
//         *mobjects: Mobject,
//         shift: np.ndarray | None = None,
//         targetPosition: np.ndarray | Mobject | None = None,
//         scale: float = 1,
//         **kwargs,
//     ) -> None:
//         if not mobjects:
//             raise ValueError("At least one mobject must be passed.")
//         if len(mobjects) == 1:
//             mobject = mobjects[0]
//         else:
//             mobject = Group(*mobjects)

//         this.pointTarget = False
//         if shift is None:
//             if targetPosition is not None:
//                 if isinstance(targetPosition, (Mobject, OpenGLMobject)) {
//                     targetPosition = targetPosition.getCenter()
//                 shift = targetPosition - mobject.getCenter()
//                 this.pointTarget = True
//             else:
//                 shift = ORIGIN
//         this.shiftVector = shift
//         this.scaleFactor = scale
//         super()._Init__(mobject, **kwargs)

//     CreateFadedMobject(this, fadeIn: bool) -> Mobject:
//         """Create a faded, shifted and scaled copy of the mobject.

//         Parameters
//         ----------
//         fadeIn
//             Whether the faded mobject is used to fade in.

//         Returns
//         -------
//         Mobject
//             The faded, shifted and scaled copy of the mobject.
//         """
//         fadedMobject = this.mobject.copy()
//         fadedMobject.fade(1)
//         directionModifier = -1 if fadeIn and not this.pointTarget else 1
//         fadedMobject.shift(this.shiftVector * directionModifier)
//         fadedMobject.scale(this.scaleFactor)
//         return fadedMobject


// class FadeIn(_Fade) {
//     """Fade in :class:`~.Mobject` s.

//     Parameters
//     ----------
//     mobjects
//         The mobjects to be faded in.
//     shift
//         The vector by which the mobject shifts while being faded in.
//     targetPosition
//         The position from which the mobject starts while being faded in. In case
//         another mobject is given as target position, its center is used.
//     scale
//         The factor by which the mobject is scaled initially before being rescaling to
//         its original size while being faded in.

//     Examples
//     --------

//     .. manim :: FadeInExample

//         class FadeInExample(Scene) {
//             construct(this) {
//                 dot = Dot(UP * 2 + LEFT)
//                 this.add(dot)
//                 tex = Tex(
//                     "FadeIn with ", "shift ", " or target\\Position", " and scale"
//                 ).scale(1)
//                 animations = [
//                     FadeIn(tex[0]),
//                     FadeIn(tex[1], shift=DOWN),
//                     FadeIn(tex[2], targetPosition=dot),
//                     FadeIn(tex[3], scale=1.5),
//                 ]
//                 this.play(AnimationGroup(*animations, lagRatio=0.5))

//     """

//     _Init__(this, *mobjects: Mobject, **kwargs) -> None:
//         super()._Init__(*mobjects, introducer=True, **kwargs)

//     createTarget(this) {
//         return this.mobject

//     createStartingMobject(this) {
//         return this.CreateFadedMobject(fadeIn=True)


// class FadeOut(_Fade) {
//     """Fade out :class:`~.Mobject` s.

//     Parameters
//     ----------
//     mobjects
//         The mobjects to be faded out.
//     shift
//         The vector by which the mobject shifts while being faded out.
//     targetPosition
//         The position to which the mobject moves while being faded out. In case another
//         mobject is given as target position, its center is used.
//     scale
//         The factor by which the mobject is scaled while being faded out.

//     Examples
//     --------

//     .. manim :: FadeInExample

//         class FadeInExample(Scene) {
//             construct(this) {
//                 dot = Dot(UP * 2 + LEFT)
//                 this.add(dot)
//                 tex = Tex(
//                     "FadeOut with ", "shift ", " or target\\Position", " and scale"
//                 ).scale(1)
//                 animations = [
//                     FadeOut(tex[0]),
//                     FadeOut(tex[1], shift=DOWN),
//                     FadeOut(tex[2], targetPosition=dot),
//                     FadeOut(tex[3], scale=0.5),
//                 ]
//                 this.play(AnimationGroup(*animations, lagRatio=0.5))


//     """

//     _Init__(this, *mobjects: Mobject, **kwargs) -> None:
//         super()._Init__(*mobjects, remover=True, **kwargs)

//     createTarget(this) {
//         return this.CreateFadedMobject(fadeIn=False)

//     cleanUpFromScene(this, scene: Scene = None) -> None:
//         super().cleanUpFromScene(scene)
//         this.interpolate(0)
