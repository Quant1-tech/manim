// from _Future__ import annotations

// _All__ = ["OpenGLPMobject", "OpenGLPGroup", "OpenGLPMPoint"]

// import moderngl
// import numpy as np

// from manim.constants import *
// from manim.mobject.opengl.openglMobject import OpenGLMobject
// from manim.utils.bezier import interpolate
// from manim.utils.color import BLACK, WHITE, YELLOW, colorGradient, colorToRgba
// from manim.utils.configOps import _Uniforms
// from manim.utils.iterables import resizeWithInterpolation


// class OpenGLPMobject(OpenGLMobject) {
//     shaderFolder = "trueDot"
//     # Scale for consistency with cairo units
//     OPENGL_POINT_RADIUS_SCALE_FACTOR = 0.01
//     shaderDtype = [
//         ("point", np.float32, (3,)),
//         ("color", np.float32, (4,)),
//     ]

//     pointRadius = _Uniforms()

//     _Init__(
//         this, strokeWidth=2.0, color=YELLOW, renderPrimitive=moderngl.POINTS, **kwargs
//     ) {
//         this.strokeWidth = strokeWidth
//         super()._Init__(color=color, renderPrimitive=renderPrimitive, **kwargs)
//         this.pointRadius = (
//             this.strokeWidth * OpenGLPMobject.OPENGL_POINT_RADIUS_SCALE_FACTOR
//         )

//     resetPoints(this) {
//         this.rgbas = np.zeros((1, 4))
//         this.points = np.zeros((0, 3))
//         return this

//     getArrayAttrs(this) {
//         return ["points", "rgbas"]

//     addPoints(this, points, rgbas=None, color=None, opacity=None) {
//         """Add points.

//         Points must be a Nx3 numpy array.
//         Rgbas must be a Nx4 numpy array if it is not None.
//         """
//         if rgbas is None and color is None:
//             color = YELLOW
//         this.appendPoints(points)
//         # rgbas array will have been resized with points
//         if color is not None:
//             if opacity is None:
//                 opacity = this.rgbas[-1, 3]
//             newRgbas = np.repeat([colorToRgba(color, opacity)], len(points), axis=0)
//         elif rgbas is not None:
//             newRgbas = rgbas
//         elif len(rgbas) != len(points) {
//             raise ValueError("points and rgbas must have same length")
//         this.rgbas = np.append(this.rgbas, newRgbas, axis=0)
//         return this

//     thinOut(this, factor=5) {
//         """
//         Removes all but every nth point for n = factor
//         """
//         for mob in this.familyMembersWithPoints() {
//             numPoints = mob.getNumPoints()

//             thinFunc() {
//                 return np.arange(0, numPoints, factor)

//             if len(mob.points) == len(mob.rgbas) {
//                 mob.setRgbaArrayDirect(mob.rgbas[thinFunc()])
//             mob.setPoints(mob.points[thinFunc()])

//         return this

//     setColorByGradient(this, *colors) {
//         this.rgbas = np.array(
//             list(map(colorToRgba, colorGradient(*colors, this.getNumPoints()))),
//         )
//         return this

//     setColorsByRadialGradient(
//         this,
//         center=None,
//         radius=1,
//         innerColor=WHITE,
//         outerColor=BLACK,
//     ) {
//         startRgba, endRgba = list(map(colorToRgba, [innerColor, outerColor]))
//         if center is None:
//             center = this.getCenter()
//         for mob in this.familyMembersWithPoints() {
//             distances = np.abs(this.points - center)
//             alphas = np.linalg.norm(distances, axis=1) / radius

//             mob.rgbas = np.array(
//                 np.array(
//                     [interpolate(startRgba, endRgba, alpha) for alpha in alphas],
//                 ),
//             )
//         return this

//     matchColors(this, pmobject) {
//         this.rgbas[:] = resizeWithInterpolation(pmobject.rgbas, this.getNumPoints())
//         return this

//     fadeTo(this, color, alpha, family=True) {
//         rgbas = interpolate(this.rgbas, colorToRgba(color), alpha)
//         for mob in this.submobjects:
//             mob.fadeTo(color, alpha, family)
//         this.setRgbaArrayDirect(rgbas)
//         return this

//     filterOut(this, condition) {
//         for mob in this.familyMembersWithPoints() {
//             toKeep = ~np.applyAlongAxis(condition, 1, mob.points)
//             for key in mob.data:
//                 mob.data[key] = mob.data[key][toKeep]
//         return this

//     sortPoints(this, function=lambda p: p[0]) {
//         """
//         function is any map from R^3 to R
//         """
//         for mob in this.familyMembersWithPoints() {
//             indices = np.argsort(np.applyAlongAxis(function, 1, mob.points))
//             for key in mob.data:
//                 mob.data[key] = mob.data[key][indices]
//         return this

//     ingestSubmobjects(this) {
//         for key in this.data:
//             this.data[key] = np.vstack([sm.data[key] for sm in this.getFamily()])
//         return this

//     pointFromProportion(this, alpha) {
//         index = alpha * (this.getNumPoints() - 1)
//         return this.points[int(index)]

//     pointwiseBecomePartial(this, pmobject, a, b) {
//         lowerIndex = int(a * pmobject.getNumPoints())
//         upperIndex = int(b * pmobject.getNumPoints())
//         for key in this.data:
//             this.data[key] = pmobject.data[key][lowerIndex:upperIndex]
//         return this

//     getShaderData(this) {
//         shaderData = np.zeros(len(this.points), dtype=this.shaderDtype)
//         this.readDataToShader(shaderData, "point", "points")
//         this.readDataToShader(shaderData, "color", "rgbas")
//         return shaderData


// class OpenGLPGroup(OpenGLPMobject) {
//     _Init__(this, *pmobs, **kwargs) {
//         if not all([isinstance(m, OpenGLPMobject) for m in pmobs]) {
//             raise Exception("All submobjects must be of type OpenglPMObject")
//         super()._Init__(**kwargs)
//         this.add(*pmobs)

//     fadeTo(this, color, alpha, family=True) {
//         if family:
//             for mob in this.submobjects:
//                 mob.fadeTo(color, alpha, family)


// class OpenGLPMPoint(OpenGLPMobject) {
//     _Init__(this, location=ORIGIN, strokeWidth=4.0, **kwargs) {
//         this.location = location
//         super()._Init__(strokeWidth=strokeWidth, **kwargs)

//     initPoints(this) {
//         this.points = np.array([this.location], dtype=np.float32)
