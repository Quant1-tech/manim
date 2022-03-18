import {Pt3, $add} from "./utils/js";

// # Messages
// NOT_SETTING_FONT_MSG: str = """
// You haven't set font.
// If you are not using English, this may cause text rendering problem.
// You set font like:
// text = Text('your text', font='your font')
// """
// SCENE_NOT_FOUND_MESSAGE: str = """
//    {} is not in the script
// """
// CHOOSE_NUMBER_MESSAGE: str = """
// Choose number corresponding to desired scene/arguments.
// (Use comma separated list for multiple entries)
// Choice(s): """
// INVALID_NUMBER_MESSAGE: str = "Invalid scene numbers have been specified. Aborting."
// NO_SCENE_MESSAGE: str = """
//    There are no scenes inside that module
// """

// # Pango stuff
// NORMAL: str = "NORMAL"
// ITALIC: str = "ITALIC"
// OBLIQUE: str = "OBLIQUE"
// BOLD: str = "BOLD"
// # Only for Pango from below
// THIN: str = "THIN"
// ULTRALIGHT: str = "ULTRALIGHT"
// LIGHT: str = "LIGHT"
// SEMILIGHT: str = "SEMILIGHT"
// BOOK: str = "BOOK"
// MEDIUM: str = "MEDIUM"
// SEMIBOLD: str = "SEMIBOLD"
// ULTRABOLD: str = "ULTRABOLD"
// HEAVY: str = "HEAVY"
// ULTRAHEAVY: str = "ULTRAHEAVY"

// RESAMPLING_ALGORITHMS = {
//     "nearest": Image.NEAREST,
//     "none": Image.NEAREST,
//     "lanczos": Image.LANCZOS,
//     "antialias": Image.LANCZOS,
//     "bilinear": Image.BILINEAR,
//     "linear": Image.BILINEAR,
//     "bicubic": Image.BICUBIC,
//     "cubic": Image.BICUBIC,
//     "box": Image.BOX,
//     "hamming": Image.HAMMING,
// }

// Geometry: directions

/** The center of the coordinate system. */
export const ORIGIN: Pt3 = [0, 0, 0];

/** One unit step in the positive Y direction. */
export const UP: Pt3 = [0, 1, 0];

/** One unit step in the negative Y direction. */
export const DOWN: Pt3 = [0, -1, 0];

/** One unit step in the positive X direction. */
export const RIGHT: Pt3 = [1, 0, 0];

/** One unit step in the negative X direction. */
export const LEFT: Pt3 = [-1, 0, 0];

/** One unit step in the negative Z direction. */
export const IN: Pt3 = [0, 0, -1];

/** One unit step in the positive Z direction. */
export const OUT: Pt3 = [0, 0, 1];

// # Geometry: axes
// X_AXIS: np.ndarray = np.array((1.0, 0.0, 0.0))
// Y_AXIS: np.ndarray = np.array((0.0, 1.0, 0.0))
// Z_AXIS: np.ndarray = np.array((0.0, 0.0, 1.0))

// Geometry: useful abbreviations for diagonals
/** One step up plus one step left. */
export const UL: Pt3 = $add(LEFT, UP);

/** One step up plus one step right. */
export const UR: Pt3 = $add(RIGHT, UP);

/** One step down plus one step left. */
export const DL: Pt3 = $add(LEFT, DOWN);

/** One step down plus one step right. */
export const DR: Pt3 = $add(RIGHT, DOWN);

// Geometry
export const START_X = 30;
export const START_Y = 20;
export const DEFAULT_DOT_RADIUS = 0.08;
export const DEFAULT_SMALL_DOT_RADIUS = 0.04;
export const DEFAULT_DASH_LENGTH = 0.05;
export const DEFAULT_ARROW_TIP_LENGTH = 0.35;

// Default buffers (padding)
export const SMALL_BUFF = 0.1;
export const MED_SMALL_BUFF = 0.25;
export const MED_LARGE_BUFF = 0.5;
export const LARGE_BUFF = 1;
export const DEFAULT_MOBJECT_TO_EDGE_BUFFER = MED_LARGE_BUFF;
export const DEFAULT_MOBJECT_TO_MOBJECT_BUFFER = MED_SMALL_BUFF;

// # Times in seconds
// DEFAULT_POINTWISE_FUNCTION_RUN_TIME: float = 3.0
// DEFAULT_WAIT_TIME: float = 1.0

// Misc
export const DEFAULT_POINT_DENSITY_2D = 25;
export const DEFAULT_POINT_DENSITY_1D = 10;
export const DEFAULT_STROKE_WIDTH = .04;
export const DEFAULT_FONT_SIZE = 48;

// Mathematical constants
/** The ratio of the circumference of a circle to its diameter. */
export const PI = Math.PI;

/** The ratio of the circumference of a circle to its radius. */
export const TWOPI = 2 * Math.PI;

/** The exchange rate between radians and degrees. */
export const DEGREES = TWOPI / 360;

// # ffmpeg stuff
// FFMPEG_BIN: str = "ffmpeg"

// # gif stuff
// GIF_FILE_EXTENSION: str = ".gif"

// FFMPEG_VERBOSITY_MAP: dict[str, str] = {
//     "DEBUG": "error",
//     "INFO": "error",
//     "WARNING": "error",
//     "ERROR": "error",
//     "CRITICAL": "fatal",
// }
// VERBOSITY_CHOICES = FFMPEG_VERBOSITY_MAP.keys()
// WEBGL_RENDERER_INFO: str = (
//     "The Electron frontend to Manim is hosted at "
//     "https://github.com/ManimCommunity/manim-renderer. After cloning and building it, "
//     "you can either start it prior to running Manim or specify the path to the "
//     "executable with the --webglRendererPath flag."
// )

// # Video qualities
// QUALITIES: dict[str, dict[str, str | int | None]] = {
//     "fourkQuality": {
//         "flag": "k",
//         "pixelHeight": 2160,
//         "pixelWidth": 3840,
//         "frameRate": 60,
//     },
//     "productionQuality": {
//         "flag": "p",
//         "pixelHeight": 1440,
//         "pixelWidth": 2560,
//         "frameRate": 60,
//     },
//     "highQuality": {
//         "flag": "h",
//         "pixelHeight": 1080,
//         "pixelWidth": 1920,
//         "frameRate": 60,
//     },
//     "mediumQuality": {
//         "flag": "m",
//         "pixelHeight": 720,
//         "pixelWidth": 1280,
//         "frameRate": 30,
//     },
//     "lowQuality": {
//         "flag": "l",
//         "pixelHeight": 480,
//         "pixelWidth": 854,
//         "frameRate": 15,
//     },
//     "exampleQuality": {
//         "flag": None,
//         "pixelHeight": 480,
//         "pixelWidth": 854,
//         "frameRate": 30,
//     },
// }

// DEFAULT_QUALITY: str = "highQuality"
// DEFAULT_QUALITY_SHORT = QUALITIES[DEFAULT_QUALITY]["flag"]

// EPILOG = "Made with <3 by Manim Community developers."
// HELP_OPTIONS = ["-h", "--help"]
// CONTEXT_SETTINGS = {"helpOptionNames": HELP_OPTIONS}
// SHIFT_VALUE = 65505
// CTRL_VALUE = 65507
