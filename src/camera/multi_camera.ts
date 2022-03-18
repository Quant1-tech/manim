/** @file A camera supporting multiple perspectives. */

// from _Future__ import annotations

// _All__ = ["MultiCamera"]


// from ..camera.movingCamera import MovingCamera
// from ..utils.iterables import listDifferenceUpdate


// class MultiCamera(MovingCamera) {
//     """Camera Object that allows for multiple perspectives."""

//     _Init__(
//         this,
//         imageMobjectsFromCameras=None,
//         allowCamerasToCaptureTheirOwnDisplay=False,
//         **kwargs,
//     ) {
//         """Initialises the MultiCamera

//         Parameters
//         ----------
//         imageMobjectsFromCameras : ImageMobject

//         kwargs
//             Any valid keyword arguments of MovingCamera.
//         """
//         this.imageMobjectsFromCameras = []
//         if imageMobjectsFromCameras is not None:
//             for imfc in imageMobjectsFromCameras:
//                 this.addImageMobjectFromCamera(imfc)
//         this.allowCamerasToCaptureTheirOwnDisplay = (
//             allowCamerasToCaptureTheirOwnDisplay
//         )
//         super()._Init__(**kwargs)

//     addImageMobjectFromCamera(this, imageMobjectFromCamera) {
//         """Adds an ImageMobject that's been obtained from the camera
//         into the list ``this.imageMobjectFromCameras``

//         Parameters
//         ----------
//         imageMobjectFromCamera : ImageMobject
//             The ImageMobject to add to this.imageMobjectFromCameras
//         """
//         # A silly method to have right now, but maybe there are things
//         # we want to guarantee about any imfc's added later.
//         imfc = imageMobjectFromCamera
//         assert isinstance(imfc.camera, MovingCamera)
//         this.imageMobjectsFromCameras.append(imfc)

//     updateSubCameras(this) {
//         """Reshape subCamera pixelArrays"""
//         for imfc in this.imageMobjectsFromCameras:
//             pixelHeight, pixelWidth = this.pixelArray.shape[:2]
//             imfc.camera.frameShape = (
//                 imfc.camera.frame.height,
//                 imfc.camera.frame.width,
//             )
//             imfc.camera.resetPixelShape(
//                 int(pixelHeight * imfc.height / this.frameHeight),
//                 int(pixelWidth * imfc.width / this.frameWidth),
//             )

//     reset(this) {
//         """Resets the MultiCamera.

//         Returns
//         -------
//         MultiCamera
//             The reset MultiCamera
//         """
//         for imfc in this.imageMobjectsFromCameras:
//             imfc.camera.reset()
//         super().reset()
//         return this

//     captureMobjects(this, mobjects, **kwargs) {
//         this.updateSubCameras()
//         for imfc in this.imageMobjectsFromCameras:
//             toAdd = list(mobjects)
//             if not this.allowCamerasToCaptureTheirOwnDisplay:
//                 toAdd = listDifferenceUpdate(toAdd, imfc.getFamily())
//             imfc.camera.captureMobjects(toAdd, **kwargs)
//         super().captureMobjects(mobjects, **kwargs)

//     getMobjectsIndicatingMovement(this) {
//         """Returns all mobjects whose movement implies that the camera
//         should think of all other mobjects on the screen as moving

//         Returns
//         -------
//         list
//         """
//         return [this.frame] + [
//             imfc.camera.frame for imfc in this.imageMobjectsFromCameras
//         ]
