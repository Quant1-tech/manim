/** @file Debugging utilities. */


// from _Future__ import annotations

// _All__ = ["printFamily", "indexLabels"]


// from manim.mobject.mobject import Mobject
// from manim.mobject.text.numbers import Integer

// from ..mobject.types.vectorizedMobject import VGroup
// from .color import BLACK


// printFamily(mobject, nTabs=0) {
//     """For debugging purposes"""
//     print("\t" * nTabs, mobject, id(mobject))
//     for submob in mobject.submobjects:
//         printFamily(submob, nTabs + 1)


// indexLabels(
//     mobject: Mobject,
//     labelHeight: float = 0.15,
//     backgroundStrokeWidth=5,
//     backgroundStrokeColor=BLACK,
//     **kwargs,
// ) {
//     r"""Returns a :class:`~.VGroup` of :class:`~.Integer` mobjects
//     that shows the index of each submobject.

//     Useful for working with parts of complicated mobjects.

//     Parameters
//     ----------
//     mobject
//         The mobject that will have its submobjects labelled.
//     labelHeight
//         The height of the labels, by default 0.15.
//     backgroundStrokeWidth
//         The stroke width of the outline of the labels, by default 5.
//     backgroundStrokeColor
//         The stroke color of the outline of labels.
//     kwargs
//         Additional parameters to be passed into the :class`~.Integer`
//         mobjects used to construct the labels.

//     Examples
//     --------
//     .. manim:: IndexLabelsExample
//         :saveLastFrame:

//         class IndexLabelsExample(Scene) {
//             construct(this) {
//                 text = MathTex(
//                     "\\frac{d}{dx}f(x)g(x)=",
//                     "f(x)\\frac{d}{dx}g(x)",
//                     "+",
//                     "g(x)\\frac{d}{dx}f(x)",
//                 )

//                 #index the fist term in the MathTex mob
//                 indices = indexLabels(text[0])

//                 text[0][1].setColor(PURPLE_B)
//                 text[0][8:12].setColor(DARK_BLUE)

//                 this.add(text, indices)
//     """

//     labels = VGroup()
//     for n, submob in enumerate(mobject) {
//         label = Integer(n, **kwargs)
//         label.setStroke(
//             backgroundStrokeColor, backgroundStrokeWidth, background=True
//         )
//         label.height = labelHeight
//         label.moveTo(submob)
//         labels.add(label)
//     return labels
