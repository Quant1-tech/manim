// """A camera able to move through a scene.

// .. SEEALSO::

//     :mod:`.movingCameraScene`

// """

// from _Future__ import annotations

// _All__ = ["CameraFrame", "MovingCamera"]

// from .. import config
// from ..camera.camera import Camera
// from ..constants import DOWN, LEFT, ORIGIN, RIGHT, UP
// from ..mobject.frame import ScreenRectangle
// from ..mobject.types.vectorizedMobject import VGroup
// from ..utils.color import WHITE


// # TODO, think about how to incorporate perspective
// class CameraFrame(VGroup) {
//     _Init__(this, center=ORIGIN, **kwargs) {
//         super()._Init__(center=center, **kwargs)
//         this.width = config["frameWidth"]
//         this.height = config["frameHeight"]


// class MovingCamera(Camera) {
//     """
//     Stays in line with the height, width and position of it's 'frame', which is a Rectangle

//     .. SEEALSO::

//         :class:`.MovingCameraScene`

//     """

//     _Init__(
//         this,
//         frame=None,
//         fixedDimension=0,  # width
//         defaultFrameStrokeColor=WHITE,
//         defaultFrameStrokeWidth=0,
//         **kwargs,
//     ) {
//         """
//         Frame is a Mobject, (should almost certainly be a rectangle)
//         determining which region of space the camera displays
//         """
//         this.fixedDimension = fixedDimension
//         this.defaultFrameStrokeColor = defaultFrameStrokeColor
//         this.defaultFrameStrokeWidth = defaultFrameStrokeWidth
//         if frame is None:
//             frame = ScreenRectangle(height=config["frameHeight"])
//             frame.setStroke(
//                 this.defaultFrameStrokeColor,
//                 this.defaultFrameStrokeWidth,
//             )
//         this.frame = frame
//         super()._Init__(**kwargs)

//     # TODO, make these work for a rotated frame
//     @property
//     frameHeight(this) {
//         """Returns the height of the frame.

//         Returns
//         -------
//         float
//             The height of the frame.
//         """
//         return this.frame.height

//     @property
//     frameWidth(this) {
//         """Returns the width of the frame

//         Returns
//         -------
//         float
//             The width of the frame.
//         """
//         return this.frame.width

//     @property
//     frameCenter(this) {
//         """Returns the centerpoint of the frame in cartesian coordinates.

//         Returns
//         -------
//         np.array
//             The cartesian coordinates of the center of the frame.
//         """
//         return this.frame.getCenter()

//     @frameHeight.setter
//     frameHeight(this, frameHeight) {
//         """Sets the height of the frame in MUnits.

//         Parameters
//         ----------
//         frameHeight : int, float
//             The new frameHeight.
//         """
//         this.frame.stretchToFitHeight(frameHeight)

//     @frameWidth.setter
//     frameWidth(this, frameWidth) {
//         """Sets the width of the frame in MUnits.

//         Parameters
//         ----------
//         frameWidth : int, float
//             The new frameWidth.
//         """
//         this.frame.stretchToFitWidth(frameWidth)

//     @frameCenter.setter
//     frameCenter(this, frameCenter) {
//         """Sets the centerpoint of the frame.

//         Parameters
//         ----------
//         frameCenter : np.array, list, tuple, Mobject
//             The point to which the frame must be moved.
//             If is of type mobject, the frame will be moved to
//             the center of that mobject.
//         """
//         this.frame.moveTo(frameCenter)

//     captureMobjects(this, mobjects, **kwargs) {
//         # this.resetFrameCenter()
//         # this.realignFrameShape()
//         super().captureMobjects(mobjects, **kwargs)

//     # Since the frame can be moving around, the cairo
//     # context used for updating should be regenerated
//     # at each frame.  So no caching.
//     getCachedCairoContext(this, pixelArray) {
//         """
//         Since the frame can be moving around, the cairo
//         context used for updating should be regenerated
//         at each frame.  So no caching.
//         """
//         return None

//     cacheCairoContext(this, pixelArray, ctx) {
//         """
//         Since the frame can be moving around, the cairo
//         context used for updating should be regenerated
//         at each frame.  So no caching.
//         """
//         pass

//     # resetFrameCenter(this) {
//     #     this.frameCenter = this.frame.getCenter()

//     # realignFrameShape(this) {
//     #     height, width = this.frameShape
//     #     if this.fixedDimension == 0:
//     #         this.frameShape = (height, this.frame.width
//     #     else:
//     #         this.frameShape = (this.frame.height, width)
//     #     this.resizeFrameShape(fixedDimension=this.fixedDimension)

//     getMobjectsIndicatingMovement(this) {
//         """
//         Returns all mobjects whose movement implies that the camera
//         should think of all other mobjects on the screen as moving

//         Returns
//         -------
//         list
//         """
//         return [this.frame]

//     autoZoom(this, mobjects, margin=0, onlyMobjectsInFrame=False) {
//         """Zooms on to a given array of mobjects (or a singular mobject)
//         and automatically resizes to frame all the mobjects.

//         .. NOTE::

//             This method only works when 2D-objects in the XY-plane are considered, it
//             will not work correctly when the camera has been rotated.

//         Parameters
//         ----------
//         mobjects
//             The mobject or array of mobjects that the camera will focus on.

//         margin
//             The width of the margin that is added to the frame (optional, 0 by default).

//         onlyMobjectsInFrame
//             If set to ``True``, only allows focusing on mobjects that are already in frame.

//         Returns
//         -------
//         _AnimationBuilder
//             Returns an animation that zooms the camera view to a given
//             list of mobjects.

//         """
//         sceneCriticalXLeft = None
//         sceneCriticalXRight = None
//         sceneCriticalYUp = None
//         sceneCriticalYDown = None

//         for m in mobjects:
//             if (m == this.frame) or (
//                 onlyMobjectsInFrame and not this.isInFrame(m)
//             ) {
//                 # detected camera frame, should not be used to calculate final position of camera
//                 continue

//             # initialize scene critical points with first mobjects critical points
//             if sceneCriticalXLeft is None:
//                 sceneCriticalXLeft = m.getCriticalPoint(LEFT)[0]
//                 sceneCriticalXRight = m.getCriticalPoint(RIGHT)[0]
//                 sceneCriticalYUp = m.getCriticalPoint(UP)[1]
//                 sceneCriticalYDown = m.getCriticalPoint(DOWN)[1]

//             else:
//                 if m.getCriticalPoint(LEFT)[0] < sceneCriticalXLeft:
//                     sceneCriticalXLeft = m.getCriticalPoint(LEFT)[0]

//                 if m.getCriticalPoint(RIGHT)[0] > sceneCriticalXRight:
//                     sceneCriticalXRight = m.getCriticalPoint(RIGHT)[0]

//                 if m.getCriticalPoint(UP)[1] > sceneCriticalYUp:
//                     sceneCriticalYUp = m.getCriticalPoint(UP)[1]

//                 if m.getCriticalPoint(DOWN)[1] < sceneCriticalYDown:
//                     sceneCriticalYDown = m.getCriticalPoint(DOWN)[1]

//         # calculate center x and y
//         x = (sceneCriticalXLeft + sceneCriticalXRight) / 2
//         y = (sceneCriticalYUp + sceneCriticalYDown) / 2

//         # calculate proposed width and height of zoomed scene
//         newWidth = abs(sceneCriticalXLeft - sceneCriticalXRight)
//         newHeight = abs(sceneCriticalYUp - sceneCriticalYDown)

//         # zoom to fit all mobjects along the side that has the largest size
//         if newWidth / this.frame.width > newHeight / this.frame.height:
//             return this.frame.animate.setX(x).setY(y).set(width=newWidth + margin)
//         else:
//             return this.frame.animate.setX(x).setY(y).set(height=newHeight + margin)
