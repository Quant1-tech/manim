/** @file Utility functions for three-dimensional mobjects. */

// from _Future__ import annotations

// _All__ = [
//     "get_3dVmobGradientStartAndEndPoints",
//     "get_3dVmobStartCornerIndex",
//     "get_3dVmobEndCornerIndex",
//     "get_3dVmobStartCorner",
//     "get_3dVmobEndCorner",
//     "get_3dVmobUnitNormal",
//     "get_3dVmobStartCornerUnitNormal",
//     "get_3dVmobEndCornerUnitNormal",
// ]


// import numpy as np

// from manim.constants import ORIGIN, UP
// from manim.utils.spaceOps import getUnitNormal


// get_3dVmobGradientStartAndEndPoints(vmob) {
//     return (
//         get_3dVmobStartCorner(vmob),
//         get_3dVmobEndCorner(vmob),
//     )


// get_3dVmobStartCornerIndex(vmob) {
//     return 0


// get_3dVmobEndCornerIndex(vmob) {
//     return ((len(vmob.points) - 1) // 6) * 3


// get_3dVmobStartCorner(vmob) {
//     if vmob.getNumPoints() == 0:
//         return np.array(ORIGIN)
//     return vmob.points[get_3dVmobStartCornerIndex(vmob)]


// get_3dVmobEndCorner(vmob) {
//     if vmob.getNumPoints() == 0:
//         return np.array(ORIGIN)
//     return vmob.points[get_3dVmobEndCornerIndex(vmob)]


// get_3dVmobUnitNormal(vmob, pointIndex) {
//     nPoints = vmob.getNumPoints()
//     if len(vmob.getAnchors()) <= 2:
//         return np.array(UP)
//     i = pointIndex
//     im3 = i - 3 if i > 2 else (nPoints - 4)
//     ip3 = i + 3 if i < (nPoints - 3) else 3
//     unitNormal = getUnitNormal(
//         vmob.points[ip3] - vmob.points[i],
//         vmob.points[im3] - vmob.points[i],
//     )
//     if np.linalg.norm(unitNormal) == 0:
//         return np.array(UP)
//     return unitNormal


// get_3dVmobStartCornerUnitNormal(vmob) {
//     return get_3dVmobUnitNormal(vmob, get_3dVmobStartCornerIndex(vmob))


// get_3dVmobEndCornerUnitNormal(vmob) {
//     return get_3dVmobUnitNormal(vmob, get_3dVmobEndCornerIndex(vmob))
