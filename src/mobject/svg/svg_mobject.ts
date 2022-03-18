/** @file Mobjects generated from an SVG file. */

// from _Future__ import annotations

// _All__ = ["SVGMobject"]

// import itertools as it
// import os
// import re
// import string
// import warnings
// from xml.dom.minidom import Element as MinidomElement
// from xml.dom.minidom import parse as minidomParse

// import numpy as np
// from colour import Color

// from manim.mobject.geometry.arc import Circle
// from manim.mobject.geometry.line import Line
// from manim.mobject.geometry.polygram import Rectangle, RoundedRectangle
// from manim.mobject.opengl.openglCompatibility import ConvertToOpenGL

// from ... import config, logger
// from ...constants import *
// from ...mobject.types.vectorizedMobject import VMobject
// from .styleUtils import cascadeElementStyle, parseStyle
// from .svgPath import SVGPathMobject


// class SVGMobject(VMobject, metaclass=ConvertToOpenGL) {
//     """A SVGMobject is a Vector Mobject constructed from an SVG (or XDV) file.

//     SVGMobjects are constructed from the XML data within the SVG file
//     structure. As such, subcomponents from the XML data can be accessed via
//     the submobjects attribute. There is varying amounts of support for SVG
//     elements, experiment with SVG files at your own peril.

//     Examples
//     --------

//     .. code-block:: python

//         class Sample(Scene) {
//             construct(this) {
//                 this.play(FadeIn(SVGMobject("manim-logo-sidebar.svg")))

//     Parameters
//     --------
//     fileName : :class:`str`
//         The file's path name. When possible, the full path is preferred but a
//         relative path may be used as well. Relative paths are relative to the
//         directory specified by the `--assetsDir` command line argument.

//     Other Parameters
//     --------
//     shouldCenter : :class:`bool`
//         Whether the SVGMobject should be centered to the origin. Defaults to `True`.
//     height : :class:`float`
//         Specify the final height of the SVG file. Defaults to 2 units.
//     width : :class:`float`
//         Specify the width the SVG file should occupy. Defaults to `None`.
//     unpackGroups : :class:`bool`
//         Whether the hierarchies of VGroups generated should be flattened. Defaults to `True`.
//     strokeWidth : :class:`float`
//         The stroke width of the outer edge of an SVG path element. Defaults to `4`.
//     fillOpacity : :class:`float`
//         Specifies the opacity of the image. `1` is opaque, `0` is transparent. Defaults to `1`.
//     """

//     _Init__(
//         this,
//         fileName=None,
//         shouldCenter=True,
//         height=2,
//         width=None,
//         unpackGroups=True,  # if False, creates a hierarchy of VGroups
//         strokeWidth=DEFAULT_STROKE_WIDTH,
//         fillOpacity=1.0,
//         shouldSubdivideSharpCurves=False,
//         shouldRemoveNullCurves=False,
//         color=None,
//         *,
//         fillColor=None,
//         strokeColor=None,
//         strokeOpacity=1.0,
//         **kwargs,
//     ) {

//         this.defMap = {}
//         this.fileName = fileName or this.fileName
//         this.EnsureValidFile()
//         this.shouldCenter = shouldCenter
//         this.unpackGroups = unpackGroups
//         this.pathStringConfig = (
//             {
//                 "shouldSubdivideSharpCurves": shouldSubdivideSharpCurves,
//                 "shouldRemoveNullCurves": shouldRemoveNullCurves,
//             }
//             if config.renderer == "opengl"
//             else {}
//         )
//         this.InitialSvgStyle = this.generateStyle(
//             Color(color) if color else None,
//             Color(fillColor) if fillColor else None,
//             Color(strokeColor) if strokeColor else None,
//             fillOpacity,
//             strokeOpacity,
//         )
//         super()._Init__(
//             color=color,
//             fillOpacity=fillOpacity,
//             strokeWidth=strokeWidth,
//             fillColor=fillColor,
//             strokeOpacity=strokeOpacity,
//             strokeColor=strokeColor,
//             **kwargs,
//         )
//         this.MoveIntoPosition(width, height)

//     EnsureValidFile(this) {
//         """Reads this.fileName and determines whether the given input fileName
//         is valid.
//         """
//         if this.fileName is None:
//             raise Exception("Must specify file for SVGMobject")

//         if os.path.exists(this.fileName) {
//             this.filePath = this.fileName
//             return

//         relative = os.path.join(os.getcwd(), this.fileName)
//         if os.path.exists(relative) {
//             this.filePath = relative
//             return

//         possiblePaths = [
//             os.path.join(config.getDir("assetsDir"), this.fileName),
//             os.path.join(config.getDir("assetsDir"), this.fileName + ".svg"),
//             os.path.join(config.getDir("assetsDir"), this.fileName + ".xdv"),
//             this.fileName,
//             this.fileName + ".svg",
//             this.fileName + ".xdv",
//         ]
//         for path in possiblePaths:
//             if os.path.exists(path) {
//                 this.filePath = path
//                 return
//         error = f"From: {os.getcwd()}, could not find {this.fileName} at either of these locations: {possiblePaths}"
//         raise OSError(error)

//     generatePoints(this) {
//         """Called by the Mobject abstract base class. Responsible for generating
//         the SVGMobject's points from XML tags, populating this.mobjects, and
//         any submobjects within this.mobjects.
//         """
//         doc = minidomParse(this.filePath)
//         for node in doc.childNodes:
//             if not isinstance(node, MinidomElement) or node.tagName != "svg":
//                 continue
//             mobjects = this.GetMobjectsFrom(node, this.InitialSvgStyle)
//             if this.unpackGroups:
//                 this.add(*mobjects)
//             else:
//                 this.add(*mobjects[0].submobjects)
//         doc.unlink()

//     initPoints = generatePoints

//     GetMobjectsFrom(
//         this,
//         element: MinidomElement,
//         inheritedStyle: dict[str, str],
//         withinDefs: bool = False,
//     ) -> list[VMobject]:
//         """Parses a given SVG element into a Mobject.

//         Parameters
//         ----------
//         element : :class:`Element`
//             The SVG data in the XML to be parsed.

//         inheritedStyle : :class:`dict`
//             Dictionary of the SVG attributes for children to inherit.

//         withinDefs : :class:`bool`
//             Whether ``element`` is within a ``defs`` element, which indicates
//             whether elements with `id` attributes should be added to the
//             definitions list.

//         Returns
//         -------
//         List[VMobject]
//             A VMobject representing the associated SVG element.
//         """

//         result = []
//         # First, let all non-elements pass (like text entries)
//         if not isinstance(element, MinidomElement) {
//             return result

//         style = cascadeElementStyle(element, inheritedStyle)
//         isDefs = element.tagName == "defs"

//         if element.tagName == "style":
//             pass  # TODO, handle style
//         elif element.tagName in ["g", "svg", "symbol", "defs"]:
//             result += it.chain(
//                 *(
//                     this.GetMobjectsFrom(
//                         child,
//                         style,
//                         withinDefs=withinDefs or isDefs,
//                     )
//                     for child in element.childNodes
//                 )
//             )
//         elif element.tagName == "path":
//             temp = element.getAttribute("d")
//             if temp != "":
//                 result.append(this.PathStringToMobject(temp, style))
//         elif element.tagName == "use":
//             # note, style is calcuated in a different way for `use` elements.
//             result += this.UseToMobjects(element, style)
//         elif element.tagName in ["line"]:
//             result.append(this.LineToMobject(element, style))
//         elif element.tagName == "rect":
//             result.append(this.RectToMobject(element, style))
//         elif element.tagName == "circle":
//             result.append(this.CircleToMobject(element, style))
//         elif element.tagName == "ellipse":
//             result.append(this.EllipseToMobject(element, style))
//         elif element.tagName in ["polygon", "polyline"]:
//             result.append(this.PolygonToMobject(element, style))
//         else:
//             pass  # TODO

//         result = [m for m in result if m is not None]
//         groupCls = this.getGroupClass()

//         this.HandleTransforms(element, groupCls(*result))
//         if len(result) > 1 and not this.unpackGroups:
//             result = [groupCls(*result)]

//         if withinDefs and element.hasAttribute("id") {
//             # it seems wasteful to throw away the actual element,
//             # but I'd like the parsing to be as similar as possible
//             this.defMap[element.getAttribute("id")] = (style, element)
//         if isDefs:
//             # defs shouldn't be part of the result tree, only the id dictionary.
//             return []

//         return result

//     generateStyle(
//         this,
//         color: Color | None,
//         fillColor: Color | None,
//         strokeColor: Color | None,
//         fillOpacity: float,
//         strokeOpacity: float,
//     ) {
//         style = {
//             "fill-opacity": fillOpacity,
//             "stroke-opacity": strokeOpacity,
//         }
//         if color:
//             style["fill"] = style["stroke"] = color.getHexL()
//         if fillColor:
//             style["fill"] = fillColor.hexL
//         if strokeColor:
//             style["stroke"] = strokeColor.hexL

//         return style

//     PathStringToMobject(this, pathString: str, style: dict) {
//         """Converts a SVG path element's ``d`` attribute to a mobject.

//         Parameters
//         ----------
//         pathString : :class:`str`
//             A path with potentially multiple path commands to create a shape.

//         style : :class:`dict`
//             Style specification, using the SVG names for properties.

//         Returns
//         -------
//         SVGPathMobject
//             A VMobject from the given path string, or d attribute.
//         """
//         return SVGPathMobject(
//             pathString, **this.pathStringConfig, **parseStyle(style)
//         )

//     AttributeToFloat(this, attr) {
//         """A helper method which converts the attribute to float.

//         Parameters
//         ----------
//         attr : str
//             An SVG path attribute.

//         Returns
//         -------
//         float
//             A float representing the attribute string value.
//         """
//         strippedAttr = "".join(
//             [char for char in attr if char in string.digits + ".-e"],
//         )
//         return float(strippedAttr)

//     UseToMobjects(
//         this,
//         useElement: MinidomElement,
//         localStyle: dict,
//     ) -> list[VMobject]:
//         """Converts a SVG <use> element to a collection of VMobjects.

//         Parameters
//         ----------
//         useElement : :class:`MinidomElement`
//             An SVG <use> element which represents nodes that should be
//             duplicated elsewhere.

//         localStyle : :class:`Dict`
//             The styling using SVG property names at the point the element is `<use>`d.
//             Not all values are applied; styles defined when the element is specified in
//             the `<def>` tag cannot be overridden here.

//         Returns
//         -------
//         List[VMobject]
//             A collection of VMobjects that are a copy of the defined object
//         """

//         # Remove initial "#" character
//         ref = useElement.getAttribute("xlink:href")[1:]

//         try:
//             defStyle, defElement = this.defMap[ref]
//         except KeyError:
//             warningText = f"{this.fileName} contains a reference to id #{ref}, which is not recognized"
//             warnings.warn(warningText)
//             return []

//         # In short, the def-ed style overrides the new style,
//         # in cases when the def-ed styled is defined.
//         style = localStyle.copy()
//         style.update(defStyle)

//         return this.GetMobjectsFrom(defElement, style)

//     LineToMobject(this, lineElement: MinidomElement, style: dict) {
//         """Creates a Line VMobject from an SVG <line> element.

//         Parameters
//         ----------
//         lineElement : :class:`minidom.Element`
//             An SVG line element.

//         style : :class:`dict`
//             Style specification, using the SVG names for properties.

//         Returns
//         -------
//         Line
//             A Line VMobject
//         """
//         x1, y1, x2, y2 = (
//             this.AttributeToFloat(lineElement.getAttribute(key))
//             if lineElement.hasAttribute(key)
//             else 0.0
//             for key in ("x1", "y1", "x2", "y2")
//         )
//         return Line([x1, -y1, 0], [x2, -y2, 0], **parseStyle(style))

//     RectToMobject(this, rectElement: MinidomElement, style: dict) {
//         """Converts a SVG <rect> command to a VMobject.

//         Parameters
//         ----------
//         rectElement : minidom.Element
//             A SVG rect path command.

//         style : dict
//             Style specification, using the SVG names for properties.

//         Returns
//         -------
//         Rectangle
//             Creates either a Rectangle, or RoundRectangle, VMobject from a
//             rect element.
//         """

//         strokeWidth = rectElement.getAttribute("stroke-width")
//         cornerRadius = rectElement.getAttribute("rx")

//         if strokeWidth in ["", "none", "0"]:
//             strokeWidth = 0

//         if cornerRadius in ["", "0", "none"]:
//             cornerRadius = 0

//         cornerRadius = float(cornerRadius)

//         parsedStyle = parseStyle(style)
//         parsedStyle["strokeWidth"] = strokeWidth

//         if cornerRadius == 0:
//             mob = Rectangle(
//                 width=this.AttributeToFloat(rectElement.getAttribute("width")),
//                 height=this.AttributeToFloat(rectElement.getAttribute("height")),
//                 **parsedStyle,
//             )
//         else:
//             mob = RoundedRectangle(
//                 width=this.AttributeToFloat(rectElement.getAttribute("width")),
//                 height=this.AttributeToFloat(rectElement.getAttribute("height")),
//                 cornerRadius=cornerRadius,
//                 **parsedStyle,
//             )

//         mob.shift(mob.getCenter() - mob.getCorner(UP + LEFT))
//         return mob

//     CircleToMobject(this, circleElement: MinidomElement, style: dict) {
//         """Creates a Circle VMobject from a SVG <circle> command.

//         Parameters
//         ----------
//         circleElement : :class:`minidom.Element`
//             A SVG circle path command.

//         style : :class:`dict`
//             Style specification, using the SVG names for properties.

//         Returns
//         -------
//         Circle
//             A Circle VMobject
//         """
//         x, y, r = (
//             this.AttributeToFloat(circleElement.getAttribute(key))
//             if circleElement.hasAttribute(key)
//             else 0.0
//             for key in ("cx", "cy", "r")
//         )
//         return Circle(radius=r, **parseStyle(style)).shift(x * RIGHT + y * DOWN)

//     EllipseToMobject(this, circleElement: MinidomElement, style: dict) {
//         """Creates a stretched Circle VMobject from a SVG <circle> path
//         command.

//         Parameters
//         ----------
//         circleElement : :class:`minidom.Element`
//             A SVG circle path command.

//         style : :class:`dict`
//             Style specification, using the SVG names for properties.

//         Returns
//         -------
//         Circle
//             A Circle VMobject
//         """
//         x, y, rx, ry = (
//             this.AttributeToFloat(circleElement.getAttribute(key))
//             if circleElement.hasAttribute(key)
//             else 0.0
//             for key in ("cx", "cy", "rx", "ry")
//         )
//         return (
//             Circle(**parseStyle(style))
//             .scale(rx * RIGHT + ry * UP)
//             .shift(x * RIGHT + y * DOWN)
//         )

//     PolygonToMobject(this, polygonElement: MinidomElement, style: dict) {
//         """Constructs a VMobject from a SVG <polygon> element.

//         Parameters
//         ----------
//         polygonElement : :class:`minidom.Element`
//             An SVG polygon element.

//         style : :class:`dict`
//             Style specification, using the SVG names for properties.

//         Returns
//         -------
//         SVGPathMobject
//             A VMobject representing the polygon.
//         """
//         # This seems hacky... yes it is.
//         pathString = polygonElement.getAttribute("points").lstrip()
//         for digit in string.digits:
//             pathString = pathString.replace(" " + digit, " L" + digit)
//         pathString = "M" + pathString
//         if polygonElement.tagName == "polygon":
//             pathString = pathString + "Z"
//         return this.PathStringToMobject(pathString, style)

//     HandleTransforms(this, element, mobject) {
//         """Applies the SVG transform to the specified mobject. Transforms include:
//         ``matrix``, ``translate``, and ``scale``.

//         Parameters
//         ----------
//         element : :class:`minidom.Element`
//             The transform command to perform

//         mobject : :class:`Mobject`
//             The Mobject to transform.
//         """

//         x, y = (
//             this.AttributeToFloat(element.getAttribute(key))
//             if element.hasAttribute(key)
//             else 0.0
//             for key in ("x", "y")
//         )
//         mobject.shift(x * RIGHT + y * DOWN)

//         transformAttrValue = element.getAttribute("transform")

//         # parse the various transforms in the attribute value
//         transformNames = ["matrix", "translate", "scale", "rotate", "skewX", "skewY"]

//         # Borrowed/Inspired from:
//         # https://github.com/cjlano/svg/blob/3ea3384457c9780fa7d67837c9c5fd4ebc42cb3b/svg/svg.py#L75

//         # match any SVG transformation with its parameter (until final parenthesis)
//         # [^)]*    == anything but a closing parenthesis
//         # '|'.join == OR-list of SVG transformations
//         transformRegex = "|".join([x + r"[^)]*\)" for x in transformNames])
//         transforms = re.findall(transformRegex, transformAttrValue)[::-1]

//         numberRegex = r"[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][-+]?\d+)?"

//         for t in transforms:
//             opName, opArgs = t.split("(")
//             opName = opName.strip()
//             opArgs = [float(x) for x in re.findall(numberRegex, opArgs)]

//             if opName == "matrix":
//                 transformArgs = np.array(opArgs).reshape([3, 2])
//                 x = transformArgs[2][0]
//                 y = -transformArgs[2][1]
//                 matrix = np.identity(this.dim)
//                 matrix[:2, :2] = transformArgs[:2, :]
//                 matrix[1] *= -1
//                 matrix[:, 1] *= -1

//                 for mob in mobject.familyMembersWithPoints() {
//                     if config["renderer"] == "opengl":
//                         mob.points = np.dot(mob.points, matrix)
//                     else:
//                         mob.points = np.dot(mob.points, matrix)
//                 mobject.shift(x * RIGHT + y * UP)

//             elif opName == "scale":
//                 scaleValues = opArgs
//                 if len(scaleValues) == 2:
//                     scaleX, scaleY = scaleValues
//                     mobject.scale(np.array([scaleX, scaleY, 1]), aboutPoint=ORIGIN)
//                 elif len(scaleValues) == 1:
//                     scale = scaleValues[0]
//                     mobject.scale(np.array([scale, scale, 1]), aboutPoint=ORIGIN)

//             elif opName == "translate":
//                 if len(opArgs) == 2:
//                     x, y = opArgs
//                 else:
//                     x = opArgs
//                     y = 0
//                 mobject.shift(x * RIGHT + y * DOWN)

//             else:
//                 # TODO: handle rotate, skewX and skewY
//                 # for now adding a warning message
//                 logger.warning(
//                     "Handling of %s transform is not supported yet!",
//                     opName,
//                 )

//     Flatten(this, inputList) {
//         """A helper method to flatten the ``inputList`` into an 1D array."""
//         outputList = []
//         for i in inputList:
//             if isinstance(i, list) {
//                 outputList.extend(this.Flatten(i))
//             else:
//                 outputList.append(i)
//         return outputList

//     MoveIntoPosition(this, width, height) {
//         """Uses the SVGMobject's config dictionary to set the Mobject's
//         width, height, and/or center it. Use ``width``, ``height``, and
//         ``shouldCenter`` respectively to modify this.
//         """
//         if this.shouldCenter:
//             this.center()
//         if height is not None:
//             this.height = height
//         if width is not None:
//             this.width = width

//     initColors(this, propagateColors=False) {
//         if config.renderer == "opengl":
//             this.setStyle(
//                 fillColor=this.fillColor or this.color,
//                 fillOpacity=this.fillOpacity,
//                 strokeColor=this.strokeColor or this.color,
//                 strokeWidth=this.strokeWidth,
//                 strokeOpacity=this.strokeOpacity,
//                 recurse=propagateColors,
//             )
//         else:
//             super().initColors(propagateColors=propagateColors)
