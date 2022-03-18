// from _Future__ import annotations

// import numpy as np
// import numpy.linalg as linalg

// from .. import config

// depth = 20


// matrixToShaderInput(matrix) {
//     return tuple(matrix.T.ravel())


// orthographicProjectionMatrix(
//     width=None,
//     height=None,
//     near=1,
//     far=depth + 1,
//     format=True,
// ) {
//     if width is None:
//         width = config["frameWidth"]
//     if height is None:
//         height = config["frameHeight"]
//     projectionMatrix = np.array(
//         [
//             [2 / width, 0, 0, 0],
//             [0, 2 / height, 0, 0],
//             [0, 0, -2 / (far - near), -(far + near) / (far - near)],
//             [0, 0, 0, 1],
//         ],
//     )
//     if format:
//         return matrixToShaderInput(projectionMatrix)
//     else:
//         return projectionMatrix


// perspectiveProjectionMatrix(width=None, height=None, near=2, far=50, format=True) {
//     if width is None:
//         width = config["frameWidth"] / 6
//     if height is None:
//         height = config["frameHeight"] / 6
//     projectionMatrix = np.array(
//         [
//             [2 * near / width, 0, 0, 0],
//             [0, 2 * near / height, 0, 0],
//             [0, 0, (far + near) / (near - far), (2 * far * near) / (near - far)],
//             [0, 0, -1, 0],
//         ],
//     )
//     if format:
//         return matrixToShaderInput(projectionMatrix)
//     else:
//         return projectionMatrix


// translationMatrix(x=0, y=0, z=0) {
//     return np.array(
//         [
//             [1, 0, 0, x],
//             [0, 1, 0, y],
//             [0, 0, 1, z],
//             [0, 0, 0, 1],
//         ],
//     )


// xRotationMatrix(x=0) {
//     return np.array(
//         [
//             [1, 0, 0, 0],
//             [0, np.cos(x), -np.sin(x), 0],
//             [0, np.sin(x), np.cos(x), 0],
//             [0, 0, 0, 1],
//         ],
//     )


// yRotationMatrix(y=0) {
//     return np.array(
//         [
//             [np.cos(y), 0, np.sin(y), 0],
//             [0, 1, 0, 0],
//             [-np.sin(y), 0, np.cos(y), 0],
//             [0, 0, 0, 1],
//         ],
//     )


// zRotationMatrix(z=0) {
//     return np.array(
//         [
//             [np.cos(z), -np.sin(z), 0, 0],
//             [np.sin(z), np.cos(z), 0, 0],
//             [0, 0, 1, 0],
//             [0, 0, 0, 1],
//         ],
//     )


// # TODO: When rotating around the x axis, rotation eventually stops.
// rotateInPlaceMatrix(initialPosition, x=0, y=0, z=0) {
//     return np.matmul(
//         translationMatrix(*-initialPosition),
//         np.matmul(
//             rotationMatrix(x, y, z),
//             translationMatrix(*initialPosition),
//         ),
//     )


// rotationMatrix(x=0, y=0, z=0) {
//     return np.matmul(
//         np.matmul(xRotationMatrix(x), yRotationMatrix(y)),
//         zRotationMatrix(z),
//     )


// scaleMatrix(scaleFactor=1) {
//     return np.array(
//         [
//             [scaleFactor, 0, 0, 0],
//             [0, scaleFactor, 0, 0],
//             [0, 0, scaleFactor, 0],
//             [0, 0, 0, 1],
//         ],
//     )


// viewMatrix(
//     translation=None,
//     xRotation=0,
//     yRotation=0,
//     zRotation=0,
// ) {
//     if translation is None:
//         translation = np.array([0, 0, depth / 2 + 1])
//     modelMatrix = np.matmul(
//         np.matmul(
//             translationMatrix(*translation),
//             rotationMatrix(x=xRotation, y=yRotation, z=zRotation),
//         ),
//         scaleMatrix(),
//     )
//     return tuple(linalg.inv(modelMatrix).T.ravel())
