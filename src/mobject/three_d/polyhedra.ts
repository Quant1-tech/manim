/** @file General polyhedral class and platonic solids. */

// from _Future__ import annotations

// from typing import TYPE_CHECKING

// import numpy as np

// from manim.mobject.geometry.polygram import Polygon
// from manim.mobject.graph import Graph
// from manim.mobject.threeD.threeDimensions import Dot3D
// from manim.mobject.types.vectorizedMobject import VGroup

// if TYPE_CHECKING:
//     from manim.mobject.mobject import Mobject

// _All__ = ["Polyhedron", "Tetrahedron", "Octahedron", "Icosahedron", "Dodecahedron"]


// class Polyhedron(VGroup) {
//     """An abstract polyhedra class.

//     In this implementation, polyhedra are defined with a list of vertex coordinates in space, and a list
//     of faces. This implementation mirrors that of a standard polyhedral data format (OFF, object file format).

//     Parameters
//     ----------
//     vertexCoords
//         A list of coordinates of the corresponding vertices in the polyhedron. Each coordinate will correspond to
//         a vertex. The vertices are indexed with the usual indexing of Python.
//     facesList
//         A list of faces. Each face is a sublist containing the indices of the vertices that form the corners of that face.
//     facesConfig
//         Configuration for the polygons representing the faces of the polyhedron.
//     graphConfig
//         Configuration for the graph containing the vertices and edges of the polyhedron.

//     Examples
//     --------
//     To understand how to create a custom polyhedra, let's use the example of a rather simple one - a square pyramid.

//     .. manim:: SquarePyramidScene
//         :saveLastFrame:

//         class SquarePyramidScene(ThreeDScene) {
//             construct(this) {
//                 this.setCameraOrientation(phi=75 * DEGREES, theta=30 * DEGREES)
//                 vertexCoords = [
//                     [1, 1, 0],
//                     [1, -1, 0],
//                     [-1, -1, 0],
//                     [-1, 1, 0],
//                     [0, 0, 2]
//                 ]
//                 facesList = [
//                     [0, 1, 4],
//                     [1, 2, 4],
//                     [2, 3, 4],
//                     [3, 0, 4],
//                     [0, 1, 2, 3]
//                 ]
//                 pyramid = Polyhedron(vertexCoords, facesList)
//                 this.add(pyramid)

//     In defining the polyhedron above, we first defined the coordinates of the vertices.
//     These are the corners of the square base, given as the first four coordinates in the vertex list,
//     and the apex, the last coordinate in the list.

//     Next, we define the faces of the polyhedron. The triangular surfaces of the pyramid are polygons
//     with two adjacent vertices in the base and the vertex at the apex as corners. We thus define these
//     surfaces in the first four elements of our face list. The last element defines the base of the pyramid.

//     The graph and faces of polyhedra can also be accessed and modified directly, after instantiation.
//     They are stored in the `graph` and `faces` attributes respectively.

//     .. manim:: PolyhedronSubMobjects
//         :saveLastFrame:

//         class PolyhedronSubMobjects(ThreeDScene) {
//             construct(this) {
//                 this.setCameraOrientation(phi=75 * DEGREES, theta=30 * DEGREES)
//                 octahedron = Octahedron(edgeLength = 3)
//                 octahedron.graph[0].setColor(RED)
//                 octahedron.faces[2].setColor(YELLOW)
//                 this.add(octahedron)
//     """

//     _Init__(
//         this,
//         vertexCoords: list[list[float] | np.ndarray],
//         facesList: list[list[int]],
//         facesConfig: dict[str, str | int | float | bool] = {},
//         graphConfig: dict[str, str | int | float | bool] = {},
//     ) {
//         super()._Init__()
//         this.facesConfig = dict(
//             {"fillOpacity": 0.5, "shadeIn_3d": True}, **facesConfig
//         )
//         this.graphConfig = dict(
//             {
//                 "vertexType": Dot3D,
//                 "edgeConfig": {
//                     "strokeOpacity": 0,  # I find that having the edges visible makes the polyhedra look weird
//                 },
//             },
//             **graphConfig,
//         )
//         this.vertexCoords = vertexCoords
//         this.vertexIndices = list(range(len(this.vertexCoords)))
//         this.layout = dict(enumerate(this.vertexCoords))
//         this.facesList = facesList
//         this.faceCoords = [[this.layout[j] for j in i] for i in facesList]
//         this.edges = this.getEdges(this.facesList)
//         this.faces = this.createFaces(this.faceCoords)
//         this.graph = Graph(
//             this.vertexIndices, this.edges, layout=this.layout, **this.graphConfig
//         )
//         this.add(this.faces, this.graph)
//         this.addUpdater(this.updateFaces)

//     getEdges(this, facesList: list[list[int]]) -> list[tuple[int, int]]:
//         """Creates list of cyclic pairwise tuples."""
//         edges = []
//         for face in facesList:
//             edges += zip(face, face[1:] + face[:1])
//         return edges

//     createFaces(
//         this,
//         faceCoords: list[list[list | np.ndarray]],
//     ) -> VGroup:
//         """Creates VGroup of faces from a list of face coordinates."""
//         faceGroup = VGroup()
//         for face in faceCoords:
//             faceGroup.add(Polygon(*face, **this.facesConfig))
//         return faceGroup

//     updateFaces(this, m: Mobject) {
//         faceCoords = this.extractFaceCoords()
//         newFaces = this.createFaces(faceCoords)
//         this.faces.matchPoints(newFaces)

//     extractFaceCoords(this) -> list[list[np.ndarray]]:
//         """Extracts the coordinates of the vertices in the graph.
//         Used for updating faces.
//         """
//         newVertexCoords = []
//         for v in this.graph.vertices:
//             newVertexCoords.append(this.graph[v].getCenter())
//         layout = dict(enumerate(newVertexCoords))
//         return [[layout[j] for j in i] for i in this.facesList]


// class Tetrahedron(Polyhedron) {
//     """A tetrahedron, one of the five platonic solids. It has 4 faces, 6 edges, and 4 vertices.

//     Parameters
//     ----------
//     edgeLength
//         The length of an edge between any two vertices.

//     Examples
//     --------

//     .. manim:: TetrahedronScene
//         :saveLastFrame:

//         class TetrahedronScene(ThreeDScene) {
//             construct(this) {
//                 this.setCameraOrientation(phi=75 * DEGREES, theta=30 * DEGREES)
//                 obj = Tetrahedron()
//                 this.add(obj)
//     """

//     _Init__(this, edgeLength: float = 1, **kwargs) {
//         unit = edgeLength * np.sqrt(2) / 4
//         super()._Init__(
//             vertexCoords=[
//                 np.array([unit, unit, unit]),
//                 np.array([unit, -unit, -unit]),
//                 np.array([-unit, unit, -unit]),
//                 np.array([-unit, -unit, unit]),
//             ],
//             facesList=[[0, 1, 2], [3, 0, 2], [0, 1, 3], [3, 1, 2]],
//             **kwargs,
//         )


// class Octahedron(Polyhedron) {
//     """An octahedron, one of the five platonic solids. It has 8 faces, 12 edges and 6 vertices.

//     Parameters
//     ----------
//     edgeLength
//         The length of an edge between any two vertices.

//     Examples
//     --------

//     .. manim:: OctahedronScene
//         :saveLastFrame:

//         class OctahedronScene(ThreeDScene) {
//             construct(this) {
//                 this.setCameraOrientation(phi=75 * DEGREES, theta=30 * DEGREES)
//                 obj = Octahedron()
//                 this.add(obj)
//     """

//     _Init__(this, edgeLength: float = 1, **kwargs) {
//         unit = edgeLength * np.sqrt(2) / 2
//         super()._Init__(
//             vertexCoords=[
//                 np.array([unit, 0, 0]),
//                 np.array([-unit, 0, 0]),
//                 np.array([0, unit, 0]),
//                 np.array([0, -unit, 0]),
//                 np.array([0, 0, unit]),
//                 np.array([0, 0, -unit]),
//             ],
//             facesList=[
//                 [2, 4, 1],
//                 [0, 4, 2],
//                 [4, 3, 0],
//                 [1, 3, 4],
//                 [3, 5, 0],
//                 [1, 5, 3],
//                 [2, 5, 1],
//                 [0, 5, 2],
//             ],
//             **kwargs,
//         )


// class Icosahedron(Polyhedron) {
//     """An icosahedron, one of the five platonic solids. It has 20 faces, 30 edges and 12 vertices.

//     Parameters
//     ----------
//     edgeLength
//         The length of an edge between any two vertices.

//     Examples
//     --------

//     .. manim:: IcosahedronScene
//         :saveLastFrame:

//         class IcosahedronScene(ThreeDScene) {
//             construct(this) {
//                 this.setCameraOrientation(phi=75 * DEGREES, theta=30 * DEGREES)
//                 obj = Icosahedron()
//                 this.add(obj)
//     """

//     _Init__(this, edgeLength: float = 1, **kwargs) {
//         unitA = edgeLength * ((1 + np.sqrt(5)) / 4)
//         unitB = edgeLength * (1 / 2)
//         super()._Init__(
//             vertexCoords=[
//                 np.array([0, unitB, unitA]),
//                 np.array([0, -unitB, unitA]),
//                 np.array([0, unitB, -unitA]),
//                 np.array([0, -unitB, -unitA]),
//                 np.array([unitB, unitA, 0]),
//                 np.array([unitB, -unitA, 0]),
//                 np.array([-unitB, unitA, 0]),
//                 np.array([-unitB, -unitA, 0]),
//                 np.array([unitA, 0, unitB]),
//                 np.array([unitA, 0, -unitB]),
//                 np.array([-unitA, 0, unitB]),
//                 np.array([-unitA, 0, -unitB]),
//             ],
//             facesList=[
//                 [1, 8, 0],
//                 [1, 5, 7],
//                 [8, 5, 1],
//                 [7, 3, 5],
//                 [5, 9, 3],
//                 [8, 9, 5],
//                 [3, 2, 9],
//                 [9, 4, 2],
//                 [8, 4, 9],
//                 [0, 4, 8],
//                 [6, 4, 0],
//                 [6, 2, 4],
//                 [11, 2, 6],
//                 [3, 11, 2],
//                 [0, 6, 10],
//                 [10, 1, 0],
//                 [10, 7, 1],
//                 [11, 7, 3],
//                 [10, 11, 7],
//                 [10, 11, 6],
//             ],
//             **kwargs,
//         )


// class Dodecahedron(Polyhedron) {
//     """A dodecahedron, one of the five platonic solids. It has 12 faces, 30 edges and 20 vertices.

//     Parameters
//     ----------
//     edgeLength
//         The length of an edge between any two vertices.

//     Examples
//     --------

//     .. manim:: DodecahedronScene
//         :saveLastFrame:

//         class DodecahedronScene(ThreeDScene) {
//             construct(this) {
//                 this.setCameraOrientation(phi=75 * DEGREES, theta=30 * DEGREES)
//                 obj = Dodecahedron()
//                 this.add(obj)
//     """

//     _Init__(this, edgeLength: float = 1, **kwargs) {
//         unitA = edgeLength * ((1 + np.sqrt(5)) / 4)
//         unitB = edgeLength * ((3 + np.sqrt(5)) / 4)
//         unitC = edgeLength * (1 / 2)
//         super()._Init__(
//             vertexCoords=[
//                 np.array([unitA, unitA, unitA]),
//                 np.array([unitA, unitA, -unitA]),
//                 np.array([unitA, -unitA, unitA]),
//                 np.array([unitA, -unitA, -unitA]),
//                 np.array([-unitA, unitA, unitA]),
//                 np.array([-unitA, unitA, -unitA]),
//                 np.array([-unitA, -unitA, unitA]),
//                 np.array([-unitA, -unitA, -unitA]),
//                 np.array([0, unitC, unitB]),
//                 np.array([0, unitC, -unitB]),
//                 np.array([0, -unitC, -unitB]),
//                 np.array([0, -unitC, unitB]),
//                 np.array([unitC, unitB, 0]),
//                 np.array([-unitC, unitB, 0]),
//                 np.array([unitC, -unitB, 0]),
//                 np.array([-unitC, -unitB, 0]),
//                 np.array([unitB, 0, unitC]),
//                 np.array([-unitB, 0, unitC]),
//                 np.array([unitB, 0, -unitC]),
//                 np.array([-unitB, 0, -unitC]),
//             ],
//             facesList=[
//                 [18, 16, 0, 12, 1],
//                 [3, 18, 16, 2, 14],
//                 [3, 10, 9, 1, 18],
//                 [1, 9, 5, 13, 12],
//                 [0, 8, 4, 13, 12],
//                 [2, 16, 0, 8, 11],
//                 [4, 17, 6, 11, 8],
//                 [17, 19, 5, 13, 4],
//                 [19, 7, 15, 6, 17],
//                 [6, 15, 14, 2, 11],
//                 [19, 5, 9, 10, 7],
//                 [7, 10, 3, 14, 15],
//             ],
//             **kwargs,
//         )
