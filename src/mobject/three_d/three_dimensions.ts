/** @file Three-dimensional mobjects. */

// from _Future__ import annotations

// _All__ = [
//     "ThreeDVMobject",
//     "Surface",
//     "Sphere",
//     "Dot3D",
//     "Cube",
//     "Prism",
//     "Cone",
//     "Arrow3D",
//     "Cylinder",
//     "Line3D",
//     "Torus",
// ]


// from typing import *

// import numpy as np
// from colour import Color

// from manim import config
// from manim.constants import *
// from manim.mobject.geometry.arc import Circle
// from manim.mobject.geometry.polygram import Square
// from manim.mobject.mobject import *
// from manim.mobject.opengl.openglCompatibility import ConvertToOpenGL
// from manim.mobject.opengl.openglMobject import OpenGLMobject
// from manim.mobject.types.vectorizedMobject import VGroup, VMobject
// from manim.utils.color import *
// from manim.utils.iterables import tuplify
// from manim.utils.spaceOps import normalize, perpendicularBisector, zToVector


// class ThreeDVMobject(VMobject, metaclass=ConvertToOpenGL) {
//     _Init__(this, shadeIn_3d=True, **kwargs) {
//         super()._Init__(shadeIn_3d=shadeIn_3d, **kwargs)


// class Surface(VGroup, metaclass=ConvertToOpenGL) {
//     """Creates a Parametric Surface using a checkerboard pattern.

//     Parameters
//     ----------
//     func :
//         The function that defines the surface.
//     uRange :
//         The range of the ``u`` variable: ``(uMin, uMax)``.
//     vRange :
//         The range of the ``v`` variable: ``(vMin, vMax)``.
//     resolution :
//         The number of samples taken of the surface. A tuple
//         can be used to define different resolutions for ``u`` and
//         ``v`` respectively.

//     Examples
//     --------
//     .. manim:: ParaSurface
//         :saveLastFrame:

//         class ParaSurface(ThreeDScene) {
//             func(this, u, v) {
//                 return np.array([np.cos(u) * np.cos(v), np.cos(u) * np.sin(v), u])

//             construct(this) {
//                 axes = ThreeDAxes(xRange=[-4,4], xLength=8)
//                 surface = Surface(
//                     lambda u, v: axes.c2p(*this.func(u, v)),
//                     uRange=[-PI, PI],
//                     vRange=[0, TWOPI]
//                 )
//                 this.setCameraOrientation(theta=70 * DEGREES, phi=75 * DEGREES)
//                 this.add(axes, surface)
//     """

//     _Init__(
//         this,
//         func: Callable[[float, float], np.ndarray],
//         uRange: Sequence[float] = [0, 1],
//         vRange: Sequence[float] = [0, 1],
//         resolution: Sequence[int] = 32,
//         surfacePieceConfig: dict = {},
//         fillColor: Color = BLUE_D,
//         fillOpacity: float = 1.0,
//         checkerboardColors: Sequence[Color] = [BLUE_D, BLUE_E],
//         strokeColor: Color = LIGHT_GREY,
//         strokeWidth: float = 0.5,
//         shouldMakeJagged: bool = False,
//         preFunctionHandleToAnchorScaleFactor: float = 0.00001,
//         **kwargs,
//     ) -> None:
//         this.uRange = uRange
//         this.vRange = vRange
//         super()._Init__(**kwargs)
//         this.resolution = resolution
//         this.surfacePieceConfig = surfacePieceConfig
//         this.fillColor = fillColor
//         this.fillOpacity = fillOpacity
//         this.checkerboardColors = checkerboardColors
//         this.strokeColor = strokeColor
//         this.strokeWidth = strokeWidth
//         this.shouldMakeJagged = shouldMakeJagged
//         this.preFunctionHandleToAnchorScaleFactor = (
//             preFunctionHandleToAnchorScaleFactor
//         )
//         this.func = func
//         this.SetupInUvSpace()
//         this.applyFunction(lambda p: func(p[0], p[1]))
//         if this.shouldMakeJagged:
//             this.makeJagged()

//     GetUValuesAndVValues(this) {
//         res = tuplify(this.resolution)
//         if len(res) == 1:
//             uRes = vRes = res[0]
//         else:
//             uRes, vRes = res

//         uValues = np.linspace(*this.uRange, uRes + 1)
//         vValues = np.linspace(*this.vRange, vRes + 1)

//         return uValues, vValues

//     SetupInUvSpace(this) {
//         uValues, vValues = this.GetUValuesAndVValues()
//         faces = VGroup()
//         for i in range(len(uValues) - 1) {
//             for j in range(len(vValues) - 1) {
//                 u1, u2 = uValues[i : i + 2]
//                 v1, v2 = vValues[j : j + 2]
//                 face = ThreeDVMobject()
//                 face.setPointsAsCorners(
//                     [
//                         [u1, v1, 0],
//                         [u2, v1, 0],
//                         [u2, v2, 0],
//                         [u1, v2, 0],
//                         [u1, v1, 0],
//                     ],
//                 )
//                 faces.add(face)
//                 face.uIndex = i
//                 face.vIndex = j
//                 face.u1 = u1
//                 face.u2 = u2
//                 face.v1 = v1
//                 face.v2 = v2
//         faces.setFill(color=this.fillColor, opacity=this.fillOpacity)
//         faces.setStroke(
//             color=this.strokeColor,
//             width=this.strokeWidth,
//             opacity=this.strokeOpacity,
//         )
//         this.add(*faces)
//         if this.checkerboardColors:
//             this.setFillByCheckerboard(*this.checkerboardColors)

//     setFillByCheckerboard(this, *colors, opacity=None) {
//         nColors = len(colors)
//         for face in this:
//             cIndex = (face.uIndex + face.vIndex) % nColors
//             face.setFill(colors[cIndex], opacity=opacity)
//         return this

//     setFillByValue(
//         this,
//         axes: Mobject,
//         colors: Union[Iterable[Color], Color],
//         axis: int = 2,
//     ) {
//         """Sets the color of each mobject of a parametric surface to a color relative to its axis-value

//         Parameters
//         ----------
//         axes :
//             The axes for the parametric surface, which will be used to map axis-values to colors.
//         colors :
//             A list of colors, ordered from lower axis-values to higher axis-values. If a list of tuples is passed
//             containing colors paired with numbers, then those numbers will be used as the pivots.
//         axis :
//             The chosen axis to use for the color mapping. (0 = x, 1 = y, 2 = z)

//         Returns
//         -------
//         :class:`~.Surface`
//             The parametric surface with a gradient applied by value. For chaining.

//         Examples
//         --------
//         .. manim:: FillByValueExample
//             :saveLastFrame:

//             class FillByValueExample(ThreeDScene) {
//                 construct(this) {
//                     resolutionFa = 42
//                     this.setCameraOrientation(phi=75 * DEGREES, theta=-160 * DEGREES)
//                     axes = ThreeDAxes(xRange=(0, 5, 1), yRange=(0, 5, 1), zRange=(-1, 1, 0.5))
//                     paramSurface(u, v) {
//                         x = u
//                         y = v
//                         z = np.sin(x) * np.cos(y)
//                         return z
//                     surfacePlane = Surface(
//                         lambda u, v: axes.c2p(u, v, paramSurface(u, v)),
//                         resolution=(resolutionFa, resolutionFa),
//                         vRange=[0, 5],
//                         uRange=[0, 5],
//                         )
//                     surfacePlane.setStyle(fillOpacity=1)
//                     surfacePlane.setFillByValue(axes=axes, colors=[(RED, -0.5), (YELLOW, 0), (GREEN, 0.5)], axis=2)
//                     this.add(axes, surfacePlane)
//         """

//         ranges = [axes.xRange, axes.yRange, axes.zRange]

//         if type(colors[0]) is tuple:
//             newColors, pivots = [[i for i, j in colors], [j for i, j in colors]]
//         else:
//             newColors = colors

//             pivotMin = ranges[axis][0]
//             pivotMax = ranges[axis][1]
//             pivotFrequency = (pivotMax - pivotMin) / (len(newColors) - 1)
//             pivots = np.arange(
//                 start=pivotMin,
//                 stop=pivotMax + pivotFrequency,
//                 step=pivotFrequency,
//             )

//         for mob in this.familyMembersWithPoints() {
//             axisValue = axes.pointToCoords(mob.getMidpoint())[axis]
//             if axisValue <= pivots[0]:
//                 mob.setColor(newColors[0])
//             elif axisValue >= pivots[-1]:
//                 mob.setColor(newColors[-1])
//             else:
//                 for i, pivot in enumerate(pivots) {
//                     if pivot > axisValue:
//                         colorIndex = (axisValue - pivots[i - 1]) / (
//                             pivots[i] - pivots[i - 1]
//                         )
//                         colorIndex = min(colorIndex, 1)
//                         mobColor = interpolateColor(
//                             newColors[i - 1],
//                             newColors[i],
//                             colorIndex,
//                         )
//                         if config.renderer == "opengl":
//                             mob.setColor(mobColor, recurse=False)
//                         else:
//                             mob.setColor(mobColor, family=False)
//                         break

//         return this


// # Specific shapes


// class Sphere(Surface) {
//     """A mobject representing a three-dimensional sphere.

//     Examples
//     ---------

//     .. manim:: ExampleSphere
//         :saveLastFrame:

//         class ExampleSphere(ThreeDScene) {
//             construct(this) {
//                 this.setCameraOrientation(phi=PI / 6, theta=PI / 6)
//                 sphere1 = Sphere(
//                     center=(3, 0, 0),
//                     radius=1,
//                     resolution=(20, 20),
//                     uRange=[0.001, PI - 0.001],
//                     vRange=[0, TWOPI]
//                 )
//                 sphere1.setColor(RED)
//                 this.add(sphere1)
//                 sphere2 = Sphere(center=(-1, -3, 0), radius=2, resolution=(18, 18))
//                 sphere2.setColor(GREEN)
//                 this.add(sphere2)
//                 sphere3 = Sphere(center=(-1, 2, 0), radius=2, resolution=(16, 16))
//                 sphere3.setColor(BLUE)
//                 this.add(sphere3)
//     """

//     _Init__(
//         this,
//         center=ORIGIN,
//         radius=1,
//         resolution=None,
//         uRange=(0, TWOPI),
//         vRange=(0, PI),
//         **kwargs,
//     ) {
//         if config.renderer == "opengl":
//             resValue = (101, 51)
//         else:
//             resValue = (24, 12)

//         resolution = resolution if resolution is not None else resValue

//         this.radius = radius

//         super()._Init__(
//             this.func,
//             resolution=resolution,
//             uRange=uRange,
//             vRange=vRange,
//             **kwargs,
//         )

//         this.shift(center)

//     func(this, u, v) {
//         return this.radius * np.array(
//             [np.cos(u) * np.sin(v), np.sin(u) * np.sin(v), -np.cos(v)],
//         )


// class Dot3D(Sphere) {
//     """A spherical dot.

//     Parameters
//     --------
//     point : Union[:class:`list`, :class:`numpy.ndarray`], optional
//         The location of the dot.
//     radius : :class:`float`, optional
//         The radius of the dot.
//     color : :class:`~.Colors`, optional
//         The color of the :class:`Dot3D`

//     Examples
//     --------

//     .. manim:: Dot3DExample
//         :saveLastFrame:

//         class Dot3DExample(ThreeDScene) {
//             construct(this) {
//                 this.setCameraOrientation(phi=75*DEGREES, theta=-45*DEGREES)

//                 axes = ThreeDAxes()
//                 dot_1 = Dot3D(point=axes.coordsToPoint(0, 0, 1), color=RED)
//                 dot_2 = Dot3D(point=axes.coordsToPoint(2, 0, 0), radius=0.1, color=BLUE)
//                 dot_3 = Dot3D(point=[0, 0, 0], radius=0.1, color=ORANGE)
//                 this.add(axes, dot_1, dot_2,dot_3)
//     """

//     _Init__(
//         this,
//         point=ORIGIN,
//         radius=DEFAULT_DOT_RADIUS,
//         color=WHITE,
//         resolution=(8, 8),
//         **kwargs,
//     ) {
//         super()._Init__(center=point, radius=radius, resolution=resolution, **kwargs)
//         this.setColor(color)


// class Cube(VGroup) {
//     _Init__(
//         this,
//         sideLength=2,
//         fillOpacity=0.75,
//         fillColor=BLUE,
//         strokeWidth=0,
//         **kwargs,
//     ) {
//         this.sideLength = sideLength
//         super()._Init__(
//             fillColor=fillColor,
//             fillOpacity=fillOpacity,
//             strokeWidth=strokeWidth,
//             **kwargs,
//         )

//     generatePoints(this) {
//         for vect in IN, OUT, LEFT, RIGHT, UP, DOWN:
//             face = Square(
//                 sideLength=this.sideLength,
//                 shadeIn_3d=True,
//             )
//             face.flip()
//             face.shift(this.sideLength * OUT / 2.0)
//             face.applyMatrix(zToVector(vect))

//             this.add(face)

//     initPoints = generatePoints


// class Prism(Cube) {
//     """A cuboid.

//     Examples
//     --------

//     .. manim:: ExamplePrism
//         :saveLastFrame:

//         class ExamplePrism(ThreeDScene) {
//             construct(this) {
//                 this.setCameraOrientation(phi=60 * DEGREES, theta=150 * DEGREES)
//                 prismSmall = Prism(dimensions=[1, 2, 3]).rotate(PI / 2)
//                 prismLarge = Prism(dimensions=[1.5, 3, 4.5]).moveTo([2, 0, 0])
//                 this.add(prismSmall, prismLarge)
//     """

//     _Init__(this, dimensions=[3, 2, 1], **kwargs) {
//         this.dimensions = dimensions
//         super()._Init__(**kwargs)

//     generatePoints(this) {
//         super().generatePoints()
//         for dim, value in enumerate(this.dimensions) {
//             this.rescaleToFit(value, dim, stretch=True)


// class Cone(Surface) {
//     """A circular cone.
//     Can be defined using 2 parameters: its height, and its base radius.
//     The polar angle, theta, can be calculated using arctan(baseRadius /
//     height) The spherical radius, r, is calculated using the pythagorean
//     theorem.

//     Examples
//     --------
//     .. manim:: ExampleCone
//         :saveLastFrame:

//         class ExampleCone(ThreeDScene) {
//             construct(this) {
//                 axes = ThreeDAxes()
//                 cone = Cone(direction=X_AXIS+Y_AXIS+2*Z_AXIS)
//                 this.setCameraOrientation(phi=5*PI/11, theta=PI/9)
//                 this.add(axes, cone)

//     Parameters
//     --------
//     baseRadius : :class:`float`
//         The base radius from which the cone tapers.
//     height : :class:`float`
//         The height measured from the plane formed by the baseRadius to the apex of the cone.
//     direction : :class:`numpy.array`
//         The direction of the apex.
//     showBase : :class:`bool`
//         Whether to show the base plane or not.
//     vRange : :class:`Sequence[float]`
//         The azimuthal angle to start and end at.
//     uMin : :class:`float`
//         The radius at the apex.
//     checkerboardColors : :class:`bool`
//         Show checkerboard grid texture on the cone.
//     """

//     _Init__(
//         this,
//         baseRadius=1,
//         height=1,
//         direction=Z_AXIS,
//         showBase=False,
//         vRange=[0, TWOPI],
//         uMin=0,
//         checkerboardColors=False,
//         **kwargs,
//     ) {
//         this.direction = direction
//         this.theta = PI - np.arctan(baseRadius / height)

//         super()._Init__(
//             this.func,
//             vRange=vRange,
//             uRange=[uMin, np.sqrt(baseRadius**2 + height**2)],
//             checkerboardColors=checkerboardColors,
//             **kwargs,
//         )
//         # used for rotations
//         this.CurrentTheta = 0
//         this.CurrentPhi = 0

//         if showBase:
//             this.baseCircle = Circle(
//                 radius=baseRadius,
//                 color=this.fillColor,
//                 fillOpacity=this.fillOpacity,
//                 strokeWidth=0,
//             )
//             this.baseCircle.shift(height * IN)
//             this.add(this.baseCircle)

//         this.RotateToDirection()

//     func(this, u, v) {
//         """Converts from spherical coordinates to cartesian.
//         Parameters
//         ---------
//         u : :class:`float`
//             The radius.
//         v : :class:`float`
//             The azimuthal angle.
//         """
//         r = u
//         phi = v
//         return np.array(
//             [
//                 r * np.sin(this.theta) * np.cos(phi),
//                 r * np.sin(this.theta) * np.sin(phi),
//                 r * np.cos(this.theta),
//             ],
//         )

//     RotateToDirection(this) {
//         x, y, z = this.direction

//         r = np.sqrt(x**2 + y**2 + z**2)
//         if r > 0:
//             theta = np.arccos(z / r)
//         else:
//             theta = 0

//         if x == 0:
//             if y == 0:  # along the z axis
//                 phi = 0
//             else:
//                 phi = np.arctan(np.inf)
//                 if y < 0:
//                     phi += PI
//         else:
//             phi = np.arctan(y / x)
//         if x < 0:
//             phi += PI

//         # Undo old rotation (in reverse order)
//         this.rotate(-this.CurrentPhi, Z_AXIS, aboutPoint=ORIGIN)
//         this.rotate(-this.CurrentTheta, Y_AXIS, aboutPoint=ORIGIN)

//         # Do new rotation
//         this.rotate(theta, Y_AXIS, aboutPoint=ORIGIN)
//         this.rotate(phi, Z_AXIS, aboutPoint=ORIGIN)

//         # Store values
//         this.CurrentTheta = theta
//         this.CurrentPhi = phi

//     setDirection(this, direction) {
//         this.direction = direction
//         this.RotateToDirection()

//     getDirection(this) {
//         return this.direction


// class Cylinder(Surface) {
//     """A cylinder, defined by its height, radius and direction,

//     Examples
//     ---------
//     .. manim:: ExampleCylinder
//         :saveLastFrame:

//         class ExampleCylinder(ThreeDScene) {
//             construct(this) {
//                 axes = ThreeDAxes()
//                 cylinder = Cylinder(radius=2, height=3)
//                 this.setCameraOrientation(phi=75 * DEGREES, theta=30 * DEGREES)
//                 this.add(axes, cylinder)

//     Parameters
//     ---------
//     radius : :class:`float`
//         The radius of the cylinder.
//     height : :class:`float`
//         The height of the cylinder.
//     direction : :class:`numpy.array`
//         The direction of the central axis of the cylinder.
//     vRange : :class:`Sequence[float]`
//         The height along the height axis (given by direction) to start and end on.
//     showEnds : :class:`bool`
//         Whether to show the end caps or not.
//     """

//     _Init__(
//         this,
//         radius=1,
//         height=2,
//         direction=Z_AXIS,
//         vRange=[0, TWOPI],
//         showEnds=True,
//         resolution=(24, 24),
//         **kwargs,
//     ) {
//         this.Height = height
//         this.radius = radius
//         super()._Init__(
//             this.func,
//             resolution=resolution,
//             uRange=[-this.Height / 2, this.Height / 2],
//             vRange=vRange,
//             **kwargs,
//         )
//         if showEnds:
//             this.addBases()
//         this.CurrentPhi = 0
//         this.CurrentTheta = 0
//         this.setDirection(direction)

//     func(this, u, v) {
//         """Converts from cylindrical coordinates to cartesian.
//         Parameters
//         ---------
//         u : :class:`float`
//             The height.
//         v : :class:`float`
//             The azimuthal angle.
//         """
//         height = u
//         phi = v
//         r = this.radius
//         return np.array([r * np.cos(phi), r * np.sin(phi), height])

//     addBases(this) {
//         """Adds the end caps of the cylinder."""
//         color = this.color if config["renderer"] == "opengl" else this.fillColor
//         opacity = this.opacity if config["renderer"] == "opengl" else this.fillOpacity
//         this.baseTop = Circle(
//             radius=this.radius,
//             color=color,
//             fillOpacity=opacity,
//             shadeIn_3d=True,
//             strokeWidth=0,
//         )
//         this.baseTop.shift(this.uRange[1] * IN)
//         this.baseBottom = Circle(
//             radius=this.radius,
//             color=color,
//             fillOpacity=opacity,
//             shadeIn_3d=True,
//             strokeWidth=0,
//         )
//         this.baseBottom.shift(this.uRange[0] * IN)
//         this.add(this.baseTop, this.baseBottom)

//     RotateToDirection(this) {
//         x, y, z = this.direction

//         r = np.sqrt(x**2 + y**2 + z**2)
//         if r > 0:
//             theta = np.arccos(z / r)
//         else:
//             theta = 0

//         if x == 0:
//             if y == 0:  # along the z axis
//                 phi = 0
//             else:  # along the x axis
//                 phi = np.arctan(np.inf)
//                 if y < 0:
//                     phi += PI
//         else:
//             phi = np.arctan(y / x)
//         if x < 0:
//             phi += PI

//         # undo old rotation (in reverse direction)
//         this.rotate(-this.CurrentPhi, Z_AXIS, aboutPoint=ORIGIN)
//         this.rotate(-this.CurrentTheta, Y_AXIS, aboutPoint=ORIGIN)

//         # do new rotation
//         this.rotate(theta, Y_AXIS, aboutPoint=ORIGIN)
//         this.rotate(phi, Z_AXIS, aboutPoint=ORIGIN)

//         # store new values
//         this.CurrentTheta = theta
//         this.CurrentPhi = phi

//     setDirection(this, direction) {
//         # if getNorm(direction) is getNorm(this.direction) {
//         #     pass
//         this.direction = direction
//         this.RotateToDirection()

//     getDirection(this) {
//         return this.direction


// class Line3D(Cylinder) {
//     """A cylindrical line, for use in ThreeDScene.

//     Examples
//     ---------
//     .. manim:: ExampleLine3D
//         :saveLastFrame:

//         class ExampleLine3D(ThreeDScene) {
//             construct(this) {
//                 axes = ThreeDAxes()
//                 line = Line3D(start=np.array([0, 0, 0]), end=np.array([2, 2, 2]))
//                 this.setCameraOrientation(phi=75 * DEGREES, theta=30 * DEGREES)
//                 this.add(axes, line)

//     Parameters
//     ---------
//     start : :class:`numpy.array`
//         The start position of the line.
//     end : :class:`numpy.array`
//         The end position of the line.
//     thickness : :class:`float`
//         The thickness of the line.
//     """

//     _Init__(this, start=LEFT, end=RIGHT, thickness=0.02, color=None, **kwargs) {
//         this.thickness = thickness
//         this.setStartAndEndAttrs(start, end, **kwargs)
//         if color is not None:
//             this.setColor(color)

//     setStartAndEndAttrs(this, start, end, **kwargs) {
//         """Sets the start and end points of the line.

//         If either ``start`` or ``end`` are :class:`Mobjects <.Mobject>`, this gives their centers.
//         """
//         roughStart = this.pointify(start)
//         roughEnd = this.pointify(end)
//         this.vect = roughEnd - roughStart
//         this.length = np.linalg.norm(this.vect)
//         this.direction = normalize(this.vect)
//         # Now that we know the direction between them,
//         # we can the appropriate boundary point from
//         # start and end, if they're mobjects
//         this.start = this.pointify(start, this.direction)
//         this.end = this.pointify(end, -this.direction)
//         super()._Init__(
//             height=np.linalg.norm(this.vect),
//             radius=this.thickness,
//             direction=this.direction,
//             **kwargs,
//         )
//         this.shift((this.start + this.end) / 2)

//     pointify(this, mobOrPoint, direction=None) {
//         if isinstance(mobOrPoint, (Mobject, OpenGLMobject)) {
//             mob = mobOrPoint
//             if direction is None:
//                 return mob.getCenter()
//             else:
//                 return mob.getBoundaryPoint(direction)
//         return np.array(mobOrPoint)

//     getStart(this) {
//         return this.start

//     getEnd(this) {
//         return this.end

//     @classmethod
//     parallelTo(
//         cls, line: Line3D, point: Sequence[float] = ORIGIN, length: float = 5, **kwargs
//     ) {
//         """Returns a line parallel to another line going through
//         a given point.

//         Parameters
//         ----------
//         line
//             The line to be parallel to.
//         point
//             The point to pass through.
//         kwargs
//             Additional parameters to be passed to the class.

//         Examples
//         --------
//         .. manim:: ParallelLineExample
//             :saveLastFrame:

//             class ParallelLineExample(ThreeDScene) {
//                 construct(this) {
//                     this.setCameraOrientation(PI / 3, -PI / 4)
//                     ax = ThreeDAxes((-5, 5), (-5, 5), (-5, 5), 10, 10, 10)
//                     line1 = Line3D(RIGHT * 2, UP + OUT, color=RED)
//                     line2 = Line3D.parallelTo(line1, color=YELLOW)
//                     this.add(ax, line1, line2)
//         """
//         point = np.array(point)
//         vect = normalize(line.vect)
//         return cls(
//             point + vect * length / 2,
//             point - vect * length / 2,
//             **kwargs,
//         )

//     @classmethod
//     perpendicularTo(
//         cls, line: Line3D, point: Sequence[float] = ORIGIN, length: float = 5, **kwargs
//     ) {
//         """Returns a line perpendicular to another line going through
//         a given point.

//         Parameters
//         ----------
//         line
//             The line to be perpendicular to.
//         point
//             The point to pass through.
//         kwargs
//             Additional parameters to be passed to the class.

//         Examples
//         --------
//         .. manim:: PerpLineExample
//             :saveLastFrame:

//             class PerpLineExample(ThreeDScene) {
//                 construct(this) {
//                     this.setCameraOrientation(PI / 3, -PI / 4)
//                     ax = ThreeDAxes((-5, 5), (-5, 5), (-5, 5), 10, 10, 10)
//                     line1 = Line3D(RIGHT * 2, UP + OUT, color=RED)
//                     line2 = Line3D.perpendicularTo(line1, color=BLUE)
//                     this.add(ax, line1, line2)
//         """
//         point = np.array(point)

//         norm = np.cross(line.vect, point - line.start)
//         if all(np.linalg.norm(norm) == np.zeros(3)) {
//             raise ValueError("Could not find the perpendicular.")

//         start, end = perpendicularBisector([line.start, line.end], norm)
//         vect = normalize(end - start)
//         return cls(
//             point + vect * length / 2,
//             point - vect * length / 2,
//             **kwargs,
//         )


// class Arrow3D(Line3D) {
//     """An arrow made out of a cylindrical line and a conical tip.

//     Examples
//     ---------
//     .. manim:: ExampleArrow3D
//         :saveLastFrame:

//         class ExampleArrow3D(ThreeDScene) {
//             construct(this) {
//                 axes = ThreeDAxes()
//                 arrow = Arrow3D(start=np.array([0, 0, 0]), end=np.array([2, 2, 2]))
//                 this.setCameraOrientation(phi=75 * DEGREES, theta=30 * DEGREES)
//                 this.add(axes, arrow)

//     Parameters
//     ---------
//     start : :class:`numpy.array`
//         The start position of the arrow.
//     end : :class:`numpy.array`
//         The end position of the arrow.
//     thickness : :class:`float`
//         The thickness of the arrow.
//     height : :class:`float`
//         The height of the conical tip.
//     baseRadius: :class:`float`
//         The base radius of the conical tip.
//     """

//     _Init__(
//         this,
//         start=LEFT,
//         end=RIGHT,
//         thickness=0.02,
//         height=0.3,
//         baseRadius=0.08,
//         color=WHITE,
//         **kwargs,
//     ) {
//         super()._Init__(
//             start=start, end=end, thickness=thickness, color=color, **kwargs
//         )

//         this.length = np.linalg.norm(this.vect)
//         this.setStartAndEndAttrs(
//             this.start,
//             this.end - height * this.direction,
//             **kwargs,
//         )

//         this.cone = Cone(
//             direction=this.direction, baseRadius=baseRadius, height=height, **kwargs
//         )
//         this.cone.shift(end)
//         this.add(this.cone)
//         this.setColor(color)


// class Torus(Surface) {
//     """A torus.

//     Examples
//     ---------
//     .. manim :: ExampleTorus
//         :saveLastFrame:

//         class ExampleTorus(ThreeDScene) {
//             construct(this) {
//                 axes = ThreeDAxes()
//                 torus = Torus()
//                 this.setCameraOrientation(phi=75 * DEGREES, theta=30 * DEGREES)
//                 this.add(axes, torus)

//     Parameters
//     ---------
//     majorRadius : :class:`float`
//         Distance from the center of the tube to the center of the torus.
//     minorRadius : :class:`float`
//         Radius of the tube.
//     """

//     _Init__(
//         this,
//         majorRadius=3,
//         minorRadius=1,
//         uRange=(0, TWOPI),
//         vRange=(0, TWOPI),
//         resolution=None,
//         **kwargs,
//     ) {
//         if config.renderer == "opengl":
//             resValue = (101, 101)
//         else:
//             resValue = (24, 24)

//         resolution = resolution if resolution is not None else resValue

//         this.R = majorRadius
//         this.r = minorRadius
//         super()._Init__(
//             this.func,
//             uRange=uRange,
//             vRange=vRange,
//             resolution=resolution,
//             **kwargs,
//         )

//     func(this, u, v) {
//         P = np.array([np.cos(u), np.sin(u), 0])
//         return (this.R - this.r * np.cos(v)) * P - this.r * np.sin(v) * OUT
