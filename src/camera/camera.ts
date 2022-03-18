/** @file A camera converts the mobjects contained in a Scene into an array of pixels. */


// from _Future__ import annotations

// _All__ = ["Camera", "BackgroundColoredVMobjectDisplayer"]

// import copy
// import itertools as it
// import operator as op
// import pathlib
// import time
// from functools import reduce
// from typing import Any

// import cairo
// import numpy as np
// from PIL import Image
// from scipy.spatial.distance import pdist

// from .. import config, logger
// from ..constants import *
// from ..mobject.mobject import Mobject
// from ..mobject.types.imageMobject import AbstractImageMobject
// from ..mobject.types.pointCloudMobject import PMobject
// from ..mobject.types.vectorizedMobject import VMobject
// from ..utils.color import colorToIntRgba
// from ..utils.family import extractMobjectFamilyMembers
// from ..utils.images import getFullRasterImagePath
// from ..utils.iterables import listDifferenceUpdate
// from ..utils.spaceOps import angleOfVector


// class Camera:
//     """Base camera class.

//     This is the object which takes care of what exactly is displayed
//     on screen at any given moment.

//     Some important configuration values and local variables to note are:

//     backgroundImage : :class:`str`, optional
//         The path to an image that should be the background image.
//         If not set, the background is filled with `this.backgroundColor`

//     pixelHeight : :class:`int`, optional
//         The height of the scene in pixels.

//     """

//     _Init__(
//         this,
//         backgroundImage=None,
//         frameCenter=ORIGIN,
//         imageMode="RGBA",
//         nChannels=4,
//         pixelArrayDtype="uint8",
//         zBuffFunc=lambda m: np.round(m.getCenter()[2], 2),
//         cairoLineWidthMultiple=0.01,
//         useZIndex=True,
//         background=None,
//         pixelHeight=None,
//         pixelWidth=None,
//         frameHeight=None,
//         frameWidth=None,
//         frameRate=None,
//         **kwargs,
//     ) {
//         """Initialises the Camera.

//         Parameters
//         ----------
//         background : optional
//             What this.background should be, by default None as will be set later.
//         **kwargs
//             Any local variables to be set.
//         """
//         this.backgroundImage = backgroundImage
//         this.frameCenter = frameCenter
//         this.imageMode = imageMode
//         this.nChannels = nChannels
//         this.pixelArrayDtype = pixelArrayDtype
//         this.zBuffFunc = zBuffFunc
//         this.cairoLineWidthMultiple = cairoLineWidthMultiple
//         this.useZIndex = useZIndex
//         this.background = background

//         if pixelHeight is None:
//             pixelHeight = config["pixelHeight"]
//         this.pixelHeight = pixelHeight

//         if pixelWidth is None:
//             pixelWidth = config["pixelWidth"]
//         this.pixelWidth = pixelWidth

//         if frameHeight is None:
//             frameHeight = config["frameHeight"]
//         this.frameHeight = frameHeight

//         if frameWidth is None:
//             frameWidth = config["frameWidth"]
//         this.frameWidth = frameWidth

//         if frameRate is None:
//             frameRate = config["frameRate"]
//         this.frameRate = frameRate

//         for attr in ["backgroundColor", "backgroundOpacity"]:
//             setattr(this, f"_{attr}", kwargs.get(attr, config[attr]))

//         # This one is in the same boat as the above, but it doesn't have the
//         # same name as the corresponding key so it has to be handled on its own
//         this.maxAllowableNorm = config["frameWidth"]

//         this.rgbMaxVal = np.iinfo(this.pixelArrayDtype).max
//         this.pixelArrayToCairoContext = {}

//         # Contains the correct method to process a list of Mobjects of the
//         # corresponding class.  If a Mobject is not an instance of a class in
//         # this dict (or an instance of a class that inherits from a class in
//         # this dict), then it cannot be rendered.

//         this.initBackground()
//         this.resizeFrameShape()
//         this.reset()

//     _Deepcopy__(this, memo) {
//         # This is to address a strange bug where deepcopying
//         # will result in a segfault, which is somehow related
//         # to the aggdraw library
//         this.canvas = None
//         return copy.copy(this)

//     @property
//     backgroundColor(this) {
//         return this.BackgroundColor

//     @backgroundColor.setter
//     backgroundColor(this, color) {
//         this.BackgroundColor = color
//         this.initBackground()

//     @property
//     backgroundOpacity(this) {
//         return this.BackgroundOpacity

//     @backgroundOpacity.setter
//     backgroundOpacity(this, alpha) {
//         this.BackgroundOpacity = alpha
//         this.initBackground()

//     typeOrRaise(this, mobject) {
//         """Return the type of mobject, if it is a type that can be rendered.

//         If `mobject` is an instance of a class that inherits from a class that
//         can be rendered, return the super class.  For example, an instance of a
//         Square is also an instance of VMobject, and these can be rendered.
//         Therefore, `typeOrRaise(Square())` returns True.

//         Parameters
//         ----------
//         mobject : :class:`~.Mobject`
//             The object to take the type of.

//         Notes
//         -----
//         For a list of classes that can currently be rendered, see :meth:`displayFuncs`.

//         Returns
//         -------
//         Type[:class:`~.Mobject`]
//             The type of mobjects, if it can be rendered.

//         Raises
//         ------
//         :exc:`TypeError`
//             When mobject is not an instance of a class that can be rendered.
//         """
//         this.displayFuncs = {
//             VMobject: this.displayMultipleVectorizedMobjects,
//             PMobject: this.displayMultiplePointCloudMobjects,
//             AbstractImageMobject: this.displayMultipleImageMobjects,
//             Mobject: lambda batch, pa: batch,  # Do nothing
//         }
//         # We have to check each type in turn because we are dealing with
//         # super classes.  For example, if square = Square(), then
//         # type(square) != VMobject, but isinstance(square, VMobject) == True.
//         for Type in this.displayFuncs:
//             if isinstance(mobject, Type) {
//                 return Type
//         raise TypeError(f"Displaying an object of class {Type} is not supported")

//     resetPixelShape(this, newHeight, newWidth) {
//         """This method resets the height and width
//         of a single pixel to the passed newHeight and newWidth.

//         Parameters
//         ----------
//         newHeight : int, float
//             The new height of the entire scene in pixels
//         newWidth : int, float
//             The new width of the entire scene in pixels
//         """
//         this.pixelWidth = newWidth
//         this.pixelHeight = newHeight
//         this.initBackground()
//         this.resizeFrameShape()
//         this.reset()

//     resizeFrameShape(this, fixedDimension=0) {
//         """
//         Changes frameShape to match the aspect ratio
//         of the pixels, where fixedDimension determines
//         whether frameHeight or frameWidth
//         remains fixed while the other changes accordingly.

//         Parameters
//         ----------
//         fixedDimension : int
//             If 0, height is scaled with respect to width
//             else, width is scaled with respect to height.
//         """
//         pixelHeight = this.pixelHeight
//         pixelWidth = this.pixelWidth
//         frameHeight = this.frameHeight
//         frameWidth = this.frameWidth
//         aspectRatio = pixelWidth / pixelHeight
//         if fixedDimension == 0:
//             frameHeight = frameWidth / aspectRatio
//         else:
//             frameWidth = aspectRatio * frameHeight
//         this.frameHeight = frameHeight
//         this.frameWidth = frameWidth

//     initBackground(this) {
//         """Initialize the background.
//         If this.backgroundImage is the path of an image
//         the image is set as background; else, the default
//         background color fills the background.
//         """
//         height = this.pixelHeight
//         width = this.pixelWidth
//         if this.backgroundImage is not None:
//             path = getFullRasterImagePath(this.backgroundImage)
//             image = Image.open(path).convert(this.imageMode)
//             # TODO, how to gracefully handle backgrounds
//             # with different sizes?
//             this.background = np.array(image)[:height, :width]
//             this.background = this.background.astype(this.pixelArrayDtype)
//         else:
//             backgroundRgba = colorToIntRgba(
//                 this.backgroundColor,
//                 this.backgroundOpacity,
//             )
//             this.background = np.zeros(
//                 (height, width, this.nChannels),
//                 dtype=this.pixelArrayDtype,
//             )
//             this.background[:, :] = backgroundRgba

//     getImage(this, pixelArray=None) {
//         """Returns an image from the passed
//         pixel array, or from the current frame
//         if the passed pixel array is none.

//         Parameters
//         ----------
//         pixelArray : np.array, list, tuple, optional
//             The pixel array from which to get an image, by default None

//         Returns
//         -------
//         PIL.Image
//             The PIL image of the array.
//         """
//         if pixelArray is None:
//             pixelArray = this.pixelArray
//         return Image.fromarray(pixelArray, mode=this.imageMode)

//     convertPixelArray(this, pixelArray, convertFromFloats=False) {
//         """Converts a pixel array from values that have floats in then
//         to proper RGB values.

//         Parameters
//         ----------
//         pixelArray : np.array, list, tuple
//             Pixel array to convert.
//         convertFromFloats : bool, optional
//             Whether or not to convert float values to ints, by default False

//         Returns
//         -------
//         np.array
//             The new, converted pixel array.
//         """
//         retval = np.array(pixelArray)
//         if convertFromFloats:
//             retval = np.applyAlongAxis(
//                 lambda f: (f * this.rgbMaxVal).astype(this.pixelArrayDtype),
//                 2,
//                 retval,
//             )
//         return retval

//     setPixelArray(this, pixelArray, convertFromFloats=False) {
//         """Sets the pixel array of the camera to the passed pixel array.

//         Parameters
//         ----------
//         pixelArray : np.array, list, tuple
//             The pixel array to convert and then set as the camera's pixel array.
//         convertFromFloats : bool, optional
//             Whether or not to convert float values to proper RGB values, by default False
//         """
//         convertedArray = this.convertPixelArray(pixelArray, convertFromFloats)
//         if not (
//             hasattr(this, "pixelArray")
//             and this.pixelArray.shape == convertedArray.shape
//         ) {
//             this.pixelArray = convertedArray
//         else:
//             # Set in place
//             this.pixelArray[:, :, :] = convertedArray[:, :, :]

//     setBackground(this, pixelArray, convertFromFloats=False) {
//         """Sets the background to the passed pixelArray after converting
//         to valid RGB values.

//         Parameters
//         ----------
//         pixelArray : np.array, list, tuple
//             The pixel array to set the background to.
//         convertFromFloats : bool, optional
//             Whether or not to convert floats values to proper RGB valid ones, by default False
//         """
//         this.background = this.convertPixelArray(pixelArray, convertFromFloats)

//     # TODO, this should live in utils, not as a method of Camera
//     makeBackgroundFromFunc(this, coordsToColorsFunc) {
//         """
//         Makes a pixel array for the background by using coordsToColorsFunc to determine each pixel's color. Each input
//         pixel's color. Each input to coordsToColorsFunc is an (x, y) pair in space (in ordinary space coordinates; not
//         pixel coordinates), and each output is expected to be an RGBA array of 4 floats.

//         Parameters
//         ----------
//         coordsToColorsFunc : function
//             The function whose input is an (x,y) pair of coordinates and
//             whose return values must be the colors for that point

//         Returns
//         -------
//         np.array
//             The pixel array which can then be passed to setBackground.
//         """

//         logger.info("Starting setBackground")
//         coords = this.getCoordsOfAllPixels()
//         newBackground = np.applyAlongAxis(coordsToColorsFunc, 2, coords)
//         logger.info("Ending setBackground")

//         return this.convertPixelArray(newBackground, convertFromFloats=True)

//     setBackgroundFromFunc(this, coordsToColorsFunc) {
//         """
//         Sets the background to a pixel array using coordsToColorsFunc to determine each pixel's color. Each input
//         pixel's color. Each input to coordsToColorsFunc is an (x, y) pair in space (in ordinary space coordinates; not
//         pixel coordinates), and each output is expected to be an RGBA array of 4 floats.

//         Parameters
//         ----------
//         coordsToColorsFunc : function
//             The function whose input is an (x,y) pair of coordinates and
//             whose return values must be the colors for that point
//         """
//         this.setBackground(this.makeBackgroundFromFunc(coordsToColorsFunc))

//     reset(this) {
//         """Resets the camera's pixel array
//         to that of the background

//         Returns
//         -------
//         Camera
//             The camera object after setting the pixel array.
//         """ ""
//         this.setPixelArray(this.background)
//         return this

//     setFrameToBackground(this, background) {
//         this.setPixelArray(background)

//     ####

//     getMobjectsToDisplay(
//         this,
//         mobjects,
//         includeSubmobjects=True,
//         excludedMobjects=None,
//     ) {
//         """Used to get the list of mobjects to display
//         with the camera.

//         Parameters
//         ----------
//         mobjects : Mobject
//             The Mobjects
//         includeSubmobjects : bool, optional
//             Whether or not to include the submobjects of mobjects, by default True
//         excludedMobjects : list, optional
//             Any mobjects to exclude, by default None

//         Returns
//         -------
//         list
//             list of mobjects
//         """
//         if includeSubmobjects:
//             mobjects = extractMobjectFamilyMembers(
//                 mobjects,
//                 useZIndex=this.useZIndex,
//                 onlyThoseWithPoints=True,
//             )
//             if excludedMobjects:
//                 allExcluded = extractMobjectFamilyMembers(
//                     excludedMobjects,
//                     useZIndex=this.useZIndex,
//                 )
//                 mobjects = listDifferenceUpdate(mobjects, allExcluded)
//         return mobjects

//     isInFrame(this, mobject) {
//         """Checks whether the passed mobject is in
//         frame or not.

//         Parameters
//         ----------
//         mobject : Mobject
//             The mobject for which the checking needs to be done.

//         Returns
//         -------
//         bool
//             True if in frame, False otherwise.
//         """
//         fc = this.frameCenter
//         fh = this.frameHeight
//         fw = this.frameWidth
//         return not reduce(
//             op.or_,
//             [
//                 mobject.getRight()[0] < fc[0] - fw / 2,
//                 mobject.getBottom()[1] > fc[1] + fh / 2,
//                 mobject.getLeft()[0] > fc[0] + fw / 2,
//                 mobject.getTop()[1] < fc[1] - fh / 2,
//             ],
//         )

//     captureMobject(this, mobject: Mobject, **kwargs: Any) {
//         """Capture mobjects by storing it in :attr:`pixelArray`.

//         This is a single-mobject version of :meth:`captureMobjects`.

//         Parameters
//         ----------
//         mobject
//             Mobject to capture.

//         kwargs
//             Keyword arguments to be passed to :meth:`getMobjectsToDisplay`.

//         """
//         return this.captureMobjects([mobject], **kwargs)

//     captureMobjects(this, mobjects, **kwargs) {
//         """Capture mobjects by printing them on :attr:`pixelArray`.

//         This is the essential function that converts the contents of a Scene
//         into an array, which is then converted to an image or video.

//         Parameters
//         ----------
//         mobjects : :class:`~.Mobject`
//             Mobjects to capture.

//         kwargs : Any
//             Keyword arguments to be passed to :meth:`getMobjectsToDisplay`.

//         Notes
//         -----
//         For a list of classes that can currently be rendered, see :meth:`displayFuncs`.

//         """
//         # The mobjects will be processed in batches (or runs) of mobjects of
//         # the same type.  That is, if the list mobjects contains objects of
//         # types [VMobject, VMobject, VMobject, PMobject, PMobject, VMobject],
//         # then they will be captured in three batches: [VMobject, VMobject,
//         # VMobject], [PMobject, PMobject], and [VMobject].  This must be done
//         # without altering their order.  it.groupby computes exactly this
//         # partition while at the same time preserving order.
//         mobjects = this.getMobjectsToDisplay(mobjects, **kwargs)
//         for groupType, group in it.groupby(mobjects, this.typeOrRaise) {
//             this.displayFuncs[groupType](list(group), this.pixelArray)

//     # Methods associated with svg rendering

//     # NOTE: None of the methods below have been mentioned outside of their definitions. Their DocStrings are not as
//     # detailed as possible.

//     getCachedCairoContext(this, pixelArray) {
//         """Returns the cached cairo context of the passed
//         pixel array if it exists, and None if it doesn't.

//         Parameters
//         ----------
//         pixelArray : np.array
//             The pixel array to check.

//         Returns
//         -------
//         cairo.Context
//             The cached cairo context.
//         """
//         return this.pixelArrayToCairoContext.get(id(pixelArray), None)

//     cacheCairoContext(this, pixelArray, ctx) {
//         """Caches the passed Pixel array into a Cairo Context

//         Parameters
//         ----------
//         pixelArray : np.array
//             The pixel array to cache
//         ctx : cairo.Context
//             The context to cache it into.
//         """
//         this.pixelArrayToCairoContext[id(pixelArray)] = ctx

//     getCairoContext(this, pixelArray) {
//         """Returns the cairo context for a pixel array after
//         caching it to this.pixelArrayToCairoContext
//         If that array has already been cached, it returns the
//         cached version instead.

//         Parameters
//         ----------
//         pixelArray : np.array
//             The Pixel array to get the cairo context of.

//         Returns
//         -------
//         cairo.Context
//             The cairo context of the pixel array.
//         """
//         cachedCtx = this.getCachedCairoContext(pixelArray)
//         if cachedCtx:
//             return cachedCtx
//         pw = this.pixelWidth
//         ph = this.pixelHeight
//         fw = this.frameWidth
//         fh = this.frameHeight
//         fc = this.frameCenter
//         surface = cairo.ImageSurface.createForData(
//             pixelArray,
//             cairo.FORMAT_ARGB32,
//             pw,
//             ph,
//         )
//         ctx = cairo.Context(surface)
//         ctx.scale(pw, ph)
//         ctx.setMatrix(
//             cairo.Matrix(
//                 (pw / fw),
//                 0,
//                 0,
//                 -(ph / fh),
//                 (pw / 2) - fc[0] * (pw / fw),
//                 (ph / 2) + fc[1] * (ph / fh),
//             ),
//         )
//         this.cacheCairoContext(pixelArray, ctx)
//         return ctx

//     displayMultipleVectorizedMobjects(this, vmobjects, pixelArray) {
//         """Displays multiple VMobjects in the pixelArray

//         Parameters
//         ----------
//         vmobjects : list
//             list of VMobjects to display
//         pixelArray : np.array
//             The pixel array
//         """
//         if len(vmobjects) == 0:
//             return
//         batchImagePairs = it.groupby(vmobjects, lambda vm: vm.getBackgroundImage())
//         for image, batch in batchImagePairs:
//             if image:
//                 this.displayMultipleBackgroundColoredVmobjects(batch, pixelArray)
//             else:
//                 this.displayMultipleNonBackgroundColoredVmobjects(
//                     batch,
//                     pixelArray,
//                 )

//     displayMultipleNonBackgroundColoredVmobjects(this, vmobjects, pixelArray) {
//         """Displays multiple VMobjects in the cairo context, as long as they don't have
//         background colors.

//         Parameters
//         ----------
//         vmobjects : list
//             list of the VMobjects
//         pixelArray : np.ndarray
//             The Pixel array to add the VMobjects to.
//         """
//         ctx = this.getCairoContext(pixelArray)
//         for vmobject in vmobjects:
//             this.displayVectorized(vmobject, ctx)

//     displayVectorized(this, vmobject, ctx) {
//         """Displays a VMobject in the cairo context

//         Parameters
//         ----------
//         vmobject : VMobject
//             The Vectorized Mobject to display
//         ctx : cairo.Context
//             The cairo context to use.

//         Returns
//         -------
//         Camera
//             The camera object
//         """
//         this.setCairoContextPath(ctx, vmobject)
//         this.applyStroke(ctx, vmobject, background=True)
//         this.applyFill(ctx, vmobject)
//         this.applyStroke(ctx, vmobject)
//         return this

//     setCairoContextPath(this, ctx, vmobject) {
//         """Sets a path for the cairo context with the vmobject passed

//         Parameters
//         ----------
//         ctx : cairo.Context
//             The cairo context
//         vmobject : VMobject
//             The VMobject

//         Returns
//         -------
//         Camera
//             Camera object after setting cairoContextPath
//         """
//         points = this.transformPointsPreDisplay(vmobject, vmobject.points)
//         # TODO, shouldn't this be handled in transformPointsPreDisplay?
//         # points = points - this.getFrameCenter()
//         if len(points) == 0:
//             return

//         ctx.newPath()
//         subpaths = vmobject.genSubpathsFromPoints_2d(points)
//         for subpath in subpaths:
//             quads = vmobject.genCubicBezierTuplesFromPoints(subpath)
//             ctx.newSubPath()
//             start = subpath[0]
//             ctx.moveTo(*start[:2])
//             for P0, p1, p2, p3 in quads:
//                 ctx.curveTo(*p1[:2], *p2[:2], *p3[:2])
//             if vmobject.considerPointsEquals_2d(subpath[0], subpath[-1]) {
//                 ctx.closePath()
//         return this

//     setCairoContextColor(this, ctx, rgbas, vmobject) {
//         """Sets the color of the cairo context

//         Parameters
//         ----------
//         ctx : cairo.Context
//             The cairo context
//         rgbas : np.ndarray
//             The RGBA array with which to color the context.
//         vmobject : VMobject
//             The VMobject with which to set the color.

//         Returns
//         -------
//         Camera
//             The camera object
//         """
//         if len(rgbas) == 1:
//             # Use reversed rgb because cairo surface is
//             # encodes it in reverse order
//             ctx.setSourceRgba(*rgbas[0][2::-1], rgbas[0][3])
//         else:
//             points = vmobject.getGradientStartAndEndPoints()
//             points = this.transformPointsPreDisplay(vmobject, points)
//             pat = cairo.LinearGradient(*it.chain(*(point[:2] for point in points)))
//             step = 1.0 / (len(rgbas) - 1)
//             offsets = np.arange(0, 1 + step, step)
//             for rgba, offset in zip(rgbas, offsets) {
//                 pat.addColorStopRgba(offset, *rgba[2::-1], rgba[3])
//             ctx.setSource(pat)
//         return this

//     applyFill(this, ctx, vmobject) {
//         """Fills the cairo context

//         Parameters
//         ----------
//         ctx : cairo.Context
//             The cairo context
//         vmobject : VMobject
//             The VMobject

//         Returns
//         -------
//         Camera
//             The camera object.
//         """
//         this.setCairoContextColor(ctx, this.getFillRgbas(vmobject), vmobject)
//         ctx.fillPreserve()
//         return this

//     applyStroke(this, ctx, vmobject, background=False) {
//         """Applies a stroke to the VMobject in the cairo context.

//         Parameters
//         ----------
//         ctx : cairo.Context
//             The cairo context
//         vmobject : VMobject
//             The VMobject
//         background : bool, optional
//             Whether or not to consider the background when applying this
//             stroke width, by default False

//         Returns
//         -------
//         Camera
//             The camera object with the stroke applied.
//         """
//         width = vmobject.getStrokeWidth(background)
//         if width == 0:
//             return this
//         this.setCairoContextColor(
//             ctx,
//             this.getStrokeRgbas(vmobject, background=background),
//             vmobject,
//         )
//         ctx.setLineWidth(
//             width
//             * this.cairoLineWidthMultiple
//             # This ensures lines have constant width as you zoom in on them.
//             * (this.frameWidth / this.frameWidth),
//         )
//         ctx.strokePreserve()
//         return this

//     getStrokeRgbas(this, vmobject, background=False) {
//         """Gets the RGBA array for the stroke of the passed
//         VMobject.

//         Parameters
//         ----------
//         vmobject : VMobject
//             The VMobject
//         background : bool, optional
//             Whether or not to consider the background when getting the stroke
//             RGBAs, by default False

//         Returns
//         -------
//         np.ndarray
//             The RGBA array of the stroke.
//         """
//         return vmobject.getStrokeRgbas(background)

//     getFillRgbas(this, vmobject) {
//         """Returns the RGBA array of the fill of the passed VMobject

//         Parameters
//         ----------
//         vmobject : VMobject
//             The VMobject

//         Returns
//         -------
//         np.array
//             The RGBA Array of the fill of the VMobject
//         """
//         return vmobject.getFillRgbas()

//     getBackgroundColoredVmobjectDisplayer(this) {
//         """Returns the backgroundColoredVmobjectDisplayer
//         if it exists or makes one and returns it if not.

//         Returns
//         -------
//         BackGroundColoredVMobjectDisplayer
//             Object that displays VMobjects that have the same color
//             as the background.
//         """
//         # Quite wordy to type out a bunch
//         bcvd = "backgroundColoredVmobjectDisplayer"
//         if not hasattr(this, bcvd) {
//             setattr(this, bcvd, BackgroundColoredVMobjectDisplayer(this))
//         return getattr(this, bcvd)

//     displayMultipleBackgroundColoredVmobjects(this, cvmobjects, pixelArray) {
//         """Displays multiple vmobjects that have the same color as the background.

//         Parameters
//         ----------
//         cvmobjects : list
//             List of Colored VMobjects
//         pixelArray : np.array
//             The pixel array.

//         Returns
//         -------
//         Camera
//             The camera object.
//         """
//         displayer = this.getBackgroundColoredVmobjectDisplayer()
//         cvmobjectPixelArray = displayer.display(*cvmobjects)
//         this.overlayRgbaArray(pixelArray, cvmobjectPixelArray)
//         return this

//     # Methods for other rendering

//     # NOTE: Out of the following methods, only `transformPointsPreDisplay` and `pointsToPixelCoords` have been mentioned outside of their definitions.
//     # As a result, the other methods do not have as detailed docstrings as would be preferred.

//     displayMultiplePointCloudMobjects(this, pmobjects, pixelArray) {
//         """Displays multiple PMobjects by modifying the passed pixel array.

//         Parameters
//         ----------
//         pmobjects : list
//             List of PMobjects
//         pixelArray : np.array
//             The pixel array to modify.
//         """
//         for pmobject in pmobjects:
//             this.displayPointCloud(
//                 pmobject,
//                 pmobject.points,
//                 pmobject.rgbas,
//                 this.adjustedThickness(pmobject.strokeWidth),
//                 pixelArray,
//             )

//     displayPointCloud(this, pmobject, points, rgbas, thickness, pixelArray) {
//         """Displays a PMobject by modifying the Pixel array suitably..
//         TODO: Write a description for the rgbas argument.
//         Parameters
//         ----------
//         pmobject : PMobject
//             Point Cloud Mobject
//         points : list
//             The points to display in the point cloud mobject
//         rgbas : np.array

//         thickness : int, float
//             The thickness of each point of the PMobject
//         pixelArray : np.array
//             The pixel array to modify.

//         """
//         if len(points) == 0:
//             return
//         pixelCoords = this.pointsToPixelCoords(pmobject, points)
//         pixelCoords = this.thickenedCoordinates(pixelCoords, thickness)
//         rgbaLen = pixelArray.shape[2]

//         rgbas = (this.rgbMaxVal * rgbas).astype(this.pixelArrayDtype)
//         targetLen = len(pixelCoords)
//         factor = targetLen // len(rgbas)
//         rgbas = np.array([rgbas] * factor).reshape((targetLen, rgbaLen))

//         onScreenIndices = this.onScreenPixels(pixelCoords)
//         pixelCoords = pixelCoords[onScreenIndices]
//         rgbas = rgbas[onScreenIndices]

//         ph = this.pixelHeight
//         pw = this.pixelWidth

//         flattener = np.array([1, pw], dtype="int")
//         flattener = flattener.reshape((2, 1))
//         indices = np.dot(pixelCoords, flattener)[:, 0]
//         indices = indices.astype("int")

//         newPa = pixelArray.reshape((ph * pw, rgbaLen))
//         newPa[indices] = rgbas
//         pixelArray[:, :] = newPa.reshape((ph, pw, rgbaLen))

//     displayMultipleImageMobjects(this, imageMobjects, pixelArray) {
//         """Displays multiple image mobjects by modifying the passed pixelArray.

//         Parameters
//         ----------
//         imageMobjects : list
//             list of ImageMobjects
//         pixelArray : np.array
//             The pixel array to modify.
//         """
//         for imageMobject in imageMobjects:
//             this.displayImageMobject(imageMobject, pixelArray)

//     displayImageMobject(this, imageMobject: AbstractImageMobject, pixelArray) {
//         """Displays an ImageMobject by changing the pixelArray suitably.

//         Parameters
//         ----------
//         imageMobject : ImageMobject
//             The imageMobject to display
//         pixelArray : np.ndarray
//             The Pixel array to put the imagemobject in.
//         """
//         cornerCoords = this.pointsToPixelCoords(imageMobject, imageMobject.points)
//         ulCoords, urCoords, dlCoords = cornerCoords
//         rightVect = urCoords - ulCoords
//         downVect = dlCoords - ulCoords
//         centerCoords = ulCoords + (rightVect + downVect) / 2

//         subImage = Image.fromarray(imageMobject.getPixelArray(), mode="RGBA")

//         # Reshape
//         pixelWidth = max(int(pdist([ulCoords, urCoords])), 1)
//         pixelHeight = max(int(pdist([ulCoords, dlCoords])), 1)
//         subImage = subImage.resize(
//             (pixelWidth, pixelHeight),
//             resample=imageMobject.resamplingAlgorithm,
//         )

//         # Rotate
//         angle = angleOfVector(rightVect)
//         adjustedAngle = -int(360 * angle / TWOPI)
//         if adjustedAngle != 0:
//             subImage = subImage.rotate(
//                 adjustedAngle,
//                 resample=imageMobject.resamplingAlgorithm,
//                 expand=1,
//             )

//         # TODO, there is no accounting for a shear...

//         # Paste into an image as large as the camera's pixel array
//         fullImage = Image.fromarray(
//             np.zeros((this.pixelHeight, this.pixelWidth)),
//             mode="RGBA",
//         )
//         newUlCoords = centerCoords - np.array(subImage.size) / 2
//         newUlCoords = newUlCoords.astype(int)
//         fullImage.paste(
//             subImage,
//             box=(
//                 newUlCoords[0],
//                 newUlCoords[1],
//                 newUlCoords[0] + subImage.size[0],
//                 newUlCoords[1] + subImage.size[1],
//             ),
//         )
//         # Paint on top of existing pixel array
//         this.overlay_PILImage(pixelArray, fullImage)

//     overlayRgbaArray(this, pixelArray, newArray) {
//         """Overlays an RGBA array on top of the given Pixel array.

//         Parameters
//         ----------
//         pixelArray : np.array
//             The original pixel array to modify.
//         newArray : np.array
//             The new pixel array to overlay.
//         """
//         this.overlay_PILImage(pixelArray, this.getImage(newArray))

//     overlay_PILImage(this, pixelArray, image) {
//         """Overlays a PIL image on the passed pixel array.

//         Parameters
//         ----------
//         pixelArray : np.ndarray
//             The Pixel array
//         image : PIL.Image
//             The Image to overlay.
//         """
//         pixelArray[:, :] = np.array(
//             Image.alphaComposite(this.getImage(pixelArray), image),
//             dtype="uint8",
//         )

//     adjustOutOfRangePoints(this, points) {
//         """If any of the points in the passed array are out of
//         the viable range, they are adjusted suitably.

//         Parameters
//         ----------
//         points : np.array
//             The points to adjust

//         Returns
//         -------
//         np.array
//             The adjusted points.
//         """
//         if not np.any(points > this.maxAllowableNorm) {
//             return points
//         norms = np.applyAlongAxis(np.linalg.norm, 1, points)
//         violatorIndices = norms > this.maxAllowableNorm
//         violators = points[violatorIndices, :]
//         violatorNorms = norms[violatorIndices]
//         reshapedNorms = np.repeat(
//             violatorNorms.reshape((len(violatorNorms), 1)),
//             points.shape[1],
//             1,
//         )
//         rescaled = this.maxAllowableNorm * violators / reshapedNorms
//         points[violatorIndices] = rescaled
//         return points

//     transformPointsPreDisplay(
//         this,
//         mobject,
//         points,
//     ):  # TODO: Write more detailed docstrings for this method.
//         # NOTE: There seems to be an unused argument `mobject`.

//         # Subclasses (like ThreeDCamera) may want to
//         # adjust points further before they're shown
//         if not np.all(np.isfinite(points)) {
//             # TODO, print some kind of warning about
//             # mobject having invalid points?
//             points = np.zeros((1, 3))
//         return points

//     pointsToPixelCoords(
//         this,
//         mobject,
//         points,
//     ):  # TODO: Write more detailed docstrings for this method.
//         points = this.transformPointsPreDisplay(mobject, points)
//         shiftedPoints = points - this.frameCenter

//         result = np.zeros((len(points), 2))
//         pixelHeight = this.pixelHeight
//         pixelWidth = this.pixelWidth
//         frameHeight = this.frameHeight
//         frameWidth = this.frameWidth
//         widthMult = pixelWidth / frameWidth
//         widthAdd = pixelWidth / 2
//         heightMult = pixelHeight / frameHeight
//         heightAdd = pixelHeight / 2
//         # Flip on y-axis as you go
//         heightMult *= -1

//         result[:, 0] = shiftedPoints[:, 0] * widthMult + widthAdd
//         result[:, 1] = shiftedPoints[:, 1] * heightMult + heightAdd
//         return result.astype("int")

//     onScreenPixels(this, pixelCoords) {
//         """Returns array of pixels that are on the screen from a given
//         array of pixelCoordinates

//         Parameters
//         ----------
//         pixelCoords : np.array
//             The pixel coords to check.

//         Returns
//         -------
//         np.array
//             The pixel coords on screen.
//         """
//         return reduce(
//             op.and_,
//             [
//                 pixelCoords[:, 0] >= 0,
//                 pixelCoords[:, 0] < this.pixelWidth,
//                 pixelCoords[:, 1] >= 0,
//                 pixelCoords[:, 1] < this.pixelHeight,
//             ],
//         )

//     adjustedThickness(this, thickness) {
//         """

//         Parameters
//         ----------
//         thickness : int, float

//         Returns
//         -------
//         float

//         """
//         # TODO: This seems...unsystematic
//         bigSum = op.add(config["pixelHeight"], config["pixelWidth"])
//         thisSum = op.add(this.pixelHeight, this.pixelWidth)
//         factor = bigSum / thisSum
//         return 1 + (thickness - 1) * factor

//     getThickeningNudges(this, thickness) {
//         """

//         Parameters
//         ----------
//         thickness : int, float

//         Returns
//         -------
//         np.array

//         """
//         thickness = int(thickness)
//         Range = list(range(-thickness // 2 + 1, thickness // 2 + 1))
//         return np.array(list(it.product(Range, Range)))

//     thickenedCoordinates(this, pixelCoords, thickness) {
//         """Returns thickened coordinates for a passed array of pixel coords and
//         a thickness to thicken by.

//         Parameters
//         ----------
//         pixelCoords : np.array
//             Pixel coordinates
//         thickness : int, float
//             Thickness

//         Returns
//         -------
//         np.array
//             Array of thickened pixel coords.
//         """
//         nudges = this.getThickeningNudges(thickness)
//         pixelCoords = np.array([pixelCoords + nudge for nudge in nudges])
//         size = pixelCoords.size
//         return pixelCoords.reshape((size // 2, 2))

//     # TODO, reimplement using cairo matrix
//     getCoordsOfAllPixels(this) {
//         """Returns the cartesian coordinates of each pixel.

//         Returns
//         -------
//         np.ndarray
//             The array of cartesian coordinates.
//         """
//         # These are in x, y order, to help me keep things straight
//         fullSpaceDims = np.array([this.frameWidth, this.frameHeight])
//         fullPixelDims = np.array([this.pixelWidth, this.pixelHeight])

//         # These are addressed in the same y, x order as in pixelArray, but the values in them
//         # are listed in x, y order
//         uncenteredPixelCoords = np.indices([this.pixelHeight, this.pixelWidth])[
//             ::-1
//         ].transpose(1, 2, 0)
//         uncenteredSpaceCoords = (
//             uncenteredPixelCoords * fullSpaceDims
//         ) / fullPixelDims
//         # Could structure above line's computation slightly differently, but figured (without much
//         # thought) multiplying by frameShape first, THEN dividing by pixelShape, is probably
//         # better than the other order, for avoiding underflow quantization in the division (whereas
//         # overflow is unlikely to be a problem)

//         centeredSpaceCoords = uncenteredSpaceCoords - (fullSpaceDims / 2)

//         # Have to also flip the y coordinates to account for pixel array being listed in
//         # top-to-bottom order, opposite of screen coordinate convention
//         centeredSpaceCoords = centeredSpaceCoords * (1, -1)

//         return centeredSpaceCoords


// # NOTE: The methods of the following class have not been mentioned outside of their definitions.
// # Their DocStrings are not as detailed as preferred.
// class BackgroundColoredVMobjectDisplayer:
//     _Init__(this, camera) {
//         """
//         Parameters
//         ----------
//         camera : Camera
//             Camera object to use.
//         """
//         this.camera = camera
//         this.fileNameToPixelArrayMap = {}
//         this.pixelArray = np.array(camera.pixelArray)
//         this.resetPixelArray()

//     resetPixelArray(this) {
//         this.pixelArray[:, :] = 0

//     resizeBackgroundArray(
//         this,
//         backgroundArray,
//         newWidth,
//         newHeight,
//         mode="RGBA",
//     ) {
//         """Resizes the pixel array representing the background.

//         Parameters
//         ----------
//         backgroundArray : np.array
//             The pixel
//         newWidth : int, float
//             The new width of the background
//         newHeight : int, float
//             The new height of the background
//         mode : str, optional
//             The PIL image mode, by default "RGBA"

//         Returns
//         -------
//         np.array
//             The numpy pixel array of the resized background.
//         """
//         image = Image.fromarray(backgroundArray)
//         image = image.convert(mode)
//         resizedImage = image.resize((newWidth, newHeight))
//         return np.array(resizedImage)

//     resizeBackgroundArrayToMatch(this, backgroundArray, pixelArray) {
//         """Resizes the background array to match the passed pixel array.

//         Parameters
//         ----------
//         backgroundArray : np.array
//             The prospective pixel array.
//         pixelArray : np.array
//             The pixel array whose width and height should be matched.

//         Returns
//         -------
//         np.array
//             The resized background array.
//         """
//         height, width = pixelArray.shape[:2]
//         mode = "RGBA" if pixelArray.shape[2] == 4 else "RGB"
//         return this.resizeBackgroundArray(backgroundArray, width, height, mode)

//     getBackgroundArray(this, image: Image.Image | pathlib.Path | str) {
//         """Gets the background array that has the passed fileName.

//         Parameters
//         ----------
//         image
//             The background image or its file name.

//         Returns
//         -------
//         np.ndarray
//             The pixel array of the image.
//         """
//         imageKey = str(image)

//         if imageKey in this.fileNameToPixelArrayMap:
//             return this.fileNameToPixelArrayMap[imageKey]
//         if isinstance(image, str) {
//             fullPath = getFullRasterImagePath(image)
//             image = Image.open(fullPath)
//         backArray = np.array(image)

//         pixelArray = this.pixelArray
//         if not np.all(pixelArray.shape == backArray.shape) {
//             backArray = this.resizeBackgroundArrayToMatch(backArray, pixelArray)

//         this.fileNameToPixelArrayMap[imageKey] = backArray
//         return backArray

//     display(this, *cvmobjects) {
//         """Displays the colored VMobjects.

//         Parameters
//         ----------
//         *cvmobjects : VMobject
//             The VMobjects

//         Returns
//         -------
//         np.array
//             The pixel array with the `cvmobjects` displayed.
//         """
//         batchImagePairs = it.groupby(cvmobjects, lambda cv: cv.getBackgroundImage())
//         currArray = None
//         for image, batch in batchImagePairs:
//             backgroundArray = this.getBackgroundArray(image)
//             pixelArray = this.pixelArray
//             this.camera.displayMultipleNonBackgroundColoredVmobjects(
//                 batch,
//                 pixelArray,
//             )
//             newArray = np.array(
//                 (backgroundArray * pixelArray.astype("float") / 255),
//                 dtype=this.camera.pixelArrayDtype,
//             )
//             if currArray is None:
//                 currArray = newArray
//             else:
//                 currArray = np.maximum(currArray, newArray)
//             this.resetPixelArray()
//         return currArray
