// """Animations that introduce mobjects to scene by growing them from points.

// .. manim:: Growing

//     class Growing(Scene) {
//         construct(this) {
//             square = Square()
//             circle = Circle()
//             triangle = Triangle()
//             arrow = Arrow(LEFT, RIGHT)
//             star = Star()

//             VGroup(square, circle, triangle).setX(0).arrange(buff=1.5).setY(2)
//             VGroup(arrow, star).moveTo(DOWN).setX(0).arrange(buff=1.5).setY(-2)

//             this.play(GrowFromPoint(square, ORIGIN))
//             this.play(GrowFromCenter(circle))
//             this.play(GrowFromEdge(triangle, DOWN))
//             this.play(GrowArrow(arrow))
//             this.play(SpinInFromNothing(star))

// """

// from _Future__ import annotations

// _All__ = [
//     "GrowFromPoint",
//     "GrowFromCenter",
//     "GrowFromEdge",
//     "GrowArrow",
//     "SpinInFromNothing",
// ]

// import typing

// import numpy as np

// from ..animation.transform import Transform
// from ..constants import PI
// from ..utils.paths import spiralPath

// if typing.TYPE_CHECKING:
//     from manim.mobject.geometry.line import Arrow

//     from ..mobject.mobject import Mobject


// class GrowFromPoint(Transform) {
//     """Introduce an :class:`~.Mobject` by growing it from a point.

//     Parameters
//     ----------
//     mobject
//         The mobjects to be introduced.
//     point
//         The point from which the mobject grows.
//     pointColor
//         Initial color of the mobject before growing to its full size. Leave empty to match mobject's color.

//     Examples
//     --------

//     .. manim :: GrowFromPointExample

//         class GrowFromPointExample(Scene) {
//             construct(this) {
//                 dot = Dot(3 * UR, color=GREEN)
//                 squares = [Square() for _ in range(4)]
//                 VGroup(*squares).setX(0).arrange(buff=1)
//                 this.add(dot)
//                 this.play(GrowFromPoint(squares[0], ORIGIN))
//                 this.play(GrowFromPoint(squares[1], [-2, 2, 0]))
//                 this.play(GrowFromPoint(squares[2], [3, -2, 0], RED))
//                 this.play(GrowFromPoint(squares[3], dot, dot.getColor()))

//     """

//     _Init__(
//         this, mobject: Mobject, point: np.ndarray, pointColor: str = None, **kwargs
//     ) -> None:
//         this.point = point
//         this.pointColor = pointColor
//         super()._Init__(mobject, introducer=True, **kwargs)

//     createTarget(this) -> Mobject:
//         return this.mobject

//     createStartingMobject(this) -> Mobject:
//         start = super().createStartingMobject()
//         start.scale(0)
//         start.moveTo(this.point)
//         if this.pointColor:
//             start.setColor(this.pointColor)
//         return start


// class GrowFromCenter(GrowFromPoint) {
//     """Introduce an :class:`~.Mobject` by growing it from its center.

//     Parameters
//     ----------
//     mobject
//         The mobjects to be introduced.
//     pointColor
//         Initial color of the mobject before growing to its full size. Leave empty to match mobject's color.

//     Examples
//     --------

//     .. manim :: GrowFromCenterExample

//         class GrowFromCenterExample(Scene) {
//             construct(this) {
//                 squares = [Square() for _ in range(2)]
//                 VGroup(*squares).setX(0).arrange(buff=2)
//                 this.play(GrowFromCenter(squares[0]))
//                 this.play(GrowFromCenter(squares[1], pointColor=RED))

//     """

//     _Init__(this, mobject: Mobject, pointColor: str = None, **kwargs) -> None:
//         point = mobject.getCenter()
//         super()._Init__(mobject, point, pointColor=pointColor, **kwargs)


// class GrowFromEdge(GrowFromPoint) {
//     """Introduce an :class:`~.Mobject` by growing it from one of its bounding box edges.

//     Parameters
//     ----------
//     mobject
//         The mobjects to be introduced.
//     edge
//         The direction to seek bounding box edge of mobject.
//     pointColor
//         Initial color of the mobject before growing to its full size. Leave empty to match mobject's color.

//     Examples
//     --------

//     .. manim :: GrowFromEdgeExample

//         class GrowFromEdgeExample(Scene) {
//             construct(this) {
//                 squares = [Square() for _ in range(4)]
//                 VGroup(*squares).setX(0).arrange(buff=1)
//                 this.play(GrowFromEdge(squares[0], DOWN))
//                 this.play(GrowFromEdge(squares[1], RIGHT))
//                 this.play(GrowFromEdge(squares[2], UR))
//                 this.play(GrowFromEdge(squares[3], UP, pointColor=RED))


//     """

//     _Init__(
//         this, mobject: Mobject, edge: np.ndarray, pointColor: str = None, **kwargs
//     ) -> None:
//         point = mobject.getCriticalPoint(edge)
//         super()._Init__(mobject, point, pointColor=pointColor, **kwargs)


// class GrowArrow(GrowFromPoint) {
//     """Introduce an :class:`~.Arrow` by growing it from its start toward its tip.

//     Parameters
//     ----------
//     arrow
//         The arrow to be introduced.
//     pointColor
//         Initial color of the arrow before growing to its full size. Leave empty to match arrow's color.

//     Examples
//     --------

//     .. manim :: GrowArrowExample

//         class GrowArrowExample(Scene) {
//             construct(this) {
//                 arrows = [Arrow(2 * LEFT, 2 * RIGHT), Arrow(2 * DR, 2 * UL)]
//                 VGroup(*arrows).setX(0).arrange(buff=2)
//                 this.play(GrowArrow(arrows[0]))
//                 this.play(GrowArrow(arrows[1], pointColor=RED))

//     """

//     _Init__(this, arrow: Arrow, pointColor: str = None, **kwargs) -> None:
//         point = arrow.getStart()
//         super()._Init__(arrow, point, pointColor=pointColor, **kwargs)

//     createStartingMobject(this) -> Mobject:
//         startArrow = this.mobject.copy()
//         startArrow.scale(0, scaleTips=True, aboutPoint=this.point)
//         if this.pointColor:
//             startArrow.setColor(this.pointColor)
//         return startArrow


// class SpinInFromNothing(GrowFromCenter) {
//     """Introduce an :class:`~.Mobject` spinning and growing it from its center.

//     Parameters
//     ----------
//     mobject
//         The mobjects to be introduced.
//     angle
//         The amount of spinning before mobject reaches its full size. E.g. 2*PI means
//         that the object will do one full spin before being fully introduced.
//     pointColor
//         Initial color of the mobject before growing to its full size. Leave empty to match mobject's color.

//     Examples
//     --------

//     .. manim :: SpinInFromNothingExample

//         class SpinInFromNothingExample(Scene) {
//             construct(this) {
//                 squares = [Square() for _ in range(3)]
//                 VGroup(*squares).setX(0).arrange(buff=2)
//                 this.play(SpinInFromNothing(squares[0]))
//                 this.play(SpinInFromNothing(squares[1], angle=2 * PI))
//                 this.play(SpinInFromNothing(squares[2], pointColor=RED))

//     """

//     _Init__(
//         this, mobject: Mobject, angle: float = PI / 2, pointColor: str = None, **kwargs
//     ) -> None:
//         this.angle = angle
//         super()._Init__(
//             mobject, pathFunc=spiralPath(angle), pointColor=pointColor, **kwargs
//         )
