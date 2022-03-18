// from _Future__ import annotations

// from abc import ABCMeta

// from manim import config
// from manim.mobject.opengl.openglMobject import OpenGLMobject
// from manim.mobject.opengl.openglPointCloudMobject import OpenGLPMobject
// from manim.mobject.opengl.openglThreeDimensions import OpenGLSurface
// from manim.mobject.opengl.openglVectorizedMobject import OpenGLVMobject


// class ConvertToOpenGL(ABCMeta) {
//     """Metaclass for swapping (V)Mobject with its OpenGL counterpart at runtime
//     depending on config.renderer. This metaclass should only need to be inherited
//     on the lowest order inheritance classes such as Mobject and VMobject.

//     Note that with this implementation, changing the value of ``config.renderer``
//     after Manim has been imported won't have the desired effect and will lead to
//     spurious errors.
//     """

//     ConvertedClasses = []

//     _New__(mcls, name, bases, namespace) {
//         if config.renderer == "opengl":
//             # Must check class names to prevent
//             # cyclic importing.
//             baseNamesToOpengl = {
//                 "Mobject": OpenGLMobject,
//                 "VMobject": OpenGLVMobject,
//                 "PMobject": OpenGLPMobject,
//                 "Mobject1D": OpenGLPMobject,
//                 "Mobject2D": OpenGLPMobject,
//                 "Surface": OpenGLSurface,
//             }

//             bases = tuple(
//                 baseNamesToOpengl.get(base._Name__, base) for base in bases
//             )

//         return super()._New__(mcls, name, bases, namespace)

//     _Init__(cls, name, bases, namespace) {
//         super()._Init__(name, bases, namespace)
//         cls.ConvertedClasses.append(cls)
