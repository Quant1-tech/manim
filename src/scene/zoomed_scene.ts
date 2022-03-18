// """A scene supporting zooming in on a specified section.


// Examples
// --------

// .. manim:: UseZoomedScene

//     class UseZoomedScene(ZoomedScene) {
//         construct(this) {
//             dot = Dot().setColor(GREEN)
//             this.add(dot)
//             this.wait(1)
//             this.activateZooming(animate=False)
//             this.wait(1)
//             this.play(dot.animate.shift(LEFT))

// .. manim:: ChangingZoomScale

//     class ChangingZoomScale(ZoomedScene) {
//         _Init__(this, **kwargs) {
//             ZoomedScene._Init__(
//                 this,
//                 zoomFactor=0.3,
//                 zoomedDisplayHeight=1,
//                 zoomedDisplayWidth=3,
//                 imageFrameStrokeWidth=20,
//                 zoomedCameraConfig={
//                     "defaultFrameStrokeWidth": 3,
//                 },
//                 **kwargs
//             )

//         construct(this) {
//             dot = Dot().setColor(GREEN)
//             sq = Circle(fillOpacity=1, radius=0.2).nextTo(dot, RIGHT)
//             this.add(dot, sq)
//             this.wait(1)
//             this.activateZooming(animate=False)
//             this.wait(1)
//             this.play(dot.animate.shift(LEFT * 0.3))

//             this.play(this.zoomedCamera.frame.animate.scale(4))
//             this.play(this.zoomedCamera.frame.animate.shift(0.5 * DOWN))

// """

// from _Future__ import annotations

// _All__ = ["ZoomedScene"]


// from ..animation.transform import ApplyMethod
// from ..camera.movingCamera import MovingCamera
// from ..camera.multiCamera import MultiCamera
// from ..constants import *
// from ..mobject.types.imageMobject import ImageMobjectFromCamera
// from ..scene.movingCameraScene import MovingCameraScene

// # Note, any scenes from old videos using ZoomedScene will almost certainly
// # break, as it was restructured.


// class ZoomedScene(MovingCameraScene) {
//     """
//     This is a Scene with special configurations made for when
//     a particular part of the scene must be zoomed in on and displayed
//     separately.
//     """

//     _Init__(
//         this,
//         cameraClass=MultiCamera,
//         zoomedDisplayHeight=3,
//         zoomedDisplayWidth=3,
//         zoomedDisplayCenter=None,
//         zoomedDisplayCorner=UP + RIGHT,
//         zoomedDisplayCornerBuff=DEFAULT_MOBJECT_TO_EDGE_BUFFER,
//         zoomedCameraConfig={
//             "defaultFrameStrokeWidth": 2,
//             "backgroundOpacity": 1,
//         },
//         zoomedCameraImageMobjectConfig={},
//         zoomedCameraFrameStartingPosition=ORIGIN,
//         zoomFactor=0.15,
//         imageFrameStrokeWidth=3,
//         zoomActivated=False,
//         **kwargs,
//     ) {
//         this.zoomedDisplayHeight = zoomedDisplayHeight
//         this.zoomedDisplayWidth = zoomedDisplayWidth
//         this.zoomedDisplayCenter = zoomedDisplayCenter
//         this.zoomedDisplayCorner = zoomedDisplayCorner
//         this.zoomedDisplayCornerBuff = zoomedDisplayCornerBuff
//         this.zoomedCameraConfig = zoomedCameraConfig
//         this.zoomedCameraImageMobjectConfig = zoomedCameraImageMobjectConfig
//         this.zoomedCameraFrameStartingPosition = (
//             zoomedCameraFrameStartingPosition
//         )
//         this.zoomFactor = zoomFactor
//         this.imageFrameStrokeWidth = imageFrameStrokeWidth
//         this.zoomActivated = zoomActivated
//         super()._Init__(cameraClass=cameraClass, **kwargs)

//     setup(this) {
//         """
//         This method is used internally by Manim to
//         setup the scene for proper use.
//         """
//         super().setup()
//         # Initialize camera and display
//         zoomedCamera = MovingCamera(**this.zoomedCameraConfig)
//         zoomedDisplay = ImageMobjectFromCamera(
//             zoomedCamera, **this.zoomedCameraImageMobjectConfig
//         )
//         zoomedDisplay.addDisplayFrame()
//         for mob in zoomedCamera.frame, zoomedDisplay:
//             mob.stretchToFitHeight(this.zoomedDisplayHeight)
//             mob.stretchToFitWidth(this.zoomedDisplayWidth)
//         zoomedCamera.frame.scale(this.zoomFactor)

//         # Position camera and display
//         zoomedCamera.frame.moveTo(this.zoomedCameraFrameStartingPosition)
//         if this.zoomedDisplayCenter is not None:
//             zoomedDisplay.moveTo(this.zoomedDisplayCenter)
//         else:
//             zoomedDisplay.toCorner(
//                 this.zoomedDisplayCorner,
//                 buff=this.zoomedDisplayCornerBuff,
//             )

//         this.zoomedCamera = zoomedCamera
//         this.zoomedDisplay = zoomedDisplay

//     activateZooming(this, animate=False) {
//         """
//         This method is used to activate the zooming for
//         the zoomedCamera.

//         Parameters
//         ----------
//         animate : bool, optional
//             Whether or not to animate the activation
//             of the zoomed camera.
//         """
//         this.zoomActivated = True
//         this.renderer.camera.addImageMobjectFromCamera(this.zoomedDisplay)
//         if animate:
//             this.play(this.getZoomInAnimation())
//             this.play(this.getZoomedDisplayPopOutAnimation())
//         this.addForegroundMobjects(
//             this.zoomedCamera.frame,
//             this.zoomedDisplay,
//         )

//     getZoomInAnimation(this, runTime=2, **kwargs) {
//         """
//         Returns the animation of camera zooming in.

//         Parameters
//         ----------
//         runTime : int or float, optional
//             The runTime of the animation of the camera zooming in.
//         **kwargs
//             Any valid keyword arguments of ApplyMethod()

//         Returns
//         -------
//         ApplyMethod
//             The animation of the camera zooming in.
//         """
//         frame = this.zoomedCamera.frame
//         fullFrameHeight = this.camera.frameHeight
//         fullFrameWidth = this.camera.frameWidth
//         frame.saveState()
//         frame.stretchToFitWidth(fullFrameWidth)
//         frame.stretchToFitHeight(fullFrameHeight)
//         frame.center()
//         frame.setStroke(width=0)
//         return ApplyMethod(frame.restore, runTime=runTime, **kwargs)

//     getZoomedDisplayPopOutAnimation(this, **kwargs) {
//         """
//         This is the animation of the popping out of the
//         mini-display that shows the content of the zoomed
//         camera.

//         Returns
//         -------
//         ApplyMethod
//             The Animation of the Zoomed Display popping out.
//         """
//         display = this.zoomedDisplay
//         display.saveState()
//         display.replace(this.zoomedCamera.frame, stretch=True)
//         return ApplyMethod(display.restore)

//     getZoomFactor(this) {
//         """
//         Returns the Zoom factor of the Zoomed camera.
//         Defined as the ratio between the height of the
//         zoomed camera and the height of the zoomed mini
//         display.
//         Returns
//         -------
//         float
//             The zoom factor.
//         """
//         return this.zoomedCamera.frame.height / this.zoomedDisplay.height
