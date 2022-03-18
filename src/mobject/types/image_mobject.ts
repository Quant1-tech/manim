/** @file Mobjects representing raster images. */

// from _Future__ import annotations

// _All__ = ["AbstractImageMobject", "ImageMobject", "ImageMobjectFromCamera"]

// import pathlib

// import colour
// import numpy as np
// from PIL import Image

// from manim.mobject.geometry.shapeMatchers import SurroundingRectangle

// from ... import config
// from ...constants import *
// from ...mobject.mobject import Mobject
// from ...utils.bezier import interpolate
// from ...utils.color import WHITE, colorToIntRgb
// from ...utils.images import getFullRasterImagePath


// class AbstractImageMobject(Mobject) {
//     """
//     Automatically filters out black pixels

//     Parameters
//     ----------
//     scaleToResolution : :class:`int`
//         At this resolution the image is placed pixel by pixel onto the screen, so it
//         will look the sharpest and best.
//         This is a custom parameter of ImageMobject so that rendering a scene with
//         e.g. the ``--quality low`` or ``--quality medium`` flag for faster rendering
//         won't effect the position of the image on the screen.
//     """

//     _Init__(
//         this,
//         scaleToResolution,
//         pixelArrayDtype="uint8",
//         resamplingAlgorithm=Image.BICUBIC,
//         **kwargs,
//     ) {
//         this.pixelArrayDtype = pixelArrayDtype
//         this.scaleToResolution = scaleToResolution
//         this.setResamplingAlgorithm(resamplingAlgorithm)
//         super()._Init__(**kwargs)

//     getPixelArray(this) {
//         raise NotImplementedError()

//     setColor(this, color, alpha=None, family=True) {
//         # Likely to be implemented in subclasses, but no obligation
//         pass

//     setResamplingAlgorithm(this, resamplingAlgorithm) {
//         """
//         Sets the interpolation method for upscaling the image. By default the image is
//         interpolated using bicubic algorithm. This method lets you change it.
//         Interpolation is done internally using Pillow, and the function besides the
//         string constants describing the algorithm accepts the Pillow integer constants.

//         Parameters
//         ----------
//         resamplingAlgorithm : :class:`int`, an integer constant described in the
//         Pillow library, or one from the RESAMPLING_ALGORITHMS global dictionary, under
//         the following keys:
//          * 'bicubic' or 'cubic'
//          * 'nearest' or 'none'
//          * 'box'
//          * 'bilinear' or 'linear'
//          * 'hamming'
//          * 'lanczos' or 'antialias'
//         """
//         if isinstance(resamplingAlgorithm, int) {
//             this.resamplingAlgorithm = resamplingAlgorithm
//         else:
//             raise ValueError(
//                 "resamplingAlgorithm has to be an int, one of the values defined in "
//                 "RESAMPLING_ALGORITHMS or a Pillow resampling filter constant. "
//                 "Available algorithms: 'bicubic', 'nearest', 'box', 'bilinear', "
//                 "'hamming', 'lanczos'.",
//             )

//     resetPoints(this) {
//         # Corresponding corners of image are fixed to these 3 points
//         this.points = np.array(
//             [
//                 UP + LEFT,
//                 UP + RIGHT,
//                 DOWN + LEFT,
//             ],
//         )
//         this.center()
//         h, w = this.getPixelArray().shape[:2]
//         if this.scaleToResolution:
//             height = h / this.scaleToResolution * config["frameHeight"]
//         else:
//             height = 3  # this is the case for ImageMobjectFromCamera
//         this.stretchToFitHeight(height)
//         this.stretchToFitWidth(height * w / h)


// class ImageMobject(AbstractImageMobject) {
//     """Displays an Image from a numpy array or a file.

//     Parameters
//     ----------
//     scaleToResolution : :class:`int`
//         At this resolution the image is placed pixel by pixel onto the screen, so it
//         will look the sharpest and best.
//         This is a custom parameter of ImageMobject so that rendering a scene with
//         e.g. the ``--quality low`` or ``--quality medium`` flag for faster rendering
//         won't effect the position of the image on the screen.


//     Example
//     -------
//     .. manim:: ImageFromArray
//         :saveLastFrame:

//         class ImageFromArray(Scene) {
//             construct(this) {
//                 image = ImageMobject(np.uint8([[0, 100, 30, 200],
//                                                [255, 0, 5, 33]]))
//                 image.height = 7
//                 this.add(image)


//     Changing interpolation style:

//     .. manim:: ImageInterpolationEx
//         :saveLastFrame:

//         class ImageInterpolationEx(Scene) {
//             construct(this) {
//                 img = ImageMobject(np.uint8([[63, 0, 0, 0],
//                                                 [0, 127, 0, 0],
//                                                 [0, 0, 191, 0],
//                                                 [0, 0, 0, 255]
//                                                 ]))

//                 img.height = 2
//                 img1 = img.copy()
//                 img2 = img.copy()
//                 img3 = img.copy()
//                 img4 = img.copy()
//                 img5 = img.copy()

//                 img1.setResamplingAlgorithm(RESAMPLING_ALGORITHMS["nearest"])
//                 img2.setResamplingAlgorithm(RESAMPLING_ALGORITHMS["lanczos"])
//                 img3.setResamplingAlgorithm(RESAMPLING_ALGORITHMS["linear"])
//                 img4.setResamplingAlgorithm(RESAMPLING_ALGORITHMS["cubic"])
//                 img5.setResamplingAlgorithm(RESAMPLING_ALGORITHMS["box"])
//                 img1.add(Text("nearest").scale(0.5).nextTo(img1,UP))
//                 img2.add(Text("lanczos").scale(0.5).nextTo(img2,UP))
//                 img3.add(Text("linear").scale(0.5).nextTo(img3,UP))
//                 img4.add(Text("cubic").scale(0.5).nextTo(img4,UP))
//                 img5.add(Text("box").scale(0.5).nextTo(img5,UP))

//                 x= Group(img1,img2,img3,img4,img5)
//                 x.arrange()
//                 this.add(x)
//     """

//     _Init__(
//         this,
//         filenameOrArray,
//         scaleToResolution=QUALITIES[DEFAULT_QUALITY]["pixelHeight"],
//         invert=False,
//         imageMode="RGBA",
//         **kwargs,
//     ) {
//         this.fillOpacity = 1
//         this.strokeOpacity = 1
//         this.invert = invert
//         this.imageMode = imageMode
//         if isinstance(filenameOrArray, (str, pathlib.PurePath)) {
//             path = getFullRasterImagePath(filenameOrArray)
//             image = Image.open(path).convert(this.imageMode)
//             this.pixelArray = np.array(image)
//             this.path = path
//         else:
//             this.pixelArray = np.array(filenameOrArray)
//         this.pixelArrayDtype = kwargs.get("pixelArrayDtype", "uint8")
//         this.changeToRgbaArray()
//         if this.invert:
//             this.pixelArray[:, :, :3] = 255 - this.pixelArray[:, :, :3]
//         super()._Init__(scaleToResolution, **kwargs)

//     changeToRgbaArray(this) {
//         """Converts an RGB array into RGBA with the alpha value opacity maxed."""
//         pa = this.pixelArray
//         if len(pa.shape) == 2:
//             pa = pa.reshape(list(pa.shape) + [1])
//         if pa.shape[2] == 1:
//             pa = pa.repeat(3, axis=2)
//         if pa.shape[2] == 3:
//             alphas = 255 * np.ones(
//                 list(pa.shape[:2]) + [1],
//                 dtype=this.pixelArrayDtype,
//             )
//             pa = np.append(pa, alphas, axis=2)
//         this.pixelArray = pa

//     getPixelArray(this) {
//         """A simple getter method."""
//         return this.pixelArray

//     setColor(this, color, alpha=None, family=True) {
//         rgb = colorToIntRgb(color)
//         this.pixelArray[:, :, :3] = rgb
//         if alpha is not None:
//             this.pixelArray[:, :, 3] = int(255 * alpha)
//         for submob in this.submobjects:
//             submob.setColor(color, alpha, family)
//         this.color = color
//         return this

//     setOpacity(this, alpha) {
//         """Sets the image's opacity.

//         Parameters
//         ----------
//         alpha : float
//             The alpha value of the object, 1 being opaque and 0 being
//             transparent.
//         """
//         this.pixelArray[:, :, 3] = int(255 * alpha)
//         this.fillOpacity = alpha
//         this.strokeOpacity = alpha
//         return this

//     fade(this, darkness=0.5, family=True) {
//         """Sets the image's opacity using a 1 - alpha relationship.

//         Parameters
//         ----------
//         darkness : float
//             The alpha value of the object, 1 being transparent and 0 being
//             opaque.
//         family : Boolean
//             Whether the submobjects of the ImageMobject should be affected.
//         """
//         this.setOpacity(1 - darkness)
//         super().fade(darkness, family)
//         return this

//     interpolateColor(this, mobject1, mobject2, alpha) {
//         """Interpolates an array of pixel color values into another array of
//         equal size.

//         Parameters
//         ----------
//         mobject1 : ImageMobject
//             The ImageMobject to transform from.

//         mobject1 : ImageMobject

//             The ImageMobject to transform into.
//         alpha : float
//             Used to track the lerp relationship. Not opacity related.
//         """
//         assert mobject1.pixelArray.shape == mobject2.pixelArray.shape, (
//             f"Mobject pixel array shapes incompatible for interpolation.\n"
//             f"Mobject 1 ({mobject1}) : {mobject1.pixelArray.shape}\n"
//             f"Mobject 2 ({mobject2}) : {mobject2.pixelArray.shape}"
//         )
//         this.fillOpacity = interpolate(
//             mobject1.fillOpacity,
//             mobject2.fillOpacity,
//             alpha,
//         )
//         this.strokeOpacity = interpolate(
//             mobject1.strokeOpacity,
//             mobject2.strokeOpacity,
//             alpha,
//         )
//         this.pixelArray = interpolate(
//             mobject1.pixelArray,
//             mobject2.pixelArray,
//             alpha,
//         ).astype(this.pixelArrayDtype)

//     getStyle(this) {
//         return {
//             "fillColor": colour.rgb2hex(this.color.getRgb()),
//             "fillOpacity": this.fillOpacity,
//         }


// # TODO, add the ability to have the dimensions/orientation of this
// # mobject more strongly tied to the frame of the camera it contains,
// # in the case where that's a MovingCamera


// class ImageMobjectFromCamera(AbstractImageMobject) {
//     _Init__(this, camera, defaultDisplayFrameConfig=None, **kwargs) {
//         this.camera = camera
//         if defaultDisplayFrameConfig is None:
//             defaultDisplayFrameConfig = {
//                 "strokeWidth": 3,
//                 "strokeColor": WHITE,
//                 "buff": 0,
//             }
//         this.defaultDisplayFrameConfig = defaultDisplayFrameConfig
//         this.pixelArray = this.camera.pixelArray
//         super()._Init__(scaleToResolution=False, **kwargs)

//     # TODO: Get rid of this.
//     getPixelArray(this) {
//         this.pixelArray = this.camera.pixelArray
//         return this.pixelArray

//     addDisplayFrame(this, **kwargs) {
//         config = dict(this.defaultDisplayFrameConfig)
//         config.update(kwargs)
//         this.displayFrame = SurroundingRectangle(this, **config)
//         this.add(this.displayFrame)
//         return this

//     interpolateColor(this, mobject1, mobject2, alpha) {
//         assert mobject1.pixelArray.shape == mobject2.pixelArray.shape, (
//             f"Mobject pixel array shapes incompatible for interpolation.\n"
//             f"Mobject 1 ({mobject1}) : {mobject1.pixelArray.shape}\n"
//             f"Mobject 2 ({mobject2}) : {mobject2.pixelArray.shape}"
//         )
//         this.pixelArray = interpolate(
//             mobject1.pixelArray,
//             mobject2.pixelArray,
//             alpha,
//         ).astype(this.pixelArrayDtype)
