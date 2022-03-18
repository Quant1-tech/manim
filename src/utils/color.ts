/** @file Colors and utility functions for conversion between different color models. */

// from _Future__ import annotations

// _All__ = [
//     "colorToRgb",
//     "colorToRgba",
//     "rgbToColor",
//     "rgbaToColor",
//     "rgbToHex",
//     "hexToRgb",
//     "invertColor",
//     "colorToIntRgb",
//     "colorToIntRgba",
//     "colorGradient",
//     "interpolateColor",
//     "averageColor",
//     "randomBrightColor",
//     "randomColor",
//     "getShadedRgb",
// ]

// import random
// from enum import Enum
// from typing import Iterable

// import numpy as np
// from colour import Color

// from ..utils.bezier import interpolate
// from ..utils.spaceOps import normalize


// class Colors(Enum) {
//     """A list of pre-defined colors.

//     Examples
//     --------

//     .. manim:: ColorsOverview
//         :saveLastFrame:
//         :hideSource:

//         from manim.utils.color import Colors
//         class ColorsOverview(Scene) {
//             construct(this) {
//                 colorGroup(color) {
//                     group = VGroup(
//                         *[
//                             Line(ORIGIN, RIGHT * 1.5, strokeWidth=35, color=Colors[name].value)
//                             for name in subnames(color)
//                         ]
//                     ).arrangeSubmobjects(buff=0.4, direction=DOWN)

//                     name = Text(color).scale(0.6).nextTo(group, UP, buff=0.3)
//                     if any(decender in color for decender in "gjpqy") {
//                         name.shift(DOWN * 0.08)
//                     group.add(name)
//                     return group

//                 subnames(name) {
//                     return [name + "_" + char for char in "abcde"]

//                 colorGroups = VGroup(
//                     *[
//                         colorGroup(color)
//                         for color in [
//                             "blue",
//                             "teal",
//                             "green",
//                             "yellow",
//                             "gold",
//                             "red",
//                             "maroon",
//                             "purple",
//                         ]
//                     ]
//                 ).arrangeSubmobjects(buff=0.2, alignedEdge=DOWN)

//                 for line, char in zip(colorGroups[0], "abcde") {
//                     colorGroups.add(Text(char).scale(0.6).nextTo(line, LEFT, buff=0.2))

//                 namedLinesGroup(length, colors, names, textColors, alignToBlock) {
//                     lines = VGroup(
//                         *[
//                             Line(
//                                 ORIGIN,
//                                 RIGHT * length,
//                                 strokeWidth=55,
//                                 color=Colors[color].value,
//                             )
//                             for color in colors
//                         ]
//                     ).arrangeSubmobjects(buff=0.6, direction=DOWN)

//                     for line, name, color in zip(lines, names, textColors) {
//                         line.add(Text(name, color=color).scale(0.6).moveTo(line))
//                     lines.nextTo(colorGroups, DOWN, buff=0.5).alignTo(
//                         colorGroups[alignToBlock], LEFT
//                     )
//                     return lines

//                 otherColors = (
//                     "pink",
//                     "lightPink",
//                     "orange",
//                     "lightBrown",
//                     "darkBrown",
//                     "grayBrown",
//                 )

//                 otherLines = namedLinesGroup(
//                     3.2,
//                     otherColors,
//                     otherColors,
//                     [BLACK] * 4 + [WHITE] * 2,
//                     0,
//                 )

//                 grayLines = namedLinesGroup(
//                     6.6,
//                     ["white"] + subnames("gray") + ["black"],
//                     [
//                         "white",
//                         "lighterGray / grayA",
//                         "lightGray / grayB",
//                         "gray / grayC",
//                         "darkGray / grayD",
//                         "darkerGray / grayE",
//                         "black",
//                     ],
//                     [BLACK] * 3 + [WHITE] * 4,
//                     2,
//                 )

//                 pureColors = (
//                     "pureRed",
//                     "pureGreen",
//                     "pureBlue",
//                 )

//                 pureLines = namedLinesGroup(
//                     3.2,
//                     pureColors,
//                     pureColors,
//                     [BLACK, BLACK, WHITE],
//                     6,
//                 )

//                 this.add(colorGroups, otherLines, grayLines, pureLines)

//                 VGroup(*this.mobjects).moveTo(ORIGIN)


//     The preferred way of using these colors is by importing their constants from manim:

//     .. code-block:: pycon

//         >>> from manim import RED, GREEN, BLUE
//         >>> RED
//         '#FC6255'

//     Note this way uses the name of the colors in UPPERCASE.

//     Alternatively, you can also import this Enum directly and use its members
//     directly, through the use of :code:`color.value`.  Note this way uses the
//     name of the colors in lowercase.

//     .. code-block:: pycon

//         >>> from manim.utils.color import Colors
//         >>> Colors.red.value
//         '#FC6255'

//     .. note::

//         The colors of type "C" have an alias equal to the colorname without a letter,
//         e.g. GREEN = GREEN_C

//     """

//     white: str = "#FFFFFF"
//     grayA: str = "#DDDDDD"
//     grayB: str = "#BBBBBB"
//     grayC: str = "#888888"
//     grayD: str = "#444444"
//     grayE: str = "#222222"
//     black: str = "#000000"
//     lighterGray: str = grayA
//     lightGray: str = grayB
//     gray: str = grayC
//     darkGray: str = grayD
//     darkerGray: str = grayE

//     blueA: str = "#C7E9F1"
//     blueB: str = "#9CDCEB"
//     blueC: str = "#58C4DD"
//     blueD: str = "#29ABCA"
//     blueE: str = "#236B8E"
//     pureBlue: str = "#0000FF"
//     blue: str = blueC
//     darkBlue: str = blueE

//     tealA: str = "#ACEAD7"
//     tealB: str = "#76DDC0"
//     tealC: str = "#5CD0B3"
//     tealD: str = "#55C1A7"
//     tealE: str = "#49A88F"
//     teal: str = tealC

//     greenA: str = "#C9E2AE"
//     greenB: str = "#A6CF8C"
//     greenC: str = "#83C167"
//     greenD: str = "#77B05D"
//     greenE: str = "#699C52"
//     pureGreen: str = "#00FF00"
//     green: str = greenC

//     yellowA: str = "#FFF1B6"
//     yellowB: str = "#FFEA94"
//     yellowC: str = "#FFFF00"
//     yellowD: str = "#F4D345"
//     yellowE: str = "#E8C11C"
//     yellow: str = yellowC

//     goldA: str = "#F7C797"
//     goldB: str = "#F9B775"
//     goldC: str = "#F0AC5F"
//     goldD: str = "#E1A158"
//     goldE: str = "#C78D46"
//     gold: str = goldC

//     redA: str = "#F7A1A3"
//     redB: str = "#FF8080"
//     redC: str = "#FC6255"
//     redD: str = "#E65A4C"
//     redE: str = "#CF5044"
//     pureRed: str = "#FF0000"
//     red: str = redC

//     maroonA: str = "#ECABC1"
//     maroonB: str = "#EC92AB"
//     maroonC: str = "#C55F73"
//     maroonD: str = "#A24D61"
//     maroonE: str = "#94424F"
//     maroon: str = maroonC

//     purpleA: str = "#CAA3E8"
//     purpleB: str = "#B189C6"
//     purpleC: str = "#9A72AC"
//     purpleD: str = "#715582"
//     purpleE: str = "#644172"
//     purple: str = purpleC

//     pink: str = "#D147BD"
//     lightPink: str = "#DC75CD"

//     orange: str = "#FF862F"
//     lightBrown: str = "#CD853F"
//     darkBrown: str = "#8B4513"
//     grayBrown: str = "#736357"


// printConstantDefinitions() {
//     """
//     A simple function used to generate the constant values below. To run it
//     paste this function and the Colors class into a file and run them.
//     """
//     constantsNames: list[str] = []
//     for name in Colors._Members__.keys() {
//         nameUpper = name.upper()

//         constantsNames.append(nameUpper)
//         print(f"{nameUpper} = Colors.{name}")

//         if "GRAY" in nameUpper:
//             nameUpper = nameUpper.replace("GRAY", "GREY")

//             constantsNames.append(nameUpper)
//             print(f"{nameUpper} = Colors.{name}")

//     constantsNamesRepr = '[\n    "' + '",\n    "'.join(constantsNames) + '",\n]'

//     print(f"\n_All__ += {constantsNamesRepr}")


export const WHITE = "#FFFFFF";
export const GRAY_A = "#DDDDDD";
export const GREY_A = "#DDDDDD";
export const GRAY_B = "#BBBBBB";
export const GREY_B = "#BBBBBB";
export const GRAY_C = "#888888";
export const GREY_C = "#888888";
export const GRAY_D = "#444444";
export const GREY_D = "#444444";
export const GRAY_E = "#222222";
export const GREY_E = "#222222";
export const BLACK = "#000000";
export const LIGHTER_GRAY = "#DDDDDD";
export const LIGHTER_GREY = "#DDDDDD";
export const LIGHT_GRAY = "#BBBBBB";
export const LIGHT_GREY = "#BBBBBB";
export const GRAY = "#888888";
export const GREY = "#888888";
export const DARK_GRAY = "#444444";
export const DARK_GREY = "#444444";
export const DARKER_GRAY = "#222222";
export const DARKER_GREY = "#222222";
export const BLUE_A = "#C7E9F1";
export const BLUE_B = "#9CDCEB";
export const BLUE_C = "#58C4DD";
export const BLUE_D = "#29ABCA";
export const BLUE_E = "#236B8E";
export const PURE_BLUE = "#0000FF";
export const BLUE = "#58C4DD";
export const DARK_BLUE = "#236B8E";
export const TEAL_A = "#ACEAD7";
export const TEAL_B = "#76DDC0";
export const TEAL_C = "#5CD0B3";
export const TEAL_D = "#55C1A7";
export const TEAL_E = "#49A88F";
export const TEAL = "#5CD0B3";
export const GREEN_A = "#C9E2AE";
export const GREEN_B = "#A6CF8C";
export const GREEN_C = "#83C167";
export const GREEN_D = "#77B05D";
export const GREEN_E = "#699C52";
export const PURE_GREEN = "#00FF00";
export const GREEN = "#83C167";
export const YELLOW_A = "#FFF1B6";
export const YELLOW_B = "#FFEA94";
export const YELLOW_C = "#FFFF00";
export const YELLOW_D = "#F4D345";
export const YELLOW_E = "#E8C11C";
export const YELLOW = "#FFFF00";
export const GOLD_A = "#F7C797";
export const GOLD_B = "#F9B775";
export const GOLD_C = "#F0AC5F";
export const GOLD_D = "#E1A158";
export const GOLD_E = "#C78D46";
export const GOLD = "#F0AC5F";
export const RED_A = "#F7A1A3";
export const RED_B = "#FF8080";
export const RED_C = "#FC6255";
export const RED_D = "#E65A4C";
export const RED_E = "#CF5044";
export const PURE_RED = "#FF0000";
export const RED = "#FC6255";
export const MAROON_A = "#ECABC1";
export const MAROON_B = "#EC92AB";
export const MAROON_C = "#C55F73";
export const MAROON_D = "#A24D61";
export const MAROON_E = "#94424F";
export const MAROON = "#C55F73";
export const PURPLE_A = "#CAA3E8";
export const PURPLE_B = "#B189C6";
export const PURPLE_C = "#9A72AC";
export const PURPLE_D = "#715582";
export const PURPLE_E = "#644172";
export const PURPLE = "#9A72AC";
export const PINK = "#D147BD";
export const LIGHT_PINK = "#DC75CD";
export const ORANGE = "#FF862F";
export const LIGHT_BROWN = "#CD853F";
export const DARK_BROWN = "#8B4513";
export const GRAY_BROWN = "#736357";
export const GREY_BROWN = "#736357";

// _All__ += [
//     "WHITE",
//     "GRAY_A",
//     "GREY_A",
//     "GRAY_B",
//     "GREY_B",
//     "GRAY_C",
//     "GREY_C",
//     "GRAY_D",
//     "GREY_D",
//     "GRAY_E",
//     "GREY_E",
//     "BLACK",
//     "LIGHTER_GRAY",
//     "LIGHTER_GREY",
//     "LIGHT_GRAY",
//     "LIGHT_GREY",
//     "GRAY",
//     "GREY",
//     "DARK_GRAY",
//     "DARK_GREY",
//     "DARKER_GRAY",
//     "DARKER_GREY",
//     "BLUE_A",
//     "BLUE_B",
//     "BLUE_C",
//     "BLUE_D",
//     "BLUE_E",
//     "PURE_BLUE",
//     "BLUE",
//     "DARK_BLUE",
//     "TEAL_A",
//     "TEAL_B",
//     "TEAL_C",
//     "TEAL_D",
//     "TEAL_E",
//     "TEAL",
//     "GREEN_A",
//     "GREEN_B",
//     "GREEN_C",
//     "GREEN_D",
//     "GREEN_E",
//     "PURE_GREEN",
//     "GREEN",
//     "YELLOW_A",
//     "YELLOW_B",
//     "YELLOW_C",
//     "YELLOW_D",
//     "YELLOW_E",
//     "YELLOW",
//     "GOLD_A",
//     "GOLD_B",
//     "GOLD_C",
//     "GOLD_D",
//     "GOLD_E",
//     "GOLD",
//     "RED_A",
//     "RED_B",
//     "RED_C",
//     "RED_D",
//     "RED_E",
//     "PURE_RED",
//     "RED",
//     "MAROON_A",
//     "MAROON_B",
//     "MAROON_C",
//     "MAROON_D",
//     "MAROON_E",
//     "MAROON",
//     "PURPLE_A",
//     "PURPLE_B",
//     "PURPLE_C",
//     "PURPLE_D",
//     "PURPLE_E",
//     "PURPLE",
//     "PINK",
//     "LIGHT_PINK",
//     "ORANGE",
//     "LIGHT_BROWN",
//     "DARK_BROWN",
//     "GRAY_BROWN",
//     "GREY_BROWN",
// ]


// colorToRgb(color: Color | str) -> np.ndarray:
//     if isinstance(color, str) {
//         return hexToRgb(color)
//     elif isinstance(color, Color) {
//         return np.array(color.getRgb())
//     else:
//         raise ValueError("Invalid color type: " + str(color))


// colorToRgba(color: Color | str, alpha: float = 1) -> np.ndarray:
//     return np.array([*colorToRgb(color), alpha])


// rgbToColor(rgb: Iterable[float]) -> Color:
//     return Color(rgb=rgb)


// rgbaToColor(rgba: Iterable[float]) -> Color:
//     return rgbToColor(rgba[:3])


// rgbToHex(rgb: Iterable[float]) -> str:
//     return "#" + "".join("%02x" % round(255 * x) for x in rgb)


// hexToRgb(hexCode: str) -> np.ndarray:
//     hexPart = hexCode[1:]
//     if len(hexPart) == 3:
//         hexPart = "".join([2 * c for c in hexPart])
//     return np.array([int(hexPart[i : i + 2], 16) / 255 for i in range(0, 6, 2)])


// invertColor(color: Color) -> Color:
//     return rgbToColor(1.0 - colorToRgb(color))


// colorToIntRgb(color: Color) -> np.ndarray:
//     return (255 * colorToRgb(color)).astype("uint8")


// colorToIntRgba(color: Color, opacity: float = 1.0) -> np.ndarray:
//     alphaMultiplier = np.vectorize(lambda x: int(x * opacity))

//     return alphaMultiplier(np.append(colorToIntRgb(color), 255))


// colorGradient(
//     referenceColors: Iterable[Color],
//     lengthOfOutput: int,
// ) -> list[Color]:
//     if lengthOfOutput == 0:
//         return referenceColors[0]
//     rgbs = list(map(colorToRgb, referenceColors))
//     alphas = np.linspace(0, (len(rgbs) - 1), lengthOfOutput)
//     floors = alphas.astype("int")
//     alphasMod1 = alphas % 1
//     # End edge case
//     alphasMod1[-1] = 1
//     floors[-1] = len(rgbs) - 2
//     return [
//         rgbToColor(interpolate(rgbs[i], rgbs[i + 1], alpha))
//         for i, alpha in zip(floors, alphasMod1)
//     ]


// interpolateColor(color1: Color, color2: Color, alpha: float) -> Color:
//     rgb = interpolate(colorToRgb(color1), colorToRgb(color2), alpha)
//     return rgbToColor(rgb)


// averageColor(*colors: Color) -> Color:
//     rgbs = np.array(list(map(colorToRgb, colors)))
//     meanRgb = np.applyAlongAxis(np.mean, 0, rgbs)
//     return rgbToColor(meanRgb)


// randomBrightColor() -> Color:
//     color = randomColor()
//     currRgb = colorToRgb(color)
//     newRgb = interpolate(currRgb, np.ones(len(currRgb)), 0.5)
//     return Color(rgb=newRgb)


// randomColor() -> Color:
//     return random.choice([c.value for c in list(Colors)])


// getShadedRgb(
//     rgb: np.ndarray,
//     point: np.ndarray,
//     unitNormalVect: np.ndarray,
//     lightSource: np.ndarray,
// ) -> np.ndarray:
//     toSun = normalize(lightSource - point)
//     factor = 0.5 * np.dot(unitNormalVect, toSun) ** 3
//     if factor < 0:
//         factor *= 0.5
//     result = rgb + factor
//     return result
