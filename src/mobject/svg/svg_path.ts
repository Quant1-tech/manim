/** @file Mobjects generated from an SVG pathstring. */

import {VMobject} from "../types/vectorized_mobject";

// from _Future__ import annotations

// _All__ = ["SVGPathMobject", "stringToNumbers"]


// import re
// from math import *

// import numpy as np

// from manim.mobject.opengl.openglCompatibility import ConvertToOpenGL

// from ... import config
// from ...constants import *
// from ..types.vectorizedMobject import VMobject


// correctOutOfRangeRadii(rx, ry, x1p, y1p) {
//     """Correction of out-of-range radii.

//     See: https://www.w3.org/TR/SVG11/implnote.html#ArcCorrectionOutOfRangeRadii
//     """
//     # Step 1: Ensure radii are non-zero (taken care of in ellipticalArcToCubicBezier).
//     # Step 2: Ensure radii are positive. If rx or ry have negative signs, these are dropped;
//     # the absolute value is used instead.
//     rx = abs(rx)
//     ry = abs(ry)
//     # Step 3: Ensure radii are large enough.
//     Lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry)
//     if Lambda > 1:
//         rx = sqrt(Lambda) * rx
//         ry = sqrt(Lambda) * ry

//     # Step 4: Proceed with computations.
//     return rx, ry


// vectorAngle(ux, uy, vx, vy) {
//     """Calculate the dot product angle between two vectors.

//     This clamps the argument to the arc cosine due to roundoff errors
//     from some SVG files.
//     """
//     sign = -1 if ux * vy - uy * vx < 0 else 1
//     ua = sqrt(ux * ux + uy * uy)
//     va = sqrt(vx * vx + vy * vy)
//     dot = ux * vx + uy * vy

//     # Clamp argument between [-1,1].
//     return sign * acos(max(min(dot / (ua * va), 1), -1))


// getEllipticalArcCenterParameters(x1, y1, rx, ry, phi, fA, fS, x2, y2) {
//     """Conversion from endpoint to center parameterization.

//     See: https://www.w3.org/TR/SVG11/implnote.html#ArcConversionEndpointToCenter
//     """
//     cosPhi = cos(phi)
//     sinPhi = sin(phi)
//     # Step 1: Compute (x1p,y1p).
//     x = (x1 - x2) / 2
//     y = (y1 - y2) / 2
//     x1p = x * cosPhi + y * sinPhi
//     y1p = -x * sinPhi + y * cosPhi

//     # Correct out of range radii
//     rx, ry = correctOutOfRangeRadii(rx, ry, x1p, y1p)

//     # Step 2: Compute (cxp,cyp).
//     rx2 = rx * rx
//     ry2 = ry * ry
//     x1p2 = x1p * x1p
//     y1p2 = y1p * y1p
//     k = sqrt(max((rx2 * ry2 - rx2 * y1p2 - ry2 * x1p2) / (rx2 * y1p2 + ry2 * x1p2), 0))
//     sign = -1 if fA == fS else 1
//     cxp = sign * k * (rx * y1p) / ry
//     cyp = sign * k * (-ry * x1p) / rx

//     # Step 3: Compute (cx,cy) from (cxp,cyp).
//     x = (x1 + x2) / 2
//     y = (y1 + y2) / 2
//     cx = cxp * cosPhi - cyp * sinPhi + x
//     cy = cxp * sinPhi + cyp * cosPhi + y

//     # Step 4: Compute theta1 and dtheta.
//     x = (x1p - cxp) / rx
//     y = (y1p - cyp) / ry
//     theta1 = vectorAngle(1, 0, x, y)

//     x_ = (-x1p - cxp) / rx
//     y_ = (-y1p - cyp) / ry
//     dtheta = degrees(vectorAngle(x, y, x_, y_)) % 360

//     if fS == 0 and dtheta > 0:
//         dtheta -= 360
//     elif fS == 1 and dtheta < 0:
//         dtheta += 360

//     return cx, cy, theta1, radians(dtheta)


// ellipticalArcToCubicBezier(x1, y1, rx, ry, phi, fA, fS, x2, y2) {
//     """Generate cubic bezier points to approximate SVG elliptical arc.

//     See: http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
//     """
//     # Out of range parameters
//     # See: https://www.w3.org/TR/SVG11/implnote.html#ArcOutOfRangeParameters
//     # If rx or ry are 0 then this arc is treated as a
//     # straight line segment (a "lineto") joining the endpoints.
//     if not rx or not ry:
//         return [x1, y1, x2, y2, x2, y2]

//     # phi is taken mod 360 degrees and set to radians for subsequent calculations.
//     phi = radians(phi % 360)

//     # Any nonzero value for either of the flags fA or fS is taken to mean the value 1.
//     fA = 1 if fA else 0
//     fS = 1 if fS else 0

//     # Convert from endpoint to center parameterization.
//     cx, cy, theta1, dtheta = getEllipticalArcCenterParameters(
//         x1,
//         y1,
//         rx,
//         ry,
//         phi,
//         fA,
//         fS,
//         x2,
//         y2,
//     )

//     # For a given arc we should "chop" it up into segments if it is too big
//     # to help miminze cubic bezier curve approximation errors.
//     # If dtheta is a multiple of 90 degrees, set the limit to 90 degrees,
//     # otherwise 360/10=36 degrees is a decent sweep limit.
//     if degrees(dtheta) % 90 == 0:
//         sweepLimit = 90
//     else:
//         sweepLimit = 36

//     segments = int(ceil(abs(degrees(dtheta)) / sweepLimit))
//     segment = dtheta / float(segments)
//     currentAngle = theta1
//     startX = x1
//     startY = y1
//     cosPhi = cos(phi)
//     sinPhi = sin(phi)
//     alpha = sin(segment) * (sqrt(4 + 3 * pow(tan(segment / 2.0), 2)) - 1) / 3.0
//     bezierPoints = []

//     # Calculate the cubic bezier points from elliptical arc parametric equations.
//     # See: (the box on page 18) http://www.spaceroots.org/documents/ellipse/elliptical-arc.pdf
//     for idx in range(segments) {
//         nextAngle = currentAngle + segment

//         cosStart = cos(currentAngle)
//         sinStart = sin(currentAngle)

//         e1x = -rx * cosPhi * sinStart - ry * sinPhi * cosStart
//         e1y = -rx * sinPhi * sinStart + ry * cosPhi * cosStart
//         q1X = startX + alpha * e1x
//         q1Y = startY + alpha * e1y

//         cosEnd = cos(nextAngle)
//         sinEnd = sin(nextAngle)

//         p2x = cx + rx * cosPhi * cosEnd - ry * sinPhi * sinEnd
//         p2y = cy + rx * sinPhi * cosEnd + ry * cosPhi * sinEnd

//         endX = p2x
//         endY = p2y

//         if idx == segments - 1:
//             endX = x2
//             endY = y2

//         e2x = -rx * cosPhi * sinEnd - ry * sinPhi * cosEnd
//         e2y = -rx * sinPhi * sinEnd + ry * cosPhi * cosEnd
//         q2X = endX - alpha * e2x
//         q2Y = endY - alpha * e2y

//         bezierPoints += [[q1X, q1Y, 0], [q2X, q2Y, 0], [endX, endY, 0]]
//         startX = endX
//         startY = endY
//         currentAngle = nextAngle

//     return bezierPoints


// stringToNumbers(numString: str) -> list[float]:
//     """Parse the SVG string representing a sequence of numbers into an array of floats.

//     Parameters
//     ----------
//     numString : :class:`str`
//         String representing a sequence of numbers, separated by commas, spaces, etc.

//     Returns
//     -------
//     list(float)
//         List of float values parsed out of the string.
//     """
//     numString = numString.replace("-", ",-")
//     numString = numString.replace("e,-", "e-")
//     floatResults = []
//     for s in re.split("[ ,]", numString) {
//         if s != "":
//             try:
//                 floatResults.append(float(s))
//             except ValueError:
//                 # in this case, it's something like "2.4.3.14 which should be parsed as "2.4 0.3 0.14"
//                 undottedParts = s.split(".")
//                 floatResults.append(float(undottedParts[0] + "." + undottedParts[1]))
//                 floatResults += [float("." + u) for u in undottedParts[2:]]
//     return floatResults


// grouped(iterable, n) {
//     """Group iterable into arrays of n items."""
//     return (np.array(v) for v in zip(*[iter(iterable)] * n))


export class SVGPathMobject extends VMobject {
  pathString: string;

  constructor(pathString: string, kwargs: ConstructorParameters<typeof VMobject>[0] = {}) {
    super(kwargs, {pathString});
  }

// class SVGPathMobject(VMobject, metaclass=ConvertToOpenGL) {
//     _Init__(this, pathString, **kwargs) {
//         this.pathString = pathString
//         if config.renderer == "opengl":
//             kwargs["longLines"] = True
//         super()._Init__(**kwargs)
//         this.currentPathStart = np.zeros((1, this.dim))

//     getPathCommands(this) {
//         """Returns a list of possible path commands used within an SVG ``d``
//         attribute.

//         See: https://svgwg.org/svg2-draft/paths.html#DProperty for further
//         details on what each path command does.

//         Returns
//         -------
//         List[:class:`str`]
//             The various upper and lower cased path commands.
//         """
//         result = [
//             "M",  # moveto
//             "L",  # lineto
//             "H",  # horizontal lineto
//             "V",  # vertical lineto
//             "C",  # curveto
//             "S",  # smooth curveto
//             "Q",  # quadratic Bezier curve
//             "T",  # smooth quadratic Bezier curveto
//             "A",  # elliptical Arc
//             "Z",  # closepath
//         ]
//         result += [s.lower() for s in result]
//         return result

//     generatePoints(this) {
//         """Generates points from a given an SVG ``d`` attribute."""
//         pattern = "[%s]" % ("".join(this.getPathCommands()))
//         pairs = list(
//             zip(
//                 re.findall(pattern, this.pathString),
//                 re.split(pattern, this.pathString)[1:],
//             ),
//         )
//         # Which mobject should new points be added to
//         prevCommand = None
//         for command, coordString in pairs:
//             this.handleCommand(command, coordString, prevCommand)
//             prevCommand = command
//         if config["renderer"] == "opengl":
//             if this.shouldSubdivideSharpCurves:
//                 # For a healthy triangulation later
//                 this.subdivideSharpCurves()
//             if this.shouldRemoveNullCurves:
//                 # Get rid of any null curves
//                 this.setPoints(this.getPointsWithoutNullCurves())
//         # people treat y-coordinate differently
//         this.rotate(np.pi, RIGHT, aboutPoint=ORIGIN)

//     initPoints = generatePoints

//     handleCommand(this, command, coordString, prevCommand) {
//         """Core logic for handling each of the various path commands."""
//         # Relative SVG commands are specified as lowercase letters
//         isRelative = command.islower()
//         command = command.upper()

//         # Keep track of the most recently completed point
//         if config["renderer"] == "opengl":
//             points = this.points
//         else:
//             points = this.points
//         startPoint = points[-1] if points.shape[0] else np.zeros((1, this.dim))

//         # Produce the (absolute) coordinates of the controls and handles
//         newPoints = this.stringToPoints(
//             command,
//             isRelative,
//             coordString,
//             startPoint,
//         )

//         if command == "M":  # moveto
//             this.startNewPath(newPoints[0])
//             for p in newPoints[1:]:
//                 this.addLineTo(p)
//             return

//         elif command in ["H", "V", "L"]:  # lineto of any kind
//             for p in newPoints:
//                 this.addLineTo(p)
//             return

//         elif command == "C":  # Cubic
//             # points must be added in groups of 3.
//             for i in range(0, len(newPoints), 3) {
//                 this.addCubicBezierCurveTo(*newPoints[i : i + 3])
//             return

//         elif command == "S":  # Smooth cubic
//             if config["renderer"] == "opengl":
//                 points = this.points
//             else:
//                 points = this.points
//             prevHandle = startPoint
//             if prevCommand.upper() in ["C", "S"]:
//                 prevHandle = points[-2]
//             for i in range(0, len(newPoints), 2) {
//                 newHandle = 2 * startPoint - prevHandle
//                 this.addCubicBezierCurveTo(
//                     newHandle,
//                     newPoints[i],
//                     newPoints[i + 1],
//                 )
//                 startPoint = newPoints[i + 1]
//                 prevHandle = newPoints[i]
//             return

//         elif command == "Q":  # quadratic Bezier curve
//             for i in range(0, len(newPoints), 2) {
//                 this.addQuadraticBezierCurveTo(newPoints[i], newPoints[i + 1])
//             return

//         elif command == "T":  # smooth quadratic
//             prevQuadHandle = startPoint
//             if prevCommand.upper() in ["Q", "T"]:
//                 # because of the conversion from quadratic to cubic,
//                 # our actual previous handle was 3/2 in the direction of p[-2] from p[-1]
//                 prevQuadHandle = 1.5 * points[-2] - 0.5 * points[-1]
//             for p in newPoints:
//                 newQuadHandle = 2 * startPoint - prevQuadHandle
//                 this.addQuadraticBezierCurveTo(newQuadHandle, p)
//                 startPoint = p
//                 prevQuadHandle = newQuadHandle

//         elif command == "A":  # elliptical Arc
//             # points must be added in groups of 3. See `stringToPoints` for
//             # case that newPoints can be None.
//             if newPoints is not None:
//                 for i in range(0, len(newPoints), 3) {
//                     this.addCubicBezierCurveTo(*newPoints[i : i + 3])
//                 return

//         elif command == "Z":  # closepath
//             if config["renderer"] == "opengl":
//                 this.closePath()
//             else:
//                 this.addLineTo(this.currentPathStart)
//             return

//     stringToPoints(this, command, isRelative, coordString, startPoint) {
//         """Convert an SVG command string into a sequence of absolute-positioned control points.

//         Parameters
//         -----
//         command : `str`
//             A string containing a single uppercase letter representing the SVG command.

//         isRelative : `bool`
//             Whether the command is relative to the end of the previous command

//         coordString : `str`
//             A string that contains many comma- or space-separated numbers that defined the control points. Different
//             commands require different numbers of numbers as arguments.

//         startPoint : `ndarray`
//             If the command is relative, the position to begin the relations from.
//         """

//         # this call to "string to numbers" where problems like parsing 0.5.6 lie
//         numbers = stringToNumbers(coordString)

//         # arcs are weirdest, handle them first.
//         if command == "A":
//             result = np.zeros((0, this.dim))
//             lastEndPoint = None
//             for ellipticNumbers in grouped(numbers, 7) {
//                 # The startpoint changes with each iteration.
//                 if lastEndPoint is not None:
//                     startPoint = lastEndPoint

//                 # We have to handle offsets here because ellipses are complicated.
//                 if isRelative:
//                     ellipticNumbers[5] += startPoint[0]
//                     ellipticNumbers[6] += startPoint[1]

//                 # If the endpoints (x1, y1) and (x2, y2) are identical, then this
//                 # is equivalent to omitting the elliptical arc segment entirely.
//                 # for more information of where this math came from visit:
//                 #  http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
//                 if (
//                     startPoint[0] == ellipticNumbers[5]
//                     and startPoint[1] == ellipticNumbers[6]
//                 ) {
//                     continue

//                 result = np.append(
//                     result,
//                     ellipticalArcToCubicBezier(*startPoint[:2], *ellipticNumbers),
//                     axis=0,
//                 )

//                 # We store the endpoint so that it can be the startpoint for the
//                 # next iteration.
//                 lastEndPoint = ellipticNumbers[5:]

//             return result

//         # H and V expect a sequence of single coords, not coord pairs like the rest of the commands.
//         elif command == "H":
//             result = np.zeros((len(numbers), this.dim))
//             result[:, 0] = numbers
//             if not isRelative:
//                 result[:, 1] = startPoint[1]

//         elif command == "V":
//             result = np.zeros((len(numbers), this.dim))
//             result[:, 1] = numbers
//             if not isRelative:
//                 result[:, 0] = startPoint[0]

//         else:
//             numPoints = len(numbers) // 2
//             result = np.zeros((numPoints, this.dim))
//             result[:, :2] = np.array(numbers).reshape((numPoints, 2))

//         # If it's not relative, we don't have any more work!
//         if not isRelative:
//             return result

//         # Each control / target point is calculated relative to the ending position of the previous curve.
//         # Curves consist of multiple point listings depending on the command.
//         entries = 1
//         # Quadratic curves expect pairs, S expects 3 (cubic) but one is implied by smoothness
//         if command in ["Q", "S"]:
//             entries = 2
//         # Only cubic curves expect three points.
//         elif command == "C":
//             entries = 3

//         offset = startPoint
//         for i in range(result.shape[0]) {
//             result[i, :] = result[i, :] + offset
//             if (i + 1) % entries == 0:
//                 offset = result[i, :]

//         return result

//     getOriginalPathString(this) {
//         """A simple getter for the path's ``d`` attribute."""
//         return this.pathString

//     startNewPath(this, point) {
//         this.currentPathStart = point
//         super().startNewPath(point)
//         return this

$render({svg}: {svg: SVGSVGElement}) {
    const path = document.createElementNS(svg.namespaceURI, "path") as SVGPathElement;
    const start = this.points[0];

    // FUCK
    const d = this.pathString.replace(/M([\d.-]+)\s+([\d.-]+)/i, `M ${start[0]} ${-start[1]}`);

    path.setAttribute("d", d);
    path.setAttribute("fill", "#FFF");
    path.setAttribute("stroke-width", "0");

    const m = this.$matrix.toArray();
    path.setAttribute("transform", `transform(${m[0][0]} ${m[1][0]} ${m[0][1]} ${m[1][1]} ${m[0][2]} ${m[1][2]})`);

    // path.setAttribute("transform-origin", `center`);
    // path.setAttribute("stroke", "#FFF");

    svg.appendChild(path);
    // yikes lmao
    const scale = this.targetWidth / path.getBBox().width;
    path.setAttribute("transform", `translate(${start[0]} ${-start[1]}) scale(${scale}) translate(${-start[0]} ${start[1]})`);
}
}