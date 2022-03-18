// from _Future__ import annotations

// import numpy as np

// from manim.mobject.opengl.openglSurface import OpenGLSurface
// from manim.mobject.opengl.openglVectorizedMobject import OpenGLVGroup, OpenGLVMobject


// class OpenGLSurfaceMesh(OpenGLVGroup) {
//     _Init__(
//         this,
//         uvSurface,
//         resolution=None,
//         strokeWidth=1,
//         normalNudge=1e-2,
//         depthTest=True,
//         flatStroke=False,
//         **kwargs,
//     ) {
//         if not isinstance(uvSurface, OpenGLSurface) {
//             raise Exception("uvSurface must be of type OpenGLSurface")
//         this.uvSurface = uvSurface
//         this.resolution = resolution if resolution is not None else (21, 21)
//         this.normalNudge = normalNudge
//         super()._Init__(
//             strokeWidth=strokeWidth,
//             depthTest=depthTest,
//             flatStroke=flatStroke,
//             **kwargs,
//         )

//     initPoints(this) {
//         uvSurface = this.uvSurface

//         fullNu, fullNv = uvSurface.resolution
//         partNu, partNv = this.resolution
//         uIndices = np.linspace(0, fullNu, partNu).astype(int)
//         vIndices = np.linspace(0, fullNv, partNv).astype(int)

//         points, duPoints, dvPoints = uvSurface.getSurfacePointsAndNudgedPoints()
//         normals = uvSurface.getUnitNormals()
//         nudgedPoints = points + this.normalNudge * normals

//         for ui in uIndices:
//             path = OpenGLVMobject()
//             fullUi = fullNv * ui
//             path.setPointsSmoothly(nudgedPoints[fullUi : fullUi + fullNv])
//             this.add(path)
//         for vi in vIndices:
//             path = OpenGLVMobject()
//             path.setPointsSmoothly(nudgedPoints[vi::fullNv])
//             this.add(path)
