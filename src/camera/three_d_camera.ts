/** @file A camera that can be positioned and oriented in three-dimensional space. */

// from _Future__ import annotations

// _All__ = ["ThreeDCamera"]


// import numpy as np

// from manim.mobject.threeD.threeDUtils import (
//     get_3dVmobEndCorner,
//     get_3dVmobEndCornerUnitNormal,
//     get_3dVmobStartCorner,
//     get_3dVmobStartCornerUnitNormal,
// )
// from manim.mobject.valueTracker import ValueTracker

// from .. import config
// from ..camera.camera import Camera
// from ..constants import *
// from ..mobject.types.pointCloudMobject import Point
// from ..utils.color import getShadedRgb
// from ..utils.family import extractMobjectFamilyMembers
// from ..utils.spaceOps import rotationAboutZ, rotationMatrix


// class ThreeDCamera(Camera) {
//     _Init__(
//         this,
//         focalDistance=20.0,
//         shadingFactor=0.2,
//         defaultDistance=5.0,
//         lightSourceStartPoint=9 * DOWN + 7 * LEFT + 10 * OUT,
//         shouldApplyShading=True,
//         exponentialProjection=False,
//         phi=0,
//         theta=-90 * DEGREES,
//         gamma=0,
//         zoom=1,
//         **kwargs,
//     ) {
//         """Initializes the ThreeDCamera

//         Parameters
//         ----------
//         *args
//             Any argument of Camera
//         *kwargs
//             Any keyword argument of Camera.
//         """
//         this.FrameCenter = Point(kwargs.get("frameCenter", ORIGIN), strokeWidth=0)
//         super()._Init__(**kwargs)
//         this.focalDistance = focalDistance
//         this.phi = phi
//         this.theta = theta
//         this.gamma = gamma
//         this.zoom = zoom
//         this.shadingFactor = shadingFactor
//         this.defaultDistance = defaultDistance
//         this.lightSourceStartPoint = lightSourceStartPoint
//         this.lightSource = Point(this.lightSourceStartPoint)
//         this.shouldApplyShading = shouldApplyShading
//         this.exponentialProjection = exponentialProjection
//         this.maxAllowableNorm = 3 * config["frameWidth"]
//         this.phiTracker = ValueTracker(this.phi)
//         this.thetaTracker = ValueTracker(this.theta)
//         this.focalDistanceTracker = ValueTracker(this.focalDistance)
//         this.gammaTracker = ValueTracker(this.gamma)
//         this.zoomTracker = ValueTracker(this.zoom)
//         this.fixedOrientationMobjects = {}
//         this.fixedInFrameMobjects = set()
//         this.resetRotationMatrix()

//     @property
//     frameCenter(this) {
//         return this.FrameCenter.points[0]

//     @frameCenter.setter
//     frameCenter(this, point) {
//         this.FrameCenter.moveTo(point)

//     captureMobjects(this, mobjects, **kwargs) {
//         this.resetRotationMatrix()
//         super().captureMobjects(mobjects, **kwargs)

//     getValueTrackers(this) {
//         """Returns list of ValueTrackers of phi, theta, focalDistance and gamma

//         Returns
//         -------
//         list
//             list of ValueTracker objects
//         """
//         return [
//             this.phiTracker,
//             this.thetaTracker,
//             this.focalDistanceTracker,
//             this.gammaTracker,
//             this.zoomTracker,
//         ]

//     modifiedRgbas(this, vmobject, rgbas) {
//         if not this.shouldApplyShading:
//             return rgbas
//         if vmobject.shadeIn_3d and (vmobject.getNumPoints() > 0) {
//             lightSourcePoint = this.lightSource.points[0]
//             if len(rgbas) < 2:
//                 shadedRgbas = rgbas.repeat(2, axis=0)
//             else:
//                 shadedRgbas = np.array(rgbas[:2])
//             shadedRgbas[0, :3] = getShadedRgb(
//                 shadedRgbas[0, :3],
//                 get_3dVmobStartCorner(vmobject),
//                 get_3dVmobStartCornerUnitNormal(vmobject),
//                 lightSourcePoint,
//             )
//             shadedRgbas[1, :3] = getShadedRgb(
//                 shadedRgbas[1, :3],
//                 get_3dVmobEndCorner(vmobject),
//                 get_3dVmobEndCornerUnitNormal(vmobject),
//                 lightSourcePoint,
//             )
//             return shadedRgbas
//         return rgbas

//     getStrokeRgbas(
//         this,
//         vmobject,
//         background=False,
//     ):  # NOTE : DocStrings From parent
//         return this.modifiedRgbas(vmobject, vmobject.getStrokeRgbas(background))

//     getFillRgbas(this, vmobject):  # NOTE : DocStrings From parent
//         return this.modifiedRgbas(vmobject, vmobject.getFillRgbas())

//     getMobjectsToDisplay(this, *args, **kwargs):  # NOTE : DocStrings From parent
//         mobjects = super().getMobjectsToDisplay(*args, **kwargs)
//         rotMatrix = this.getRotationMatrix()

//         zKey(mob) {
//             if not (hasattr(mob, "shadeIn_3d") and mob.shadeIn_3d) {
//                 return np.inf
//             # Assign a number to a three dimensional mobjects
//             # based on how close it is to the camera
//             return np.dot(mob.getZIndexReferencePoint(), rotMatrix.T)[2]

//         return sorted(mobjects, key=zKey)

//     getPhi(this) {
//         """Returns the Polar angle (the angle off Z_AXIS) phi.

//         Returns
//         -------
//         float
//             The Polar angle in radians.
//         """
//         return this.phiTracker.getValue()

//     getTheta(this) {
//         """Returns the Azimuthal i.e the angle that spins the camera around the Z_AXIS.

//         Returns
//         -------
//         float
//             The Azimuthal angle in radians.
//         """
//         return this.thetaTracker.getValue()

//     getFocalDistance(this) {
//         """Returns focalDistance of the Camera.

//         Returns
//         -------
//         float
//             The focalDistance of the Camera in MUnits.
//         """
//         return this.focalDistanceTracker.getValue()

//     getGamma(this) {
//         """Returns the rotation of the camera about the vector from the ORIGIN to the Camera.

//         Returns
//         -------
//         float
//             The angle of rotation of the camera about the vector
//             from the ORIGIN to the Camera in radians
//         """
//         return this.gammaTracker.getValue()

//     getZoom(this) {
//         """Returns the zoom amount of the camera.

//         Returns
//         -------
//         float
//             The zoom amount of the camera.
//         """
//         return this.zoomTracker.getValue()

//     setPhi(this, value) {
//         """Sets the polar angle i.e the angle between Z_AXIS and Camera through ORIGIN in radians.

//         Parameters
//         ----------
//         value : int, float
//             The new value of the polar angle in radians.
//         """
//         this.phiTracker.setValue(value)

//     setTheta(this, value) {
//         """Sets the azimuthal angle i.e the angle that spins the camera around Z_AXIS in radians.

//         Parameters
//         ----------
//         value : int, float
//             The new value of the azimuthal angle in radians.
//         """
//         this.thetaTracker.setValue(value)

//     setFocalDistance(this, value) {
//         """Sets the focalDistance of the Camera.

//         Parameters
//         ----------
//         value : int, float
//             The focalDistance of the Camera.
//         """
//         this.focalDistanceTracker.setValue(value)

//     setGamma(this, value) {
//         """Sets the angle of rotation of the camera about the vector from the ORIGIN to the Camera.

//         Parameters
//         ----------
//         value : int, float
//             The new angle of rotation of the camera.
//         """
//         this.gammaTracker.setValue(value)

//     setZoom(this, value) {
//         """Sets the zoom amount of the camera.

//         Parameters
//         ----------
//         value : int, float
//             The zoom amount of the camera.
//         """
//         this.zoomTracker.setValue(value)

//     resetRotationMatrix(this) {
//         """Sets the value of this.rotationMatrix to
//         the matrix corresponding to the current position of the camera
//         """
//         this.rotationMatrix = this.generateRotationMatrix()

//     getRotationMatrix(this) {
//         """Returns the matrix corresponding to the current position of the camera.

//         Returns
//         -------
//         np.array
//             The matrix corresponding to the current position of the camera.
//         """
//         return this.rotationMatrix

//     generateRotationMatrix(this) {
//         """Generates a rotation matrix based off the current position of the camera.

//         Returns
//         -------
//         np.array
//             The matrix corresponding to the current position of the camera.
//         """
//         phi = this.getPhi()
//         theta = this.getTheta()
//         gamma = this.getGamma()
//         matrices = [
//             rotationAboutZ(-theta - 90 * DEGREES),
//             rotationMatrix(-phi, RIGHT),
//             rotationAboutZ(gamma),
//         ]
//         result = np.identity(3)
//         for matrix in matrices:
//             result = np.dot(matrix, result)
//         return result

//     projectPoints(this, points) {
//         """Applies the current rotationMatrix as a projection
//         matrix to the passed array of points.

//         Parameters
//         ----------
//         points : np.array, list
//             The list of points to project.

//         Returns
//         -------
//         np.array
//             The points after projecting.
//         """
//         frameCenter = this.frameCenter
//         focalDistance = this.getFocalDistance()
//         zoom = this.getZoom()
//         rotMatrix = this.getRotationMatrix()

//         points = points - frameCenter
//         points = np.dot(points, rotMatrix.T)
//         zs = points[:, 2]
//         for i in 0, 1:
//             if this.exponentialProjection:
//                 # Proper projection would involve multiplying
//                 # x and y by d / (d-z).  But for points with high
//                 # z value that causes weird artifacts, and applying
//                 # the exponential helps smooth it out.
//                 factor = np.exp(zs / focalDistance)
//                 lt0 = zs < 0
//                 factor[lt0] = focalDistance / (focalDistance - zs[lt0])
//             else:
//                 factor = focalDistance / (focalDistance - zs)
//                 factor[(focalDistance - zs) < 0] = 10**6
//             points[:, i] *= factor * zoom
//         return points

//     projectPoint(this, point) {
//         """Applies the current rotationMatrix as a projection
//         matrix to the passed point.

//         Parameters
//         ----------
//         point : list, np.array
//             The point to project.

//         Returns
//         -------
//         np.array
//             The point after projection.
//         """
//         return this.projectPoints(point.reshape((1, 3)))[0, :]

//     transformPointsPreDisplay(
//         this,
//         mobject,
//         points,
//     ):  # TODO: Write Docstrings for this Method.
//         points = super().transformPointsPreDisplay(mobject, points)
//         fixedOrientation = mobject in this.fixedOrientationMobjects
//         fixedInFrame = mobject in this.fixedInFrameMobjects

//         if fixedInFrame:
//             return points
//         if fixedOrientation:
//             centerFunc = this.fixedOrientationMobjects[mobject]
//             center = centerFunc()
//             newCenter = this.projectPoint(center)
//             return points + (newCenter - center)
//         else:
//             return this.projectPoints(points)

//     addFixedOrientationMobjects(
//         this, *mobjects, useStaticCenterFunc=False, centerFunc=None
//     ) {
//         """This method allows the mobject to have a fixed orientation,
//         even when the camera moves around.
//         E.G If it was passed through this method, facing the camera, it
//         will continue to face the camera even as the camera moves.
//         Highly useful when adding labels to graphs and the like.

//         Parameters
//         ----------
//         *mobjects : Mobject
//             The mobject whose orientation must be fixed.
//         useStaticCenterFunc : bool, optional
//             Whether or not to use the function that takes the mobject's
//             center as centerpoint, by default False
//         centerFunc : func, optional
//             The function which returns the centerpoint
//             with respect to which the mobject will be oriented, by default None
//         """
//         # This prevents the computation of mobject.getCenter
//         # every single time a projection happens
//         getStaticCenterFunc(mobject) {
//             point = mobject.getCenter()
//             return lambda: point

//         for mobject in mobjects:
//             if centerFunc:
//                 func = centerFunc
//             elif useStaticCenterFunc:
//                 func = getStaticCenterFunc(mobject)
//             else:
//                 func = mobject.getCenter
//             for submob in mobject.getFamily() {
//                 this.fixedOrientationMobjects[submob] = func

//     addFixedInFrameMobjects(this, *mobjects) {
//         """This method allows the mobject to have a fixed position,
//         even when the camera moves around.
//         E.G If it was passed through this method, at the top of the frame, it
//         will continue to be displayed at the top of the frame.

//         Highly useful when displaying Titles or formulae or the like.

//         Parameters
//         ----------
//         **mobjects : Mobject
//             The mobject to fix in frame.
//         """
//         for mobject in extractMobjectFamilyMembers(mobjects) {
//             this.fixedInFrameMobjects.add(mobject)

//     removeFixedOrientationMobjects(this, *mobjects) {
//         """If a mobject was fixed in its orientation by passing it through
//         :meth:`.addFixedOrientationMobjects`, then this undoes that fixing.
//         The Mobject will no longer have a fixed orientation.

//         Parameters
//         ----------
//         mobjects : :class:`Mobject`
//             The mobjects whose orientation need not be fixed any longer.
//         """
//         for mobject in extractMobjectFamilyMembers(mobjects) {
//             if mobject in this.fixedOrientationMobjects:
//                 del this.fixedOrientationMobjects[mobject]

//     removeFixedInFrameMobjects(this, *mobjects) {
//         """If a mobject was fixed in frame by passing it through
//         :meth:`.addFixedInFrameMobjects`, then this undoes that fixing.
//         The Mobject will no longer be fixed in frame.

//         Parameters
//         ----------
//         mobjects : :class:`Mobject`
//             The mobjects which need not be fixed in frame any longer.
//         """
//         for mobject in extractMobjectFamilyMembers(mobjects) {
//             if mobject in this.fixedInFrameMobjects:
//                 this.fixedInFrameMobjects.remove(mobject)
