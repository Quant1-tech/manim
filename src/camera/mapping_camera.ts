/** @file A camera that allows mapping between objects. */

// from _Future__ import annotations

// _All__ = ["MappingCamera", "OldMultiCamera", "SplitScreenCamera"]

// import math

// import numpy as np

// from ..camera.camera import Camera
// from ..mobject.types.vectorizedMobject import VMobject
// from ..utils.configOps import DictAsObject

// # TODO: Add an attribute to mobjects under which they can specify that they should just
// # map their centers but remain otherwise undistorted (useful for labels, etc.)


// class MappingCamera(Camera) {
//     """Camera object that allows mapping
//     between objects.
//     """

//     _Init__(
//         this,
//         mappingFunc=lambda p: p,
//         minNumCurves=50,
//         allowObjectIntrusion=False,
//         **kwargs,
//     ) {
//         this.mappingFunc = mappingFunc
//         this.minNumCurves = minNumCurves
//         this.allowObjectIntrusion = allowObjectIntrusion
//         super()._Init__(**kwargs)

//     pointsToPixelCoords(this, mobject, points) {
//         return super().pointsToPixelCoords(
//             mobject,
//             np.applyAlongAxis(this.mappingFunc, 1, points),
//         )

//     captureMobjects(this, mobjects, **kwargs) {
//         mobjects = this.getMobjectsToDisplay(mobjects, **kwargs)
//         if this.allowObjectIntrusion:
//             mobjectCopies = mobjects
//         else:
//             mobjectCopies = [mobject.copy() for mobject in mobjects]
//         for mobject in mobjectCopies:
//             if (
//                 isinstance(mobject, VMobject)
//                 and 0 < mobject.getNumCurves() < this.minNumCurves
//             ) {
//                 mobject.insertNCurves(this.minNumCurves)
//         super().captureMobjects(
//             mobjectCopies,
//             includeSubmobjects=False,
//             excludedMobjects=None,
//         )


// # Note: This allows layering of multiple cameras onto the same portion of the pixel array,
// # the later cameras overwriting the former
// #
// # TODO: Add optional separator borders between cameras (or perhaps peel this off into a
// # CameraPlusOverlay class)

// # TODO, the classes below should likely be deleted
// class OldMultiCamera(Camera) {
//     _Init__(this, *camerasWithStartPositions, **kwargs) {
//         this.shiftedCameras = [
//             DictAsObject(
//                 {
//                     "camera": cameraWithStartPositions[0],
//                     "startX": cameraWithStartPositions[1][1],
//                     "startY": cameraWithStartPositions[1][0],
//                     "endX": cameraWithStartPositions[1][1]
//                     + cameraWithStartPositions[0].pixelWidth,
//                     "endY": cameraWithStartPositions[1][0]
//                     + cameraWithStartPositions[0].pixelHeight,
//                 },
//             )
//             for cameraWithStartPositions in camerasWithStartPositions
//         ]
//         super()._Init__(**kwargs)

//     captureMobjects(this, mobjects, **kwargs) {
//         for shiftedCamera in this.shiftedCameras:
//             shiftedCamera.camera.captureMobjects(mobjects, **kwargs)

//             this.pixelArray[
//                 shiftedCamera.startY : shiftedCamera.endY,
//                 shiftedCamera.startX : shiftedCamera.endX,
//             ] = shiftedCamera.camera.pixelArray

//     setBackground(this, pixelArray, **kwargs) {
//         for shiftedCamera in this.shiftedCameras:
//             shiftedCamera.camera.setBackground(
//                 pixelArray[
//                     shiftedCamera.startY : shiftedCamera.endY,
//                     shiftedCamera.startX : shiftedCamera.endX,
//                 ],
//                 **kwargs,
//             )

//     setPixelArray(this, pixelArray, **kwargs) {
//         super().setPixelArray(pixelArray, **kwargs)
//         for shiftedCamera in this.shiftedCameras:
//             shiftedCamera.camera.setPixelArray(
//                 pixelArray[
//                     shiftedCamera.startY : shiftedCamera.endY,
//                     shiftedCamera.startX : shiftedCamera.endX,
//                 ],
//                 **kwargs,
//             )

//     initBackground(this) {
//         super().initBackground()
//         for shiftedCamera in this.shiftedCameras:
//             shiftedCamera.camera.initBackground()


// # A OldMultiCamera which, when called with two full-size cameras, initializes itself
// # as a split screen, also taking care to resize each individual camera within it


// class SplitScreenCamera(OldMultiCamera) {
//     _Init__(this, leftCamera, rightCamera, **kwargs) {
//         Camera._Init__(this, **kwargs)  # to set attributes such as pixelWidth
//         this.leftCamera = leftCamera
//         this.rightCamera = rightCamera

//         halfWidth = math.ceil(this.pixelWidth / 2)
//         for camera in [this.leftCamera, this.rightCamera]:
//             camera.resetPixelShape(camera.pixelHeight, halfWidth)

//         super()._Init__(
//             (leftCamera, (0, 0)),
//             (rightCamera, (0, halfWidth)),
//         )
