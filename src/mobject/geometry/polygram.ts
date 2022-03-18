/** @file Mobjects that are simple geometric shapes. */

import {DEFAULT_DOT_RADIUS, DL, DOWN, DR, ORIGIN, RIGHT, TWOPI, UL, UR} from "../../constants";
import {BLUE, WHITE} from "../../utils/color";
import {ArcBetweenPoints} from "../geometry/arc";
import {$add, $cross, $dot, $gcd, $normalize, $scale, $sign, $sub, $zip, Pt3, Vec3} from "../../utils/js";
import {adjacentNTuples, adjacentPairs} from "../../utils/iterables";
import {Line} from "../geometry/line";
import {angleBetweenVectors, angleOfVector, normalize, regularVertices} from "../../utils/space_ops";
import {Mobject} from "../mobject";
import {VGroup, VMobject} from "../types/vectorized_mobject";
import {range} from "@liqvid/utils/misc";
import {count} from "console";

// __all__ = [
//     "Polygram",
//     "Polygon",
//     "RegularPolygram",
//     "RegularPolygon",
//     "Star",
//     "Triangle",
//     "Rectangle",
//     "Square",
//     "RoundedRectangle",
//     "Cutout",
// ]

/**
 * A generalized {@link Polygon}, allowing for disconnected sets of edges.
 */
export class Polygram extends VMobject {
  constructor({vertexGroups, ...kwargs}: {
    /**
     * The groups of vertices making up the {@link Polygram}.
     * 
     * The first vertex in each group is repeated to close the shape.
     * Each point must be 3-dimensional: `[x,y,z]`
    */
    vertexGroups?: Vec3[][];
  } & ConstructorParameters<typeof VMobject>[0]) {
    super(kwargs);

    for (const vertices of vertexGroups) {
      let [firstVirtex, ...tail] = vertices;

      this.startNewPath(firstVirtex);
      this.addPointsAsCorners([...tail, firstVirtex]);
    }

    // def __init__(self, *vertex_groups: Iterable[Sequence[float]], color=BLUE, **kwargs) {
    //     super().__init__(color=color, **kwargs)

    //     for vertices in vertex_groups:
    //         first_vertex, *vertices = vertices
    //         first_vertex = np.array(first_vertex)

    //         self.start_new_path(first_vertex)
    //         self.add_points_as_corners(
    //             [*(np.array(vertex) for vertex in vertices), first_vertex],
    //         )
  }

  /**
   * Gets the vertices of the {@link Polygram}.
   * @returns The vertices of the {@link Polygram}.
   */
  getVertices(): Vec3[] {
    return this.getStartAnchors();
  }

  /**
   * Gets the vertex groups of the {@link Polygram}.
   * @returns The vertex groups of the {@link Polygram}.
   */
  getVertexGroups(): Vec3[][] {
    const vertexGroups: Vec3[][] = [];
    const group = [];

    for (const [start, end] of $zip(this.getStartAnchors(), this.getEndAnchors())) {
      group.push(start);

      if (this.considerPointsEqual(end, group[0])) {
        vertexGroups.push(group);
        group.length = 0;
      }
    }

    return vertexGroups;
  }


  /**
   * Rounds off the corners of the {@link Polygram}.
   * @param radius The curvature of the corners of the {@link Polygram}.
   */
  roundCorners(radius: number = 0.5): this {
    if (radius === 0) {
      return this;
    }

    const newPoints: Pt3[] = [];

    for (const vertices of this.getVertexGroups()) {
      const arcs: ArcBetweenPoints[] = [];

      for (const [v1, v2, v3] of adjacentNTuples(vertices, 3)) {
        const vect1 = $sub(v2, v1);
        const vect2 = $sub(v3, v2);
        const unitVect1 = normalize(vect1)
        const unitVect2 = normalize(vect2)

        let angle = angleBetweenVectors(vect1, vect2);
        // Negative radius gives concave curves
        angle *= $sign(radius)

        // Distance between vertex and start of the arc
        const cutOffLength = radius * Math.tan(angle / 2);

        // Determines counterclockwise vs.clockwise
        const sign = $sign($cross(vect1, vect2)[2]);
        const arc = new ArcBetweenPoints(
          $sub(v2, $scale(unitVect1, cutOffLength)),
          $add(v2, $scale(unitVect2, cutOffLength)),
          {angle: sign * angle}
        );
        arcs.push(arc);
      }

      // # To ensure that we loop through starting with last
      arcs.unshift(arcs.pop());

      for (const [arc1, arc2] of adjacentPairs(arcs)) {
        newPoints.push(...arc1.points);

        const line = new Line(arc1.getEnd(), arc2.getStart());

        // Make sure anchors are evenly distributed
        const lenRatio = line.getLength() / arc1.getArcLength();

        // line.insertNCurves(int(arc1.getNumCurves() * lenRatio))

        newPoints.push(...line.points);
      }
    }

    this.setPoints(newPoints);

    return this;
  }
  //     def round_corners(self, radius: float = 0.5) {

  //         if radius == 0:
  //             return self

  //         new_points = []

  //         for vertices in self.get_vertex_groups() {
  //             arcs = []
  //             for v1, v2, v3 in adjacent_n_tuples(vertices, 3) {
  //                 vect1 = v2 - v1
  //                 vect2 = v3 - v2
  //                 unit_vect1 = normalize(vect1)
  //                 unit_vect2 = normalize(vect2)

  //                 angle = angle_between_vectors(vect1, vect2)
  //                 # Negative radius gives concave curves
  //                 angle *= np.sign(radius)

  //                 # Distance between vertex and start of the arc
  //                 cut_off_length = radius * np.tan(angle / 2)

  //                 # Determines counterclockwise vs. clockwise
  //                 sign = np.sign(np.cross(vect1, vect2)[2])

  //                 arc = ArcBetweenPoints(
  //                     v2 - unit_vect1 * cut_off_length,
  //                     v2 + unit_vect2 * cut_off_length,
  //                     angle=sign * angle,
  //                 )
  //                 arcs.append(arc)

  //             # To ensure that we loop through starting with last
  //             arcs = [arcs[-1], *arcs[:-1]]
  //             from manim.mobject.geometry.line import Line

  //             for arc1, arc2 in adjacent_pairs(arcs) {
  //                 new_points.extend(arc1.points)

  //                 line = Line(arc1.get_end(), arc2.get_start())

  //                 # Make sure anchors are evenly distributed
  //                 len_ratio = line.get_length() / arc1.get_arc_length()

  //                 line.insert_n_curves(int(arc1.get_num_curves() * len_ratio))

  //                 new_points.extend(line.points)

  //         self.set_points(new_points)

  //         return self
}

/**
 * A shape consisting of one closed loop of vertices.
 */
export class Polygon extends Polygram {
  vertices: Pt3[];

  constructor({vertices, ...kwargs}: {
    vertices: Pt3[]
  } & ConstructorParameters<typeof Polygram>[0]) {
    super({vertexGroups: [vertices], ...kwargs});
  }
}

/** A {@link Polygram} with regularly spaced vertices. */
export class RegularPolygram extends Polygram {
  /** The angle the vertices start at; the rotation of the {@link RegularPolygram}. */
  startAngle: number;

  constructor({
    density = 2, numVertices, radius = 1, startAngle,
    ...kwargs
  }: {
    /**
     * The density of the {@link RegularPolygram}.
     * Can be thought of as how many vertices to hop
     * to draw a line between them. Every ``density``-th
     * vertex is connected.
    */
    density: number;

    /**
     * The number of vertices.
     */
    numVertices: number;

    /**
     * The radius of the circle that the vertices are placed on.
     */
    radius?: number;

    /**
     * The angle the vertices start at; the rotation of the {@link RegularPolygram}.
     */
    startAngle?: number;
  } & ConstructorParameters<typeof Polygram>[0]) {
    /*
    Regular polygrams can be expressed by the number of their vertices
    and their density. This relation can be expressed as its Schläfli
    symbol: {numVertices/density}.

    For instance, a pentagon can be expressed as {5/1} or just {5}.
    A pentagram, however, can be expressed as {5/2}.
    A hexagram *would* be expressed as {6/2}, except that 6 and 2
    are not coprime, and it can be simplified to 2{3}, which corresponds
    to the fact that a hexagram is actually made up of 2 triangles.

    See https://en.wikipedia.org/wiki/Polygram_(geometry)#GeneralizedRegularPolygons
    for more information. */

    const numGons = $gcd(numVertices, density);
    numVertices /= numGons;
    density /= numGons;

    // Utility function for generating the individual polygon vertices.
    function genPolygonVertices(__startAngle: number): [Vec3[], number] {
      const [regVertices, startAngle] = regularVertices(numVertices, {radius, startAngle: __startAngle});

      const vertices: Vec3[] = [];
      let i = 0;
      while (true) {
        vertices.push(regVertices[i]);

        i += density;
        i %= numVertices;
        if (i === 0) {
          break;
        }
      }

      return [vertices, startAngle];
    }

    const [firstGroup, selfStartAngle] = genPolygonVertices(startAngle);
    const vertexGroups = [firstGroup];

    for (let i = 1; i < numGons; ++i) {
      const startAngle = selfStartAngle + (i / numGons) * TWOPI / numVertices;
      const [group] = genPolygonVertices(startAngle);

      vertexGroups.push(group);
    }

    super({...kwargs, vertexGroups});
  }
}

/** An n-sided regular {@link Polygon}. */
export class RegularPolygon extends RegularPolygram {
  /** The number of sides of the {@link RegularPolygon}. */
  public n: number;

  constructor({n = 6, ...kwargs}: {
    n?: number;
  } & ConstructorParameters<typeof Mobject>[0]) {
    super({numVertices: n, density: 1, ...kwargs});
    this.n = n;
  }

  $render({svg}: {svg: SVGSVGElement}) {
    const [cx, cy] = this.points[0];
    const radius = 1;
    const startAngle = TWOPI / 4;
    let d = `M ${cx + radius * Math.cos(startAngle)} ${-cy - radius * Math.sin(startAngle)}`;
    for (let i = 1; i <= this.n; ++i) {
      const angle = startAngle + TWOPI * i / this.n;
      d += `L ${cx + radius * Math.cos(angle)} ${-cy - radius * Math.sin(angle)}`;
    }
    d += ` z`;

    const path = document.createElementNS(svg.namespaceURI, "path") as SVGPathElement;
    path.setAttribute("d", d);
    path.setAttribute("fill", this.color);
    svg.appendChild(path);
  }
}

// class Star(Polygon) {
//     """A regular polygram without the intersecting lines.

//     Parameters
//     ----------
//     n
//         How many points on the :class:`Star`.
//     outer_radius
//         The radius of the circle that the outer vertices are placed on.
//     inner_radius
//         The radius of the circle that the inner vertices are placed on.

//         If unspecified, the inner radius will be
//         calculated such that the edges of the :class:`Star`
//         perfectly follow the edges of its :class:`RegularPolygram`
//         counterpart.
//     density
//         The density of the :class:`Star`. Only used if
//         ``inner_radius`` is unspecified.

//         See :class:`RegularPolygram` for more information.
//     start_angle
//         The angle the vertices start at; the rotation of
//         the :class:`Star`.
//     kwargs
//         Forwardeds to the parent constructor.

//     Raises
//     ------
//     :exc:`ValueError`
//         If ``inner_radius`` is unspecified and ``density``
//         is not in the range ``[1, n/2)``.

//     def __init__(
//         self,
//         n: int = 5,
//         *,
//         outer_radius: float = 1,
//         inner_radius: float | None = None,
//         density: int = 2,
//         start_angle: float | None = TWOPI / 4,
//         **kwargs,
//     ) {
//         inner_angle = TWOPI / (2 * n)

//         if inner_radius is None:
//             # See https://math.stackexchange.com/a/2136292 for an
//             # overview of how to calculate the inner radius of a
//             # perfect star.

//             if density <= 0 or density >= n / 2:
//                 raise ValueError(
//                     f"Incompatible density {density} for number of points {n}",
//                 )

//             outer_angle = TWOPI * density / n
//             inverse_x = 1 - np.tan(inner_angle) * (
//                 (np.cos(outer_angle) - 1) / np.sin(outer_angle)
//             )

//             inner_radius = outer_radius / (np.cos(inner_angle) * inverse_x)

//         outer_vertices, self.start_angle = regular_vertices(
//             n,
//             radius=outer_radius,
//             start_angle=start_angle,
//         )
//         inner_vertices, _ = regular_vertices(
//             n,
//             radius=inner_radius,
//             start_angle=self.start_angle + inner_angle,
//         )

//         vertices = []
//         for pair in zip(outer_vertices, inner_vertices) {
//             vertices.extend(pair)

//         super().__init__(*vertices, **kwargs)

/** An equilateral triangle. */
export class Triangle extends RegularPolygon {
  constructor(args: ConstructorParameters<typeof RegularPolygon>[0]) {
    super({n: 3, ...args});
  }
}

/** A quadrilateral with two sets of parallel sides. */
export class Rectangle extends Polygon {
  /** The color of the rectangle. */
  color: string;

  constructor({
    gridXstep, gridYstep,
    height = 2.0,
    width = 4.0,
    ...kwargs
  }: {
    /** Space between vertical grid lines. */
    gridXstep?: number;

    /** Space between horizontal grid lines. */
    gridYstep?: number;

    /** The vertical height of the rectangle. */
    height: number;

    /** The horizontal width of the rectangle. */
    width: number;
  } & ConstructorParameters<typeof Polygon>[0]) {
    super({
      vertices: [UR, UL, DL, DR],
      ...kwargs
    });

    this.stretchToFitWidth(width);
    this.stretchToFitHeight(height);
    const v = this.getVertices();
    if (gridXstep !== undefined) {
      gridXstep = Math.abs(gridXstep);
      const count = Math.floor(width / gridXstep);
      const grid = new VGroup(...range(1, count).map(i => new Line(
        $add(v[1], $scale(RIGHT, i * gridXstep)),
        $add(v[1], $scale(RIGHT, i * gridXstep), $scale(DOWN, height)),
        // color = color
      )));
      this.add(grid)
    }
    if (gridYstep !== undefined) {
      gridYstep = Math.abs(gridYstep);
      const count = Math.floor(height / gridYstep);
      const grid = new VGroup(...range(1, count).map(i => new Line(
        $add(v[1], $scale(DOWN, i * gridYstep)),
        $add(v[1], $scale(DOWN, i * gridYstep), $scale(RIGHT, width)),
        // color = color,
      )));
      this.add(grid);
    }
  }

  $render({svg}: {svg: SVGSVGElement}) {
    const rect = document.createElementNS(svg.namespaceURI, "rect") as SVGRectElement;
    rect.setAttribute("x", String(this.points[0][0] - this.width / 2));
    rect.setAttribute("y", String(-this.height / 2 - this.points[0][1]));
    rect.setAttribute("height", String(this.height));
    rect.setAttribute("width", String(this.height));
    rect.setAttribute("fill", this.color);

    svg.appendChild(rect);
  }
}

/** A rectangle with equal side lengths. */
export class Square extends Rectangle {
  constructor({sideLength = 2, ...kwargs}: {
    sideLength?: number;
  } & ConstructorParameters<typeof Rectangle>[0] = {}) {
    super({height: sideLength, width: sideLength, ...kwargs});
  }
}

// class RoundedRectangle(Rectangle) {
//     """A rectangle with rounded corners.

//     Parameters
//     ----------
//     corner_radius : :class:`float`, optional
//         The curvature of the corners of the rectangle.
//     kwargs : Any
//         Additional arguments to be passed to :class:`Rectangle`

//     def __init__(self, corner_radius=0.5, **kwargs) {
//         super().__init__(**kwargs)
//         self.corner_radius = corner_radius
//         self.round_corners(self.corner_radius)


// class Cutout(VMobject, metaclass=ConvertToOpenGL) {
//     """A shape with smaller cutouts.

//     Parameters
//     ----------
//     main_shape : :class:`~.VMobject`
//         The primary shape from which cutouts are made.
//     mobjects : :class:`~.VMobject`
//         The smaller shapes which are to be cut out of the ``main_shape``.
//     kwargs
//         Further keyword arguments that are passed to the constructor of
//         :class:`~.VMobject`.


//     .. warning::
//         Technically, this class behaves similar to a symmetric difference: if
//         parts of the ``mobjects`` are not located within the ``main_shape``,
//         these parts will be added to the resulting :class:`~.VMobject`.

//     def __init__(self, main_shape, *mobjects, **kwargs) {
//         super().__init__(**kwargs)
//         self.append_points(main_shape.points)
//         if main_shape.get_direction() == "CW":
//             sub_direction = "CCW"
//         else:
//             sub_direction = "CW"
//         for mobject in mobjects:
//             self.append_points(mobject.force_direction(sub_direction).points)
