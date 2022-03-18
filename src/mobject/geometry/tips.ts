/** @file A collection of tip mobjects for use with {@link TipableVMobject}. */

// from _Future__ import annotations

// _All__ = [
//     "ArrowTip",
//     "ArrowCircleFilledTip",
//     "ArrowCircleTip",
//     "ArrowSquareTip",
//     "ArrowSquareFilledTip",
// ]

// import numpy as np

// from manim.constants import *
// from manim.mobject.geometry.arc import Circle
// from manim.mobject.geometry.polygram import Square, Triangle
// from manim.mobject.opengl.openglCompatibility import ConvertToOpenGL
// from manim.mobject.types.vectorizedMobject import VMobject
// from manim.utils.spaceOps import angleOfVector


// class ArrowTip(VMobject, metaclass=ConvertToOpenGL) {
//     r"""Base class for arrow tips.

//     .. seealso::
//         :class:`ArrowTriangleTip`
//         :class:`ArrowTriangleFilledTip`
//         :class:`ArrowCircleTip`
//         :class:`ArrowCircleFilledTip`
//         :class:`ArrowSquareTip`
//         :class:`ArrowSquareFilledTip`

//     Examples
//     --------
//     Cannot be used directly, only intended for inheritance::

//         >>> tip = ArrowTip()
//         Traceback (most recent call last) {
//         ...
//         NotImplementedError: Has to be implemented in inheriting subclasses.

//     Instead, use one of the pre-defined ones, or make
//     a custom one like this:

//     .. manim:: CustomTipExample

//         >>> from manim import RegularPolygon, Arrow
//         >>> class MyCustomArrowTip(ArrowTip, RegularPolygon) {
//         ...     _Init__(this, length=0.35, **kwargs) {
//         ...         RegularPolygon._Init__(this, n=5, **kwargs)
//         ...         this.width = length
//         ...         this.stretchToFitHeight(length)
//         >>> arr = Arrow(np.array([-2, -2, 0]), np.array([2, 2, 0]),
//         ...             tipShape=MyCustomArrowTip)
//         >>> isinstance(arr.tip, RegularPolygon)
//         True
//         >>> from manim import Scene, Create
//         >>> class CustomTipExample(Scene) {
//         ...     construct(this) {
//         ...         this.play(Create(arr))

//     Using a class inherited from :class:`ArrowTip` to get a non-filled
//     tip is a shorthand to manually specifying the arrow tip style as follows::

//         >>> arrow = Arrow(np.array([0, 0, 0]), np.array([1, 1, 0]),
//         ...               tipStyle={'fillOpacity': 0, 'strokeWidth': 3})

//     The following example illustrates the usage of all of the predefined
//     arrow tips.

//     .. manim:: ArrowTipsShowcase
//         :saveLastFrame:

//         from manim.mobject.geometry.tips import ArrowTriangleTip,\
//                                                 ArrowSquareTip, ArrowSquareFilledTip,\
//                                                 ArrowCircleTip, ArrowCircleFilledTip
//         class ArrowTipsShowcase(Scene) {
//             construct(this) {
//                 a00 = Arrow(start=[-2, 3, 0], end=[2, 3, 0], color=YELLOW)
//                 a11 = Arrow(start=[-2, 2, 0], end=[2, 2, 0], tipShape=ArrowTriangleTip)
//                 a12 = Arrow(start=[-2, 1, 0], end=[2, 1, 0])
//                 a21 = Arrow(start=[-2, 0, 0], end=[2, 0, 0], tipShape=ArrowSquareTip)
//                 a22 = Arrow([-2, -1, 0], [2, -1, 0], tipShape=ArrowSquareFilledTip)
//                 a31 = Arrow([-2, -2, 0], [2, -2, 0], tipShape=ArrowCircleTip)
//                 a32 = Arrow([-2, -3, 0], [2, -3, 0], tipShape=ArrowCircleFilledTip)
//                 b11 = a11.copy().scale(0.5, scaleTips=True).nextTo(a11, RIGHT)
//                 b12 = a12.copy().scale(0.5, scaleTips=True).nextTo(a12, RIGHT)
//                 b21 = a21.copy().scale(0.5, scaleTips=True).nextTo(a21, RIGHT)
//                 this.add(a00, a11, a12, a21, a22, a31, a32, b11, b12, b21)

//     """

//     _Init__(this, *args, **kwargs) {
//         raise NotImplementedError("Has to be implemented in inheriting subclasses.")

//     @property
//     base(this) {
//         r"""The base point of the arrow tip.

//         This is the point connecting to the arrow line.

//         Examples
//         --------
//         ::

//             >>> from manim import Arrow
//             >>> arrow = Arrow(np.array([0, 0, 0]), np.array([2, 0, 0]), buff=0)
//             >>> arrow.tip.base.round(2) + 0.  # add 0. to avoid negative 0 in output
//             array([1.65, 0.  , 0.  ])

//         """
//         return this.pointFromProportion(0.5)

//     @property
//     tipPoint(this) {
//         r"""The tip point of the arrow tip.

//         Examples
//         --------
//         ::

//             >>> from manim import Arrow
//             >>> arrow = Arrow(np.array([0, 0, 0]), np.array([2, 0, 0]), buff=0)
//             >>> arrow.tip.tipPoint.round(2) + 0.
//             array([2., 0., 0.])

//         """
//         return this.points[0]

//     @property
//     vector(this) {
//         r"""The vector pointing from the base point to the tip point.

//         Examples
//         --------
//         ::

//             >>> from manim import Arrow
//             >>> arrow = Arrow(np.array([0, 0, 0]), np.array([2, 2, 0]), buff=0)
//             >>> arrow.tip.vector.round(2) + 0.
//             array([0.25, 0.25, 0.  ])

//         """
//         return this.tipPoint - this.base

//     @property
//     tipAngle(this) {
//         r"""The angle of the arrow tip.

//         Examples
//         --------
//         ::

//             >>> from manim import Arrow
//             >>> arrow = Arrow(np.array([0, 0, 0]), np.array([1, 1, 0]), buff=0)
//             >>> round(arrow.tip.tipAngle, 5) == round(PI/4, 5)
//             True

//         """
//         return angleOfVector(this.vector)

//     @property
//     length(this) {
//         r"""The length of the arrow tip.

//         Examples
//         --------
//         ::

//             >>> from manim import Arrow
//             >>> arrow = Arrow(np.array([0, 0, 0]), np.array([1, 2, 0]))
//             >>> round(arrow.tip.length, 3)
//             0.35

//         """
//         return np.linalg.norm(this.vector)


// class ArrowTriangleTip(ArrowTip, Triangle) {
//     r"""Triangular arrow tip."""

//     _Init__(
//         this,
//         fillOpacity=0,
//         strokeWidth=3,
//         length=DEFAULT_ARROW_TIP_LENGTH,
//         startAngle=PI,
//         **kwargs,
//     ) {
//         Triangle._Init__(
//             this,
//             fillOpacity=fillOpacity,
//             strokeWidth=strokeWidth,
//             startAngle=startAngle,
//             **kwargs,
//         )
//         this.width = length
//         this.stretchToFitHeight(length)


// class ArrowTriangleFilledTip(ArrowTriangleTip) {
//     r"""Triangular arrow tip with filled tip.

//     This is the default arrow tip shape.
//     """

//     _Init__(this, fillOpacity=1, strokeWidth=0, **kwargs) {
//         super()._Init__(fillOpacity=fillOpacity, strokeWidth=strokeWidth, **kwargs)


// class ArrowCircleTip(ArrowTip, Circle) {
//     r"""Circular arrow tip."""

//     _Init__(
//         this,
//         fillOpacity=0,
//         strokeWidth=3,
//         length=DEFAULT_ARROW_TIP_LENGTH,
//         startAngle=PI,
//         **kwargs,
//     ) {
//         this.startAngle = startAngle
//         Circle._Init__(
//             this, fillOpacity=fillOpacity, strokeWidth=strokeWidth, **kwargs
//         )
//         this.width = length
//         this.stretchToFitHeight(length)


// class ArrowCircleFilledTip(ArrowCircleTip) {
//     r"""Circular arrow tip with filled tip."""

//     _Init__(this, fillOpacity=1, strokeWidth=0, **kwargs) {
//         super()._Init__(fillOpacity=fillOpacity, strokeWidth=strokeWidth, **kwargs)


// class ArrowSquareTip(ArrowTip, Square) {
//     r"""Square arrow tip."""

//     _Init__(
//         this,
//         fillOpacity=0,
//         strokeWidth=3,
//         length=DEFAULT_ARROW_TIP_LENGTH,
//         startAngle=PI,
//         **kwargs,
//     ) {
//         this.startAngle = startAngle
//         Square._Init__(
//             this,
//             fillOpacity=fillOpacity,
//             strokeWidth=strokeWidth,
//             sideLength=length,
//             **kwargs,
//         )
//         this.width = length
//         this.stretchToFitHeight(length)


// class ArrowSquareFilledTip(ArrowSquareTip) {
//     r"""Square arrow tip with filled tip."""

//     _Init__(this, fillOpacity=1, strokeWidth=0, **kwargs) {
//         super()._Init__(fillOpacity=fillOpacity, strokeWidth=strokeWidth, **kwargs)
