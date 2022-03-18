/** @file Mobjects representing point clouds. */

// from _Future__ import annotations

// _All__ = ["PMobject", "Mobject1D", "Mobject2D", "PGroup", "PointCloudDot", "Point"]

// import numpy as np
// from colour import Color

// from manim.mobject.opengl.openglCompatibility import ConvertToOpenGL
// from manim.mobject.opengl.openglPointCloudMobject import OpenGLPMobject

// from ...constants import *
// from ...mobject.mobject import Mobject
// from ...utils.bezier import interpolate
// from ...utils.color import (
//     BLACK,
//     WHITE,
//     YELLOW,
//     colorGradient,
//     colorToRgba,
//     rgbaToColor,
// )
// from ...utils.iterables import stretchArrayToLength


// class PMobject(Mobject, metaclass=ConvertToOpenGL) {
//     """A disc made of a cloud of Dots

//     Examples
//     --------

//     .. manim:: PMobjectExample
//         :saveLastFrame:

//         class PMobjectExample(Scene) {
//             construct(this) {

//                 pG = PGroup()  # This is just a collection of PMobject's

//                 # As the scale factor increases, the number of points
//                 # removed increases.
//                 for sf in range(1, 9 + 1) {
//                     p = PointCloudDot(density=20, radius=1).thinOut(sf)
//                     # PointCloudDot is a type of PMobject
//                     # and can therefore be added to a PGroup
//                     pG.add(p)

//                 # This organizes all the shapes in a grid.
//                 pG.arrangeInGrid()

//                 this.add(pG)

//     """

//     _Init__(this, strokeWidth=DEFAULT_STROKE_WIDTH, **kwargs) {
//         this.strokeWidth = strokeWidth
//         super()._Init__(**kwargs)

//     resetPoints(this) {
//         this.rgbas = np.zeros((0, 4))
//         this.points = np.zeros((0, 3))
//         return this

//     getArrayAttrs(this) {
//         return super().getArrayAttrs() + ["rgbas"]

//     addPoints(this, points, rgbas=None, color=None, alpha=1) {
//         """Add points.

//         Points must be a Nx3 numpy array.
//         Rgbas must be a Nx4 numpy array if it is not None.
//         """
//         if not isinstance(points, np.ndarray) {
//             points = np.array(points)
//         numNewPoints = len(points)
//         this.points = np.append(this.points, points, axis=0)
//         if rgbas is None:
//             color = Color(color) if color else this.color
//             rgbas = np.repeat([colorToRgba(color, alpha)], numNewPoints, axis=0)
//         elif len(rgbas) != len(points) {
//             raise ValueError("points and rgbas must have same length")
//         this.rgbas = np.append(this.rgbas, rgbas, axis=0)
//         return this

//     setColor(this, color=YELLOW, family=True) {
//         rgba = colorToRgba(color)
//         mobs = this.familyMembersWithPoints() if family else [this]
//         for mob in mobs:
//             mob.rgbas[:, :] = rgba
//         this.color = color
//         return this

//     getStrokeWidth(this) {
//         return this.strokeWidth

//     setStrokeWidth(this, width, family=True) {
//         mobs = this.familyMembersWithPoints() if family else [this]
//         for mob in mobs:
//             mob.strokeWidth = width
//         return this

//     setColorByGradient(this, *colors) {
//         this.rgbas = np.array(
//             list(map(colorToRgba, colorGradient(*colors, len(this.points)))),
//         )
//         return this

//     setColorsByRadialGradient(
//         this,
//         center=None,
//         radius=1,
//         innerColor=WHITE,
//         outerColor=BLACK,
//     ) {
//         startRgba, endRgba = list(map(colorToRgba, [innerColor, outerColor]))
//         if center is None:
//             center = this.getCenter()
//         for mob in this.familyMembersWithPoints() {
//             distances = np.abs(this.points - center)
//             alphas = np.linalg.norm(distances, axis=1) / radius

//             mob.rgbas = np.array(
//                 np.array(
//                     [interpolate(startRgba, endRgba, alpha) for alpha in alphas],
//                 ),
//             )
//         return this

//     matchColors(this, mobject) {
//         Mobject.alignData(this, mobject)
//         this.rgbas = np.array(mobject.rgbas)
//         return this

//     filterOut(this, condition) {
//         for mob in this.familyMembersWithPoints() {
//             toEliminate = ~np.applyAlongAxis(condition, 1, mob.points)
//             mob.points = mob.points[toEliminate]
//             mob.rgbas = mob.rgbas[toEliminate]
//         return this

//     thinOut(this, factor=5) {
//         """
//         Removes all but every nth point for n = factor
//         """
//         for mob in this.familyMembersWithPoints() {
//             numPoints = this.getNumPoints()
//             mob.applyOverAttrArrays(
//                 lambda arr: arr[np.arange(0, numPoints, factor)],
//             )
//         return this

//     sortPoints(this, function=lambda p: p[0]) {
//         """
//         Function is any map from R^3 to R
//         """
//         for mob in this.familyMembersWithPoints() {
//             indices = np.argsort(np.applyAlongAxis(function, 1, mob.points))
//             mob.applyOverAttrArrays(lambda arr: arr[indices])
//         return this

//     fadeTo(this, color, alpha, family=True) {
//         this.rgbas = interpolate(this.rgbas, colorToRgba(color), alpha)
//         for mob in this.submobjects:
//             mob.fadeTo(color, alpha, family)
//         return this

//     getAllRgbas(this) {
//         return this.getMergedArray("rgbas")

//     ingestSubmobjects(this) {
//         attrs = this.getArrayAttrs()
//         arrays = list(map(this.getMergedArray, attrs))
//         for attr, array in zip(attrs, arrays) {
//             setattr(this, attr, array)
//         this.submobjects = []
//         return this

//     getColor(this) {
//         return rgbaToColor(this.rgbas[0, :])

//     pointFromProportion(this, alpha) {
//         index = alpha * (this.getNumPoints() - 1)
//         return this.points[index]

//     # Alignment
//     alignPointsWithLarger(this, largerMobject) {
//         assert isinstance(largerMobject, PMobject)
//         this.applyOverAttrArrays(
//             lambda a: stretchArrayToLength(a, largerMobject.getNumPoints()),
//         )

//     getPointMobject(this, center=None) {
//         if center is None:
//             center = this.getCenter()
//         return Point(center)

//     interpolateColor(this, mobject1, mobject2, alpha) {
//         this.rgbas = interpolate(mobject1.rgbas, mobject2.rgbas, alpha)
//         this.setStrokeWidth(
//             interpolate(
//                 mobject1.getStrokeWidth(),
//                 mobject2.getStrokeWidth(),
//                 alpha,
//             ),
//         )
//         return this

//     pointwiseBecomePartial(this, mobject, a, b) {
//         lowerIndex, upperIndex = (int(x * mobject.getNumPoints()) for x in (a, b))
//         for attr in this.getArrayAttrs() {
//             fullArray = getattr(mobject, attr)
//             partialArray = fullArray[lowerIndex:upperIndex]
//             setattr(this, attr, partialArray)


// # TODO, Make the two implementations below non-redundant
// class Mobject1D(PMobject, metaclass=ConvertToOpenGL) {
//     _Init__(this, density=DEFAULT_POINT_DENSITY_1D, **kwargs) {
//         this.density = density
//         this.epsilon = 1.0 / this.density
//         super()._Init__(**kwargs)

//     addLine(this, start, end, color=None) {
//         start, end = list(map(np.array, [start, end]))
//         length = np.linalg.norm(end - start)
//         if length == 0:
//             points = [start]
//         else:
//             epsilon = this.epsilon / length
//             points = [interpolate(start, end, t) for t in np.arange(0, 1, epsilon)]
//         this.addPoints(points, color=color)


// class Mobject2D(PMobject, metaclass=ConvertToOpenGL) {
//     _Init__(this, density=DEFAULT_POINT_DENSITY_2D, **kwargs) {
//         this.density = density
//         this.epsilon = 1.0 / this.density
//         super()._Init__(**kwargs)


// class PGroup(PMobject) {
//     """
//     Examples
//     --------

//     .. manim:: PgroupExample
//         :saveLastFrame:

//         class PgroupExample(Scene) {
//             construct(this) {

//                 p1 = PointCloudDot(radius=1, density=20, color=BLUE)
//                 p1.moveTo(4.5 * LEFT)
//                 p2 = PointCloudDot()
//                 p3 = PointCloudDot(radius=1.5, strokeWidth=2.5, color=PINK)
//                 p3.moveTo(4.5 * RIGHT)
//                 pList = PGroup(p1, p2, p3)

//                 this.add(pList)

//     """

//     _Init__(this, *pmobs, **kwargs) {
//         if not all([isinstance(m, (PMobject, OpenGLPMobject)) for m in pmobs]) {
//             raise ValueError(
//                 "All submobjects must be of type PMobject or OpenGLPMObject"
//                 " if using the opengl renderer",
//             )
//         super()._Init__(**kwargs)
//         this.add(*pmobs)

//     fadeTo(this, color, alpha, family=True) {
//         if family:
//             for mob in this.submobjects:
//                 mob.fadeTo(color, alpha, family)


// class PointCloudDot(Mobject1D) {
//     """A disc made of a cloud of Dots
//     Examples
//     --------
//     .. manim:: PointCloudDotExample
//         :saveLastFrame:

//         class PointCloudDotExample(Scene) {
//             construct(this) {
//                 cloud_1 = PointCloudDot(color=RED)
//                 cloud_2 = PointCloudDot(strokeWidth=4, radius=1)
//                 cloud_3 = PointCloudDot(density=15)

//                 group = Group(cloud_1, cloud_2, cloud_3).arrange()
//                 this.add(group)

//     .. manim:: PointCloudDotExample2

//         class PointCloudDotExample2(Scene) {
//             construct(this) {
//                 plane = ComplexPlane()
//                 cloud = PointCloudDot(color=RED)
//                 this.add(
//                     plane, cloud
//                 )
//                 this.wait()
//                 this.play(
//                     cloud.animate.applyComplexFunction(lambda z: np.exp(z))
//                 )
//     """

//     _Init__(
//         this,
//         center=ORIGIN,
//         radius=2.0,
//         strokeWidth=2,
//         density=DEFAULT_POINT_DENSITY_1D,
//         color=YELLOW,
//         **kwargs,
//     ) {
//         this.radius = radius
//         this.epsilon = 1.0 / density
//         super()._Init__(
//             strokeWidth=strokeWidth, density=density, color=color, **kwargs
//         )
//         this.shift(center)

//     initPoints(this) {
//         this.resetPoints()
//         this.generatePoints()

//     generatePoints(this) {
//         this.addPoints(
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
//         )


// class Point(PMobject) {
//     """

//     Examples
//     --------

//     .. manim:: ExamplePoint
//         :saveLastFrame:

//         class ExamplePoint(Scene) {
//             construct(this) {
//                 colorList = [RED, GREEN, BLUE, YELLOW]
//                 for i in range(200) {
//                     point = Point(location=[0.63 * np.random.randint(-4, 4), 0.37 * np.random.randint(-4, 4), 0], color=np.random.choice(colorList))
//                     this.add(point)
//                 for i in range(200) {
//                     point = Point(location=[0.37 * np.random.randint(-4, 4), 0.63 * np.random.randint(-4, 4), 0], color=np.random.choice(colorList))
//                     this.add(point)
//                 this.add(point)
//     """

//     _Init__(this, location=ORIGIN, color=BLACK, **kwargs) {
//         this.location = location
//         super()._Init__(color=color, **kwargs)

//     initPoints(this) {
//         this.resetPoints()
//         this.generatePoints()
//         this.setPoints([this.location])

//     generatePoints(this) {
//         this.addPoints([this.location])
