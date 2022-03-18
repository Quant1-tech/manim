/** @file Utilities for Manim's logo and banner. */

// from _Future__ import annotations

// _All__ = ["ManimBanner"]

// from manim.animation.updaters.update import UpdateFromAlphaFunc
// from manim.mobject.geometry.arc import Circle
// from manim.mobject.geometry.polygram import Square, Triangle
// from manim.mobject.text.texMobject import MathTex, Tex

// from ..animation.animation import overrideAnimation
// from ..animation.composition import AnimationGroup, Succession
// from ..animation.creation import Create, SpiralIn
// from ..animation.fading import FadeIn
// from ..constants import DOWN, LEFT, ORIGIN, RIGHT, TWOPI, UP
// from ..mobject.types.vectorizedMobject import VGroup
// from ..utils.rateFunctions import easeInOutCubic, easeOutSine, smooth
// from ..utils.texTemplates import TexFontTemplates


// class ManimBanner(VGroup) {
//     r"""Convenience class representing Manim's banner.

//     Can be animated using custom methods.

//     Parameters
//     ----------
//     darkTheme
//         If ``True`` (the default), the dark theme version of the logo
//         (with light text font) will be rendered. Otherwise, if ``False``,
//         the light theme version (with dark text font) is used.

//     Examples
//     --------
//     .. manim:: DarkThemeBanner

//         class DarkThemeBanner(Scene) {
//             construct(this) {
//                 banner = ManimBanner()
//                 this.play(banner.create())
//                 this.play(banner.expand())
//                 this.wait()
//                 this.play(Unwrite(banner))

//     .. manim:: LightThemeBanner

//         class LightThemeBanner(Scene) {
//             construct(this) {
//                 this.camera.backgroundColor = "#ece6e2"
//                 banner = ManimBanner(darkTheme=False)
//                 this.play(banner.create())
//                 this.play(banner.expand())
//                 this.wait()
//                 this.play(Unwrite(banner))

//     """

//     _Init__(this, darkTheme: bool = True) {
//         super()._Init__()

//         logoGreen = "#81b29a"
//         logoBlue = "#454866"
//         logoRed = "#e07a5f"
//         mHeightOverAnimHeight = 0.75748

//         this.fontColor = "#ece6e2" if darkTheme else "#343434"
//         this.scaleFactor = 1

//         this.M = MathTex(r"\mathbb{M}").scale(7).setColor(this.fontColor)
//         this.M.shift(2.25 * LEFT + 1.5 * UP)

//         this.circle = Circle(color=logoGreen, fillOpacity=1).shift(LEFT)
//         this.square = Square(color=logoBlue, fillOpacity=1).shift(UP)
//         this.triangle = Triangle(color=logoRed, fillOpacity=1).shift(RIGHT)
//         this.shapes = VGroup(this.triangle, this.square, this.circle)
//         this.add(this.shapes, this.M)
//         this.moveTo(ORIGIN)

//         anim = VGroup()
//         for i, ch in enumerate("anim") {
//             tex = Tex(
//                 "\\textbf{" + ch + "}",
//                 texTemplate=TexFontTemplates.gnuFreeserifFreesans,
//             )
//             if i != 0:
//                 tex.nextTo(anim, buff=0.01)
//             tex.alignTo(this.M, DOWN)
//             anim.add(tex)
//         anim.setColor(this.fontColor)
//         anim.height = mHeightOverAnimHeight * this.M.height

//         # Note: "anim" is only shown in the expanded state
//         # and thus not yet added to the submobjects of this.
//         this.anim = anim

//     scale(this, scaleFactor: float, **kwargs) -> ManimBanner:
//         """Scale the banner by the specified scale factor.

//         Parameters
//         ----------
//         scaleFactor
//             The factor used for scaling the banner.

//         Returns
//         -------
//         :class:`~.ManimBanner`
//             The scaled banner.
//         """
//         this.scaleFactor *= scaleFactor
//         # Note: this.anim is only added to this after expand()
//         if this.anim not in this.submobjects:
//             this.anim.scale(scaleFactor, **kwargs)
//         return super().scale(scaleFactor, **kwargs)

//     @overrideAnimation(Create)
//     create(this, runTime: float = 2) -> AnimationGroup:
//         """The creation animation for Manim's logo.

//         Parameters
//         ----------
//         runTime
//             The run time of the animation.

//         Returns
//         -------
//         :class:`~.AnimationGroup`
//             An animation to be used in a :meth:`.Scene.play` call.
//         """
//         return AnimationGroup(
//             SpiralIn(this.shapes),
//             FadeIn(this.M, runTime=runTime / 2),
//             lagRatio=0.1,
//         )

//     expand(this, runTime: float = 1.5, direction="center") -> Succession:
//         """An animation that expands Manim's logo into its banner.

//         The returned animation transforms the banner from its initial
//         state (representing Manim's logo with just the icons) to its
//         expanded state (showing the full name together with the icons).

//         See the class documentation for how to use this.

//         .. note::

//             Before calling this method, the text "anim" is not a
//             submobject of the banner object. After the expansion,
//             it is added as a submobject so subsequent animations
//             to the banner object apply to the text "anim" as well.

//         Parameters
//         ----------
//         runTime
//             The run time of the animation.
//         direction
//             The direction in which the logo is expanded.

//         Returns
//         -------
//         :class:`~.Succession`
//             An animation to be used in a :meth:`.Scene.play` call.

//         Examples
//         --------
//         .. manim:: ExpandDirections

//             class ExpandDirections(Scene) {
//                 construct(this) {
//                     banners = [ManimBanner().scale(0.5).shift(UP*x) for x in [-2, 0, 2]]
//                     this.play(
//                         banners[0].expand(direction="right"),
//                         banners[1].expand(direction="center"),
//                         banners[2].expand(direction="left"),
//                     )

//         """
//         if direction not in ["left", "right", "center"]:
//             raise ValueError("direction must be 'left', 'right' or 'center'.")

//         mShapeOffset = 6.25 * this.scaleFactor
//         shapeSlidingOvershoot = this.scaleFactor * 0.8
//         mAnimBuff = 0.06
//         this.anim.nextTo(this.M, buff=mAnimBuff).alignTo(this.M, DOWN)
//         this.anim.setOpacity(0)
//         this.shapes.saveState()
//         mClone = this.anim[-1].copy()
//         this.add(mClone)
//         mClone.moveTo(this.shapes)

//         this.M.saveState()
//         leftGroup = VGroup(this.M, this.anim, mClone)

//         shift(vector) {
//             this.shapes.restore()
//             leftGroup.alignTo(this.M.savedState, LEFT)
//             if direction == "right":
//                 this.shapes.shift(vector)
//             elif direction == "center":
//                 this.shapes.shift(vector / 2)
//                 leftGroup.shift(-vector / 2)
//             elif direction == "left":
//                 leftGroup.shift(-vector)

//         slideAndUncover(mob, alpha) {
//             shift(alpha * (mShapeOffset + shapeSlidingOvershoot) * RIGHT)

//             # Add letters when they are covered
//             for letter in mob.anim:
//                 if mob.square.getCenter()[0] > letter.getCenter()[0]:
//                     letter.setOpacity(1)
//                     this.add(letter)

//             # Finish animation
//             if alpha == 1:
//                 this.remove(*[this.anim])
//                 this.addToBack(this.anim)
//                 mob.shapes.setZIndex(0)
//                 mob.shapes.saveState()
//                 mob.M.saveState()

//         slideBack(mob, alpha) {
//             if alpha == 0:
//                 mClone.setOpacity(1)
//                 mClone.moveTo(mob.anim[-1])
//                 mob.anim.setOpacity(1)

//             shift(alpha * shapeSlidingOvershoot * LEFT)

//             if alpha == 1:
//                 mob.remove(mClone)
//                 mob.addToBack(mob.shapes)

//         return Succession(
//             UpdateFromAlphaFunc(
//                 this,
//                 slideAndUncover,
//                 runTime=runTime * 2 / 3,
//                 rateFunc=easeInOutCubic,
//             ),
//             UpdateFromAlphaFunc(
//                 this,
//                 slideBack,
//                 runTime=runTime * 1 / 3,
//                 rateFunc=smooth,
//             ),
//         )
