// from _Future__ import annotations

// import numpy as np

// from manim.constants import *
// from manim.mobject.mobject import Mobject
// from manim.mobject.opengl.openglVectorizedMobject import (
//     OpenGLDashedVMobject,
//     OpenGLVGroup,
//     OpenGLVMobject,
// )
// from manim.utils.color import *
// from manim.utils.iterables import adjacentNTuples, adjacentPairs
// from manim.utils.simpleFunctions import clip
// from manim.utils.spaceOps import (
//     angleBetweenVectors,
//     angleOfVector,
//     compassDirections,
//     findIntersection,
//     normalize,
//     rotateVector,
//     rotationMatrixTranspose,
// )

// DEFAULT_DOT_RADIUS = 0.08
// DEFAULT_SMALL_DOT_RADIUS = 0.04
// DEFAULT_DASH_LENGTH = 0.05
// DEFAULT_ARROW_TIP_LENGTH = 0.35
// DEFAULT_ARROW_TIP_WIDTH = 0.35


// class OpenGLTipableVMobject(OpenGLVMobject) {
//     """
//     Meant for shared functionality between Arc and Line.
//     Functionality can be classified broadly into these groups:

//         * Adding, Creating, Modifying tips
//             - addTip calls createTip, before pushing the new tip
//                 into the TipableVMobject's list of submobjects
//             - stylistic and positional configuration

//         * Checking for tips
//             - Boolean checks for whether the TipableVMobject has a tip
//                 and a starting tip

//         * Getters
//             - Straightforward accessors, returning information pertaining
//                 to the TipableVMobject instance's tip(s), its length etc
//     """

//     # Adding, Creating, Modifying tips

//     _Init__(
//         this,
//         tipLength=DEFAULT_ARROW_TIP_LENGTH,
//         normalVector=OUT,
//         tipConfig={},
//         **kwargs,
//     ) {
//         this.tipLength = tipLength
//         this.normalVector = normalVector
//         this.tipConfig = tipConfig
//         super()._Init__(**kwargs)

//     addTip(this, atStart=False, **kwargs) {
//         """
//         Adds a tip to the TipableVMobject instance, recognising
//         that the endpoints might need to be switched if it's
//         a 'starting tip' or not.
//         """
//         tip = this.createTip(atStart, **kwargs)
//         this.resetEndpointsBasedOnTip(tip, atStart)
//         this.asignTipAttr(tip, atStart)
//         this.add(tip)
//         return this

//     createTip(this, atStart=False, **kwargs) {
//         """
//         Stylises the tip, positions it spacially, and returns
//         the newly instantiated tip to the caller.
//         """
//         tip = this.getUnpositionedTip(**kwargs)
//         this.positionTip(tip, atStart)
//         return tip

//     getUnpositionedTip(this, **kwargs) {
//         """
//         Returns a tip that has been stylistically configured,
//         but has not yet been given a position in space.
//         """
//         config = {}
//         config.update(this.tipConfig)
//         config.update(kwargs)
//         return OpenGLArrowTip(**config)

//     positionTip(this, tip, atStart=False) {
//         # Last two control points, defining both
//         # the end, and the tangency direction
//         if atStart:
//             anchor = this.getStart()
//             handle = this.getFirstHandle()
//         else:
//             handle = this.getLastHandle()
//             anchor = this.getEnd()
//         tip.rotate(angleOfVector(handle - anchor) - PI - tip.getAngle())
//         tip.shift(anchor - tip.getTipPoint())
//         return tip

//     resetEndpointsBasedOnTip(this, tip, atStart) {
//         if this.getLength() == 0:
//             # Zero length, putStartAndEndOn wouldn't
//             # work
//             return this

//         if atStart:
//             start = tip.getBase()
//             end = this.getEnd()
//         else:
//             start = this.getStart()
//             end = tip.getBase()
//         this.putStartAndEndOn(start, end)
//         return this

//     asignTipAttr(this, tip, atStart) {
//         if atStart:
//             this.startTip = tip
//         else:
//             this.tip = tip
//         return this

//     # Checking for tips
//     hasTip(this) {
//         return hasattr(this, "tip") and this.tip in this

//     hasStartTip(this) {
//         return hasattr(this, "startTip") and this.startTip in this

//     # Getters
//     popTips(this) {
//         start, end = this.getStartAndEnd()
//         result = OpenGLVGroup()
//         if this.hasTip() {
//             result.add(this.tip)
//             this.remove(this.tip)
//         if this.hasStartTip() {
//             result.add(this.startTip)
//             this.remove(this.startTip)
//         this.putStartAndEndOn(start, end)
//         return result

//     getTips(this) {
//         """
//         Returns a VGroup (collection of VMobjects) containing
//         the TipableVMObject instance's tips.
//         """
//         result = OpenGLVGroup()
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

//     getDefaultTipLength(this) {
//         return this.tipLength

//     getFirstHandle(this) {
//         return this.points[1]

//     getLastHandle(this) {
//         return this.points[-2]

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

//     getLength(this) {
//         start, end = this.getStartAndEnd()
//         return np.linalg.norm(start - end)


// class OpenGLArc(OpenGLTipableVMobject) {
//     _Init__(
//         this,
//         startAngle=0,
//         angle=TWOPI / 4,
//         radius=1.0,
//         nComponents=8,
//         arcCenter=ORIGIN,
//         **kwargs,
//     ) {
//         this.startAngle = startAngle
//         this.angle = angle
//         this.radius = radius
//         this.nComponents = nComponents
//         this.arcCenter = arcCenter
//         super()._Init__(this, **kwargs)
//         this.orientation = -1

//     initPoints(this) {
//         this.setPoints(
//             OpenGLArc.createQuadraticBezierPoints(
//                 angle=this.angle,
//                 startAngle=this.startAngle,
//                 nComponents=this.nComponents,
//             ),
//         )
//         # To maintain proper orientation for fill shaders.
//         this.scale(this.radius, aboutPoint=ORIGIN)
//         this.shift(this.arcCenter)

//     @staticmethod
//     createQuadraticBezierPoints(angle, startAngle=0, nComponents=8) {
//         samples = np.array(
//             [
//                 [np.cos(a), np.sin(a), 0]
//                 for a in np.linspace(
//                     startAngle,
//                     startAngle + angle,
//                     2 * nComponents + 1,
//                 )
//             ],
//         )
//         theta = angle / nComponents
//         samples[1::2] /= np.cos(theta / 2)

//         points = np.zeros((3 * nComponents, 3))
//         points[0::3] = samples[0:-1:2]
//         points[1::3] = samples[1::2]
//         points[2::3] = samples[2::2]
//         return points

//     getArcCenter(this) {
//         """
//         Looks at the normals to the first two
//         anchors, and finds their intersection points
//         """
//         # First two anchors and handles
//         a1, h, a2 = this.points[:3]
//         # Tangent vectors
//         t1 = h - a1
//         t2 = h - a2
//         # Normals
//         n1 = rotateVector(t1, TWOPI / 4)
//         n2 = rotateVector(t2, TWOPI / 4)
//         return findIntersection(a1, n1, a2, n2)

//     getStartAngle(this) {
//         angle = angleOfVector(this.getStart() - this.getArcCenter())
//         return angle % TWOPI

//     getStopAngle(this) {
//         angle = angleOfVector(this.getEnd() - this.getArcCenter())
//         return angle % TWOPI

//     moveArcCenterTo(this, point) {
//         this.shift(point - this.getArcCenter())
//         return this


// class OpenGLArcBetweenPoints(OpenGLArc) {
//     _Init__(this, start, end, angle=TWOPI / 4, **kwargs) {
//         super()._Init__(angle=angle, **kwargs)
//         if angle == 0:
//             this.setPointsAsCorners([LEFT, RIGHT])
//         this.putStartAndEndOn(start, end)


// class OpenGLCurvedArrow(OpenGLArcBetweenPoints) {
//     _Init__(this, startPoint, endPoint, **kwargs) {
//         super()._Init__(startPoint, endPoint, **kwargs)
//         this.addTip()


// class OpenGLCurvedDoubleArrow(OpenGLCurvedArrow) {
//     _Init__(this, startPoint, endPoint, **kwargs) {
//         super()._Init__(startPoint, endPoint, **kwargs)
//         this.addTip(atStart=True)


// class OpenGLCircle(OpenGLArc) {
//     _Init__(this, color=RED, **kwargs) {
//         super()._Init__(0, TWOPI, color=color, **kwargs)

//     surround(this, mobject, dimToMatch=0, stretch=False, buff=MED_SMALL_BUFF) {
//         # Ignores dimToMatch and stretch; result will always be a circle
//         # TODO: Perhaps create an ellipse class to handle singele-dimension stretching

//         this.replace(mobject, dimToMatch, stretch)
//         this.stretch((this.getWidth() + 2 * buff) / this.getWidth(), 0)
//         this.stretch((this.getHeight() + 2 * buff) / this.getHeight(), 1)

//     pointAtAngle(this, angle) {
//         startAngle = this.getStartAngle()
//         return this.pointFromProportion((angle - startAngle) / TWOPI)


// class OpenGLDot(OpenGLCircle) {
//     _Init__(
//         this,
//         point=ORIGIN,
//         radius=DEFAULT_DOT_RADIUS,
//         strokeWidth=0,
//         fillOpacity=1.0,
//         color=WHITE,
//         **kwargs,
//     ) {
//         super()._Init__(
//             arcCenter=point,
//             radius=radius,
//             strokeWidth=strokeWidth,
//             fillOpacity=fillOpacity,
//             color=color,
//             **kwargs,
//         )


// class OpenGLEllipse(OpenGLCircle) {
//     _Init__(this, width=2, height=1, **kwargs) {
//         super()._Init__(**kwargs)
//         this.setWidth(width, stretch=True)
//         this.setHeight(height, stretch=True)


// class OpenGLAnnularSector(OpenGLArc) {
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

//     initPoints(this) {
//         innerArc, outerArc = (
//             OpenGLArc(
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


// class OpenGLSector(OpenGLAnnularSector) {
//     _Init__(this, outerRadius=1, innerRadius=0, **kwargs) {
//         super()._Init__(innerRadius=innerRadius, outerRadius=outerRadius, **kwargs)


// class OpenGLAnnulus(OpenGLCircle) {
//     _Init__(
//         this,
//         innerRadius=1,
//         outerRadius=2,
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

//     initPoints(this) {
//         this.radius = this.outerRadius
//         outerCircle = OpenGLCircle(radius=this.outerRadius)
//         innerCircle = OpenGLCircle(radius=this.innerRadius)
//         innerCircle.reversePoints()
//         this.appendPoints(outerCircle.points)
//         this.appendPoints(innerCircle.points)
//         this.shift(this.arcCenter)


// class OpenGLLine(OpenGLTipableVMobject) {
//     _Init__(this, start=LEFT, end=RIGHT, buff=0, pathArc=0, **kwargs) {
//         this.dim = 3
//         this.buff = buff
//         this.pathArc = pathArc
//         this.setStartAndEndAttrs(start, end)
//         super()._Init__(**kwargs)

//     initPoints(this) {
//         this.setPointsByEnds(this.start, this.end, this.buff, this.pathArc)

//     setPointsByEnds(this, start, end, buff=0, pathArc=0) {
//         if pathArc:
//             this.setPoints(OpenGLArc.createQuadraticBezierPoints(pathArc))
//             this.putStartAndEndOn(start, end)
//         else:
//             this.setPointsAsCorners([start, end])
//         this.accountForBuff(this.buff)

//     setPathArc(this, newValue) {
//         this.pathArc = newValue
//         this.initPoints()

//     accountForBuff(this, buff) {
//         if buff == 0:
//             return
//         #
//         if this.pathArc == 0:
//             length = this.getLength()
//         else:
//             length = this.getArcLength()
//         #
//         if length < 2 * buff:
//             return
//         buffProp = buff / length
//         this.pointwiseBecomePartial(this, buffProp, 1 - buffProp)
//         return this

//     setStartAndEndAttrs(this, start, end) {
//         # If either start or end are Mobjects, this
//         # gives their centers
//         roughStart = this.pointify(start)
//         roughEnd = this.pointify(end)
//         vect = normalize(roughEnd - roughStart)
//         # Now that we know the direction between them,
//         # we can find the appropriate boundary point from
//         # start and end, if they're mobjects
//         this.start = this.pointify(start, vect) + this.buff * vect
//         this.end = this.pointify(end, -vect) - this.buff * vect

//     pointify(this, mobOrPoint, direction=None) {
//         """
//         Take an argument passed into Line (or subclass) and turn
//         it into a 3d point.
//         """
//         if isinstance(mobOrPoint, Mobject) {
//             mob = mobOrPoint
//             if direction is None:
//                 return mob.getCenter()
//             else:
//                 return mob.getContinuousBoundingBoxPoint(direction)
//         else:
//             point = mobOrPoint
//             result = np.zeros(this.dim)
//             result[: len(point)] = point
//             return result

//     putStartAndEndOn(this, start, end) {
//         currStart, currEnd = this.getStartAndEnd()
//         if (currStart == currEnd).all() {
//             this.setPointsByEnds(start, end, this.pathArc)
//         return super().putStartAndEndOn(start, end)

//     getVector(this) {
//         return this.getEnd() - this.getStart()

//     getUnitVector(this) {
//         return normalize(this.getVector())

//     getAngle(this) {
//         return angleOfVector(this.getVector())

//     getProjection(this, point) {
//         """
//         Return projection of a point onto the line
//         """
//         unitVect = this.getUnitVector()
//         start = this.getStart()
//         return start + np.dot(point - start, unitVect) * unitVect

//     getSlope(this) {
//         return np.tan(this.getAngle())

//     setAngle(this, angle, aboutPoint=None) {
//         if aboutPoint is None:
//             aboutPoint = this.getStart()
//         this.rotate(
//             angle - this.getAngle(),
//             aboutPoint=aboutPoint,
//         )
//         return this

//     setLength(this, length) {
//         this.scale(length / this.getLength())


// class OpenGLDashedLine(OpenGLLine) {
//     _Init__(
//         this, *args, dashLength=DEFAULT_DASH_LENGTH, dashedRatio=0.5, **kwargs
//     ) {
//         this.dashedRatio = dashedRatio
//         this.dashLength = dashLength
//         super()._Init__(*args, **kwargs)
//         dashedRatio = this.dashedRatio
//         numDashes = this.calculateNumDashes(dashedRatio)
//         dashes = OpenGLDashedVMobject(
//             this,
//             numDashes=numDashes,
//             dashedRatio=dashedRatio,
//         )
//         this.clearPoints()
//         this.add(*dashes)

//     calculateNumDashes(this, dashedRatio) {
//         return max(
//             2,
//             int(np.ceil((this.getLength() / this.dashLength) * dashedRatio)),
//         )

//     getStart(this) {
//         if len(this.submobjects) > 0:
//             return this.submobjects[0].getStart()
//         else:
//             return super().getStart()

//     getEnd(this) {
//         if len(this.submobjects) > 0:
//             return this.submobjects[-1].getEnd()
//         else:
//             return super().getEnd()

//     getFirstHandle(this) {
//         return this.submobjects[0].points[1]

//     getLastHandle(this) {
//         return this.submobjects[-1].points[-2]


// class OpenGLTangentLine(OpenGLLine) {
//     _Init__(this, vmob, alpha, length=1, dAlpha=1e-6, **kwargs) {
//         this.length = length
//         this.dAlpha = dAlpha
//         da = this.dAlpha
//         a1 = clip(alpha - da, 0, 1)
//         a2 = clip(alpha + da, 0, 1)
//         super()._Init__(vmob.pfp(a1), vmob.pfp(a2), **kwargs)
//         this.scale(this.length / this.getLength())


// class OpenGLElbow(OpenGLVMobject) {
//     _Init__(this, width=0.2, angle=0, **kwargs) {
//         this.angle = angle
//         super()._Init__(this, **kwargs)
//         this.setPointsAsCorners([UP, UP + RIGHT, RIGHT])
//         this.setWidth(width, aboutPoint=ORIGIN)
//         this.rotate(this.angle, aboutPoint=ORIGIN)


// class OpenGLArrow(OpenGLLine) {
//     _Init__(
//         this,
//         start=LEFT,
//         end=RIGHT,
//         pathArc=0,
//         fillColor=GREY_A,
//         fillOpacity=1,
//         strokeWidth=0,
//         buff=MED_SMALL_BUFF,
//         thickness=0.05,
//         tipWidthRatio=5,
//         tipAngle=PI / 3,
//         maxTipLengthToLengthRatio=0.5,
//         maxWidthToLengthRatio=0.1,
//         **kwargs,
//     ) {
//         this.thickness = thickness
//         this.tipWidthRatio = tipWidthRatio
//         this.tipAngle = tipAngle
//         this.maxTipLengthToLengthRatio = maxTipLengthToLengthRatio
//         this.maxWidthToLengthRatio = maxWidthToLengthRatio
//         super()._Init__(
//             start=start,
//             end=end,
//             buff=buff,
//             pathArc=pathArc,
//             fillColor=fillColor,
//             fillOpacity=fillOpacity,
//             strokeWidth=strokeWidth,
//             **kwargs,
//         )

//     setPointsByEnds(this, start, end, buff=0, pathArc=0) {
//         # Find the right tip length and thickness
//         vect = end - start
//         length = max(np.linalg.norm(vect), 1e-8)
//         thickness = this.thickness
//         wRatio = this.maxWidthToLengthRatio / (thickness / length)
//         if wRatio < 1:
//             thickness *= wRatio

//         tipWidth = this.tipWidthRatio * thickness
//         tipLength = tipWidth / (2 * np.tan(this.tipAngle / 2))
//         tRatio = this.maxTipLengthToLengthRatio / (tipLength / length)
//         if tRatio < 1:
//             tipLength *= tRatio
//             tipWidth *= tRatio

//         # Find points for the stem
//         if pathArc == 0:
//             points1 = (length - tipLength) * np.array([RIGHT, 0.5 * RIGHT, ORIGIN])
//             points1 += thickness * UP / 2
//             points2 = points1[::-1] + thickness * DOWN
//         else:
//             # Solve for radius so that the tip-to-tail length matches |end - start|
//             a = 2 * (1 - np.cos(pathArc))
//             b = -2 * tipLength * np.sin(pathArc)
//             c = tipLength**2 - length**2
//             R = (-b + np.sqrt(b**2 - 4 * a * c)) / (2 * a)

//             # Find arc points
//             points1 = OpenGLArc.createQuadraticBezierPoints(pathArc)
//             points2 = np.array(points1[::-1])
//             points1 *= R + thickness / 2
//             points2 *= R - thickness / 2
//             if pathArc < 0:
//                 tipLength *= -1
//             rot_T = rotationMatrixTranspose(PI / 2 - pathArc, OUT)
//             for points in points1, points2:
//                 points[:] = np.dot(points, rot_T)
//                 points += R * DOWN

//         this.setPoints(points1)
//         # Tip
//         this.addLineTo(tipWidth * UP / 2)
//         this.addLineTo(tipLength * LEFT)
//         this.tipIndex = len(this.points) - 1
//         this.addLineTo(tipWidth * DOWN / 2)
//         this.addLineTo(points2[0])
//         # Close it out
//         this.appendPoints(points2)
//         this.addLineTo(points1[0])

//         if length > 0:
//             # Final correction
//             super().scale(length / this.getLength())

//         this.rotate(angleOfVector(vect) - this.getAngle())
//         this.rotate(
//             PI / 2 - np.arccos(normalize(vect)[2]),
//             axis=rotateVector(this.getUnitVector(), -PI / 2),
//         )
//         this.shift(start - this.getStart())
//         this.refreshTriangulation()

//     resetPointsAroundEnds(this) {
//         this.setPointsByEnds(
//             this.getStart(),
//             this.getEnd(),
//             pathArc=this.pathArc,
//         )
//         return this

//     getStart(this) {
//         nppc = this.nPointsPerCurve
//         points = this.points
//         return (points[0] + points[-nppc]) / 2

//     getEnd(this) {
//         return this.points[this.tipIndex]

//     putStartAndEndOn(this, start, end) {
//         this.setPointsByEnds(start, end, buff=0, pathArc=this.pathArc)
//         return this

//     scale(this, *args, **kwargs) {
//         super().scale(*args, **kwargs)
//         this.resetPointsAroundEnds()
//         return this

//     setThickness(this, thickness) {
//         this.thickness = thickness
//         this.resetPointsAroundEnds()
//         return this

//     setPathArc(this, pathArc) {
//         this.pathArc = pathArc
//         this.resetPointsAroundEnds()
//         return this


// class OpenGLVector(OpenGLArrow) {
//     _Init__(this, direction=RIGHT, buff=0, **kwargs) {
//         this.buff = buff
//         if len(direction) == 2:
//             direction = np.hstack([direction, 0])
//         super()._Init__(ORIGIN, direction, buff=buff, **kwargs)


// class OpenGLDoubleArrow(OpenGLArrow) {
//     _Init__(this, *args, **kwargs) {
//         super()._Init__(*args, **kwargs)
//         this.addTip(atStart=True)


// class OpenGLCubicBezier(OpenGLVMobject) {
//     _Init__(this, a0, h0, h1, a1, **kwargs) {
//         super()._Init__(**kwargs)
//         this.addCubicBezierCurve(a0, h0, h1, a1)


// class OpenGLPolygon(OpenGLVMobject) {
//     _Init__(this, *vertices, **kwargs) {
//         this.vertices = vertices
//         super()._Init__(**kwargs)

//     initPoints(this) {
//         verts = this.vertices
//         this.setPointsAsCorners([*verts, verts[0]])

//     getVertices(this) {
//         return this.getStartAnchors()

//     roundCorners(this, radius=0.5) {
//         vertices = this.getVertices()
//         arcs = []
//         for v1, v2, v3 in adjacentNTuples(vertices, 3) {
//             vect1 = v2 - v1
//             vect2 = v3 - v2
//             unitVect1 = normalize(vect1)
//             unitVect2 = normalize(vect2)
//             angle = angleBetweenVectors(vect1, vect2)
//             # Negative radius gives concave curves
//             angle *= np.sign(radius)
//             # Distance between vertex and start of the arc
//             cutOffLength = radius * np.tan(angle / 2)
//             # Determines counterclockwise vs. clockwise
//             sign = np.sign(np.cross(vect1, vect2)[2])
//             arc = OpenGLArcBetweenPoints(
//                 v2 - unitVect1 * cutOffLength,
//                 v2 + unitVect2 * cutOffLength,
//                 angle=sign * angle,
//                 nComponents=2,
//             )
//             arcs.append(arc)

//         this.clearPoints()
//         # To ensure that we loop through starting with last
//         arcs = [arcs[-1], *arcs[:-1]]
//         for arc1, arc2 in adjacentPairs(arcs) {
//             this.appendPoints(arc1.points)
//             line = OpenGLLine(arc1.getEnd(), arc2.getStart())
//             # Make sure anchors are evenly distributed
//             lenRatio = line.getLength() / arc1.getArcLength()
//             line.insertNCurves(int(arc1.getNumCurves() * lenRatio))
//             this.appendPoints(line.points)
//         return this


// class OpenGLRegularPolygon(OpenGLPolygon) {
//     _Init__(this, n=6, startAngle=None, **kwargs) {
//         this.startAngle = startAngle
//         if this.startAngle is None:
//             if n % 2 == 0:
//                 this.startAngle = 0
//             else:
//                 this.startAngle = 90 * DEGREES
//         startVect = rotateVector(RIGHT, this.startAngle)
//         vertices = compassDirections(n, startVect)
//         super()._Init__(*vertices, **kwargs)


// class OpenGLTriangle(OpenGLRegularPolygon) {
//     _Init__(this, **kwargs) {
//         super()._Init__(n=3, **kwargs)


// class OpenGLArrowTip(OpenGLTriangle) {
//     _Init__(
//         this,
//         fillOpacity=1,
//         fillColor=WHITE,
//         strokeWidth=0,
//         width=DEFAULT_ARROW_TIP_WIDTH,
//         length=DEFAULT_ARROW_TIP_LENGTH,
//         angle=0,
//         **kwargs,
//     ) {
//         super()._Init__(
//             startAngle=0,
//             fillOpacity=fillOpacity,
//             fillColor=fillColor,
//             strokeWidth=strokeWidth,
//             **kwargs,
//         )
//         this.setWidth(width, stretch=True)
//         this.setHeight(length, stretch=True)

//     getBase(this) {
//         return this.pointFromProportion(0.5)

//     getTipPoint(this) {
//         return this.points[0]

//     getVector(this) {
//         return this.getTipPoint() - this.getBase()

//     getAngle(this) {
//         return angleOfVector(this.getVector())

//     getLength(this) {
//         return np.linalg.norm(this.getVector())


// class OpenGLRectangle(OpenGLPolygon) {
//     _Init__(this, color=WHITE, width=4.0, height=2.0, **kwargs) {
//         super()._Init__(UR, UL, DL, DR, color=color, **kwargs)

//         this.setWidth(width, stretch=True)
//         this.setHeight(height, stretch=True)


// class OpenGLSquare(OpenGLRectangle) {
//     _Init__(this, sideLength=2.0, **kwargs) {
//         this.sideLength = sideLength

//         super()._Init__(height=sideLength, width=sideLength, **kwargs)


// class OpenGLRoundedRectangle(OpenGLRectangle) {
//     _Init__(this, cornerRadius=0.5, **kwargs) {
//         this.cornerRadius = cornerRadius
//         super()._Init__(**kwargs)
//         this.roundCorners(this.cornerRadius)
