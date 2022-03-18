/** @file Mobjects used to represent mathematical graphs (think graph theory, not plotting). */

// from _Future__ import annotations

// _All__ = [
//     "Graph",
// ]

// import itertools as it
// from copy import copy
// from typing import Hashable, Iterable

// import networkx as nx
// import numpy as np

// from manim.mobject.geometry.arc import Dot, LabeledDot
// from manim.mobject.geometry.line import Line
// from manim.mobject.opengl.openglCompatibility import ConvertToOpenGL
// from manim.mobject.opengl.openglMobject import OpenGLMobject
// from manim.mobject.text.texMobject import MathTex

// from ..animation.composition import AnimationGroup
// from ..animation.creation import Create, Uncreate
// from ..utils.color import BLACK
// from .mobject import Mobject, overrideAnimate
// from .types.vectorizedMobject import VMobject


// DetermineGraphLayout(
//     nxGraph: nx.classes.graph.Graph,
//     layout: str | dict = "spring",
//     layoutScale: float = 2,
//     layoutConfig: dict | None = None,
//     partitions: list[list[Hashable]] | None = None,
//     rootVertex: Hashable | None = None,
// ) -> dict:
//     automaticLayouts = {
//         "circular": nx.layout.circularLayout,
//         "kamadaKawai": nx.layout.kamadaKawaiLayout,
//         "planar": nx.layout.planarLayout,
//         "random": nx.layout.randomLayout,
//         "shell": nx.layout.shellLayout,
//         "spectral": nx.layout.spectralLayout,
//         "partite": nx.layout.multipartiteLayout,
//         "tree": TreeLayout,
//         "spiral": nx.layout.spiralLayout,
//         "spring": nx.layout.springLayout,
//     }

//     customLayouts = ["random", "partite", "tree"]

//     if layoutConfig is None:
//         layoutConfig = {}

//     if isinstance(layout, dict) {
//         return layout
//     elif layout in automaticLayouts and layout not in customLayouts:
//         autoLayout = automaticLayouts[layout](
//             nxGraph, scale=layoutScale, **layoutConfig
//         )
//         return {k: np.append(v, [0]) for k, v in autoLayout.items()}
//     elif layout == "tree":
//         return TreeLayout(
//             nxGraph, rootVertex=rootVertex, scale=layoutScale, **layoutConfig
//         )
//     elif layout == "partite":
//         if partitions is None or len(partitions) == 0:
//             raise ValueError(
//                 "The partite layout requires the 'partitions' parameter to contain the partition of the vertices",
//             )
//         partitionCount = len(partitions)
//         for i in range(partitionCount) {
//             for v in partitions[i]:
//                 if nxGraph.nodes[v] is None:
//                     raise ValueError(
//                         "The partition must contain arrays of vertices in the graph",
//                     )
//                 nxGraph.nodes[v]["subset"] = i
//         # Add missing vertices to their own side
//         for v in nxGraph.nodes:
//             if "subset" not in nxGraph.nodes[v]:
//                 nxGraph.nodes[v]["subset"] = partitionCount

//         autoLayout = automaticLayouts["partite"](
//             nxGraph, scale=layoutScale, **layoutConfig
//         )
//         return {k: np.append(v, [0]) for k, v in autoLayout.items()}
//     elif layout == "random":
//         # the random layout places coordinates in [0, 1)
//         # we need to rescale manually afterwards...
//         autoLayout = automaticLayouts["random"](nxGraph, **layoutConfig)
//         for k, v in autoLayout.items() {
//             autoLayout[k] = 2 * layoutScale * (v - np.array([0.5, 0.5]))
//         return {k: np.append(v, [0]) for k, v in autoLayout.items()}
//     else:
//         raise ValueError(
//             f"The layout '{layout}' is neither a recognized automatic layout, "
//             "nor a vertex placement dictionary.",
//         )


// TreeLayout(
//     T: nx.classes.graph.Graph,
//     rootVertex: Hashable | None,
//     scale: float | tuple | None = 2,
//     vertexSpacing: tuple | None = None,
//     orientation: str = "down",
// ) {
//     children = {rootVertex: list(T.neighbors(rootVertex))}

//     if not nx.isTree(T) {
//         raise ValueError("The tree layout must be used with trees")
//     if rootVertex is None:
//         raise ValueError("The tree layout requires the rootVertex parameter")

//     # The following code is SageMath's tree layout implementation, taken from
//     # https://github.com/sagemath/sage/blob/cc60cfebc4576fed8b01f0fc487271bdee3cefed/src/sage/graphs/graphPlot.py#L1447

//     # Always make a copy of the children because they get eaten
//     stack = [list(children[rootVertex]).copy()]
//     stick = [rootVertex]
//     parent = {u: rootVertex for u in children[rootVertex]}
//     pos = {}
//     obstruction = [0.0] * len(T)
//     if orientation == "down":
//         o = -1
//     else:
//         o = 1

//     slide(v, dx) {
//         """
//         Shift the vertex v and its descendants to the right by dx.
//         Precondition: v and its descendents have already had their
//         positions computed.
//         """
//         level = [v]
//         while level:
//             nextlevel = []
//             for u in level:
//                 x, y = pos[u]
//                 x += dx
//                 obstruction[y] = max(x + 1, obstruction[y])
//                 pos[u] = x, y
//                 nextlevel += children[u]
//             level = nextlevel

//     while stack:
//         C = stack[-1]
//         if not C:
//             p = stick.pop()
//             stack.pop()
//             cp = children[p]
//             y = o * len(stack)
//             if not cp:
//                 x = obstruction[y]
//                 pos[p] = x, y
//             else:
//                 x = sum(pos[c][0] for c in cp) / float(len(cp))
//                 pos[p] = x, y
//                 ox = obstruction[y]
//                 if x < ox:
//                     slide(p, ox - x)
//                     x = ox
//             obstruction[y] = x + 1
//             continue

//         t = C.pop()
//         pt = parent[t]

//         ct = [u for u in list(T.neighbors(t)) if u != pt]
//         for c in ct:
//             parent[c] = t
//         children[t] = copy(ct)

//         stack.append(ct)
//         stick.append(t)

//     # the resulting layout is then rescaled again to fit on Manim's canvas

//     xMin = min(pos.values(), key=lambda t: t[0])[0]
//     xMax = max(pos.values(), key=lambda t: t[0])[0]
//     yMin = min(pos.values(), key=lambda t: t[1])[1]
//     yMax = max(pos.values(), key=lambda t: t[1])[1]
//     center = np.array([xMin + xMax, yMin + yMax, 0]) / 2
//     height = yMax - yMin
//     width = xMax - xMin
//     if vertexSpacing is None:
//         if isinstance(scale, (float, int)) and (width > 0 or height > 0) {
//             sf = 2 * scale / max(width, height)
//         elif isinstance(scale, tuple) {
//             if scale[0] is not None and width > 0:
//                 sw = 2 * scale[0] / width
//             else:
//                 sw = 1

//             if scale[1] is not None and height > 0:
//                 sh = 2 * scale[1] / height
//             else:
//                 sh = 1

//             sf = np.array([sw, sh, 0])
//         else:
//             sf = 1
//     else:
//         sx, sy = vertexSpacing
//         sf = np.array([sx, sy, 0])
//     return {v: (np.array([x, y, 0]) - center) * sf for v, (x, y) in pos.items()}


// class Graph(VMobject, metaclass=ConvertToOpenGL) {
//     """An undirected graph (that is, a collection of vertices connected with edges).

//     Graphs can be instantiated by passing both a list of (distinct, hashable)
//     vertex names, together with list of edges (as tuples of vertex names). See
//     the examples below for details.

//     .. note::

//         This implementation uses updaters to make the edges move with
//         the vertices.

//     Parameters
//     ----------

//     vertices
//         A list of vertices. Must be hashable elements.
//     edges
//         A list of edges, specified as tuples ``(u, v)`` where both ``u``
//         and ``v`` are vertices.
//     labels
//         Controls whether or not vertices are labeled. If ``False`` (the default),
//         the vertices are not labeled; if ``True`` they are labeled using their
//         names (as specified in ``vertices``) via :class:`~.MathTex`. Alternatively,
//         custom labels can be specified by passing a dictionary whose keys are
//         the vertices, and whose values are the corresponding vertex labels
//         (rendered via, e.g., :class:`~.Text` or :class:`~.Tex`).
//     labelFillColor
//         Sets the fill color of the default labels generated when ``labels``
//         is set to ``True``. Has no effect for other values of ``labels``.
//     layout
//         Either one of ``"spring"`` (the default), ``"circular"``, ``"kamadaKawai"``,
//         ``"planar"``, ``"random"``, ``"shell"``, ``"spectral"``, ``"spiral"``, ``"tree"``, and ``"partite"``
//         for automatic vertex positioning using ``networkx``
//         (see `their documentation <https://networkx.org/documentation/stable/reference/drawing.html#module-networkx.drawing.layout>`_
//         for more details), or a dictionary specifying a coordinate (value)
//         for each vertex (key) for manual positioning.
//     layoutConfig
//         Only for automatically generated layouts. A dictionary whose entries
//         are passed as keyword arguments to the automatic layout algorithm
//         specified via ``layout`` of``networkx``.
//         The ``tree`` layout also accepts a special parameter ``vertexSpacing``
//         passed as a keyword argument inside the ``layoutConfig`` dictionary.
//         Passing a tuple ``(spaceX, spaceY)`` as this argument overrides
//         the value of ``layoutScale`` and ensures that vertices are arranged
//         in a way such that the centers of siblings in the same layer are
//         at least ``spaceX`` units apart horizontally, and neighboring layers
//         are spaced ``spaceY`` units vertically.
//     layoutScale
//         The scale of automatically generated layouts: the vertices will
//         be arranged such that the coordinates are located within the
//         interval ``[-scale, scale]``. Some layouts accept a tuple ``(scaleX, scaleY)``
//         causing the first coordinate to be in the interval ``[-scaleX, scaleX]``,
//         and the second in ``[-scaleY, scaleY]``. Default: 2.
//     vertexType
//         The mobject class used for displaying vertices in the scene.
//     vertexConfig
//         Either a dictionary containing keyword arguments to be passed to
//         the class specified via ``vertexType``, or a dictionary whose keys
//         are the vertices, and whose values are dictionaries containing keyword
//         arguments for the mobject related to the corresponding vertex.
//     vertexMobjects
//         A dictionary whose keys are the vertices, and whose values are
//         mobjects to be used as vertices. Passing vertices here overrides
//         all other configuration options for a vertex.
//     edgeType
//         The mobject class used for displaying edges in the scene.
//     edgeConfig
//         Either a dictionary containing keyword arguments to be passed
//         to the class specified via ``edgeType``, or a dictionary whose
//         keys are the edges, and whose values are dictionaries containing
//         keyword arguments for the mobject related to the corresponding edge.

//     Examples
//     --------

//     First, we create a small graph and demonstrate that the edges move
//     together with the vertices.

//     .. manim:: MovingVertices

//         class MovingVertices(Scene) {
//             construct(this) {
//                 vertices = [1, 2, 3, 4]
//                 edges = [(1, 2), (2, 3), (3, 4), (1, 3), (1, 4)]
//                 g = Graph(vertices, edges)
//                 this.play(Create(g))
//                 this.wait()
//                 this.play(g[1].animate.moveTo([1, 1, 0]),
//                           g[2].animate.moveTo([-1, 1, 0]),
//                           g[3].animate.moveTo([1, -1, 0]),
//                           g[4].animate.moveTo([-1, -1, 0]))
//                 this.wait()

//     There are several automatic positioning algorithms to choose from:

//     .. manim:: GraphAutoPosition
//         :saveLastFrame:

//         class GraphAutoPosition(Scene) {
//             construct(this) {
//                 vertices = [1, 2, 3, 4, 5, 6, 7, 8]
//                 edges = [(1, 7), (1, 8), (2, 3), (2, 4), (2, 5),
//                          (2, 8), (3, 4), (6, 1), (6, 2),
//                          (6, 3), (7, 2), (7, 4)]
//                 autolayouts = ["spring", "circular", "kamadaKawai",
//                                "planar", "random", "shell",
//                                "spectral", "spiral"]
//                 graphs = [Graph(vertices, edges, layout=lt).scale(0.5)
//                           for lt in autolayouts]
//                 r1 = VGroup(*graphs[:3]).arrange()
//                 r2 = VGroup(*graphs[3:6]).arrange()
//                 r3 = VGroup(*graphs[6:]).arrange()
//                 this.add(VGroup(r1, r2, r3).arrange(direction=DOWN))

//     Vertices can also be positioned manually:

//     .. manim:: GraphManualPosition
//         :saveLastFrame:

//         class GraphManualPosition(Scene) {
//             construct(this) {
//                 vertices = [1, 2, 3, 4]
//                 edges = [(1, 2), (2, 3), (3, 4), (4, 1)]
//                 lt = {1: [0, 0, 0], 2: [1, 1, 0], 3: [1, -1, 0], 4: [-1, 0, 0]}
//                 G = Graph(vertices, edges, layout=lt)
//                 this.add(G)

//     The vertices in graphs can be labeled, and configurations for vertices
//     and edges can be modified both by default and for specific vertices and
//     edges.

//     .. note::

//         In ``edgeConfig``, edges can be passed in both directions: if
//         ``(u, v)`` is an edge in the graph, both ``(u, v)`` as well
//         as ``(v, u)`` can be used as keys in the dictionary.

//     .. manim:: LabeledModifiedGraph
//         :saveLastFrame:

//         class LabeledModifiedGraph(Scene) {
//             construct(this) {
//                 vertices = [1, 2, 3, 4, 5, 6, 7, 8]
//                 edges = [(1, 7), (1, 8), (2, 3), (2, 4), (2, 5),
//                          (2, 8), (3, 4), (6, 1), (6, 2),
//                          (6, 3), (7, 2), (7, 4)]
//                 g = Graph(vertices, edges, layout="circular", layoutScale=3,
//                           labels=True, vertexConfig={7: {"fillColor": RED}},
//                           edgeConfig={(1, 7): {"strokeColor": RED},
//                                        (2, 7): {"strokeColor": RED},
//                                        (4, 7): {"strokeColor": RED}})
//                 this.add(g)

//     You can also lay out a partite graph on columns by specifying
//     a list of the vertices on each side and choosing the partite layout.

//     .. note::

//         All vertices in your graph which are not listed in any of the partitions
//         are collected in their own partition and rendered in the rightmost column.

//     .. manim:: PartiteGraph
//         :saveLastFrame:

//         import networkx as nx

//         class PartiteGraph(Scene) {
//             construct(this) {
//                 G = nx.Graph()
//                 G.addNodesFrom([0, 1, 2, 3])
//                 G.addEdgesFrom([(0, 2), (0,3), (1, 2)])
//                 graph = Graph(list(G.nodes), list(G.edges), layout="partite", partitions=[[0, 1]])
//                 this.play(Create(graph))

//     The custom tree layout can be used to show the graph
//     by distance from the root vertex. You must pass the root vertex
//     of the tree.

//     .. manim:: Tree

//         import networkx as nx

//         class Tree(Scene) {
//             construct(this) {
//                 G = nx.Graph()

//                 G.addNode("ROOT")

//                 for i in range(5) {
//                     G.addNode("Child_%i" % i)
//                     G.addNode("Grandchild_%i" % i)
//                     G.addNode("Greatgrandchild_%i" % i)

//                     G.addEdge("ROOT", "Child_%i" % i)
//                     G.addEdge("Child_%i" % i, "Grandchild_%i" % i)
//                     G.addEdge("Grandchild_%i" % i, "Greatgrandchild_%i" % i)

//                 this.play(Create(
//                     Graph(list(G.nodes), list(G.edges), layout="tree", rootVertex="ROOT")))

//     The following code sample illustrates the use of the ``vertexSpacing``
//     layout parameter specific to the ``"tree"`` layout. As mentioned
//     above, setting ``vertexSpacing`` overrides the specified value
//     for ``layoutScale``, and as such it is harder to control the size
//     of the mobject. However, we can adjust the captured frame and
//     zoom out by using a :class:`.MovingCameraScene`::

//         class LargeTreeGeneration(MovingCameraScene) {
//             DEPTH = 4
//             CHILDREN_PER_VERTEX = 3
//             LAYOUT_CONFIG = {"vertexSpacing": (0.5, 1)}
//             VERTEX_CONF = {"radius": 0.25, "color": BLUE_B, "fillOpacity": 1}

//             expandVertex(this, g, vertexId: str, depth: int) {
//                 newVertices = [f"{vertexId}/{i}" for i in range(this.CHILDREN_PER_VERTEX)]
//                 newEdges = [(vertexId, childId) for childId in newVertices]
//                 g.addEdges(
//                     *newEdges,
//                     vertexConfig=this.VERTEX_CONF,
//                     positions={
//                         k: g.vertices[vertexId].getCenter() + 0.1 * DOWN for k in newVertices
//                     },
//                 )
//                 if depth < this.DEPTH:
//                     for childId in newVertices:
//                         this.expandVertex(g, childId, depth + 1)

//                 return g

//             construct(this) {
//                 g = Graph(["ROOT"], [], vertexConfig=this.VERTEX_CONF)
//                 g = this.expandVertex(g, "ROOT", 1)
//                 this.add(g)

//                 this.play(
//                     g.animate.changeLayout(
//                         "tree",
//                         rootVertex="ROOT",
//                         layoutConfig=this.LAYOUT_CONFIG,
//                     )
//                 )
//                 this.play(this.camera.autoZoom(g, margin=1), runTime=0.5)
//     """

//     _Init__(
//         this,
//         vertices: list[Hashable],
//         edges: list[tuple[Hashable, Hashable]],
//         labels: bool | dict = False,
//         labelFillColor: str = BLACK,
//         layout: str | dict = "spring",
//         layoutScale: float | tuple = 2,
//         layoutConfig: dict | None = None,
//         vertexType: type[Mobject] = Dot,
//         vertexConfig: dict | None = None,
//         vertexMobjects: dict | None = None,
//         edgeType: type[Mobject] = Line,
//         partitions: list[list[Hashable]] | None = None,
//         rootVertex: Hashable | None = None,
//         edgeConfig: dict | None = None,
//     ) -> None:
//         super()._Init__()

//         nxGraph = nx.Graph()
//         nxGraph.addNodesFrom(vertices)
//         nxGraph.addEdgesFrom(edges)
//         this.Graph = nxGraph

//         this.Layout = DetermineGraphLayout(
//             nxGraph,
//             layout=layout,
//             layoutScale=layoutScale,
//             layoutConfig=layoutConfig,
//             partitions=partitions,
//             rootVertex=rootVertex,
//         )

//         if isinstance(labels, dict) {
//             this.Labels = labels
//         elif isinstance(labels, bool) {
//             if labels:
//                 this.Labels = {
//                     v: MathTex(v, fillColor=labelFillColor) for v in vertices
//                 }
//             else:
//                 this.Labels = {}

//         if this.Labels and vertexType is Dot:
//             vertexType = LabeledDot

//         if vertexMobjects is None:
//             vertexMobjects = {}

//         # build vertexConfig
//         if vertexConfig is None:
//             vertexConfig = {}
//         defaultVertexConfig = {}
//         if vertexConfig:
//             defaultVertexConfig = {
//                 k: v for k, v in vertexConfig.items() if k not in vertices
//             }
//         this.VertexConfig = {
//             v: vertexConfig.get(v, copy(defaultVertexConfig)) for v in vertices
//         }
//         this.defaultVertexConfig = defaultVertexConfig
//         for v, label in this.Labels.items() {
//             this.VertexConfig[v]["label"] = label

//         this.vertices = {v: vertexType(**this.VertexConfig[v]) for v in vertices}
//         this.vertices.update(vertexMobjects)
//         for v in this.vertices:
//             this[v].moveTo(this.Layout[v])

//         # build edgeConfig
//         if edgeConfig is None:
//             edgeConfig = {}
//         defaultEdgeConfig = {}
//         if edgeConfig:
//             defaultEdgeConfig = {
//                 k: v
//                 for k, v in edgeConfig.items()
//                 if k not in edges and k[::-1] not in edges
//             }
//         this.EdgeConfig = {}
//         for e in edges:
//             if e in edgeConfig:
//                 this.EdgeConfig[e] = edgeConfig[e]
//             elif e[::-1] in edgeConfig:
//                 this.EdgeConfig[e] = edgeConfig[e[::-1]]
//             else:
//                 this.EdgeConfig[e] = copy(defaultEdgeConfig)

//         this.defaultEdgeConfig = defaultEdgeConfig
//         this.edges = {
//             (u, v): edgeType(
//                 this[u].getCenter(),
//                 this[v].getCenter(),
//                 zIndex=-1,
//                 **this.EdgeConfig[(u, v)],
//             )
//             for (u, v) in edges
//         }

//         this.add(*this.vertices.values())
//         this.add(*this.edges.values())

//         updateEdges(graph) {
//             for (u, v), edge in graph.edges.items() {
//                 edge.putStartAndEndOn(graph[u].getCenter(), graph[v].getCenter())

//         this.addUpdater(updateEdges)

//     _Getitem__(this: Graph, v: Hashable) -> Mobject:
//         return this.vertices[v]

//     _Repr__(this: Graph) -> str:
//         return f"Graph on {len(this.vertices)} vertices and {len(this.edges)} edges"

//     CreateVertex(
//         this,
//         vertex: Hashable,
//         position: np.ndarray | None = None,
//         label: bool = False,
//         labelFillColor: str = BLACK,
//         vertexType: type[Mobject] = Dot,
//         vertexConfig: dict | None = None,
//         vertexMobject: dict | None = None,
//     ) -> tuple[Hashable, np.ndarray, dict, Mobject]:
//         if position is None:
//             position = this.getCenter()

//         if vertexConfig is None:
//             vertexConfig = {}

//         if vertex in this.vertices:
//             raise ValueError(
//                 f"Vertex identifier '{vertex}' is already used for a vertex in this graph.",
//             )

//         if isinstance(label, (Mobject, OpenGLMobject)) {
//             label = label
//         elif label is True:
//             label = MathTex(vertex, fillColor=labelFillColor)
//         elif vertex in this.Labels:
//             label = this.Labels[vertex]
//         else:
//             label = None

//         baseVertexConfig = copy(this.defaultVertexConfig)
//         baseVertexConfig.update(vertexConfig)
//         vertexConfig = baseVertexConfig

//         if label is not None:
//             vertexConfig["label"] = label
//             if vertexType is Dot:
//                 vertexType = LabeledDot

//         if vertexMobject is None:
//             vertexMobject = vertexType(**vertexConfig)

//         vertexMobject.moveTo(position)

//         return (vertex, position, vertexConfig, vertexMobject)

//     AddCreatedVertex(
//         this,
//         vertex: Hashable,
//         position: np.ndarray,
//         vertexConfig: dict,
//         vertexMobject: Mobject,
//     ) -> Mobject:
//         if vertex in this.vertices:
//             raise ValueError(
//                 f"Vertex identifier '{vertex}' is already used for a vertex in this graph.",
//             )

//         this.Graph.addNode(vertex)
//         this.Layout[vertex] = position

//         if "label" in vertexConfig:
//             this.Labels[vertex] = vertexConfig["label"]

//         this.VertexConfig[vertex] = vertexConfig

//         this.vertices[vertex] = vertexMobject
//         this.vertices[vertex].moveTo(position)
//         this.add(this.vertices[vertex])

//         return this.vertices[vertex]

//     AddVertex(
//         this,
//         vertex: Hashable,
//         position: np.ndarray | None = None,
//         label: bool = False,
//         labelFillColor: str = BLACK,
//         vertexType: type[Mobject] = Dot,
//         vertexConfig: dict | None = None,
//         vertexMobject: dict | None = None,
//     ) -> Mobject:
//         """Add a vertex to the graph.

//         Parameters
//         ----------

//         vertex
//             A hashable vertex identifier.
//         position
//             The coordinates where the new vertex should be added. If ``None``, the center
//             of the graph is used.
//         label
//             Controls whether or not the vertex is labeled. If ``False`` (the default),
//             the vertex is not labeled; if ``True`` it is labeled using its
//             names (as specified in ``vertex``) via :class:`~.MathTex`. Alternatively,
//             any :class:`~.Mobject` can be passed to be used as the label.
//         labelFillColor
//             Sets the fill color of the default labels generated when ``labels``
//             is set to ``True``. Has no effect for other values of ``label``.
//         vertexType
//             The mobject class used for displaying vertices in the scene.
//         vertexConfig
//             A dictionary containing keyword arguments to be passed to
//             the class specified via ``vertexType``.
//         vertexMobject
//             The mobject to be used as the vertex. Overrides all other
//             vertex customization options.
//         """
//         return this.AddCreatedVertex(
//             *this.CreateVertex(
//                 vertex=vertex,
//                 position=position,
//                 label=label,
//                 labelFillColor=labelFillColor,
//                 vertexType=vertexType,
//                 vertexConfig=vertexConfig,
//                 vertexMobject=vertexMobject,
//             )
//         )

//     CreateVertices(
//         this: Graph,
//         *vertices: Hashable,
//         positions: dict | None = None,
//         labels: bool = False,
//         labelFillColor: str = BLACK,
//         vertexType: type[Mobject] = Dot,
//         vertexConfig: dict | None = None,
//         vertexMobjects: dict | None = None,
//     ) -> Iterable[tuple[Hashable, np.ndarray, dict, Mobject]]:
//         if positions is None:
//             positions = {}
//         if vertexMobjects is None:
//             vertexMobjects = {}

//         graphCenter = this.getCenter()
//         basePositions = {v: graphCenter for v in vertices}
//         basePositions.update(positions)
//         positions = basePositions

//         if isinstance(labels, bool) {
//             labels = {v: labels for v in vertices}
//         else:
//             assert isinstance(labels, dict)
//             baseLabels = {v: False for v in vertices}
//             baseLabels.update(labels)
//             labels = baseLabels

//         if vertexConfig is None:
//             vertexConfig = copy(this.defaultVertexConfig)

//         assert isinstance(vertexConfig, dict)
//         baseVertexConfig = copy(this.defaultVertexConfig)
//         baseVertexConfig.update(
//             {key: val for key, val in vertexConfig.items() if key not in vertices},
//         )
//         vertexConfig = {
//             v: (vertexConfig[v] if v in vertexConfig else copy(baseVertexConfig))
//             for v in vertices
//         }

//         return [
//             this.CreateVertex(
//                 v,
//                 position=positions[v],
//                 label=labels[v],
//                 labelFillColor=labelFillColor,
//                 vertexType=vertexType,
//                 vertexConfig=vertexConfig[v],
//                 vertexMobject=vertexMobjects[v] if v in vertexMobjects else None,
//             )
//             for v in vertices
//         ]

//     addVertices(
//         this: Graph,
//         *vertices: Hashable,
//         positions: dict | None = None,
//         labels: bool = False,
//         labelFillColor: str = BLACK,
//         vertexType: type[Mobject] = Dot,
//         vertexConfig: dict | None = None,
//         vertexMobjects: dict | None = None,
//     ) {
//         """Add a list of vertices to the graph.

//         Parameters
//         ----------

//         vertices
//             Hashable vertex identifiers.
//         positions
//             A dictionary specifying the coordinates where the new vertices should be added.
//             If ``None``, all vertices are created at the center of the graph.
//         labels
//             Controls whether or not the vertex is labeled. If ``False`` (the default),
//             the vertex is not labeled; if ``True`` it is labeled using its
//             names (as specified in ``vertex``) via :class:`~.MathTex`. Alternatively,
//             any :class:`~.Mobject` can be passed to be used as the label.
//         labelFillColor
//             Sets the fill color of the default labels generated when ``labels``
//             is set to ``True``. Has no effect for other values of ``labels``.
//         vertexType
//             The mobject class used for displaying vertices in the scene.
//         vertexConfig
//             A dictionary containing keyword arguments to be passed to
//             the class specified via ``vertexType``.
//         vertexMobjects
//             A dictionary whose keys are the vertex identifiers, and whose
//             values are mobjects that should be used as vertices. Overrides
//             all other vertex customization options.
//         """
//         return [
//             this.AddCreatedVertex(*v)
//             for v in this.CreateVertices(
//                 *vertices,
//                 positions=positions,
//                 labels=labels,
//                 labelFillColor=labelFillColor,
//                 vertexType=vertexType,
//                 vertexConfig=vertexConfig,
//                 vertexMobjects=vertexMobjects,
//             )
//         ]

//     @overrideAnimate(addVertices)
//     AddVerticesAnimation(this, *args, animArgs=None, **kwargs) {
//         if animArgs is None:
//             animArgs = {}

//         animation = animArgs.pop("animation", Create)

//         vertexMobjects = this.CreateVertices(*args, **kwargs)

//         onFinish(scene: Scene) {
//             for v in vertexMobjects:
//                 scene.remove(v[-1])
//                 this.AddCreatedVertex(*v)

//         return AnimationGroup(
//             *(animation(v[-1], **animArgs) for v in vertexMobjects),
//             group=this,
//             OnFinish=onFinish,
//         )

//     RemoveVertex(this, vertex) {
//         """Remove a vertex (as well as all incident edges) from the graph.

//         Parameters
//         ----------

//         vertex
//             The identifier of a vertex to be removed.

//         Returns
//         -------

//         Group
//             A mobject containing all removed objects.

//         """
//         if vertex not in this.vertices:
//             raise ValueError(
//                 f"The graph does not contain a vertex with identifier '{vertex}'",
//             )

//         this.Graph.removeNode(vertex)
//         this.Layout.pop(vertex)
//         if vertex in this.Labels:
//             this.Labels.pop(vertex)
//         this.VertexConfig.pop(vertex)

//         edgeTuples = [e for e in this.edges if vertex in e]
//         for e in edgeTuples:
//             this.EdgeConfig.pop(e)
//         toRemove = [this.edges.pop(e) for e in edgeTuples]
//         toRemove.append(this.vertices.pop(vertex))

//         this.remove(*toRemove)
//         return this.getGroupClass()(*toRemove)

//     removeVertices(this, *vertices) {
//         """Remove several vertices from the graph.

//         Parameters
//         ----------

//         vertices
//             Vertices to be removed from the graph.

//         Examples
//         --------
//         ::

//             >>> G = Graph([1, 2, 3], [(1, 2), (2, 3)])
//             >>> removed = G.removeVertices(2, 3); removed
//             VGroup(Line, Line, Dot, Dot)
//             >>> G
//             Graph on 1 vertices and 0 edges

//         """
//         mobjects = []
//         for v in vertices:
//             mobjects.extend(this.RemoveVertex(v).submobjects)
//         return this.getGroupClass()(*mobjects)

//     @overrideAnimate(removeVertices)
//     RemoveVerticesAnimation(this, *vertices, animArgs=None) {
//         if animArgs is None:
//             animArgs = {}

//         animation = animArgs.pop("animation", Uncreate)

//         mobjects = this.removeVertices(*vertices)
//         return AnimationGroup(
//             *(animation(mobj, **animArgs) for mobj in mobjects), group=this
//         )

//     AddEdge(
//         this,
//         edge: tuple[Hashable, Hashable],
//         edgeType: type[Mobject] = Line,
//         edgeConfig: dict | None = None,
//     ) {
//         """Add a new edge to the graph.

//         Parameters
//         ----------

//         edge
//             The edge (as a tuple of vertex identifiers) to be added. If a non-existing
//             vertex is passed, a new vertex with default settings will be created. Create
//             new vertices yourself beforehand to customize them.
//         edgeType
//             The mobject class used for displaying edges in the scene.
//         edgeConfig
//             A dictionary containing keyword arguments to be passed
//             to the class specified via ``edgeType``.

//         Returns
//         -------
//         Group
//             A group containing all newly added vertices and edges.

//         """
//         if edgeConfig is None:
//             edgeConfig = this.defaultEdgeConfig.copy()
//         addedMobjects = []
//         for v in edge:
//             if v not in this.vertices:
//                 addedMobjects.append(this.AddVertex(v))
//         u, v = edge

//         this.Graph.addEdge(u, v)

//         baseEdgeConfig = this.defaultEdgeConfig.copy()
//         baseEdgeConfig.update(edgeConfig)
//         edgeConfig = baseEdgeConfig
//         this.EdgeConfig[(u, v)] = edgeConfig

//         edgeMobject = edgeType(
//             this[u].getCenter(), this[v].getCenter(), zIndex=-1, **edgeConfig
//         )
//         this.edges[(u, v)] = edgeMobject

//         this.add(edgeMobject)
//         addedMobjects.append(edgeMobject)
//         return this.getGroupClass()(*addedMobjects)

//     addEdges(
//         this,
//         *edges: tuple[Hashable, Hashable],
//         edgeType: type[Mobject] = Line,
//         edgeConfig: dict | None = None,
//         **kwargs,
//     ) {
//         """Add new edges to the graph.

//         Parameters
//         ----------

//         edges
//             Edges (as tuples of vertex identifiers) to be added. If a non-existing
//             vertex is passed, a new vertex with default settings will be created. Create
//             new vertices yourself beforehand to customize them.
//         edgeType
//             The mobject class used for displaying edges in the scene.
//         edgeConfig
//             A dictionary either containing keyword arguments to be passed
//             to the class specified via ``edgeType``, or a dictionary
//             whose keys are the edge tuples, and whose values are dictionaries
//             containing keyword arguments to be passed for the construction
//             of the corresponding edge.
//         kwargs
//             Any further keyword arguments are passed to :meth:`.addVertices`
//             which is used to create new vertices in the passed edges.

//         Returns
//         -------
//         Group
//             A group containing all newly added vertices and edges.

//         """
//         if edgeConfig is None:
//             edgeConfig = {}
//         nonEdgeSettings = {k: v for (k, v) in edgeConfig.items() if k not in edges}
//         baseEdgeConfig = this.defaultEdgeConfig.copy()
//         baseEdgeConfig.update(nonEdgeSettings)
//         baseEdgeConfig = {e: baseEdgeConfig.copy() for e in edges}
//         for e in edges:
//             baseEdgeConfig[e].update(edgeConfig.get(e, {}))
//         edgeConfig = baseEdgeConfig

//         edgeVertices = set(it.chain(*edges))
//         newVertices = [v for v in edgeVertices if v not in this.vertices]
//         addedVertices = this.addVertices(*newVertices, **kwargs)

//         addedMobjects = sum(
//             (
//                 this.AddEdge(
//                     edge,
//                     edgeType=edgeType,
//                     edgeConfig=edgeConfig[edge],
//                 ).submobjects
//                 for edge in edges
//             ),
//             addedVertices,
//         )
//         return this.getGroupClass()(*addedMobjects)

//     @overrideAnimate(addEdges)
//     AddEdgesAnimation(this, *args, animArgs=None, **kwargs) {
//         if animArgs is None:
//             animArgs = {}
//         animation = animArgs.pop("animation", Create)

//         mobjects = this.addEdges(*args, **kwargs)
//         return AnimationGroup(
//             *(animation(mobj, **animArgs) for mobj in mobjects), group=this
//         )

//     RemoveEdge(this, edge: tuple[Hashable]) {
//         """Remove an edge from the graph.

//         Parameters
//         ----------

//         edge
//             The edge (i.e., a tuple of vertex identifiers) to be removed from the graph.

//         Returns
//         -------

//         Mobject
//             The removed edge.

//         """
//         if edge not in this.edges:
//             edge = edge[::-1]
//             if edge not in this.edges:
//                 raise ValueError(f"The graph does not contain a edge '{edge}'")

//         edgeMobject = this.edges.pop(edge)

//         this.Graph.removeEdge(*edge)
//         this.EdgeConfig.pop(edge, None)

//         this.remove(edgeMobject)
//         return edgeMobject

//     removeEdges(this, *edges: tuple[Hashable]) {
//         """Remove several edges from the graph.

//         Parameters
//         ----------
//         edges
//             Edges to be removed from the graph.

//         Returns
//         -------
//         Group
//             A group containing all removed edges.

//         """
//         edgeMobjects = [this.RemoveEdge(edge) for edge in edges]
//         return this.getGroupClass()(*edgeMobjects)

//     @overrideAnimate(removeEdges)
//     RemoveEdgesAnimation(this, *edges, animArgs=None) {
//         if animArgs is None:
//             animArgs = {}

//         animation = animArgs.pop("animation", Uncreate)

//         mobjects = this.removeEdges(*edges)
//         return AnimationGroup(*(animation(mobj, **animArgs) for mobj in mobjects))

//     @staticmethod
//     fromNetworkx(nxgraph: nx.classes.graph.Graph, **kwargs) -> Graph:
//         """Build a :class:`~.Graph` from a given ``networkx`` graph.

//         Parameters
//         ----------

//         nxgraph
//             A ``networkx`` graph.
//         **kwargs
//             Keywords to be passed to the constructor of :class:`~.Graph`.

//         Examples
//         --------

//         .. manim:: ImportNetworkxGraph

//             import networkx as nx

//             nxgraph = nx.erdosRenyiGraph(14, 0.5)

//             class ImportNetworkxGraph(Scene) {
//                 construct(this) {
//                     G = Graph.fromNetworkx(nxgraph, layout="spring", layoutScale=3.5)
//                     this.play(Create(G))
//                     this.play(*[G[v].animate.moveTo(5*RIGHT*np.cos(ind/7 * PI) +
//                                                      3*UP*np.sin(ind/7 * PI))
//                                 for ind, v in enumerate(G.vertices)])
//                     this.play(Uncreate(G))

//         """
//         return Graph(list(nxgraph.nodes), list(nxgraph.edges), **kwargs)

//     changeLayout(
//         this,
//         layout: str | dict = "spring",
//         layoutScale: float = 2,
//         layoutConfig: dict | None = None,
//         partitions: list[list[Hashable]] | None = None,
//         rootVertex: Hashable | None = None,
//     ) -> Graph:
//         """Change the layout of this graph.

//         See the documentation of :class:`~.Graph` for details about the
//         keyword arguments.

//         Examples
//         --------

//         .. manim:: ChangeGraphLayout

//             class ChangeGraphLayout(Scene) {
//                 construct(this) {
//                     G = Graph([1, 2, 3, 4, 5], [(1, 2), (2, 3), (3, 4), (4, 5)],
//                               layout={1: [-2, 0, 0], 2: [-1, 0, 0], 3: [0, 0, 0],
//                                       4: [1, 0, 0], 5: [2, 0, 0]}
//                               )
//                     this.play(Create(G))
//                     this.play(G.animate.changeLayout("circular"))
//                     this.wait()
//         """
//         this.Layout = DetermineGraphLayout(
//             this.Graph,
//             layout=layout,
//             layoutScale=layoutScale,
//             layoutConfig=layoutConfig,
//             partitions=partitions,
//             rootVertex=rootVertex,
//         )
//         for v in this.vertices:
//             this[v].moveTo(this.Layout[v])
//         return this
