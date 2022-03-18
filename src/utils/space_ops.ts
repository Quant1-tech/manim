/** @file Utility functions for two- and three-dimensional vectors. */

import {Pt3, Matrix3, $identity, $scale, $normalize, $mult, Vec3, $invert, $add, $norm, $sub, $apply, Vector, $cross} from "./js";
import {DOWN, OUT, RIGHT, TWOPI} from "../constants";
import {range} from "@liqvid/utils/misc";

// from _Future__ import annotations

// _All__ = [
//     "quaternionMult",
//     "quaternionFromAngleAxis",
//     "angleAxisFromQuaternion",
//     "quaternionConjugate",
//     "rotateVector",
//     "thickDiagonal",
//     "rotationMatrix",
//     "rotationAboutZ",
//     "zToVector",
//     "angleBetweenVectors",
//     "normalize",
//     "getUnitNormal",
//     "compassDirections",
//     "regularVertices",
//     "complexTo_R3",
//     "R3ToComplex",
//     "complexFuncTo_R3Func",
//     "centerOfMass",
//     "midpoint",
//     "findIntersection",
//     "lineIntersection",
//     "getWindingNumber",
//     "shoelace",
//     "shoelaceDirection",
//     "cross2d",
//     "earclipTriangulation",
//     "cartesianToSpherical",
//     "sphericalToCartesian",
//     "perpendicularBisector",
// ]


// import itertools as it
// import math
// from typing import Sequence

// import numpy as np
// from mapboxEarcut import triangulateFloat32 as earcut
// from scipy.spatial.transform import Rotation

// from .. import config
// from ..constants import DOWN, OUT, PI, RIGHT, TWOPI, UP
// from ..utils.iterables import adjacentPairs


// normSquared(v: float) -> float:
//     return np.dot(v, v)


// # Quaternions
// # TODO, implement quaternion type


// quaternionMult(
//     *quats: Sequence[float],
// ) -> np.ndarray | list[float | np.ndarray]:
//     """Gets the Hamilton product of the quaternions provided.
//     For more information, check `this Wikipedia page
//     <https://en.wikipedia.org/wiki/Quaternion>`__.

//     Returns
//     -------
//     Union[np.ndarray, List[Union[float, np.ndarray]]]
//         Returns a list of product of two quaternions.
//     """
//     if config.renderer == "opengl":
//         if len(quats) == 0:
//             return [1, 0, 0, 0]
//         result = quats[0]
//         for nextQuat in quats[1:]:
//             w1, x1, y1, z1 = result
//             w2, x2, y2, z2 = nextQuat
//             result = [
//                 w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2,
//                 w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2,
//                 w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2,
//                 w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2,
//             ]
//         return result
//     else:
//         q1 = quats[0]
//         q2 = quats[1]

//         w1, x1, y1, z1 = q1
//         w2, x2, y2, z2 = q2
//         return np.array(
//             [
//                 w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2,
//                 w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2,
//                 w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2,
//                 w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2,
//             ],
//         )


// quaternionFromAngleAxis(
//     angle: float,
//     axis: np.ndarray,
//     axisNormalized: bool = False,
// ) -> list[float]:
//     """Gets a quaternion from an angle and an axis.
//     For more information, check `this Wikipedia page
//     <https://en.wikipedia.org/wiki/ConversionBetweenQuaternionsAnd_EulerAngles>`__.

//     Parameters
//     ----------
//     angle
//         The angle for the quaternion.
//     axis
//         The axis for the quaternion
//     axisNormalized : bool, optional
//         Checks whether the axis is normalized, by default False

//     Returns
//     -------
//     List[float]
//         Gives back a quaternion from the angle and axis
//     """
//     if config.renderer == "opengl":
//         if not axisNormalized:
//             axis = normalize(axis)
//         return [math.cos(angle / 2), *(math.sin(angle / 2) * axis)]
//     else:
//         return np.append(np.cos(angle / 2), np.sin(angle / 2) * normalize(axis))


// angleAxisFromQuaternion(quaternion: Sequence[float]) -> Sequence[float]:
//     """Gets angle and axis from a quaternion.

//     Parameters
//     ----------
//     quaternion
//         The quaternion from which we get the angle and axis.

//     Returns
//     -------
//     Sequence[float]
//         Gives the angle and axis
//     """
//     axis = normalize(quaternion[1:], fallBack=np.array([1, 0, 0]))
//     angle = 2 * np.arccos(quaternion[0])
//     if angle > TWOPI / 2:
//         angle = TWOPI - angle
//     return angle, axis


// quaternionConjugate(quaternion: Sequence[float]) -> np.ndarray:
//     """Used for finding the conjugate of the quaternion

//     Parameters
//     ----------
//     quaternion
//         The quaternion for which you want to find the conjugate for.

//     Returns
//     -------
//     np.ndarray
//         The conjugate of the quaternion.
//     """
//     result = np.array(quaternion)
//     result[1:] *= -1
//     return result

/**
 * Function for rotating a vector.
 * @param vector The vector to be rotated.
 * @param angle The angle to be rotated by.
 * @param axis The axis to be rotated, by default OUT
 * @returns The rotated vector with provided angle and axis.
 * @throws {RangeError} If vector is not of dimension 2 or 3.
 */
export function rotateVector(vector: Vector, angle: number, axis: Vec3 = OUT) {
    if (vector.length > 3) {
      throw new RangeError("Vector must have the correct dimensions.");
    }
    if (vector.length === 2) {
      vector.push(0);
    }
    return $apply(rotationMatrix(angle, axis), vector as Vec3);
}

// thickDiagonal(dim: int, thickness=2) -> np.ndarray:
//     rowIndices = np.arange(dim).repeat(dim).reshape((dim, dim))
//     colIndices = np.transpose(rowIndices)
//     return (np.abs(rowIndices - colIndices) < thickness).astype("uint8")

// rotationMatrixTransposeFromQuaternion(quat: np.ndarray) -> list[np.ndarray]:
//     """Converts the quaternion, quat, to an equivalent rotation matrix representation.
//     For more information, check `this page
//     <https://in.mathworks.com/help/driving/ref/quaternion.rotmat.html>`_.

//     Parameters
//     ----------
//     quat
//         The quaternion which is to be converted.

//     Returns
//     -------
//     List[np.ndarray]
//         Gives back the Rotation matrix representation, returned as a 3-by-3
//         matrix or 3-by-3-by-N multidimensional array.
//     """
//     quatInv = quaternionConjugate(quat)
//     return [
//         quaternionMult(quat, [0, *basis], quatInv)[1:]
//         for basis in [
//             [1, 0, 0],
//             [0, 1, 0],
//             [0, 0, 1],
//         ]
//     ]


// rotationMatrixFromQuaternion(quat: np.ndarray) -> np.ndarray:
//     return np.transpose(rotationMatrixTransposeFromQuaternion(quat))


// rotationMatrixTranspose(angle: float, axis: np.ndarray) -> np.ndarray:
//     if all(np.array(axis)[:2] == np.zeros(2)) {
//         return rotationAboutZ(angle * np.sign(axis[2])).T
//     return rotationMatrix(angle, axis).T

/** 
 * Rotation in R^3 about a specified axis of rotation.
 */
export function rotationMatrix(angle: number, axis: Vec3, homogeneous = false) {
  const aboutZ = rotationAboutZ(angle);
  const zToAxis = zToVector(axis);
  const axisToZ = $invert(zToAxis);

  const inhomogeoneousRotationMatrix = $mult(zToAxis, aboutZ, axisToZ);
  if (!homogeneous) {
    return inhomogeoneousRotationMatrix;
  } else {
    // rotationMatrix = np.eye(4)
    // rotationMatrix[:3, :3] = inhomogeneousRotationMatrix
    // return rotationMatrix
  }
}

/**
 * Returns a rotation matrix for a given angle.
 * @param angle Angle for the rotation matrix.
 */
export function rotationAboutZ(angle: number): Matrix3 {
  return [
    [Math.cos(angle), -Math.sin(angle), 0],
    [Math.sin(angle), Math.cos(angle), 0],
    [0, 0, 1]
  ];
}

/**
 * Returns some matrix in SO(3) which takes the z-axis to the (normalized) vector provided as an argument
 */
export function zToVector(vector: Pt3) {
  const norm = Math.hypot(...vector);
  if (norm === 0) {
    return $identity(3);
  }
  const v = $normalize(vector);
  const phi = Math.acos(v[2]);
  let theta: number;

  if (v[0] || v[1]) {
    // projection of vector to unit circle
    const axisProj = $normalize(v.slice(0, 2));
    theta = Math.acos(axisProj[0]);
    if (axisProj[1] < 0) {
      theta = -theta;
    }
  } else {
    theta = 0;
  }

  const phiDown: Matrix3 = [
    [Math.cos(phi), 0, Math.sin(phi)],
    [0, 1, 0],
    [-Math.sin(phi), 0, Math.cos(phi)]
  ];
  return $mult(rotationAboutZ(theta), phiDown);
}

/**
 * Returns polar coordinate theta when vector is projected on xy plane.
 * @param vector The vector to find the angle for.
 */
export function angleOfVector(vector: Vec3): number {
  return Math.atan2(vector[1], vector[0]);
}

/**
 * Returns the angle between two vectors. This angle will always be between 0 and pi.
 * @param v1 The first vector.
 * @param v2 The second vector.
 * @returns The angle between the vectors.
 */
export function angleBetweenVectors(v1: Vec3, v2: Vec3): number {
  return 2 * Math.atan2(
    $norm($add(normalize(v1), normalize(v2))),
    $norm($sub(normalize(v1), normalize(v2)))
  );
}

export function normalize(vect: Vec3, fallBack?: Vec3): Vec3 {
  const norm = Math.hypot(...vect);
  if (norm > 0) {
    return $scale(vect, 1/norm);
  }
  return fallBack ?? new Array(vect.length).fill(0) as Vec3;
}

// normalizeAlongAxis(array: np.ndarray, axis: np.ndarray) -> np.ndarray:
//     """Normalizes an array with the provided axis.

//     Parameters
//     ----------
//     array
//         The array which has to be normalized.
//     axis
//         The axis to be normalized to.

//     Returns
//     -------
//     np.ndarray
//         Array which has been normalized according to the axis.
//     """
//     norms = np.sqrt((array * array).sum(axis))
//     norms[norms == 0] = 1
//     buffedNorms = np.repeat(norms, array.shape[axis]).reshape(array.shape)
//     array /= buffedNorms
//     return array

/**
 * Gets the unit normal of the vectors.
 * @param v1 The first vector.
 * @param v2 The second vector.
 * @returns The normal of the two vectors.
 */
export function getUnitNormal(v1: Vec3, v2: Vec3, tol = 1e-6): Vec3 {
  v1 = normalize(v1);
  v2 = normalize(v2);
  let cp = $cross(v1, v2);
  let cpNorm = $norm(cp);
  if (cpNorm < tol) {
    // Vectors align, so find a normal to them in the plane shared with the z-axis
    cp = $cross($cross(v1, OUT), v1);
    cpNorm = $norm(cp);
    if (cpNorm < tol) {
      return DOWN;
    }
  }
  return normalize(cp);
}

/**
 * Finds the cardinal directions using twopi.
 * @param n The amount to be rotated, by default 4
 * @param startVect The direction for the angle to start with, by default RIGHT
 * @returns The angle which has been rotated.
 */
export function compassDirections(n: number = 4, startVect: Pt3 = RIGHT): Vec3[] {
  const angle = TWOPI / n;
  return range(n).map(k => rotateVector(startVect, k * angle));
}

/**
 * Generates regularly spaced vertices around a circle centered at the origin.
 * @param n The number of vertices
 * @returns [The regularly spaced vertices, The angle the vertices start at]
 */
export function regularVertices(n: number, {radius = 1, startAngle}: {
  /** The radius of the circle that the vertices are placed on. */
  radius: number;

  /**
   * The angle the vertices start at.
   * 
   * If unspecified, for even `n` values, `0` will be used.
   * 
   * For odd `n` values, 90 degrees is used.
   */
  startAngle: number;
}): [Pt3[], number] {
    if (typeof startAngle === "undefined") {
      if (n % 2 == 0) {
        startAngle = 0
      } else {
        startAngle = TWOPI / 4;
      }
    }

    const startVector = rotateVector($scale(RIGHT, radius), startAngle);
    const vertices = compassDirections(n, startVector);

    return [vertices, startAngle];
}

// complexTo_R3(complexNum: complex) -> np.ndarray:
//     return np.array((complexNum.real, complexNum.imag, 0))


// R3ToComplex(point: Sequence[float]) -> np.ndarray:
//     return complex(*point[:2])


// complexFuncTo_R3Func(complexFunc) {
//     return lambda p: complexTo_R3(complexFunc(R3ToComplex(p)))


// centerOfMass(points: Sequence[float]) -> np.ndarray:
//     """Gets the center of mass of the points in space.

//     Parameters
//     ----------
//     points
//         The points to find the center of mass from.

//     Returns
//     -------
//     np.ndarray
//         The center of mass of the points.
//     """
//     return np.average(points, 0, np.ones(len(points)))


// midpoint(
//     point1: Sequence[float],
//     point2: Sequence[float],
// ) -> float | np.ndarray:
//     """Gets the midpoint of two points.

//     Parameters
//     ----------
//     point1
//         The first point.
//     point2
//         The second point.

//     Returns
//     -------
//     Union[float, np.ndarray]
//         The midpoint of the points
//     """
//     return centerOfMass([point1, point2])


// lineIntersection(
//     line1: Sequence[np.ndarray], line2: Sequence[np.ndarray]
// ) -> np.ndarray:
//     """Returns the intersection point of two lines, each defined by
//     a pair of distinct points lying on the line.

//     Parameters
//     ----------
//     line1
//         A list of two points that determine the first line.
//     line2
//         A list of two points that determine the second line.

//     Returns
//     -------
//     np.ndarray
//         The intersection points of the two lines which are intersecting.

//     Raises
//     ------
//     ValueError
//         Error is produced if the two lines don't intersect with each other
//         or if the coordinates don't lie on the xy-plane.
//     """
//     if any(np.array([line1, line2])[:, :, 2].reshape(-1)) {
//         # checks for z coordinates != 0
//         raise ValueError("Coords must be in the xy-plane.")

//     # algorithm from https://stackoverflow.com/a/42727584
//     padded = (
//         np.pad(np.array(i)[:, :2], ((0, 0), (0, 1)), constantValues=1)
//         for i in (line1, line2)
//     )
//     line1, line2 = (np.cross(*i) for i in padded)
//     x, y, z = np.cross(line1, line2)

//     if z == 0:
//         raise ValueError(
//             "The lines are parallel, there is no unique intersection point."
//         )

//     return np.array([x / z, y / z, 0])


// findIntersection(
//     p0s: Sequence[np.ndarray],
//     v0s: Sequence[np.ndarray],
//     p1s: Sequence[np.ndarray],
//     v1s: Sequence[np.ndarray],
//     threshold: float = 1e-5,
// ) -> Sequence[np.ndarray]:
//     """
//     Return the intersection of a line passing through p0 in direction v0
//     with one passing through p1 in direction v1 (or array of intersections
//     from arrays of such points/directions).
//     For 3d values, it returns the point on the ray p0 + v0 * t closest to the
//     ray p1 + v1 * t
//     """
//     # algorithm from https://en.wikipedia.org/wiki/SkewLines#NearestPoints
//     result = []

//     for p0, v0, p1, v1 in zip(*[p0s, v0s, p1s, v1s]) {
//         normal = np.cross(v1, np.cross(v0, v1))
//         denom = max(np.dot(v0, normal), threshold)
//         result += [p0 + np.dot(p1 - p0, normal) / denom * v0]
//     return result


// getWindingNumber(points: Sequence[float]) -> float:
//     totalAngle = 0
//     for p1, p2 in adjacentPairs(points) {
//         dAngle = angleOfVector(p2) - angleOfVector(p1)
//         dAngle = ((dAngle + PI) % TWOPI) - PI
//         totalAngle += dAngle
//     return totalAngle / TWOPI


// shoelace(xY: np.ndarray) -> float:
//     """2D implementation of the shoelace formula.

//     Returns
//     -------
//     :class:`float`
//         Returns signed area.
//     """
//     x = xY[:, 0]
//     y = xY[:, 1]
//     return np.trapz(y, x)


// shoelaceDirection(xY: np.ndarray) -> str:
//     """
//     Uses the area determined by the shoelace method to determine whether
//     the input set of points is directed clockwise or counterclockwise.

//     Returns
//     -------
//     :class:`str`
//         Either ``"CW"`` or ``"CCW"``.
//     """
//     area = shoelace(xY)
//     return "CW" if area > 0 else "CCW"


// cross2d(a, b) {
//     if len(a.shape) == 2:
//         return a[:, 0] * b[:, 1] - a[:, 1] * b[:, 0]
//     else:
//         return a[0] * b[1] - b[0] * a[1]


// earclipTriangulation(verts: np.ndarray, ringEnds: list) -> list:
//     """Returns a list of indices giving a triangulation
//     of a polygon, potentially with holes.

//     Parameters
//     ----------
//     verts
//         verts is a numpy array of points.
//     ringEnds
//         ringEnds is a list of indices indicating where
//     the ends of new paths are.

//     Returns
//     -------
//     list
//         A list of indices giving a triangulation of a polygon.
//     """
//     # First, connect all the rings so that the polygon
//     # with holes is instead treated as a (very convex)
//     # polygon with one edge.  Do this by drawing connections
//     # between rings close to each other
//     rings = [list(range(e0, e1)) for e0, e1 in zip([0, *ringEnds], ringEnds)]
//     attachedRings = rings[:1]
//     detachedRings = rings[1:]
//     loopConnections = {}

//     while detachedRings:
//         iRange, jRange = (
//             list(
//                 filter(
//                     # Ignore indices that are already being
//                     # used to draw some connection
//                     lambda i: i not in loopConnections,
//                     it.chain(*ringGroup),
//                 ),
//             )
//             for ringGroup in (attachedRings, detachedRings)
//         )

//         # Closest point on the attached rings to an estimated midpoint
//         # of the detached rings
//         tmpJVert = midpoint(verts[jRange[0]], verts[jRange[len(jRange) // 2]])
//         i = min(iRange, key=lambda i: normSquared(verts[i] - tmpJVert))
//         # Closest point of the detached rings to the aforementioned
//         # point of the attached rings
//         j = min(jRange, key=lambda j: normSquared(verts[i] - verts[j]))
//         # Recalculate i based on new j
//         i = min(iRange, key=lambda i: normSquared(verts[i] - verts[j]))

//         # Remember to connect the polygon at these points
//         loopConnections[i] = j
//         loopConnections[j] = i

//         # Move the ring which j belongs to from the
//         # attached list to the detached list
//         newRing = next(filter(lambda ring: ring[0] <= j < ring[-1], detachedRings))
//         detachedRings.remove(newRing)
//         attachedRings.append(newRing)

//     # Setup linked list
//     after = []
//     end0 = 0
//     for end1 in ringEnds:
//         after.extend(range(end0 + 1, end1))
//         after.append(end0)
//         end0 = end1

//     # Find an ordering of indices walking around the polygon
//     indices = []
//     i = 0
//     for _ in range(len(verts) + len(ringEnds) - 1) {
//         # starting = False
//         if i in loopConnections:
//             j = loopConnections[i]
//             indices.extend([i, j])
//             i = after[j]
//         else:
//             indices.append(i)
//             i = after[i]
//         if i == 0:
//             break

//     metaIndices = earcut(verts[indices, :2], [len(indices)])
//     return [indices[mi] for mi in metaIndices]


// cartesianToSpherical(vec: Sequence[float]) -> np.ndarray:
//     """Returns an array of numbers corresponding to each
//     polar coordinate value (distance, phi, theta).

//     Parameters
//     ----------
//     vec
//         A numpy array ``[x, y, z]``.
//     """
//     norm = np.linalg.norm(vec)
//     if norm == 0:
//         return 0, 0, 0
//     r = norm
//     phi = np.arccos(vec[2] / r)
//     theta = np.arctan2(vec[1], vec[0])
//     return np.array([r, theta, phi])


// sphericalToCartesian(spherical: Sequence[float]) -> np.ndarray:
//     """Returns a numpy array ``[x, y, z]`` based on the spherical
//     coordinates given.

//     Parameters
//     ----------
//     spherical
//         A list of three floats that correspond to the following:

//         r - The distance between the point and the origin.

//         theta - The azimuthal angle of the point to the positive x-axis.

//         phi - The vertical angle of the point to the positive z-axis.
//     """
//     r, theta, phi = spherical
//     return np.array(
//         [
//             r * np.cos(theta) * np.sin(phi),
//             r * np.sin(theta) * np.sin(phi),
//             r * np.cos(phi),
//         ],
//     )


// perpendicularBisector(
//     line: Sequence[np.ndarray],
//     normVector=OUT,
// ) -> Sequence[np.ndarray]:
//     """Returns a list of two points that correspond
//     to the ends of the perpendicular bisector of the
//     two points given.

//     Parameters
//     ----------
//     line
//         a list of two numpy array points (corresponding
//         to the ends of a line).
//     normVector
//         the vector perpendicular to both the line given
//         and the perpendicular bisector.

//     Returns
//     -------
//     list
//         A list of two numpy array points that correspond
//         to the ends of the perpendicular bisector
//     """
//     p1 = line[0]
//     p2 = line[1]
//     direction = np.cross(p1 - p2, normVector)
//     m = midpoint(p1, p2)
//     return [m + direction, m - direction]

