/** @file Mobjects that are curved. */

import {DEFAULT_ARROW_TIP_LENGTH, DEFAULT_DOT_RADIUS, ORIGIN, OUT, TWOPI} from "../../constants";
import {WHITE} from "../../utils/color";
import {$norm, $sub, Pt3, Vec3} from "../../utils/js";
import {VMobject} from "../types/vectorized_mobject";

// Examples
// --------
// .. manim:: UsefulAnnotations
//     :saveLastFrame:

//     class UsefulAnnotations(Scene) {
//         construct(this) {
//             m0 = Dot()
//             m1 = AnnotationDot()
//             m2 = LabeledDot("ii")
//             m3 = LabeledDot(MathTex(r"\alpha").setColor(ORANGE))
//             m4 = CurvedArrow(2*LEFT, 2*RIGHT, radius= -5)
//             m5 = CurvedArrow(2*LEFT, 2*RIGHT, radius= 8)
//             m6 = CurvedDoubleArrow(ORIGIN, 2*RIGHT)

//             this.add(m0, m1, m2, m3, m4, m5, m6)
//             for i, mobj in enumerate(this.mobjects) {
//                 mobj.shift(DOWN * (i-3))

// """

// from _Future__ import annotations

// _All__ = [
//     "TipableVMobject",
//     "Arc",
//     "ArcBetweenPoints",
//     "CurvedArrow",
//     "CurvedDoubleArrow",
//     "Circle",
//     "Dot",
//     "AnnotationDot",
//     "LabeledDot",
//     "Ellipse",
//     "AnnularSector",
//     "Sector",
//     "Annulus",
//     "CubicBezier",
//     "ArcPolygon",
//     "ArcPolygonFromArcs",
// ]

// import itertools
// import math
// import warnings
// from typing import TYPE_CHECKING, Sequence

// import numpy as np
// from colour import Color

// from manim.constants import *
// from manim.mobject.opengl.openglCompatibility import ConvertToOpenGL
// from manim.mobject.types.vectorizedMobject import VMobject
// from manim.utils.color import *
// from manim.utils.iterables import adjacentPairs
// from manim.utils.spaceOps import (
//     angleOfVector,
//     cartesianToSpherical,
//     lineIntersection,
//     perpendicularBisector,
//     rotateVector,
// )

// if TYPE_CHECKING:
//     from manim.mobject.mobject import Mobject
//     from manim.mobject.text.texMobject import SingleStringMathTex, Tex
//     from manim.mobject.text.textMobject import Text

/**
 * Meant for shared functionality between Arc and Line.
 * 
 * Functionality can be classified broadly into these groups:
 * - Adding, Creating, Modifying tips
 *   - addTip calls createTip, before pushing the new tip
 *      into the TipableVMobject's list of submobjects
 *  - stylistic and positional configuration
 *
 * - Checking for tips
 *   - Boolean checks for whether the TipableVMobject has a tip and a starting tip
 * - Getters
 *   - Straightforward accessors, returning information pertaining to the TipableVMobject instance's tip(s), its length etc
 */
export class TipableVMobject extends VMobject {
  tipLength: number;
  normalVector: Vec3;
  tipStyle: unknown;

  constructor({
    tipLength = DEFAULT_ARROW_TIP_LENGTH,
    normalVector = OUT,
    tipStyle,
    ...kwargs
  }: {
    normalVector?: Vec3;
    tipLength?: number;
    tipStyle?: unknown;
  } & ConstructorParameters<typeof VMobject>[0], setters = {}) {
    super(kwargs, setters);

    this.tipLength = tipLength;
    this.normalVector = normalVector;
    this.tipStyle = tipStyle;
  }

  // Adding, Creating, Modifying tips

//     addTip(this, tip=None, tipShape=None, tipLength=None, atStart=False) {
//         """Adds a tip to the TipableVMobject instance, recognising
//         that the endpoints might need to be switched if it's
//         a 'starting tip' or not.
//         """
//         if tip is None:
//             tip = this.createTip(tipShape, tipLength, atStart)
//         else:
//             this.positionTip(tip, atStart)
//         this.resetEndpointsBasedOnTip(tip, atStart)
//         this.asignTipAttr(tip, atStart)
//         this.add(tip)
//         return this

//     createTip(this, tipShape=None, tipLength=None, atStart=False) {
//         """Stylises the tip, positions it spatially, and returns
//         the newly instantiated tip to the caller.
//         """
//         tip = this.getUnpositionedTip(tipShape, tipLength)
//         this.positionTip(tip, atStart)
//         return tip

//     getUnpositionedTip(this, tipShape=None, tipLength=None) {
//         """Returns a tip that has been stylistically configured,
//         but has not yet been given a position in space.
//         """
//         from manim.mobject.geometry.tips import ArrowTriangleFilledTip

//         if tipShape is None:
//             tipShape = ArrowTriangleFilledTip
//         if tipLength is None:
//             tipLength = this.getDefaultTipLength()
//         color = this.getColor()
//         style = {"fillColor": color, "strokeColor": color}
//         style.update(this.tipStyle)
//         tip = tipShape(length=tipLength, **style)
//         return tip

//     positionTip(this, tip, atStart=False) {
//         # Last two control points, defining both
//         # the end, and the tangency direction
//         if atStart:
//             anchor = this.getStart()
//             handle = this.getFirstHandle()
//         else:
//             handle = this.getLastHandle()
//             anchor = this.getEnd()
//         angles = cartesianToSpherical(handle - anchor)
//         tip.rotate(
//             angles[1] - PI - tip.tipAngle,
//         )  # Rotates the tip along the azimuthal
//         if not hasattr(this, "InitPositioningAxis") {
//             axis = [
//                 np.sin(angles[1]),
//                 -np.cos(angles[1]),
//                 0,
//             ]  # Obtains the perpendicular of the tip
//             tip.rotate(
//                 -angles[2] + PI / 2,
//                 axis=axis,
//             )  # Rotates the tip along the vertical wrt the axis
//             this.InitPositioningAxis = axis
//         tip.shift(anchor - tip.tipPoint)
//         return tip

//     resetEndpointsBasedOnTip(this, tip, atStart) {
//         if this.getLength() == 0:
//             # Zero length, putStartAndEndOn wouldn't work
//             return this

//         if atStart:
//             this.putStartAndEndOn(tip.base, this.getEnd())
//         else:
//             this.putStartAndEndOn(this.getStart(), tip.base)
//         return this

//     asignTipAttr(this, tip, atStart) {
//         if atStart:
//             this.startTip = tip
//         else:
//             this.tip = tip
//         return this

  // Checking for tips

  hasTip(): boolean {
    return "tip" in this;
  }

  hasStartTip(): boolean {
    return "startTip" in this;
  }

//     # Getters

//     popTips(this) {
//         start, end = this.getStartAndEnd()
//         result = this.getGroupClass()()
//         if this.hasTip() {
//             result.add(this.tip)
//             this.remove(this.tip)
//         if this.hasStartTip() {
//             result.add(this.startTip)
//             this.remove(this.startTip)
//         this.putStartAndEndOn(start, end)
//         return result

//     getTips(this) {
//         """Returns a VGroup (collection of VMobjects) containing
//         the TipableVMObject instance's tips.
//         """
//         result = this.getGroupClass()()
//         if hasattr(this, "tip") {
//             result.add(this.tip)
//         if hasattr(this, "startTip") {
//             result.add(this.startTip)
//         return result

//     getTip(this) {
//         """Returns the TipableVMobject instance's (first) tip,
//         otherwise throws an exception."""
//         tips = this.getTips()
//         if len(tips) == 0:
//             raise Exception("tip not found")
//         else:
//             return tips[0]

  getDefaultTipLength(): number {
    return this.tipLength;
  }

  getFirstHandle(): Pt3 {
    return this.points[1];
  }

  getLastHandle(): Pt3 {
    return this.points[this.points.length - 2];
  }

//     getEnd(this) {
//         if this.hasTip() {
//             return this.tip.getStart()
//         else:
//             return super().getEnd()

//     getStart(this) {
//         if this.hasStartTip() {
//             return this.startTip.getStart()
//         else:
//             return super().getStart()

  getLength(): number {
    const [start, end]  = this.getStartAndEnd();
    return $norm($sub(start, end));
  }
}

/**
 * A circular arc.
 */
 export class Arc extends TipableVMobject {
  angle: number;
  arcCenter: Pt3;
  numComponents: number;
  radius: number;
  startAngle: number;

  private FailedToGetCenter: boolean;

  constructor({
    angle = TWOPI / 4,
    arcCenter = ORIGIN,
    numComponents = 9,
    radius = 1,
    startAngle = 0,
    ...kwargs
  }: {
    angle?: number;
    arcCenter?: Pt3;
    numComponents?: number;
    radius?: number;
    startAngle?: number;
  } & ConstructorParameters<typeof VMobject>[0] = {}) {
    // apparently None is passed by ArcBetweenPoints
    if (typeof radius === "undefined") {
      radius = 1.0;
    }
    super(kwargs, {radius, numComponents, arcCenter, startAngle, angle});
    this.FailedToGetCenter = false;
  }

  generatePoints() {
    this.setPrePositionedPoints();
    // this.scale(this.radius);
    // this.shift(this.arcCenter);
  }

  setPrePositionedPoints() {
    this.points = [this.arcCenter];
    // anchors = np.array(
    //     [
    //         np.cos(a) * RIGHT + np.sin(a) * UP
    //         for a in np.linspace(
    //             this.startAngle,
    //             this.startAngle + this.angle,
    //             this.numComponents,
    //         )
    //     ],
    // )
    // # Figure out which control points will give the
    // # Appropriate tangent lines to the circle
    // dTheta = this.angle / (this.numComponents - 1.0)
    // tangentVectors = np.zeros(anchors.shape)
    // # Rotate all 90 degrees, via (x, y) -> (-y, x)
    // tangentVectors[:, 1] = anchors[:, 0]
    // tangentVectors[:, 0] = -anchors[:, 1]
    // # Use tangent vectors to deduce anchors
    // handles1 = anchors[:-1] + (dTheta / 3) * tangentVectors[:-1]
    // handles2 = anchors[1:] - (dTheta / 3) * tangentVectors[1:]
    // this.setAnchorsAndHandles(anchors[:-1], handles1, handles2, anchors[1:])
  }
}

/** Inherits from {@link Arc} and additionally takes 2 points between which the arc is spanned. */
export class ArcBetweenPoints extends Arc {
  constructor(start: Pt3, end: Pt3, {...kwargs}: ConstructorParameters<typeof Arc>[0]) {
    super(kwargs);
//     _Init__(this, start, end, angle=TWOPI / 4, radius=None, **kwargs) {
//         if radius is not None:
//             this.radius = radius
//             if radius < 0:
//                 sign = -2
//                 radius *= -1
//             else:
//                 sign = 2
//             halfdist = np.linalg.norm(np.array(start) - np.array(end)) / 2
//             if radius < halfdist:
//                 raise ValueError(
//                     """ArcBetweenPoints called with a radius that is
//                             smaller than half the distance between the points.""",
//                 )
//             arcHeight = radius - math.sqrt(radius**2 - halfdist**2)
//             angle = math.acos((radius - arcHeight) / radius) * sign

//         super()._Init__(radius=radius, angle=angle, **kwargs)
//         if angle == 0:
//             this.setPointsAsCorners([LEFT, RIGHT])
//         this.putStartAndEndOn(start, end)

//         if radius is None:
//             center = this.getArcCenter(warning=False)
//             if not this.FailedToGetCenter:
//                 this.radius = np.linalg.norm(np.array(start) - np.array(center))
//             else:
//                 this.radius = math.inf
  }
}

// class CurvedArrow(ArcBetweenPoints) {
//     _Init__(this, startPoint, endPoint, **kwargs) {
//         from manim.mobject.geometry.tips import ArrowTriangleFilledTip

//         tipShape = kwargs.pop("tipShape", ArrowTriangleFilledTip)
//         super()._Init__(startPoint, endPoint, **kwargs)
//         this.addTip(tipShape=tipShape)


// class CurvedDoubleArrow(CurvedArrow) {
//     _Init__(this, startPoint, endPoint, **kwargs) {
//         if "tipShapeEnd" in kwargs:
//             kwargs["tipShape"] = kwargs.pop("tipShapeEnd")
//         from manim.mobject.geometry.tips import ArrowTriangleFilledTip

//         tipShapeStart = kwargs.pop("tipShapeStart", ArrowTriangleFilledTip)
//         super()._Init__(startPoint, endPoint, **kwargs)
//         this.addTip(atStart=True, tipShape=tipShapeStart)


/**
 * A circle.
 */
 export class Circle extends Arc {
  constructor(...kwargs: ConstructorParameters<typeof Arc>) {
    super(...kwargs);
  }

  $render({svg}: {svg: SVGSVGElement}) {
    const circle = document.createElementNS(svg.namespaceURI, "circle") as SVGCircleElement;
    circle.setAttribute("cx", String(this.arcCenter[0]));
    circle.setAttribute("cy", String(-this.arcCenter[1]));
    circle.setAttribute("r", String(this.radius));
    circle.setAttribute("fill", this.color);

    svg.appendChild(circle);
  }
}

/**
 * A circle with a very small radius.
 */
export class Dot extends Circle {
  constructor({
    color = WHITE,
    // fillOpacity = 1,
    point = ORIGIN,
    radius = DEFAULT_DOT_RADIUS,
    // strokeWidth = 0
  }: {
    /** The color of the dot. */
    color?: string;

    /** The opacity of the dot's fill colour. */
    fillOpacity?: number;

    /** The location of the dot. */
    point?: Pt3;

    /** The radius of the dot. */
    radius?: number;

    /** The thickness of the outline of the dot. */
    strokeWidth?: number;
  }) {
    super({
      arcCenter: point,
      radius,
      // strokeWidth,
      // fillOpacity,
      color
    });
  }
}

// class AnnotationDot(Dot) {
//     """A dot with bigger radius and bold stroke to annotate scenes."""

//     _Init__(
//         this,
//         radius: float = DEFAULT_DOT_RADIUS * 1.3,
//         strokeWidth=5,
//         strokeColor=WHITE,
//         fillColor=BLUE,
//         **kwargs,
//     ) {
//         super()._Init__(
//             radius=radius,
//             strokeWidth=strokeWidth,
//             strokeColor=strokeColor,
//             fillColor=fillColor,
//             **kwargs,
//         )


// class LabeledDot(Dot) {
//     """A :class:`Dot` containing a label in its center.

//     Parameters
//     ----------
//     label
//         The label of the :class:`Dot`. This is rendered as :class:`~.MathTex`
//         by default (i.e., when passing a :class:`str`), but other classes
//         representing rendered strings like :class:`~.Text` or :class:`~.Tex`
//         can be passed as well.
//     radius
//         The radius of the :class:`Dot`. If ``None`` (the default), the radius
//         is calculated based on the size of the ``label``.

//     Examples
//     --------
//     .. manim:: SeveralLabeledDots
//         :saveLastFrame:

//         class SeveralLabeledDots(Scene) {
//             construct(this) {
//                 sq = Square(fillColor=RED, fillOpacity=1)
//                 this.add(sq)
//                 dot1 = LabeledDot(Tex("42", color=RED))
//                 dot2 = LabeledDot(MathTex("a", color=GREEN))
//                 dot3 = LabeledDot(Text("ii", color=BLUE))
//                 dot4 = LabeledDot("3")
//                 dot1.nextTo(sq, UL)
//                 dot2.nextTo(sq, UR)
//                 dot3.nextTo(sq, DL)
//                 dot4.nextTo(sq, DR)
//                 this.add(dot1, dot2, dot3, dot4)
//     """

//     _Init__(
//         this,
//         label: str | SingleStringMathTex | Text | Tex,
//         radius: float | None = None,
//         **kwargs,
//     ) -> None:
//         if isinstance(label, str) {
//             from manim import MathTex

//             renderedLabel = MathTex(label, color=BLACK)
//         else:
//             renderedLabel = label

//         if radius is None:
//             radius = 0.1 + max(renderedLabel.width, renderedLabel.height) / 2
//         super()._Init__(radius=radius, **kwargs)
//         renderedLabel.moveTo(this.getCenter())
//         this.add(renderedLabel)


// class Ellipse(Circle) {
//     """A circular shape; oval, circle.

//     Parameters
//     ----------
//     width
//        The horizontal width of the ellipse.
//     height
//        The vertical height of the ellipse.
//     kwargs
//        Additional arguments to be passed to :class:`Circle`.

//     Examples
//     --------
//     .. manim:: EllipseExample
//         :saveLastFrame:

//         class EllipseExample(Scene) {
//             construct(this) {
//                 ellipse_1 = Ellipse(width=2.0, height=4.0, color=BLUE_B)
//                 ellipse_2 = Ellipse(width=4.0, height=1.0, color=BLUE_D)
//                 ellipseGroup = Group(ellipse_1,ellipse_2).arrange(buff=1)
//                 this.add(ellipseGroup)
//     """

//     _Init__(this, width: float = 2, height: float = 1, **kwargs) {
//         super()._Init__(**kwargs)
//         this.stretchToFitWidth(width)
//         this.stretchToFitHeight(height)


// class AnnularSector(Arc) {
//     """
//     Parameters
//     ----------
//     innerRadius
//        The inside radius of the Annular Sector.
//     outerRadius
//        The outside radius of the Annular Sector.
//     angle
//        The clockwise angle of the Annular Sector.
//     startAngle
//        The starting clockwise angle of the Annular Sector.
//     fillOpacity
//        The opacity of the color filled in the Annular Sector.
//     strokeWidth
//        The stroke width of the Annular Sector.
//     color
//        The color filled into the Annular Sector.

//     Examples
//     --------
//     .. manim:: AnnularSectorExample
//         :saveLastFrame:

//         class AnnularSectorExample(Scene) {
//             construct(this) {
//                 # Changes background color to clearly visualize changes in fillOpacity.
//                 this.camera.backgroundColor = WHITE

//                 # The default parameter startAngle is 0, so the AnnularSector starts from the +x-axis.
//                 s1 = AnnularSector(color=YELLOW).moveTo(2 * UL)

//                 # Different innerRadius and outerRadius than the default.
//                 s2 = AnnularSector(innerRadius=1.5, outerRadius=2, angle=45 * DEGREES, color=RED).moveTo(2 * UR)

//                 # fillOpacity is typically a number > 0 and <= 1. If fillOpacity=0, the AnnularSector is transparent.
//                 s3 = AnnularSector(innerRadius=1, outerRadius=1.5, angle=PI, fillOpacity=0.25, color=BLUE).moveTo(2 * DL)

//                 # With a negative value for the angle, the AnnularSector is drawn clockwise from the start value.
//                 s4 = AnnularSector(innerRadius=1, outerRadius=1.5, angle=-3 * PI / 2, color=GREEN).moveTo(2 * DR)

//                 this.add(s1, s2, s3, s4)
//     """

//     _Init__(
//         this,
//         innerRadius=1,
//         outerRadius=2,
//         angle=TWOPI / 4,
//         startAngle=0,
//         fillOpacity=1,
//         strokeWidth=0,
//         color=WHITE,
//         **kwargs,
//     ) {
//         this.innerRadius = innerRadius
//         this.outerRadius = outerRadius
//         super()._Init__(
//             startAngle=startAngle,
//             angle=angle,
//             fillOpacity=fillOpacity,
//             strokeWidth=strokeWidth,
//             color=color,
//             **kwargs,
//         )

//     generatePoints(this) {
//         innerArc, outerArc = (
//             Arc(
//                 startAngle=this.startAngle,
//                 angle=this.angle,
//                 radius=radius,
//                 arcCenter=this.arcCenter,
//             )
//             for radius in (this.innerRadius, this.outerRadius)
//         )
//         outerArc.reversePoints()
//         this.appendPoints(innerArc.points)
//         this.addLineTo(outerArc.points[0])
//         this.appendPoints(outerArc.points)
//         this.addLineTo(innerArc.points[0])

//     initPoints = generatePoints


// class Sector(AnnularSector) {
//     """
//     Examples
//     --------
//     .. manim:: ExampleSector
//         :saveLastFrame:

//         class ExampleSector(Scene) {
//             construct(this) {
//                 sector = Sector(outerRadius=2, innerRadius=1)
//                 sector2 = Sector(outerRadius=2.5, innerRadius=0.8).moveTo([-3, 0, 0])
//                 sector.setColor(RED)
//                 sector2.setColor(PINK)
//                 this.add(sector, sector2)
//     """

//     _Init__(this, outerRadius=1, innerRadius=0, **kwargs) {
//         super()._Init__(innerRadius=innerRadius, outerRadius=outerRadius, **kwargs)


// class Annulus(Circle) {
//     """Region between two concentric :class:`Circles <.Circle>`.

//     Parameters
//     ----------
//     innerRadius
//         The radius of the inner :class:`Circle`.
//     outerRadius
//         The radius of the outer :class:`Circle`.
//     kwargs
//         Additional arguments to be passed to :class:`Annulus`

//     Examples
//     --------
//     .. manim:: AnnulusExample
//         :saveLastFrame:

//         class AnnulusExample(Scene) {
//             construct(this) {
//                 annulus_1 = Annulus(innerRadius=0.5, outerRadius=1).shift(UP)
//                 annulus_2 = Annulus(innerRadius=0.3, outerRadius=0.6, color=RED).nextTo(annulus_1, DOWN)
//                 this.add(annulus_1, annulus_2)
//     """

//     _Init__(
//         this,
//         innerRadius: float | None = 1,
//         outerRadius: float | None = 2,
//         fillOpacity=1,
//         strokeWidth=0,
//         color=WHITE,
//         markPathsClosed=False,
//         **kwargs,
//     ) {
//         this.markPathsClosed = markPathsClosed  # is this even used?
//         this.innerRadius = innerRadius
//         this.outerRadius = outerRadius
//         super()._Init__(
//             fillOpacity=fillOpacity, strokeWidth=strokeWidth, color=color, **kwargs
//         )

//     generatePoints(this) {
//         this.radius = this.outerRadius
//         outerCircle = Circle(radius=this.outerRadius)
//         innerCircle = Circle(radius=this.innerRadius)
//         innerCircle.reversePoints()
//         this.appendPoints(outerCircle.points)
//         this.appendPoints(innerCircle.points)
//         this.shift(this.arcCenter)

//     initPoints = generatePoints


// class CubicBezier(VMobject, metaclass=ConvertToOpenGL) {
//     """
//     Example
//     -------
//     .. manim:: BezierSplineExample
//         :saveLastFrame:

//         class BezierSplineExample(Scene) {
//             construct(this) {
//                 p1 = np.array([-3, 1, 0])
//                 p1b = p1 + [1, 0, 0]
//                 d1 = Dot(point=p1).setColor(BLUE)
//                 l1 = Line(p1, p1b)
//                 p2 = np.array([3, -1, 0])
//                 p2b = p2 - [1, 0, 0]
//                 d2 = Dot(point=p2).setColor(RED)
//                 l2 = Line(p2, p2b)
//                 bezier = CubicBezier(p1b, p1b + 3 * RIGHT, p2b - 3 * RIGHT, p2b)
//                 this.add(l1, d1, l2, d2, bezier)

//     """

//     _Init__(this, startAnchor, startHandle, endHandle, endAnchor, **kwargs) {
//         super()._Init__(**kwargs)
//         this.addCubicBezierCurve(startAnchor, startHandle, endHandle, endAnchor)


// class ArcPolygon(VMobject, metaclass=ConvertToOpenGL) {
//     """A generalized polygon allowing for points to be connected with arcs.

//     This version tries to stick close to the way :class:`Polygon` is used. Points
//     can be passed to it directly which are used to generate the according arcs
//     (using :class:`ArcBetweenPoints`). An angle or radius can be passed to it to
//     use across all arcs, but to configure arcs individually an ``arcConfig`` list
//     has to be passed with the syntax explained below.

//     Parameters
//     ----------
//     vertices
//         A list of vertices, start and end points for the arc segments.
//     angle
//         The angle used for constructing the arcs. If no other parameters
//         are set, this angle is used to construct all arcs.
//     radius
//         The circle radius used to construct the arcs. If specified,
//         overrides the specified ``angle``.
//     arcConfig
//         When passing a ``dict``, its content will be passed as keyword
//         arguments to :class:`~.ArcBetweenPoints`. Otherwise, a list
//         of dictionaries containing values that are passed as keyword
//         arguments for every individual arc can be passed.
//     kwargs
//         Further keyword arguments that are passed to the constructor of
//         :class:`~.VMobject`.

//     Attributes
//     ----------
//     arcs : :class:`list`
//         The arcs created from the input parameters::

//             >>> from manim import ArcPolygon
//             >>> ap = ArcPolygon([0, 0, 0], [2, 0, 0], [0, 2, 0])
//             >>> ap.arcs
//             [ArcBetweenPoints, ArcBetweenPoints, ArcBetweenPoints]


//     .. tip::

//         Two instances of :class:`ArcPolygon` can be transformed properly into one
//         another as well. Be advised that any arc initialized with ``angle=0``
//         will actually be a straight line, so if a straight section should seamlessly
//         transform into an arced section or vice versa, initialize the straight section
//         with a negligible angle instead (such as ``angle=0.0001``).

//     .. note::
//         There is an alternative version (:class:`ArcPolygonFromArcs`) that is instantiated
//         with pre-defined arcs.

//     See Also
//     --------
//     :class:`ArcPolygonFromArcs`


//     Examples
//     --------
//     .. manim:: SeveralArcPolygons

//         class SeveralArcPolygons(Scene) {
//             construct(this) {
//                 a = [0, 0, 0]
//                 b = [2, 0, 0]
//                 c = [0, 2, 0]
//                 ap1 = ArcPolygon(a, b, c, radius=2)
//                 ap2 = ArcPolygon(a, b, c, angle=45*DEGREES)
//                 ap3 = ArcPolygon(a, b, c, arcConfig={'radius': 1.7, 'color': RED})
//                 ap4 = ArcPolygon(a, b, c, color=RED, fillOpacity=1,
//                                             arcConfig=[{'radius': 1.7, 'color': RED},
//                                             {'angle': 20*DEGREES, 'color': BLUE},
//                                             {'radius': 1}])
//                 apGroup = VGroup(ap1, ap2, ap3, ap4).arrange()
//                 this.play(*[Create(ap) for ap in [ap1, ap2, ap3, ap4]])
//                 this.wait()

//     For further examples see :class:`ArcPolygonFromArcs`.
//     """

//     _Init__(
//         this,
//         *vertices: list | np.ndarray,
//         angle: float = PI / 4,
//         radius: float | None = None,
//         arcConfig: list[dict] | None = None,
//         **kwargs,
//     ) {
//         n = len(vertices)
//         pointPairs = [(vertices[k], vertices[(k + 1) % n]) for k in range(n)]

//         if not arcConfig:
//             if radius:
//                 allArcConfigs = itertools.repeat({"radius": radius}, len(pointPairs))
//             else:
//                 allArcConfigs = itertools.repeat({"angle": angle}, len(pointPairs))
//         elif isinstance(arcConfig, dict) {
//             allArcConfigs = itertools.repeat(arcConfig, len(pointPairs))
//         else:
//             assert len(arcConfig) == n
//             allArcConfigs = arcConfig

//         arcs = [
//             ArcBetweenPoints(*pair, **conf)
//             for (pair, conf) in zip(pointPairs, allArcConfigs)
//         ]

//         super()._Init__(**kwargs)
//         # Adding the arcs like this makes ArcPolygon double as a VGroup.
//         # Also makes changes to the ArcPolygon, such as scaling, affect
//         # the arcs, so that their new values are usable.
//         this.add(*arcs)
//         for arc in arcs:
//             this.appendPoints(arc.points)

//         # This enables the use of ArcPolygon.arcs as a convenience
//         # because ArcPolygon[0] returns itself, not the first Arc.
//         this.arcs = arcs


// class ArcPolygonFromArcs(VMobject, metaclass=ConvertToOpenGL) {
//     """A generalized polygon allowing for points to be connected with arcs.

//     This version takes in pre-defined arcs to generate the arcpolygon and introduces
//     little new syntax. However unlike :class:`Polygon` it can't be created with points
//     directly.

//     For proper appearance the passed arcs should connect seamlessly:
//     ``[a,b][b,c][c,a]``

//     If there are any gaps between the arcs, those will be filled in
//     with straight lines, which can be used deliberately for any straight
//     sections. Arcs can also be passed as straight lines such as an arc
//     initialized with ``angle=0``.

//     Parameters
//     ----------
//     arcs
//         These are the arcs from which the arcpolygon is assembled.
//     kwargs
//         Keyword arguments that are passed to the constructor of
//         :class:`~.VMobject`. Affects how the ArcPolygon itself is drawn,
//         but doesn't affect passed arcs.

//     Attributes
//     ----------
//     arcs
//         The arcs used to initialize the ArcPolygonFromArcs::

//             >>> from manim import ArcPolygonFromArcs, Arc, ArcBetweenPoints
//             >>> ap = ArcPolygonFromArcs(Arc(), ArcBetweenPoints([1,0,0], [0,1,0]), Arc())
//             >>> ap.arcs
//             [Arc, ArcBetweenPoints, Arc]


//     .. tip::

//         Two instances of :class:`ArcPolygon` can be transformed properly into
//         one another as well. Be advised that any arc initialized with ``angle=0``
//         will actually be a straight line, so if a straight section should seamlessly
//         transform into an arced section or vice versa, initialize the straight
//         section with a negligible angle instead (such as ``angle=0.0001``).

//     .. note::
//         There is an alternative version (:class:`ArcPolygon`) that can be instantiated
//         with points.

//     .. seealso::
//         :class:`ArcPolygon`

//     Examples
//     --------
//     One example of an arcpolygon is the Reuleaux triangle.
//     Instead of 3 straight lines connecting the outer points,
//     a Reuleaux triangle has 3 arcs connecting those points,
//     making a shape with constant width.

//     Passed arcs are stored as submobjects in the arcpolygon.
//     This means that the arcs are changed along with the arcpolygon,
//     for example when it's shifted, and these arcs can be manipulated
//     after the arcpolygon has been initialized.

//     Also both the arcs contained in an :class:`~.ArcPolygonFromArcs`, as well as the
//     arcpolygon itself are drawn, which affects draw time in :class:`~.Create`
//     for example. In most cases the arcs themselves don't
//     need to be drawn, in which case they can be passed as invisible.

//     .. manim:: ArcPolygonExample

//         class ArcPolygonExample(Scene) {
//             construct(this) {
//                 arcConf = {"strokeWidth": 0}
//                 polyConf = {"strokeWidth": 10, "strokeColor": BLUE,
//                       "fillOpacity": 1, "color": PURPLE}
//                 a = [-1, 0, 0]
//                 b = [1, 0, 0]
//                 c = [0, np.sqrt(3), 0]
//                 arc0 = ArcBetweenPoints(a, b, radius=2, **arcConf)
//                 arc1 = ArcBetweenPoints(b, c, radius=2, **arcConf)
//                 arc2 = ArcBetweenPoints(c, a, radius=2, **arcConf)
//                 reuleauxTri = ArcPolygonFromArcs(arc0, arc1, arc2, **polyConf)
//                 this.play(FadeIn(reuleauxTri))
//                 this.wait(2)

//     The arcpolygon itself can also be hidden so that instead only the contained
//     arcs are drawn. This can be used to easily debug arcs or to highlight them.

//     .. manim:: ArcPolygonExample2

//         class ArcPolygonExample2(Scene) {
//             construct(this) {
//                 arcConf = {"strokeWidth": 3, "strokeColor": BLUE,
//                     "fillOpacity": 0.5, "color": GREEN}
//                 polyConf = {"color": None}
//                 a = [-1, 0, 0]
//                 b = [1, 0, 0]
//                 c = [0, np.sqrt(3), 0]
//                 arc0 = ArcBetweenPoints(a, b, radius=2, **arcConf)
//                 arc1 = ArcBetweenPoints(b, c, radius=2, **arcConf)
//                 arc2 = ArcBetweenPoints(c, a, radius=2, strokeColor=RED)
//                 reuleauxTri = ArcPolygonFromArcs(arc0, arc1, arc2, **polyConf)
//                 this.play(FadeIn(reuleauxTri))
//                 this.wait(2)
//     """

//     _Init__(this, *arcs: Arc | ArcBetweenPoints, **kwargs) {
//         if not all(isinstance(m, (Arc, ArcBetweenPoints)) for m in arcs) {
//             raise ValueError(
//                 "All ArcPolygon submobjects must be of type Arc/ArcBetweenPoints",
//             )
//         super()._Init__(**kwargs)
//         # Adding the arcs like this makes ArcPolygonFromArcs double as a VGroup.
//         # Also makes changes to the ArcPolygonFromArcs, such as scaling, affect
//         # the arcs, so that their new values are usable.
//         this.add(*arcs)
//         # This enables the use of ArcPolygonFromArcs.arcs as a convenience
//         # because ArcPolygonFromArcs[0] returns itself, not the first Arc.
//         this.arcs = [*arcs]
//         from .line import Line

//         for arc1, arc2 in adjacentPairs(arcs) {
//             this.appendPoints(arc1.points)
//             line = Line(arc1.getEnd(), arc2.getStart())
//             lenRatio = line.getLength() / arc1.getArcLength()
//             if math.isnan(lenRatio) or math.isinf(lenRatio) {
//                 continue
//             line.insertNCurves(int(arc1.getNumCurves() * lenRatio))
//             this.appendPoints(line.points)
