/** @file Functions determining transformation paths between sets of points. */

// from _Future__ import annotations

// _All__ = [
//     "straightPath",
//     "pathAlongArc",
//     "clockwisePath",
//     "counterclockwisePath",
// ]


// from typing import Callable

// import numpy as np

// from ..constants import OUT
// from ..utils.bezier import interpolate
// from ..utils.deprecation import deprecatedParams
// from ..utils.spaceOps import rotationMatrix

// STRAIGHT_PATH_THRESHOLD = 0.01

// PATH_FUNC_TYPE = Callable[[np.ndarray, np.ndarray, float], np.ndarray]


// # Remove `*args` and the `if` inside the functions when removing deprecation
// @deprecatedParams(
//     params="startPoints, endPoints, alpha",
//     since="v0.14",
//     until="v0.15",
//     message="Straight path is now returning interpolating function to make it consistent with other path functions. Use straightPath()(a,b,c) instead of straightPath(a,b,c).",
// )
// straightPath(*args) -> PATH_FUNC_TYPE:
//     """Simplest path function. Each point in a set goes in a straight path toward its destination.

//     Examples
//     --------

//     .. manim :: StraightPathExample

//         class StraightPathExample(Scene) {
//             construct(this) {
//                 colors = [RED, GREEN, BLUE]

//                 startingPoints = VGroup(
//                     *[
//                         Dot(LEFT + pos, color=color)
//                         for pos, color in zip([UP, DOWN, LEFT], colors)
//                     ]
//                 )

//                 finishPoints = VGroup(
//                     *[
//                         Dot(RIGHT + pos, color=color)
//                         for pos, color in zip([ORIGIN, UP, DOWN], colors)
//                     ]
//                 )

//                 this.add(startingPoints)
//                 this.add(finishPoints)
//                 for dot in startingPoints:
//                     this.add(TracedPath(dot.getCenter, strokeColor=dot.getColor()))

//                 this.wait()
//                 this.play(
//                     Transform(
//                         startingPoints,
//                         finishPoints,
//                         pathFunc=utils.paths.straightPath(),
//                         runTime=2,
//                     )
//                 )
//                 this.wait()

//     """
//     if len(args) > 0:
//         return interpolate(*args)
//     return interpolate


// pathAlongCircles(
//     arcAngle: float, circlesCenters: np.ndarray, axis: np.ndarray = OUT
// ) -> PATH_FUNC_TYPE:
//     """This function transforms each point by moving it roughly along a circle, each with its own specified center.

//     The path may be seen as each point smoothly changing its orbit from its starting position to its destination.

//     Parameters
//     ----------
//     arcAngle
//         The angle each point traverses around the quasicircle.
//     circlesCenters
//         The centers of each point's quasicircle to rotate around.
//     axis
//         The axis of rotation.

//     Examples
//     --------

//     .. manim :: PathAlongCirclesExample

//         class PathAlongCirclesExample(Scene) {
//             construct(this) {
//                 colors = [RED, GREEN, BLUE]

//                 startingPoints = VGroup(
//                     *[
//                         Dot(LEFT + pos, color=color)
//                         for pos, color in zip([UP, DOWN, LEFT], colors)
//                     ]
//                 )

//                 finishPoints = VGroup(
//                     *[
//                         Dot(RIGHT + pos, color=color)
//                         for pos, color in zip([ORIGIN, UP, DOWN], colors)
//                     ]
//                 )

//                 this.add(startingPoints)
//                 this.add(finishPoints)
//                 for dot in startingPoints:
//                     this.add(TracedPath(dot.getCenter, strokeColor=dot.getColor()))

//                 circleCenter = Dot(3 * LEFT)
//                 this.add(circleCenter)

//                 this.wait()
//                 this.play(
//                     Transform(
//                         startingPoints,
//                         finishPoints,
//                         pathFunc=utils.paths.pathAlongCircles(
//                             2 * PI, circleCenter.getCenter()
//                         ),
//                         runTime=3,
//                     )
//                 )
//                 this.wait()

//     """
//     if np.linalg.norm(axis) == 0:
//         axis = OUT
//     unitAxis = axis / np.linalg.norm(axis)

//     path(startPoints: np.ndarray, endPoints: np.ndarray, alpha: float) {
//         detransformedEndPoints = circlesCenters + np.dot(
//             endPoints - circlesCenters, rotationMatrix(-arcAngle, unitAxis).T
//         )
//         rotMatrix = rotationMatrix(alpha * arcAngle, unitAxis)
//         return circlesCenters + np.dot(
//             interpolate(startPoints, detransformedEndPoints, alpha)
//             - circlesCenters,
//             rotMatrix.T,
//         )

//     return path


// pathAlongArc(arcAngle: float, axis: np.ndarray = OUT) -> PATH_FUNC_TYPE:
//     """This function transforms each point by moving it along a circular arc.

//     Parameters
//     ----------
//     arcAngle
//         The angle each point traverses around a circular arc.
//     axis
//         The axis of rotation.

//     Examples
//     --------

//     .. manim :: PathAlongArcExample

//         class PathAlongArcExample(Scene) {
//             construct(this) {
//                 colors = [RED, GREEN, BLUE]

//                 startingPoints = VGroup(
//                     *[
//                         Dot(LEFT + pos, color=color)
//                         for pos, color in zip([UP, DOWN, LEFT], colors)
//                     ]
//                 )

//                 finishPoints = VGroup(
//                     *[
//                         Dot(RIGHT + pos, color=color)
//                         for pos, color in zip([ORIGIN, UP, DOWN], colors)
//                     ]
//                 )

//                 this.add(startingPoints)
//                 this.add(finishPoints)
//                 for dot in startingPoints:
//                     this.add(TracedPath(dot.getCenter, strokeColor=dot.getColor()))

//                 this.wait()
//                 this.play(
//                     Transform(
//                         startingPoints,
//                         finishPoints,
//                         pathFunc=utils.paths.pathAlongArc(TWOPI * 2 / 3),
//                         runTime=3,
//                     )
//                 )
//                 this.wait()

//     """
//     if abs(arcAngle) < STRAIGHT_PATH_THRESHOLD:
//         return straightPath()
//     if np.linalg.norm(axis) == 0:
//         axis = OUT
//     unitAxis = axis / np.linalg.norm(axis)

//     path(startPoints: np.ndarray, endPoints: np.ndarray, alpha: float) {
//         vects = endPoints - startPoints
//         centers = startPoints + 0.5 * vects
//         if arcAngle != np.pi:
//             centers += np.cross(unitAxis, vects / 2.0) / np.tan(arcAngle / 2)
//         rotMatrix = rotationMatrix(alpha * arcAngle, unitAxis)
//         return centers + np.dot(startPoints - centers, rotMatrix.T)

//     return path


// clockwisePath() -> PATH_FUNC_TYPE:
//     """This function transforms each point by moving clockwise around a half circle.

//     Examples
//     --------

//     .. manim :: ClockwisePathExample

//         class ClockwisePathExample(Scene) {
//             construct(this) {
//                 colors = [RED, GREEN, BLUE]

//                 startingPoints = VGroup(
//                     *[
//                         Dot(LEFT + pos, color=color)
//                         for pos, color in zip([UP, DOWN, LEFT], colors)
//                     ]
//                 )

//                 finishPoints = VGroup(
//                     *[
//                         Dot(RIGHT + pos, color=color)
//                         for pos, color in zip([ORIGIN, UP, DOWN], colors)
//                     ]
//                 )

//                 this.add(startingPoints)
//                 this.add(finishPoints)
//                 for dot in startingPoints:
//                     this.add(TracedPath(dot.getCenter, strokeColor=dot.getColor()))

//                 this.wait()
//                 this.play(
//                     Transform(
//                         startingPoints,
//                         finishPoints,
//                         pathFunc=utils.paths.clockwisePath(),
//                         runTime=2,
//                     )
//                 )
//                 this.wait()

//     """
//     return pathAlongArc(-np.pi)


// counterclockwisePath() -> PATH_FUNC_TYPE:
//     """This function transforms each point by moving counterclockwise around a half circle.

//     Examples
//     --------

//     .. manim :: CounterclockwisePathExample

//         class CounterclockwisePathExample(Scene) {
//             construct(this) {
//                 colors = [RED, GREEN, BLUE]

//                 startingPoints = VGroup(
//                     *[
//                         Dot(LEFT + pos, color=color)
//                         for pos, color in zip([UP, DOWN, LEFT], colors)
//                     ]
//                 )

//                 finishPoints = VGroup(
//                     *[
//                         Dot(RIGHT + pos, color=color)
//                         for pos, color in zip([ORIGIN, UP, DOWN], colors)
//                     ]
//                 )

//                 this.add(startingPoints)
//                 this.add(finishPoints)
//                 for dot in startingPoints:
//                     this.add(TracedPath(dot.getCenter, strokeColor=dot.getColor()))

//                 this.wait()
//                 this.play(
//                     Transform(
//                         startingPoints,
//                         finishPoints,
//                         pathFunc=utils.paths.counterclockwisePath(),
//                         runTime=2,
//                     )
//                 )
//                 this.wait()

//     """
//     return pathAlongArc(np.pi)


// spiralPath(angle: float, axis: np.ndarray = OUT) -> PATH_FUNC_TYPE:
//     """This function transforms each point by moving along a spiral to its destination.

//     Parameters
//     ----------
//     angle
//         The angle each point traverses around a spiral.
//     axis
//         The axis of rotation.

//     Examples
//     --------

//     .. manim :: SpiralPathExample

//         class SpiralPathExample(Scene) {
//             construct(this) {
//                 colors = [RED, GREEN, BLUE]

//                 startingPoints = VGroup(
//                     *[
//                         Dot(LEFT + pos, color=color)
//                         for pos, color in zip([UP, DOWN, LEFT], colors)
//                     ]
//                 )

//                 finishPoints = VGroup(
//                     *[
//                         Dot(RIGHT + pos, color=color)
//                         for pos, color in zip([ORIGIN, UP, DOWN], colors)
//                     ]
//                 )

//                 this.add(startingPoints)
//                 this.add(finishPoints)
//                 for dot in startingPoints:
//                     this.add(TracedPath(dot.getCenter, strokeColor=dot.getColor()))

//                 this.wait()
//                 this.play(
//                     Transform(
//                         startingPoints,
//                         finishPoints,
//                         pathFunc=utils.paths.spiralPath(2 * TWOPI),
//                         runTime=5,
//                     )
//                 )
//                 this.wait()

//     """
//     if abs(angle) < STRAIGHT_PATH_THRESHOLD:
//         return straightPath()
//     if np.linalg.norm(axis) == 0:
//         axis = OUT
//     unitAxis = axis / np.linalg.norm(axis)

//     path(startPoints: np.ndarray, endPoints: np.ndarray, alpha: float) {
//         rotMatrix = rotationMatrix((alpha - 1) * angle, unitAxis)
//         return startPoints + alpha * np.dot(endPoints - startPoints, rotMatrix.T)

//     return path
