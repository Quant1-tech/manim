/** @file Utility functions for parsing SVG styles. */

// from _Future__ import annotations

// _All__ = ["cascadeElementStyle", "parseStyle", "parseColorString"]

// from xml.dom.minidom import Element as MinidomElement

// from colour import web2hex

// from ...utils.color import rgbToHex

// CASCADING_STYLING_ATTRIBUTES: list[str] = [
//     "fill",
//     "stroke",
//     "fill-opacity",
//     "stroke-opacity",
// ]


// # The default styling specifications for SVG images,
// # according to https://www.w3.org/TR/SVG/painting.html
// # (ctrl-F for "initial")
// SVG_DEFAULT_ATTRIBUTES: dict[str, str] = {
//     "fill": "black",
//     "fill-opacity": "1",
//     "stroke": "none",
//     "stroke-opacity": "1",
// }


// cascadeElementStyle(
//     element: MinidomElement,
//     inherited: dict[str, str],
// ) -> dict[str, str]:
//     """Collect the element's style attributes based upon both its inheritance and its own attributes.

//     SVG uses cascading element styles. A closer ancestor's style takes precedence over a more distant ancestor's
//     style. In order to correctly calculate the styles, the attributes are passed down through the inheritance tree,
//     updating where necessary.

//     Note that this method only copies the values and does not parse them. See :meth:`parseColorString` for converting
//     from SVG attributes to manim keyword arguments.

//     Parameters
//     ----------
//     element : :class:`MinidomElement`
//         Element of the SVG parse tree

//     inherited : :class:`dict`
//         Dictionary of SVG attributes inherited from the parent element.

//     Returns
//     -------
//     :class:`dict`
//         Dictionary mapping svg attributes to values with `element`'s values overriding inherited values.
//     """

//     style = inherited.copy()

//     # cascade the regular elements.
//     for attr in CASCADING_STYLING_ATTRIBUTES:
//         entry = element.getAttribute(attr)
//         if entry:
//             style[attr] = entry

//     # the style attribute should be handled separately in order to
//     # break it up nicely. furthermore, style takes priority over other
//     # attributes in the same element.
//     styleSpecs = element.getAttribute("style")
//     if styleSpecs:
//         for styleSpec in styleSpecs.split(";") {
//             try:
//                 key, value = styleSpec.split(":")
//             except ValueError as e:
//                 if not styleSpec.strip() {
//                     # there was just a stray semicolon at the end, producing an emptystring
//                     pass
//                 else:
//                     raise e
//             else:
//                 style[key.strip()] = value.strip()

//     return style


// parseColorString(colorSpec: str) -> str:
//     """Handle the SVG-specific color strings and convert them to HTML #rrggbb format.

//     Parameters
//     ----------
//     colorSpec : :class:`str`
//         String in any web-compatible format

//     Returns
//     -------
//     :class:`str`
//         Hexadecimal color string in the format `#rrggbb`
//     """

//     if colorSpec[0:3] == "rgb":
//         # these are only in integer form, but the Colour module wants them in floats.
//         splits = colorSpec[4:-1].split(",")
//         if splits[0][-1] == "%":
//             # if the last character of the first number is a percentage,
//             # then interpret the number as a percentage
//             parsedRgbs = [float(i[:-1]) / 100.0 for i in splits]
//         else:
//             parsedRgbs = [int(i) / 255.0 for i in splits]

//         hexColor = rgbToHex(parsedRgbs)

//     elif colorSpec[0] == "#":
//         # its OK, parse as hex color standard.
//         hexColor = colorSpec

//     else:
//         # attempt to convert color names like "red" to hex color
//         hexColor = web2hex(colorSpec, forceLong=True)

//     return hexColor


// fillDefaultValues(svgStyle: dict) -> None:
//     """
//     Fill in the default values for properties of SVG elements,
//     if they are not currently set in the style dictionary.

//     Parameters
//     ----------
//     svgStyle : :class:`dict`
//         Style dictionary with SVG property names. Some may be missing.

//     Returns
//     -------
//     :class:`dict`
//         Style attributes; none are missing.
//     """
//     for key in SVG_DEFAULT_ATTRIBUTES:
//         if key not in svgStyle:
//             svgStyle[key] = SVG_DEFAULT_ATTRIBUTES[key]


// parseStyle(svgStyle: dict[str, str]) -> dict:
//     """Convert a dictionary of SVG attributes to Manim VMobject keyword arguments.

//     Parameters
//     ----------
//     svgStyle : :class:`dict`
//         Style attributes as a string-to-string dictionary. Keys are valid SVG element attributes (fill, stroke, etc)

//     Returns
//     -------
//     :class:`dict`
//         Style attributes, but in manim kwargs form, e.g., keys are fillColor, strokeColor
//     """

//     manimStyle = {}
//     fillDefaultValues(svgStyle)

//     if "fill-opacity" in svgStyle:
//         manimStyle["fillOpacity"] = float(svgStyle["fill-opacity"])

//     if "stroke-opacity" in svgStyle:
//         manimStyle["strokeOpacity"] = float(svgStyle["stroke-opacity"])

//     # nones need to be handled specially
//     if "fill" in svgStyle:
//         if svgStyle["fill"] == "none":
//             manimStyle["fillOpacity"] = 0
//         else:
//             manimStyle["fillColor"] = parseColorString(svgStyle["fill"])

//     if "stroke" in svgStyle:
//         if svgStyle["stroke"] == "none":
//             # In order to not break animations.creation.Write,
//             # we interpret no stroke as stroke-width of zero and
//             # color the same as the fill color, if it exists.
//             manimStyle["strokeWidth"] = 0
//             if "fillColor" in manimStyle:
//                 manimStyle["strokeColor"] = manimStyle["fillColor"]
//         else:
//             manimStyle["strokeColor"] = parseColorString(svgStyle["stroke"])

//     return manimStyle
