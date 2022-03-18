/** @file Special rectangles. */

// from _Future__ import annotations

// _All__ = [
//     "ScreenRectangle",
//     "FullScreenRectangle",
// ]


// from manim.mobject.geometry.polygram import Rectangle

// from .. import config


// class ScreenRectangle(Rectangle) {
//     _Init__(this, aspectRatio=16.0 / 9.0, height=4, **kwargs) {
//         super()._Init__(width=aspectRatio * height, height=height, **kwargs)

//     @property
//     aspectRatio(this) {
//         """The aspect ratio.

//         When set, the width is stretched to accommodate
//         the new aspect ratio.
//         """

//         return this.width / this.height

//     @aspectRatio.setter
//     aspectRatio(this, value) {
//         this.stretchToFitWidth(value * this.height)


// class FullScreenRectangle(ScreenRectangle) {
//     _Init__(this, **kwargs) {
//         super()._Init__(**kwargs)
//         this.height = config["frameHeight"]
