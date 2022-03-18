import {DEFAULT_STROKE_WIDTH, UL} from "../../constants";
import {BLACK} from "../../utils/color";
import {$interpolate, $jumpslice, $linspace, Pt3, Vec3} from "../../utils/js";
import {Mobject} from "../mobject";

/**
 * A vectorized mobject.
 */
export class VMobject extends Mobject {
  fillColor: string;
  fillOpacity: number;
  strokeColor: string;
  strokeOpacity: number;
  strokeWidth: number;

  /**
   * The purpose of background stroke is to have something
   * that won't overlap fill, e.g.  For text against some
   * textured background.
   */
  backgroundStrokeColor: string;
  backgroundStrokeOpacity: number;
  backgroundStrokeWidth: number;

  /**
   * When a color c is set, there will be a second color
   * computed based on interpolating c to WHITE by with
   * sheenFactor, and the display will gradient to this
   * secondary color in the direction of sheenDirection.
   */
  sheenFactor: number = 0.0;
  sheenDirection: Pt3;

  /**
   * Indicates that it will not be displayed, but
   * that it should count in parent mobject's path
   */
  closeNewPoints: boolean;
  preFunctionHandleToAnchorScaleFactor: number;
  makeSmoothAfterApplyingFunctions: boolean;
  backgroundImage: unknown;
  shadeIn3d: boolean;

  /** This is within a pixel */
  toleranceForPointEquality: number;
  nPointsPerCubicCurve: number;

  constructor({
    fillColor,
    fillOpacity = 0.0,
    strokeColor,
    strokeOpacity = 1.0,
    strokeWidth = DEFAULT_STROKE_WIDTH,
    backgroundStrokeColor = BLACK,
    backgroundStrokeOpacity = 1.0,
    backgroundStrokeWidth = 0,
    sheenFactor = 0.0,
    sheenDirection = UL,
    closeNewPoints = false,
    preFunctionHandleToAnchorScaleFactor = 0.01,
    makeSmoothAfterApplyingFunctions = false,
    backgroundImage,
    shadeIn3d = false,
    // TODO, do we care about accounting for varying zoom levels?
    toleranceForPointEquality = 1e-6,
    nPointsPerCubicCurve = 4,
    ...kwargs
  }: {
    fillColor?: string;
    fillOpacity?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWidth?: number;
    backgroundStrokeColor?: string;
    backgroundStrokeOpacity?: number;
    backgroundStrokeWidth?: number;
    sheenFactor?: number;
    sheenDirection?: Pt3;
    closeNewPoints?: boolean;
    preFunctionHandleToAnchorScaleFactor?: number;
    makeSmoothAfterApplyingFunctions?: boolean;
    backgroundImage?: unknown;
    shadeIn3d?: boolean;
    toleranceForPointEquality?: number;
    nPointsPerCubicCurve?: number;
  } & ConstructorParameters<typeof Mobject>[0], setters: ConstructorParameters<typeof Mobject>[1] = {}) {
    super(kwargs, setters);

    this.fillOpacity = fillOpacity;
    this.strokeOpacity = strokeOpacity;
    this.strokeWidth = strokeWidth;
    this.backgroundStrokeColor = backgroundStrokeColor;
    this.backgroundStrokeOpacity = backgroundStrokeOpacity;
    this.backgroundStrokeWidth = backgroundStrokeWidth;
    this.sheenFactor = sheenFactor;
    this.sheenDirection = sheenDirection;
    this.closeNewPoints = closeNewPoints;
    this.preFunctionHandleToAnchorScaleFactor = preFunctionHandleToAnchorScaleFactor;
    this.makeSmoothAfterApplyingFunctions = makeSmoothAfterApplyingFunctions;
    this.backgroundImage = backgroundImage;
    this.shadeIn3d = shadeIn3d;
    this.toleranceForPointEquality = toleranceForPointEquality;
    this.nPointsPerCubicCurve = nPointsPerCubicCurve;

    if (fillColor) {
      this.fillColor = fillColor;
    }

    if (strokeColor) {
      this.strokeColor = strokeColor;
    }
  }

  getGroupClass(): typeof VGroup {
    return VGroup;
  }

  // Colors
  //   initColors(this, propagateColors=True) {
  //       this.setFill(
  //           color=this.fillColor,
  //           opacity=this.fillOpacity,
  //           family=propagateColors,
  //       )
  //       this.setStroke(
  //           color=this.strokeColor,
  //           width=this.strokeWidth,
  //           opacity=this.strokeOpacity,
  //           family=propagateColors,
  //       )
  //       this.setBackgroundStroke(
  //           color=this.backgroundStrokeColor,
  //           width=this.backgroundStrokeWidth,
  //           opacity=this.backgroundStrokeOpacity,
  //           family=propagateColors,
  //       )
  //       this.setSheen(
  //           factor=this.sheenFactor,
  //           direction=this.sheenDirection,
  //           family=propagateColors,
  //       )

  //       if not propagateColors:
  //           for submobject in this.submobjects:
  //               submobject.initColors(propagateColors=False)

  //       return this

  //   generateRgbasArray(this, color, opacity) {
  //       """
  //       First arg can be either a color, or a tuple/list of colors.
  //       Likewise, opacity can either be a float, or a tuple of floats.
  //       If this.sheenFactor is not zero, and only
  //       one color was passed in, a second slightly light color
  //       will automatically be added for the gradient
  //       """
  //       colors = [c if (c is not None) else BLACK for c in tuplify(color)]
  //       opacities = [o if (o is not None) else 0 for o in tuplify(opacity)]
  //       rgbas = np.array(
  //           [colorToRgba(c, o) for c, o in zip(*makeEven(colors, opacities))],
  //       )

  //       sheenFactor = this.getSheenFactor()
  //       if sheenFactor != 0 and len(rgbas) == 1:
  //           lightRgbas = np.array(rgbas)
  //           lightRgbas[:, :3] += sheenFactor
  //           np.clip(lightRgbas, 0, 1, out=lightRgbas)
  //           rgbas = np.append(rgbas, lightRgbas, axis=0)
  //       return rgbas

  //   updateRgbasArray(this, arrayName, color=None, opacity=None) {
  //       rgbas = this.generateRgbasArray(color, opacity)
  //       if not hasattr(this, arrayName) {
  //           setattr(this, arrayName, rgbas)
  //           return this
  //       # Match up current rgbas array with the newly calculated
  //       # one. 99% of the time they'll be the same.
  //       currRgbas = getattr(this, arrayName)
  //       if len(currRgbas) < len(rgbas) {
  //           currRgbas = stretchArrayToLength(currRgbas, len(rgbas))
  //           setattr(this, arrayName, currRgbas)
  //       elif len(rgbas) < len(currRgbas) {
  //           rgbas = stretchArrayToLength(rgbas, len(currRgbas))
  //       # Only update rgb if color was not None, and only
  //       # update alpha channel if opacity was passed in
  //       if color is not None:
  //           currRgbas[:, :3] = rgbas[:, :3]
  //       if opacity is not None:
  //           currRgbas[:, 3] = rgbas[:, 3]
  //       return this

  /**
   * Set the fill color and fill opacity of a {@link VMobject}.
   * @param color Fill color of the {@link VMobject}.
   * @param opacity Fill opacity of the {@link VMobject}.
   * @param family If `true`, the fill color of all submobjects is also set.
   */
  setFill(color: string, opacity: number, family: boolean = true): this {
    if (family) {
      for (const submobject of this.submobjects as VMobject[]) {
        submobject.setFill(color, opacity, family);
      }
    }
    //       this.updateRgbasArray("fillRgbas", color, opacity)
    if (typeof opacity !== "undefined") {
      this.fillOpacity = opacity;
    }
    return this;
  }

  //   setStroke(
  //       this,
  //       color=None,
  //       width=None,
  //       opacity=None,
  //       background=False,
  //       family=True,
  //   ) {
  //       if family:
  //           for submobject in this.submobjects:
  //               submobject.setStroke(color, width, opacity, background, family)
  //       if background:
  //           arrayName = "backgroundStrokeRgbas"
  //           widthName = "backgroundStrokeWidth"
  //           opacityName = "backgroundStrokeOpacity"
  //       else:
  //           arrayName = "strokeRgbas"
  //           widthName = "strokeWidth"
  //           opacityName = "strokeOpacity"
  //       this.updateRgbasArray(arrayName, color, opacity)
  //       if width is not None:
  //           setattr(this, widthName, width)
  //       if opacity is not None:
  //           setattr(this, opacityName, opacity)
  //       if color is not None and background:
  //           this.backgroundStrokeColor = color
  //       return this

  //   setBackgroundStroke(this, **kwargs) {
  //       kwargs["background"] = True
  //       this.setStroke(**kwargs)
  //       return this

  //   setStyle(
  //       this,
  //       fillColor=None,
  //       fillOpacity=None,
  //       strokeColor=None,
  //       strokeWidth=None,
  //       strokeOpacity=None,
  //       backgroundStrokeColor=None,
  //       backgroundStrokeWidth=None,
  //       backgroundStrokeOpacity=None,
  //       sheenFactor=None,
  //       sheenDirection=None,
  //       backgroundImage=None,
  //       family=True,
  //   ) {
  //       this.setFill(color=fillColor, opacity=fillOpacity, family=family)
  //       this.setStroke(
  //           color=strokeColor,
  //           width=strokeWidth,
  //           opacity=strokeOpacity,
  //           family=family,
  //       )
  //       this.setBackgroundStroke(
  //           color=backgroundStrokeColor,
  //           width=backgroundStrokeWidth,
  //           opacity=backgroundStrokeOpacity,
  //           family=family,
  //       )
  //       if sheenFactor:
  //           this.setSheen(
  //               factor=sheenFactor,
  //               direction=sheenDirection,
  //               family=family,
  //           )
  //       if backgroundImage:
  //           this.colorUsingBackgroundImage(backgroundImage)
  //       return this

  //   getStyle(this, simple=False) {
  //       ret = {
  //           "strokeOpacity": this.getStrokeOpacity(),
  //           "strokeWidth": this.getStrokeWidth(),
  //       }

  //       if simple:
  //           ret["fillColor"] = colour.rgb2hex(this.getFillColor().getRgb())
  //           ret["fillOpacity"] = this.getFillOpacity()
  //           ret["strokeColor"] = colour.rgb2hex(this.getStrokeColor().getRgb())
  //       else:
  //           ret["fillColor"] = this.getFillColors()
  //           ret["fillOpacity"] = this.getFillOpacities()
  //           ret["strokeColor"] = this.getStrokeColors()
  //           ret["backgroundStrokeColor"] = this.getStrokeColors(background=True)
  //           ret["backgroundStrokeWidth"] = this.getStrokeWidth(background=True)
  //           ret["backgroundStrokeOpacity"] = this.getStrokeOpacity(background=True)
  //           ret["sheenFactor"] = this.getSheenFactor()
  //           ret["sheenDirection"] = this.getSheenDirection()
  //           ret["backgroundImage"] = this.getBackgroundImage()

  //       return ret

  //   matchStyle(this, vmobject, family=True) {
  //       this.setStyle(**vmobject.getStyle(), family=False)

  //       if family:
  //           # Does its best to match up submobject lists, and
  //           # match styles accordingly
  //           submobs1, submobs2 = this.submobjects, vmobject.submobjects
  //           if len(submobs1) == 0:
  //               return this
  //           elif len(submobs2) == 0:
  //               submobs2 = [vmobject]
  //           for sm1, sm2 in zip(*makeEven(submobs1, submobs2)) {
  //               sm1.matchStyle(sm2)
  //       return this

  //   setColor(this, color, family=True) {
  //       this.setFill(color, family=family)
  //       this.setStroke(color, family=family)
  //       return this

  //   setOpacity(this, opacity, family=True) {
  //       this.setFill(opacity=opacity, family=family)
  //       this.setStroke(opacity=opacity, family=family)
  //       this.setStroke(opacity=opacity, family=family, background=True)
  //       return this

  //   fade(this, darkness=0.5, family=True) {
  //       factor = 1.0 - darkness
  //       this.setFill(opacity=factor * this.getFillOpacity(), family=False)
  //       this.setStroke(opacity=factor * this.getStrokeOpacity(), family=False)
  //       this.setBackgroundStroke(
  //           opacity=factor * this.getStrokeOpacity(background=True),
  //           family=False,
  //       )
  //       super().fade(darkness, family)
  //       return this

  //   getFillRgbas(this) {
  //       try:
  //           return this.fillRgbas
  //       except AttributeError:
  //           return np.zeros((1, 4))

  //   getFillColor(this) {
  //       """
  //       If there are multiple colors (for gradient)
  //       this returns the first one
  //       """
  //       return this.getFillColors()[0]

  //   fillColor = property(getFillColor, setFill)

  /** If there are multiple opacities, this returns the first */
  getFillOpacity(): any {
    return this.getFillOpacities()[0];
  }

  //   getFillColors(this) {
  //       return [
  //           colour.Color(rgb=rgba[:3]) if rgba.any() else None
  //           for rgba in this.getFillRgbas()
  //       ]

  //   getFillOpacities(this) {
  //       return this.getFillRgbas()[:, 3]

  //   getStrokeRgbas(this, background=False) {
  //       try:
  //           if background:
  //               rgbas = this.backgroundStrokeRgbas
  //           else:
  //               rgbas = this.strokeRgbas
  //           return rgbas
  //       except AttributeError:
  //           return np.zeros((1, 4))

  //   getStrokeColor(this, background=False) {
  //       return this.getStrokeColors(background)[0]

  //   strokeColor = property(getStrokeColor, setStroke)

  //   getStrokeWidth(this, background=False) {
  //       if background:
  //           width = this.backgroundStrokeWidth
  //       else:
  //           width = this.strokeWidth
  //           if isinstance(width, str) {
  //               width = int(width)
  //       return max(0, width)

  //   getStrokeOpacity(this, background=False) {
  //       return this.getStrokeOpacities(background)[0]

  //   getStrokeColors(this, background=False) {
  //       return [
  //           colour.Color(rgb=rgba[:3]) if rgba.any() else None
  //           for rgba in this.getStrokeRgbas(background)
  //       ]

  //   getStrokeOpacities(this, background=False) {
  //       return this.getStrokeRgbas(background)[:, 3]

  //   getColor(this) {
  //       if np.all(this.getFillOpacities() == 0) {
  //           return this.getStrokeColor()
  //       return this.getFillColor()

  //   color = property(getColor, setColor)

  //   setSheenDirection(this, direction: np.ndarray, family=True) {
  //       """Sets the direction of the applied sheen.

  //       Parameters
  //       ----------
  //       direction : :class:`numpy.ndarray`, optional
  //           Direction from where the gradient is applied.

  //       Examples
  //       --------
  //       Normal usage::

  //           Circle().setSheenDirection(UP)

  //       See Also
  //       --------
  //       :meth:`~.VMobject.setSheen`
  //       :meth:`~.VMobject.rotateSheenDirection`
  //       """

  //       direction = np.array(direction)
  //       if family:
  //           for submob in this.getFamily() {
  //               submob.sheenDirection = direction
  //       else:
  //           this.sheenDirection = direction
  //       return this

  //   rotateSheenDirection(this, angle: np.ndarray, axis: float = OUT, family=True) {
  //       """Rotates the direction of the applied sheen.

  //       Parameters
  //       ----------
  //       angle : :class:`float`
  //           Angle by which the direction of sheen is rotated.
  //       axis : :class:`numpy.ndarray`
  //           Axis of rotation.

  //       Examples
  //       --------
  //       Normal usage::

  //           Circle().setSheenDirection(UP).rotateSheenDirection(PI)

  //       See Also
  //       --------
  //       :meth:`~.VMobject.setSheenDirection`
  //       """
  //       if family:
  //           for submob in this.getFamily() {
  //               submob.sheenDirection = rotateVector(
  //                   submob.sheenDirection,
  //                   angle,
  //                   axis,
  //               )
  //       else:
  //           this.sheenDirection = rotateVector(this.sheenDirection, angle, axis)
  //       return this

  //   setSheen(this, factor, direction: np.ndarray = None, family=True) {
  //       """Applies a color gradient from a direction.

  //       Parameters
  //       ----------
  //       factor : :class:`float`
  //           The extent of lustre/gradient to apply. If negative, the gradient
  //           starts from black, if positive the gradient starts from white and
  //           changes to the current color.
  //       direction : :class:`numpy.ndarray`, optional
  //           Direction from where the gradient is applied.

  //       Examples
  //       --------
  //       .. manim:: SetSheen
  //           :saveLastFrame:

  //           class SetSheen(Scene) {
  //               construct(this) {
  //                   circle = Circle(fillOpacity=1).setSheen(-0.3, DR)
  //                   this.add(circle)
  //       """

  //       if family:
  //           for submob in this.submobjects:
  //               submob.setSheen(factor, direction, family)
  //       this.sheenFactor = factor
  //       if direction is not None:
  //           # family set to false because recursion will
  //           # already be handled above
  //           this.setSheenDirection(direction, family=False)
  //       # Reset color to put sheenFactor into effect
  //       if factor != 0:
  //           this.setStroke(this.getStrokeColor(), family=family)
  //           this.setFill(this.getFillColor(), family=family)
  //       return this

  //   getSheenDirection(this) {
  //       return np.array(this.sheenDirection)

  getSheenFactor(): number {
    return this.sheenFactor;
  }
  //   getGradientStartAndEndPoints(this) {
  //       if this.shadeIn_3d:
  //           return get_3dVmobGradientStartAndEndPoints(this)
  //       else:
  //           direction = this.getSheenDirection()
  //           c = this.getCenter()
  //           bases = np.array(
  //               [this.getEdgeCenter(vect) - c for vect in [RIGHT, UP, OUT]],
  //           ).transpose()
  //           offset = np.dot(bases, direction)
  //           return (c - offset, c + offset)

  //   colorUsingBackgroundImage(this, backgroundImage: Union[Image, str]) {
  //       this.backgroundImage = backgroundImage
  //       this.setColor(WHITE)
  //       for submob in this.submobjects:
  //           submob.colorUsingBackgroundImage(backgroundImage)
  //       return this

  //   getBackgroundImage(this) -> Union[Image, str]:
  //       return this.backgroundImage

  //   matchBackgroundImage(this, vmobject) {
  //       this.colorUsingBackgroundImage(vmobject.getBackgroundImage())
  //       return this

  //   setShadeIn_3d(this, value=True, zIndexAsGroup=False) {
  //       for submob in this.getFamily() {
  //           submob.shadeIn_3d = value
  //           if zIndexAsGroup:
  //               submob.zIndexGroup = this
  //       return this


  setPoints(points: Pt3[]) {
    this.points = points;
    return this;
  }

  //   setAnchorsAndHandles(
  //       this,
  //       anchors1: Sequence[float],
  //       handles1: Sequence[float],
  //       handles2: Sequence[float],
  //       anchors2: Sequence[float],
  //   ) {
  //       """Given two sets of anchors and handles, process them to set them as anchors
  //       and handles of the VMobject.

  //       anchors1[i], handles1[i], handles2[i] and anchors2[i] define the i-th bezier
  //       curve of the vmobject. There are four hardcoded parameters and this is a
  //       problem as it makes the number of points per cubic curve unchangeable from 4
  //       (two anchors and two handles).

  //       Returns
  //       -------
  //       {@link VMobject}
  //           ``this``
  //       """
  //       assert len(anchors1) == len(handles1) == len(handles2) == len(anchors2)
  //       nppcc = this.nPointsPerCubicCurve  # 4
  //       totalLen = nppcc * len(anchors1)
  //       this.points = np.zeros((totalLen, this.dim))
  //       # the following will, from the four sets, dispatch them in points such that
  //       # this.points = [
  //       #     anchors1[0], handles1[0], handles2[0], anchors1[0], anchors1[1],
  //       #     handles1[1], ...
  //       # ]
  //       arrays = [anchors1, handles1, handles2, anchors2]
  //       for index, array in enumerate(arrays) {
  //           this.points[index::nppcc] = array
  //       return this

  //   clearPoints(this) {
  //       this.points = np.zeros((0, this.dim))

  appendPoints(newPoints: Pt3[]): this {
    // TODO, check that number new points is a multiple of 4?
    // or else that if len(this.points) % 4 == 1, then
    // len(newPoints) % 4 == 3?
    // this.points = np.append(this.points, newPoints, axis=0)
    this.points = this.points.concat(newPoints);
    return this;
  }

  startNewPath(point: Pt3): this {
    // TODO, make sure that len(this.points) % 4 == 0?
    this.appendPoints([point]);
    return this;
  }

  addCubicBezierCurve(anchor1: Pt3, handle1: Pt3, handle2: Pt3, anchor2: Pt3): void {
    // TODO, check the len(this.points) % 4 == 0?
    this.appendPoints([anchor1, handle1, handle2, anchor2]);
  }

  /**
   * Add cubic bezier curve to the path. 
   * 
   * NOTE: the first anchor is not a parameter as by default the end of the last sub-path!
   * @param handle1 first handle
   * @param handle2 second handle
   * @param anchor anchor
   * */
  addCubicBezierCurveTo(
    handle1: Pt3,
    handle2: Pt3,
    anchor: Pt3,
  ): this {
    this.throwErrorIfNoPoints("addCubicBezierCurveTo");
    const newPoints = [handle1, handle2, anchor];
    if (this.hasNewPathStarted()) {
      this.appendPoints(newPoints);
    } else {
      this.appendPoints([this.getLastPoint()].concat(newPoints))
    };
    return this;
  }

  //   addQuadraticBezierCurveTo(
  //       this,
  //       handle: np.ndarray,
  //       anchor: np.ndarray,
  //   ) {
  //       """Add Quadratic bezier curve to the path.

  //       Returns
  //       -------
  //       {@link VMobject}
  //           ``this``
  //       """
  //       # How does one approximate a quadratic with a cubic?
  //       # refer to the Wikipedia page on Bezier curves
  //       # https://en.wikipedia.org/wiki/B%C3%A9zierCurve#DegreeElevation, accessed Jan 20, 2021
  //       # 1. Copy the end points, and then
  //       # 2. Place the 2 middle control points 2/3 along the line segments
  //       # from the end points to the quadratic curve's middle control point.
  //       # I think that's beautiful.
  //       this.addCubicBezierCurveTo(
  //           2 / 3 * handle + 1 / 3 * this.getLastPoint(),
  //           2 / 3 * handle + 1 / 3 * anchor,
  //           anchor,
  //       )
  //       return this

  /**
   * Add a straight line from the last point of VMobject to the given point.
   * @param point end of the straight line.
   */
  addLineTo(point: Pt3): this {
    const nppcc = this.nPointsPerCubicCurve;
    this.addCubicBezierCurveTo(
      ...$linspace(0, 1, this.nPointsPerCubicCurve).slice(1).map(a => $interpolate(this.getLastPoint(), point, a))
      // interpolate(this.getLastPoint(), point, a)
      // for a in np.linspace(0, 1, nppcc)[1:]
    )
        )
    return this
  }

  //   addSmoothCurveTo(this, *points: np.array) {
  //       """Creates a smooth curve from given points and add it to the VMobject. If two points are passed in, the first is interpreted
  //       as a handle, the second as an anchor.

  //       Parameters
  //       ----------
  //       points: np.array
  //           Points (anchor and handle, or just anchor) to add a smooth curve from

  //       Returns
  //       -------
  //       {@link VMobject}
  //           ``this``

  //       Raises
  //       ------
  //       ValueError
  //           If 0 or more than 2 points are given.
  //       """
  //       # TODO remove the value error and just add two parameters with one optional
  //       if len(points) == 1:
  //           handle2 = None
  //           newAnchor = points[0]
  //       elif len(points) == 2:
  //           handle2, newAnchor = points
  //       else:
  //           name = sys.Getframe(0).fCode.coName
  //           raise ValueError(f"Only call {name} with 1 or 2 points")

  //       if this.hasNewPathStarted() {
  //           this.addLineTo(newAnchor)
  //       else:
  //           this.throwErrorIfNoPoints()
  //           lastH2, lastA2 = this.points[-2:]
  //           lastTangent = lastA2 - lastH2
  //           handle1 = lastA2 + lastTangent
  //           if handle2 is None:
  //               toAnchorVect = newAnchor - lastA2
  //               newTangent = rotateVector(lastTangent, PI, axis=toAnchorVect)
  //               handle2 = newAnchor - newTangent
  //           this.appendPoints([lastA2, handle1, handle2, newAnchor])
  //       return this
  hasNewPathStarted(): boolean {
    // A new path starting is defined by a control point which is not part of a bezier subcurve.
    return this.points.length % this.nPointsPerCubicCurve === 1;
  }

  getLastPoint(): Pt3 {
    return this.points[this.points.length - 1];
  }

  //   isClosed(this) {
  //       # TODO use considerPointsEquals_2d ?
  //       return this.considerPointsEquals(this.points[0], this.points[-1])

  addPointsAsCorners(points: Pt3[]): Pt3[] {
    for (const point of points) {
      this.addLineTo(point)
    }
    return points
  }

  //   setPointsAsCorners(this, points: Sequence[float]) {
  //       """Given an array of points, set them as corner of the vmobject.

  //       To achieve that, this algorithm sets handles aligned with the anchors such that the resultant bezier curve will be the segment
  //       between the two anchors.

  //       Parameters
  //       ----------
  //       points : Iterable[float]
  //           Array of points that will be set as corners.

  //       Returns
  //       -------
  //       {@link VMobject}
  //           ``this``
  //       """
  //       nppcc = this.nPointsPerCubicCurve
  //       points = np.array(points)
  //       # This will set the handles aligned with the anchors.
  //       # Id est, a bezier curve will be the segment from the two anchors such that the handles belongs to this segment.
  //       this.setAnchorsAndHandles(
  //           *(interpolate(points[:-1], points[1:], a) for a in np.linspace(0, 1, nppcc))
  //       )
  //       return this

  setPointsSmoothly(points: Pt3[]): this {
    this.setPointsAsCorners(points);
    this.makeSmooth();
    return this
  }

  /**
   * Changes the anchor mode of the bezier curves. This will modify the handles.
   * 
   * There can be only two modes, "jagged", and "smooth".
   */
  changeAnchorMode(mode: "jagged" | "smooth"): this {
    throw new Error("Not implemented");
    // assert mode in ["jagged", "smooth"]
    // nppcc = this.nPointsPerCubicCurve
    // for submob in this.familyMembersWithPoints() {
    //     subpaths = submob.getSubpaths()
    //     submob.clearPoints()
    //     # A subpath can be composed of several bezier curves.
    //     for subpath in subpaths:
    //         # This will retrieve the anchors of the subpath, by selecting every n element in the array subpath
    //         # The append is needed as the last element is not reached when slicing with numpy.
    //         anchors = np.append(subpath[::nppcc], subpath[-1:], 0)
    //         if mode == "smooth":
    //             h1, h2 = getSmoothHandlePoints(anchors)
    //         elif mode == "jagged":
    //             # The following will make the handles aligned with the anchors, thus making the bezier curve a segment
    //             a1 = anchors[:-1]
    //             a2 = anchors[1:]
    //             h1 = interpolate(a1, a2, 1.0 / 3)
    //             h2 = interpolate(a1, a2, 2.0 / 3)
    //         newSubpath = np.array(subpath)
    //         newSubpath[1::nppcc] = h1
    //         newSubpath[2::nppcc] = h2
    //         submob.appendPoints(newSubpath)
    // return this
  }

  makeSmooth(): this {
    return this.changeAnchorMode("smooth");
  }

  makeJagged(): this {
    return this.changeAnchorMode("jagged");
  }

  addSubpath(points: Pt3[]): this {
    throw new Error("Not implemented");
    // assert len(points) % 4 == 0
    // this.points = np.append(this.points, points, axis=0)
    // return this;
  }

  //   appendVectorizedMobject(this, vectorizedMobject) {
  //       newPoints = list(vectorizedMobject.points)

  //       if this.hasNewPathStarted() {
  //           # Remove last point, which is starting
  //           # a new path
  //           this.points = this.points[:-1]
  //       this.appendPoints(newPoints)

  //   applyFunction(this, function) {
  //       factor = this.preFunctionHandleToAnchorScaleFactor
  //       this.scaleHandleToAnchorDistances(factor)
  //       super().applyFunction(function)
  //       this.scaleHandleToAnchorDistances(1.0 / factor)
  //       if this.makeSmoothAfterApplyingFunctions:
  //           this.makeSmooth()
  //       return this

  //   rotate(
  //       this,
  //       angle: float,
  //       axis: np.ndarray = OUT,
  //       aboutPoint: Optional[Sequence[float]] = None,
  //       **kwargs,
  //   ) {
  //       this.rotateSheenDirection(angle, axis)
  //       super().rotate(angle, axis, aboutPoint, **kwargs)
  //       return this

  //   scaleHandleToAnchorDistances(this, factor: float) {
  //       """If the distance between a given handle point H and its associated
  //       anchor point A is d, then it changes H to be a distances factor*d
  //       away from A, but so that the line from A to H doesn't change.
  //       This is mostly useful in the context of applying a (differentiable)
  //       function, to preserve tangency properties.  One would pull all the
  //       handles closer to their anchors, apply the function then push them out
  //       again.

  //       Parameters
  //       ----------
  //       factor
  //           The factor used for scaling.

  //       Returns
  //       -------
  //       {@link VMobject}
  //           ``this``
  //       """
  //       for submob in this.familyMembersWithPoints() {
  //           if len(submob.points) < this.nPointsPerCubicCurve:
  //               # The case that a bezier quad is not complete (there is no bezier curve as there is not enough control points.)
  //               continue
  //           a1, h1, h2, a2 = submob.getAnchorsAndHandles()
  //           a1ToH1 = h1 - a1
  //           a2ToH2 = h2 - a2
  //           newH1 = a1 + factor * a1ToH1
  //           newH2 = a2 + factor * a2ToH2
  //           submob.setAnchorsAndHandles(a1, newH1, newH2, a2)
  //       return this

  //   #
  //   considerPointsEquals(this, p0, p1) {
  //       return np.allclose(p0, p1, atol=this.toleranceForPointEquality)

  //   considerPointsEquals_2d(this, p0: np.ndarray, p1: np.ndarray) -> bool:
  //       """Determine if two points are close enough to be considered equal.

  //       This uses the algorithm from np.isclose(), but expanded here for the
  //       2D point case. NumPy is overkill for such a small question.
  //       Parameters
  //       ----------
  //       p0 : np.ndarray
  //           first point
  //       p1 : np.ndarray
  //           second point

  //       Returns
  //       -------
  //       bool
  //           whether two points considered close.
  //       """
  //       rtol = 1.0e-5  # default from np.isclose()
  //       atol = this.toleranceForPointEquality
  //       if abs(p0[0] - p1[0]) > atol + rtol * abs(p1[0]) {
  //           return False
  //       if abs(p0[1] - p1[1]) > atol + rtol * abs(p1[1]) {
  //           return False
  //       return True

  //   # Information about line
  //   getCubicBezierTuplesFromPoints(this, points) {
  //       return np.array(list(this.genCubicBezierTuplesFromPoints(points)))

  //   genCubicBezierTuplesFromPoints(this, points: np.ndarray) -> typing.Tuple:
  //       """Returns the bezier tuples from an array of points.

  //       this.points is a list of the anchors and handles of the bezier curves of the mobject (ie [anchor1, handle1, handle2, anchor2, anchor3 ..])
  //       This algorithm basically retrieve them by taking an element every n, where n is the number of control points
  //       of the bezier curve.


  //       Parameters
  //       ----------
  //       points : np.ndarray
  //           Points from which control points will be extracted.

  //       Returns
  //       -------
  //       typing.Tuple
  //           Bezier control points.
  //       """
  //       nppcc = this.nPointsPerCubicCurve
  //       remainder = len(points) % nppcc
  //       points = points[: len(points) - remainder]
  //       # Basically take every nppcc element.
  //       return (points[i : i + nppcc] for i in range(0, len(points), nppcc))

  getCubicBezierTuples() {
    return this.getCubicBezierTuplesFromPoints(this.points);
  }

  //   GenSubpathsFromPoints(
  //       this,
  //       points: np.ndarray,
  //       filterFunc: typing.Callable[[int], bool],
  //   ) -> typing.Tuple:
  //       """Given an array of points defining the bezier curves of the vmobject, return subpaths formed by these points.
  //       Here, Two bezier curves form a path if at least two of their anchors are evaluated True by the relation defined by filterFunc.

  //       The algorithm every bezier tuple (anchors and handles) in ``this.points`` (by regrouping each n elements, where
  //       n is the number of points per cubic curve)), and evaluate the relation between two anchors with filterFunc.
  //       NOTE : The filterFunc takes an int n as parameter, and will evaluate the relation between points[n] and points[n - 1]. This should probably be changed so
  //       the function takes two points as parameters.

  //       Parameters
  //       ----------
  //       points : np.ndarray
  //           points defining the bezier curve.
  //       filterFunc : typing.Callable[int, bool]
  //           Filter-func defining the relation.

  //       Returns
  //       -------
  //       typing.Tuple
  //           subpaths formed by the points.
  //       """
  //       nppcc = this.nPointsPerCubicCurve
  //       filtered = filter(filterFunc, range(nppcc, len(points), nppcc))
  //       splitIndices = [0] + list(filtered) + [len(points)]
  //       return (
  //           points[i1:i2]
  //           for i1, i2 in zip(splitIndices, splitIndices[1:])
  //           if (i2 - i1) >= nppcc
  //       )

  //   getSubpathsFromPoints(this, points) {
  //       return list(
  //           this.GenSubpathsFromPoints(
  //               points,
  //               lambda n: not this.considerPointsEquals(points[n - 1], points[n]),
  //           ),
  //       )

  //   genSubpathsFromPoints_2d(this, points) {
  //       return this.GenSubpathsFromPoints(
  //           points,
  //           lambda n: not this.considerPointsEquals_2d(points[n - 1], points[n]),
  //       )

  /**
   * Returns subpaths formed by the curves of the VMobject.
   * 
   * Subpaths are ranges of curves with each pair of consecutive curves having their end/start points coincident.
   * @returns subpaths.
   */
  getSubpaths() {
    return this.getSubpathsFromPoints(this.points);
  }

  //   getNthCurvePoints(this, n: int) -> np.ndarray:
  //       """Returns the points defining the nth curve of the vmobject.

  //       Parameters
  //       ----------
  //       n : int
  //           index of the desired bezier curve.

  //       Returns
  //       -------
  //       np.ndarray
  //           points defininf the nth bezier curve (anchors, handles)
  //       """
  //       assert n < this.getNumCurves()
  //       nppcc = this.nPointsPerCubicCurve
  //       return this.points[nppcc * n : nppcc * (n + 1)]

  //   getNthCurveFunction(this, n: int) -> typing.Callable[[float], np.ndarray]:
  //       """Returns the expression of the nth curve.

  //       Parameters
  //       ----------
  //       n : int
  //           index of the desired curve.

  //       Returns
  //       -------
  //       typing.Callable[float]
  //           expression of the nth bezier curve.
  //       """
  //       return bezier(this.getNthCurvePoints(n))

  //   getNthCurveLengthPieces(
  //       this,
  //       n: int,
  //       samplePoints: Optional[int] = None,
  //   ) -> np.ndarray:
  //       """Returns the array of short line lengths used for length approximation.

  //       Parameters
  //       ----------
  //       n
  //           The index of the desired curve.
  //       samplePoints
  //           The number of points to sample to find the length.

  //       Returns
  //       -------
  //       np.ndarray
  //           The short length-pieces of the nth curve.
  //       """
  //       if samplePoints is None:
  //           samplePoints = 10

  //       curve = this.getNthCurveFunction(n)
  //       points = np.array([curve(a) for a in np.linspace(0, 1, samplePoints)])
  //       diffs = points[1:] - points[:-1]
  //       norms = np.applyAlongAxis(np.linalg.norm, 1, diffs)

  //       return norms

  //   getNthCurveLength(
  //       this,
  //       n: int,
  //       samplePoints: Optional[int] = None,
  //   ) -> float:
  //       """Returns the (approximate) length of the nth curve.

  //       Parameters
  //       ----------
  //       n
  //           The index of the desired curve.
  //       samplePoints
  //           The number of points to sample to find the length.

  //       Returns
  //       -------
  //       length : :class:`float`
  //           The length of the nth curve.
  //       """

  //       _, length = this.getNthCurveFunctionWithLength(n, samplePoints)

  //       return length

  //   getNthCurveFunctionWithLength(
  //       this,
  //       n: int,
  //       samplePoints: Optional[int] = None,
  //   ) -> typing.Tuple[typing.Callable[[float], np.ndarray], float]:
  //       """Returns the expression of the nth curve along with its (approximate) length.

  //       Parameters
  //       ----------
  //       n
  //           The index of the desired curve.
  //       samplePoints
  //           The number of points to sample to find the length.

  //       Returns
  //       -------
  //       curve : typing.Callable[[float], np.ndarray]
  //           The function for the nth curve.
  //       length : :class:`float`
  //           The length of the nth curve.
  //       """

  //       curve = this.getNthCurveFunction(n)
  //       norms = this.getNthCurveLengthPieces(n, samplePoints=samplePoints)
  //       length = np.sum(norms)

  //       return curve, length
  /**
   * Returns the number of curves of the vmobject.
   * @returns number of curves of the vmobject.
  */
  getNumCurves(): number {
    const nppcc = this.nPointsPerCubicCurve;
    return Math.floor(this.points.length / nppcc);
  }

  //   getCurveFunctions(
  //       this,
  //   ) -> typing.Iterable[typing.Callable[[float], np.ndarray]]:
  //       """Gets the functions for the curves of the mobject.

  //       Returns
  //       -------
  //       typing.Iterable[typing.Callable[[float], np.ndarray]]
  //           The functions for the curves.
  //       """

  //       numCurves = this.getNumCurves()

  //       for n in range(numCurves) {
  //           yield this.getNthCurveFunction(n)

  /**
   * Gets the functions and lengths of the curves for the mobject.
   * @param kwargs The keyword arguments passed to {@link getNthCurveFunctionWithLength}
   * @returns The functions and lengths of the curves.
   */
  getCurveFunctionsWithLengths(kwargs) {
    const numCurves = this.getNumCurves();

    //       for n in range(numCurves) {
    //           yield this.getNthCurveFunctionWithLength(n, **kwargs)
  }

  //   pointFromProportion(this, alpha: float) -> np.ndarray:
  //       """Gets the point at a proportion along the path of the {@link VMobject}.

  //       Parameters
  //       ----------
  //       alpha
  //           The proportion along the the path of the {@link VMobject}.

  //       Returns
  //       -------
  //       :class:`numpy.ndarray`
  //           The point on the {@link VMobject}.

  //       Raises
  //       ------
  //       :exc:`ValueError`
  //           If ``alpha`` is not between 0 and 1.
  //       :exc:`Exception`
  //           If the {@link VMobject} has no points.
  //       """

  //       if alpha < 0 or alpha > 1:
  //           raise ValueError(f"Alpha {alpha} not between 0 and 1.")

  //       this.throwErrorIfNoPoints()
  //       if alpha == 1:
  //           return this.points[-1]

  //       curvesAndLengths = tuple(this.getCurveFunctionsWithLengths())

  //       targetLength = alpha * sum(length for _, length in curvesAndLengths)
  //       currentLength = 0

  //       for curve, length in curvesAndLengths:
  //           if currentLength + length >= targetLength:
  //               if length != 0:
  //                   residue = (targetLength - currentLength) / length
  //               else:
  //                   residue = 0

  //               return curve(residue)

  //           currentLength += length

  //   proportionFromPoint(
  //       this,
  //       point: typing.Iterable[typing.Union[float, int]],
  //   ) -> float:
  //       """Returns the proportion along the path of the {@link VMobject}
  //       a particular given point is at.

  //       Parameters
  //       ----------
  //       point
  //           The Cartesian coordinates of the point which may or may not lie on the {@link VMobject}

  //       Returns
  //       -------
  //       float
  //           The proportion along the path of the {@link VMobject}.

  //       Raises
  //       ------
  //       :exc:`ValueError`
  //           If ``point`` does not lie on the curve.
  //       :exc:`Exception`
  //           If the {@link VMobject} has no points.
  //       """
  //       this.throwErrorIfNoPoints()

  //       # Iterate over each bezier curve that the ``VMobject`` is composed of, checking
  //       # if the point lies on that curve. If it does not lie on that curve, add
  //       # the whole length of the curve to ``targetLength`` and move onto the next
  //       # curve. If the point does lie on the curve, add how far along the curve
  //       # the point is to ``targetLength``.
  //       # Then, divide ``targetLength`` by the total arc length of the shape to get
  //       # the proportion along the ``VMobject`` the point is at.

  //       numCurves = this.getNumCurves()
  //       totalLength = this.getArcLength()
  //       targetLength = 0
  //       for n in range(numCurves) {
  //           controlPoints = this.getNthCurvePoints(n)
  //           length = this.getNthCurveLength(n)
  //           proportionsAlongBezier = proportionsAlongBezierCurveForPoint(
  //               point,
  //               controlPoints,
  //           )
  //           if len(proportionsAlongBezier) > 0:
  //               proportionAlongNthCurve = max(proportionsAlongBezier)
  //               targetLength += length * proportionAlongNthCurve
  //               break
  //           targetLength += length
  //       else:
  //           raise ValueError(f"Point {point} does not lie on this curve.")

  //       alpha = targetLength / totalLength

  //       return alpha

  //   getAnchorsAndHandles(this) -> typing.Iterable[np.ndarray]:
  //       """Returns anchors1, handles1, handles2, anchors2,
  //       where (anchors1[i], handles1[i], handles2[i], anchors2[i])
  //       will be four points defining a cubic bezier curve
  //       for any i in range(0, len(anchors1))

  //       Returns
  //       -------
  //       typing.Iterable[np.ndarray]
  //           Iterable of the anchors and handles.
  //       """
  //       nppcc = this.nPointsPerCubicCurve
  //       return [this.points[i::nppcc] for i in range(nppcc)]

  /**
   * Returns the start anchors of the bezier curves.
   * @returns Starting anchors
   */
  getStartAnchors(): Vec3[] {
    return $jumpslice(this.points, 0, this.nPointsPerCubicCurve);
  }

  /**
   * Return the starting anchors of the bezier curves.
   * @returns Starting anchors
   */
  getEndAnchors(): Vec3[] {
    return $jumpslice(this.points, this.nPointsPerCubicCurve - 1, this.nPointsPerCubicCurve);
  }

  //   getAnchors(this) -> np.ndarray:
  //       """Returns the anchors of the curves forming the VMobject.

  //       Returns
  //       -------
  //       np.ndarray
  //           The anchors.
  //       """
  //       if this.points.shape[0] == 1:
  //           return this.points
  //       return np.array(
  //           list(it.chain(*zip(this.getStartAnchors(), this.getEndAnchors()))),
  //       )

  //   getPointsDefiningBoundary(this) {
  //       # Probably returns all anchors, but this is weird regarding  the name of the method.
  //       return np.array(list(it.chain(*(sm.getAnchors() for sm in this.getFamily()))))

  /**
   * Return the approximated length of the whole curve.
   * @param samplePointsPerCurve Number of sample points per curve used to approximate the length. More points result in a better approximation.
   * @returns The length of the {@link VMobject}.
   */
  getArcLength(samplePointsPerCurve: number): number {

  }

  //       return sum(
  //           length
  //           for _, length in this.getCurveFunctionsWithLengths(
  //               samplePoints=samplePointsPerCurve,
  //           )
  //       )

  //   # Alignment
  //   alignPoints(this, vmobject: "VMobject") {
  //       """Adds points to this and vmobject so that they both have the same number of subpaths, with
  //       corresponding subpaths each containing the same number of points.

  //       Points are added either by subdividing curves evenly along the subpath, or by creating new subpaths consisting
  //       of a single point repeated.

  //       Parameters
  //       ----------
  //       vmobject
  //           The object to align points with.

  //       Returns
  //       -------
  //       {@link VMobject}
  //          ``this``
  //       """
  //       this.alignRgbas(vmobject)
  //       # TODO: This shortcut can be a bit over eager. What if they have the same length, but different subpath lengths?
  //       if this.getNumPoints() == vmobject.getNumPoints() {
  //           return

  //       for mob in this, vmobject:
  //           # If there are no points, add one to
  //           # wherever the "center" is
  //           if mob.hasNoPoints() {
  //               mob.startNewPath(mob.getCenter())
  //           # If there's only one point, turn it into
  //           # a null curve
  //           if mob.hasNewPathStarted() {
  //               mob.addLineTo(mob.getLastPoint())

  //       # Figure out what the subpaths are
  //       subpaths1 = this.getSubpaths()
  //       subpaths2 = vmobject.getSubpaths()
  //       nSubpaths = max(len(subpaths1), len(subpaths2))
  //       # Start building new ones
  //       newPath1 = np.zeros((0, this.dim))
  //       newPath2 = np.zeros((0, this.dim))

  //       nppcc = this.nPointsPerCubicCurve

  //       getNthSubpath(pathList, n) {
  //           if n >= len(pathList) {
  //               # Create a null path at the very end
  //               return [pathList[-1][-1]] * nppcc
  //           path = pathList[n]
  //           # Check for useless points at the end of the path and remove them
  //           # https://github.com/ManimCommunity/manim/issues/1959
  //           while len(path) > nppcc:
  //               # If the last nppc points are all equal to the preceding point
  //               if this.considerPointsEquals(path[-nppcc:], path[-nppcc - 1]) {
  //                   path = path[:-nppcc]
  //               else:
  //                   break
  //           return path

  //       for n in range(nSubpaths) {
  //           # For each pair of subpaths, add points until they are the same length
  //           sp1 = getNthSubpath(subpaths1, n)
  //           sp2 = getNthSubpath(subpaths2, n)
  //           diff1 = max(0, (len(sp2) - len(sp1)) // nppcc)
  //           diff2 = max(0, (len(sp1) - len(sp2)) // nppcc)
  //           sp1 = this.insertNCurvesToPointList(diff1, sp1)
  //           sp2 = this.insertNCurvesToPointList(diff2, sp2)
  //           newPath1 = np.append(newPath1, sp1, axis=0)
  //           newPath2 = np.append(newPath2, sp2, axis=0)
  //       this.setPoints(newPath1)
  //       vmobject.setPoints(newPath2)
  //       return this

  //   insertNCurves(this, n: int) {
  //       """Inserts n curves to the bezier curves of the vmobject.

  //       Parameters
  //       ----------
  //       n
  //           Number of curves to insert.

  //       Returns
  //       -------
  //       {@link VMobject}
  //           ``this``
  //       """
  //       newPathPoint = None
  //       if this.hasNewPathStarted() {
  //           newPathPoint = this.getLastPoint()

  //       newPoints = this.insertNCurvesToPointList(n, this.points)
  //       this.setPoints(newPoints)

  //       if newPathPoint is not None:
  //           this.appendPoints([newPathPoint])
  //       return this

  //   insertNCurvesToPointList(this, n: int, points: np.ndarray) -> np.ndarray:
  //       """Given an array of k points defining a bezier curves (anchors and handles), returns points defining exactly k + n bezier curves.

  //       Parameters
  //       ----------
  //       n : int
  //           Number of desired curves.
  //       points : np.ndarray
  //           Starting points.

  //       Returns
  //       -------
  //       np.ndarray
  //           Points generated.
  //       """

  //       if len(points) == 1:
  //           nppcc = this.nPointsPerCubicCurve
  //           return np.repeat(points, nppcc * n, 0)
  //       bezierQuads = this.getCubicBezierTuplesFromPoints(points)
  //       currNum = len(bezierQuads)
  //       targetNum = currNum + n
  //       # This is an array with values ranging from 0
  //       # up to currNum,  with repeats such that
  //       # it's total length is targetNum.  For example,
  //       # with currNum = 10, targetNum = 15, this would
  //       # be [0, 0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 8, 8, 9]
  //       repeatIndices = (np.arange(targetNum, dtype="i") * currNum) // targetNum

  //       # If the nth term of this list is k, it means
  //       # that the nth curve of our path should be split
  //       # into k pieces.
  //       # In the above example our array had the following elements
  //       # [0, 0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 8, 8, 9]
  //       # We have two 0s, one 1, two 2s and so on.
  //       # The split factors array would hence be:
  //       # [2, 1, 2, 1, 2, 1, 2, 1, 2, 1]
  //       splitFactors = np.zeros(currNum, dtype="i")
  //       for val in repeatIndices:
  //           splitFactors[val] += 1

  //       newPoints = np.zeros((0, this.dim))
  //       for quad, sf in zip(bezierQuads, splitFactors) {
  //           # What was once a single cubic curve defined
  //           # by "quad" will now be broken into sf
  //           # smaller cubic curves
  //           alphas = np.linspace(0, 1, sf + 1)
  //           for a1, a2 in zip(alphas, alphas[1:]) {
  //               newPoints = np.append(
  //                   newPoints,
  //                   partialBezierPoints(quad, a1, a2),
  //                   axis=0,
  //               )
  //       return newPoints

  //   alignRgbas(this, vmobject) {
  //       attrs = ["fillRgbas", "strokeRgbas", "backgroundStrokeRgbas"]
  //       for attr in attrs:
  //           a1 = getattr(this, attr)
  //           a2 = getattr(vmobject, attr)
  //           if len(a1) > len(a2) {
  //               newA2 = stretchArrayToLength(a2, len(a1))
  //               setattr(vmobject, attr, newA2)
  //           elif len(a2) > len(a1) {
  //               newA1 = stretchArrayToLength(a1, len(a2))
  //               setattr(this, attr, newA1)
  //       return this

  //   getPointMobject(this, center=None) {
  //       if center is None:
  //           center = this.getCenter()
  //       point = VectorizedPoint(center)
  //       point.matchStyle(this)
  //       return point

  //   interpolateColor(this, mobject1, mobject2, alpha) {
  //       attrs = [
  //           "fillRgbas",
  //           "strokeRgbas",
  //           "backgroundStrokeRgbas",
  //           "strokeWidth",
  //           "backgroundStrokeWidth",
  //           "sheenDirection",
  //           "sheenFactor",
  //       ]
  //       for attr in attrs:
  //           setattr(
  //               this,
  //               attr,
  //               interpolate(getattr(mobject1, attr), getattr(mobject2, attr), alpha),
  //           )
  //           if alpha == 1.0:
  //               setattr(this, attr, getattr(mobject2, attr))

  //   pointwiseBecomePartial(
  //       this,
  //       vmobject: "VMobject",
  //       a: float,
  //       b: float,
  //   ) {
  //       """Given two bounds a and b, transforms the points of the this vmobject into the points of the vmobject
  //       passed as parameter with respect to the bounds. Points here stand for control points of the bezier curves (anchors and handles)

  //       Parameters
  //       ----------
  //       vmobject : VMobject
  //           The vmobject that will serve as a model.
  //       a : float
  //           upper-bound.
  //       b : float
  //           lower-bound

  //       Returns
  //       -------
  //       {@link VMobject}
  //           ``this``
  //       """
  //       assert isinstance(vmobject, VMobject)
  //       # Partial curve includes three portions:
  //       # - A middle section, which matches the curve exactly
  //       # - A start, which is some ending portion of an inner cubic
  //       # - An end, which is the starting portion of a later inner cubic
  //       if a <= 0 and b >= 1:
  //           this.setPoints(vmobject.points)
  //           return this
  //       bezierQuads = vmobject.getCubicBezierTuples()
  //       numCubics = len(bezierQuads)

  //       # The following two lines will compute which bezier curves of the given mobject need to be processed.
  //       # The residue basically indicates de proportion of the selected bezier curve that have to be selected.
  //       # Ex : if lowerIndex is 3, and lowerResidue is 0.4, then the algorithm will append to the points 0.4 of the third bezier curve
  //       lowerIndex, lowerResidue = integerInterpolate(0, numCubics, a)
  //       upperIndex, upperResidue = integerInterpolate(0, numCubics, b)

  //       this.clearPoints()
  //       if numCubics == 0:
  //           return this
  //       if lowerIndex == upperIndex:
  //           this.appendPoints(
  //               partialBezierPoints(
  //                   bezierQuads[lowerIndex],
  //                   lowerResidue,
  //                   upperResidue,
  //               ),
  //           )
  //       else:
  //           this.appendPoints(
  //               partialBezierPoints(bezierQuads[lowerIndex], lowerResidue, 1),
  //           )
  //           for quad in bezierQuads[lowerIndex + 1 : upperIndex]:
  //               this.appendPoints(quad)
  //           this.appendPoints(
  //               partialBezierPoints(bezierQuads[upperIndex], 0, upperResidue),
  //           )
  //       return this

  //   getSubcurve(this, a: float, b: float) -> "VMobject":
  //       """Returns the subcurve of the VMobject between the interval [a, b].
  //       The curve is a VMobject itself.

  //       Parameters
  //       ----------

  //       a
  //           The lower bound.
  //       b
  //           The upper bound.

  //       Returns
  //       -------
  //       VMobject
  //           The subcurve between of [a, b]
  //       """
  //       if this.isClosed() and a > b:
  //           vmob = this.copy()
  //           vmob.pointwiseBecomePartial(this, a, 1)
  //           vmob2 = this.copy()
  //           vmob2.pointwiseBecomePartial(this, 0, b)
  //           vmob.appendVectorizedMobject(vmob2)
  //       else:
  //           vmob = this.copy()
  //           vmob.pointwiseBecomePartial(this, a, b)
  //       return vmob

  /**
   * Uses {@link shoelaceDirection} to calculate the direction.
   * The direction of points determines in which direction the object is drawn, clockwise or counterclockwise.
   */
  getDirection(): "CW" | "CCW" {
    return shoelaceDirection(this.getStartAnchors())
  }

  /** Reverts the point direction by inverting the point order. */
  reverseDirection(): this {
    this.points.reverse();
    return this;
  }

  /** Makes sure that points are either directed clockwise or counterclockwise. */
  forceDirection(targetDirection: "CW" | "CCW"): this {
    if (!["CW", "CCW"].includes(targetDirection)) {
      throw new RangeError('Invalid input for forceDirection. Use "CW" or "CCW"');
    }
    if (this.getDirection() != targetDirection) {
      // Since we already assured the input is CW or CCW, and the directions don't match, we just reverse
      this.reverseDirection();
    }
    return this;
  }
}


/**
 * A group of vectorized mobjects.
 * 
 * This can be used to group multiple {@link VMobject} instances together
 * in order to scale, move, ... them together.
 */
export class VGroup extends VMobject {
  constructor(...vmobjects: VMobject[]) {
    super({});
    this.add(...vmobjects);
  }

  //   _Init__(this, *vmobjects, **kwargs) {
  //       super()._Init__(**kwargs)
  //       this.add(*vmobjects)

  //   _Repr__(this) {
  //       return (
  //           this._Class__._Name__
  //           + "("
  //           + ", ".join(str(mob) for mob in this.submobjects)
  //           + ")"
  //       )

  //   _Str__(this) {
  //       return (
  //           f"{this._Class__._Name__} of {len(this.submobjects)} "
  //           f"submobject{'s' if len(this.submobjects) > 0 else ''}"
  //   

  /**
   * Checks if all passed elements are an instance of VMobject and then add them to submobjects
   * 
   * @param vmobjects List of {@link VMobject} to add
   * @throws {TypeError} If one element of the list is not an instance of {@link VMobject}
   */
  add(...vmobjects: VMobject[]): this {
    if (!vmobjects.every(m => m instanceof VMobject)) {
      throw new TypeError("All submobjects must be of type VMobject");
    }
    return super.add(...vmobjects);
  }

  //   _Add__(this, vmobject) {
  //       return VGroup(*this.submobjects, vmobject)

  //   _Iadd__(this, vmobject) {
  //       return this.add(vmobject)

  //   _Sub__(this, vmobject) {
  //       copy = VGroup(*this.submobjects)
  //       copy.remove(vmobject)
  //       return copy

  //   _Isub__(this, vmobject) {
  //       return this.remove(vmobject)

  //   _Setitem__(this, key: int, value: Union[VMobject, typing.Sequence[VMobject]]) {
  //       """Override the [] operator for item assignment.

  //       Parameters
  //       ----------
  //       key
  //           The index of the submobject to be assigned
  //       value
  //           The vmobject value to assign to the key

  //       Returns
  //       -------
  //       None

  //       Examples
  //       --------
  //       Normal usage::

  //           >>> vgroup = VGroup(VMobject())
  //           >>> newObj = VMobject()
  //           >>> vgroup[0] = newObj
  //       """
  //       if not all(isinstance(m, (VMobject, OpenGLVMobject)) for m in value) {
  //           raise TypeError("All submobjects must be of type VMobject")
  //       this.submobjects[key] = value

  $render(targets: Parameters<Mobject["$render"]>[0]) {
    for (const mob of this.submobjects) {
      mob.$render(targets);
    }
  }
}
