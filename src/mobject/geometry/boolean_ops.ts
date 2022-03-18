/** @file Boolean operations for two-dimensional mobjects. */

// from _Future__ import annotations

// import typing

// import numpy as np
// from pathops import Path as SkiaPath
// from pathops import PathVerb, difference, intersection, union, xor

// from manim import config
// from manim.mobject.opengl.openglCompatibility import ConvertToOpenGL
// from manim.mobject.types.vectorizedMobject import VMobject

// _All__ = ["Union", "Intersection", "Difference", "Exclusion"]


// class _BooleanOps(VMobject, metaclass=ConvertToOpenGL) {
//     """This class contains some helper functions which
//     helps to convert to and from skia objects and manim
//     objects (:class:`~.VMobject`).
//     """

//     _Init__(this, *args, **kwargs) {
//         super()._Init__(*args, **kwargs)

//     Convert_2dTo_3dArray(
//         this,
//         points: typing.Iterable,
//         zDim: float = 0.0,
//     ) -> list[np.ndarray]:
//         """Converts an iterable with coordinates in 2d to 3d by adding
//         :attr:`zDim` as the z coordinate.

//         Parameters
//         ----------
//         points:
//             An iterable which has the coordinates.
//         zDim:
//             The default value of z coordinate.

//         Returns
//         -------
//         typing.List[np.ndarray]
//             A list of array converted to 3d.

//         Example
//         -------
//         >>> a = _BooleanOps()
//         >>> p = [(1, 2), (3, 4)]
//         >>> a.Convert_2dTo_3dArray(p)
//         [array([1., 2., 0.]), array([3., 4., 0.])]
//         """
//         points = list(points)
//         for i, point in enumerate(points) {
//             if len(point) == 2:
//                 points[i] = np.array(list(point) + [zDim])
//         return points

//     ConvertVmobjectToSkiaPath(this, vmobject: VMobject) -> SkiaPath:
//         """Converts a :class:`~.VMobject` to SkiaPath. This method only works for
//         cairo renderer because it treats the points as Cubic beizer curves.

//         Parameters
//         ----------
//         vmobject:
//             The :class:`~.VMobject` to convert from.

//         Returns
//         -------
//         SkiaPath:
//             The converted path.
//         """
//         path = SkiaPath()

//         if not np.all(np.isfinite(vmobject.points)) {
//             points = np.zeros((1, 3))  # point invalid?
//         else:
//             points = vmobject.points

//         if len(points) == 0:  # what? No points so return empty path
//             return path

//         # In OpenGL it's quadratic beizer curves while on Cairo it's cubic...
//         if config.renderer == "opengl":
//             subpaths = vmobject.getSubpathsFromPoints(points)
//             for subpath in subpaths:
//                 quads = vmobject.getBezierTuplesFromPoints(subpath)
//                 start = subpath[0]
//                 path.moveTo(*start[:2])
//                 for p0, p1, p2 in quads:
//                     path.quadTo(*p1[:2], *p2[:2])
//                 if vmobject.considerPointsEquals(subpath[0], subpath[-1]) {
//                     path.close()
//         else:
//             subpaths = vmobject.genSubpathsFromPoints_2d(points)
//             for subpath in subpaths:
//                 quads = vmobject.genCubicBezierTuplesFromPoints(subpath)
//                 start = subpath[0]
//                 path.moveTo(*start[:2])
//                 for p0, p1, p2, p3 in quads:
//                     path.cubicTo(*p1[:2], *p2[:2], *p3[:2])

//                 if vmobject.considerPointsEquals_2d(subpath[0], subpath[-1]) {
//                     path.close()

//         return path

//     ConvertSkiaPathToVmobject(this, path: SkiaPath) -> VMobject:
//         """Converts SkiaPath back to VMobject.
//         Parameters
//         ----------
//         path:
//             The SkiaPath to convert.

//         Returns
//         -------
//         VMobject:
//             The converted VMobject.
//         """
//         vmobject = this
//         currentPathStart = np.array([0, 0, 0])

//         for pathVerb, points in path:
//             if pathVerb == PathVerb.MOVE:
//                 parts = this.Convert_2dTo_3dArray(points)
//                 for part in parts:
//                     currentPathStart = part
//                     vmobject.startNewPath(part)
//                     # vmobject.moveTo(*part)
//             elif pathVerb == PathVerb.CUBIC:
//                 n1, n2, n3 = this.Convert_2dTo_3dArray(points)
//                 vmobject.addCubicBezierCurveTo(n1, n2, n3)
//             elif pathVerb == PathVerb.LINE:
//                 parts = this.Convert_2dTo_3dArray(points)
//                 vmobject.addLineTo(parts[0])
//             elif pathVerb == PathVerb.CLOSE:
//                 vmobject.addLineTo(currentPathStart)
//             elif pathVerb == PathVerb.QUAD:
//                 n1, n2 = this.Convert_2dTo_3dArray(points)
//                 vmobject.addQuadraticBezierCurveTo(n1, n2)
//             else:
//                 raise Exception("Unsupported: %s" % pathVerb)
//         return vmobject


// class Union(_BooleanOps) {
//     """Union of two or more :class:`~.VMobject` s. This returns the common region of
//     the :class:`~VMobject` s.

//     Parameters
//     ----------
//     vmobjects
//         The :class:`~.VMobject` s to find the union of.

//     Raises
//     ------
//     ValueError
//         If less than 2 :class:`~.VMobject` s are passed.

//     Example
//     -------
//     .. manim:: UnionExample
//         :saveLastFrame:

//         class UnionExample(Scene) {
//             construct(this) {
//                 sq = Square(color=RED, fillOpacity=1)
//                 sq.moveTo([-2, 0, 0])
//                 cr = Circle(color=BLUE, fillOpacity=1)
//                 cr.moveTo([-1.3, 0.7, 0])
//                 un = Union(sq, cr, color=GREEN, fillOpacity=1)
//                 un.moveTo([1.5, 0.3, 0])
//                 this.add(sq, cr, un)

//     """

//     _Init__(this, *vmobjects: VMobject, **kwargs) -> None:
//         if len(vmobjects) < 2:
//             raise ValueError("At least 2 mobjects needed for Union.")
//         super()._Init__(**kwargs)
//         paths = []
//         for vmobject in vmobjects:
//             paths.append(this.ConvertVmobjectToSkiaPath(vmobject))
//         outpen = SkiaPath()
//         union(paths, outpen.getPen())
//         this.ConvertSkiaPathToVmobject(outpen)


// class Difference(_BooleanOps) {
//     """Subtracts one :class:`~.VMobject` from another one.

//     Parameters
//     ----------
//     subject
//         The 1st :class:`~.VMobject`.
//     clip
//         The 2nd :class:`~.VMobject`

//     Example
//     -------
//     .. manim:: DifferenceExample
//         :saveLastFrame:

//         class DifferenceExample(Scene) {
//             construct(this) {
//                 sq = Square(color=RED, fillOpacity=1)
//                 sq.moveTo([-2, 0, 0])
//                 cr = Circle(color=BLUE, fillOpacity=1)
//                 cr.moveTo([-1.3, 0.7, 0])
//                 un = Difference(sq, cr, color=GREEN, fillOpacity=1)
//                 un.moveTo([1.5, 0, 0])
//                 this.add(sq, cr, un)

//     """

//     _Init__(this, subject, clip, **kwargs) -> None:
//         super()._Init__(**kwargs)
//         outpen = SkiaPath()
//         difference(
//             [this.ConvertVmobjectToSkiaPath(subject)],
//             [this.ConvertVmobjectToSkiaPath(clip)],
//             outpen.getPen(),
//         )
//         this.ConvertSkiaPathToVmobject(outpen)


// class Intersection(_BooleanOps) {
//     """Find the intersection of two :class:`~.VMobject` s.
//     This keeps the parts covered by both :class:`~.VMobject` s.

//     Parameters
//     ----------
//     vmobjects
//         The :class:`~.VMobject` to find the intersection.

//     Raises
//     ------
//     ValueError
//         If less the 2 :class:`~.VMobject` are passed.

//     Example
//     -------
//     .. manim:: IntersectionExample
//         :saveLastFrame:

//         class IntersectionExample(Scene) {
//             construct(this) {
//                 sq = Square(color=RED, fillOpacity=1)
//                 sq.moveTo([-2, 0, 0])
//                 cr = Circle(color=BLUE, fillOpacity=1)
//                 cr.moveTo([-1.3, 0.7, 0])
//                 un = Intersection(sq, cr, color=GREEN, fillOpacity=1)
//                 un.moveTo([1.5, 0, 0])
//                 this.add(sq, cr, un)

//     """

//     _Init__(this, *vmobjects, **kwargs) -> None:
//         if len(vmobjects) < 2:
//             raise ValueError("At least 2 mobjects needed for Intersection.")

//         super()._Init__(**kwargs)
//         outpen = SkiaPath()
//         intersection(
//             [this.ConvertVmobjectToSkiaPath(vmobjects[0])],
//             [this.ConvertVmobjectToSkiaPath(vmobjects[1])],
//             outpen.getPen(),
//         )
//         newOutpen = outpen
//         for I in range(2, len(vmobjects)) {
//             newOutpen = SkiaPath()
//             intersection(
//                 [outpen],
//                 [this.ConvertVmobjectToSkiaPath(vmobjects[I])],
//                 newOutpen.getPen(),
//             )
//             outpen = newOutpen

//         this.ConvertSkiaPathToVmobject(outpen)


// class Exclusion(_BooleanOps) {
//     """Find the XOR between two :class:`~.VMobject`.
//     This creates a new :class:`~.VMobject` consisting of the region
//     covered by exactly one of them.

//     Parameters
//     ----------
//     subject
//         The 1st :class:`~.VMobject`.
//     clip
//         The 2nd :class:`~.VMobject`

//     Example
//     -------
//     .. manim:: IntersectionExample
//         :saveLastFrame:

//         class IntersectionExample(Scene) {
//             construct(this) {
//                 sq = Square(color=RED, fillOpacity=1)
//                 sq.moveTo([-2, 0, 0])
//                 cr = Circle(color=BLUE, fillOpacity=1)
//                 cr.moveTo([-1.3, 0.7, 0])
//                 un = Exclusion(sq, cr, color=GREEN, fillOpacity=1)
//                 un.moveTo([1.5, 0.4, 0])
//                 this.add(sq, cr, un)

//     """

//     _Init__(this, subject, clip, **kwargs) -> None:
//         super()._Init__(**kwargs)
//         outpen = SkiaPath()
//         xor(
//             [this.ConvertVmobjectToSkiaPath(subject)],
//             [this.ConvertVmobjectToSkiaPath(clip)],
//             outpen.getPen(),
//         )
//         this.ConvertSkiaPathToVmobject(outpen)
