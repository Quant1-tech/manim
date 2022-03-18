/** Utilities for things which are easy in Python but not so easy in JS */

import {range} from "@liqvid/utils/misc";
import {ORIGIN} from "../constants";

/** Add vectors */
export function $add(...vectors: Pt3[]): Pt3;
export function $add(...vectors: Vector[]) {
  return vectors.reduce((a, b) => a.map((ai, i) => ai + b[i], ORIGIN));
}

/** Subtract vectors */
export function $sub(a: Pt3, b: Pt3) {
  return $add(a, $scale(b, -1));
}

export type Pt3 = [number, number, number];
export type Vec3 = [number, number, number];
export type Matrix3 = [Vec3, Vec3, Vec3];
export type Vector = number[];
export type Matrix = number[][];

/** GCD */
export function $gcd(a: number, b: number): number {
  if (b === 0) {
    return a;
  }

  return $gcd(b, a % b);
}

/** Scale a vector. */
export function $scale<V extends Vec3 | Vector>(v: V, a: number): V {
  return v.map(vi => vi * a) as V;
}

/** Apply matrix to vector */
export function $apply(m: Matrix3, v: Vec3): Vec3 {
  return m.map(row => row.map((ri, i) => ri * v[i]).reduce((a, b) => a+b, 0)) as Vec3;
}

/** Dot product of vectors */
export function $dot(a: Vec3, b: Vec3) {
  return a.map((ai, i) => ai * b[i]).reduce((x, y) => x+y, 0);
}

/** Cross product of vectors */
export function $cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

/** Matrix multiplication */
export function $mult(...matrices: Matrix3[]): Matrix3 {
  // # of arguments other than 2
  if (matrices.length === 0) {
    return $identity(3);
  } else if (matrices.length === 1) {
    return matrices[0];
  } else if (matrices.length > 2) {
    return $mult($mult(matrices[0], matrices[1]), ...matrices.slice(2));
  }

  // two matrices
  const [a, b] = matrices;
  const c = $zero(3);
  for (let i = 0; i < 3; ++i) {
    for (let j = 0; j < 3; ++j) {
      for (let k = 0; k < 3; ++k) {
        c[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  return c;
}

export function $norm(v: Vec3 | Vector): number {
  return Math.hypot(...v);
}

/**
 * Normalize a vector.
 * @throws If v is the zero vector.
 */
export function $normalize<V extends Vec3 | Vector>(v: V): V {
  const norm = $norm(v);
  if (norm === 0) {
    throw new Error("Cannot normalize zero vector");
  }
  return $scale(v, 1/norm);
}

/** Identity matrix. */
export function $identity(n: 3): Matrix3;
export function $identity(n: number) {
  const m = [];
  for (let i = 0; i < n; ++i) {
    const row = new Array(n).fill(0);
    row[i] = 1;
    m.push(row);
  }
  return m as Matrix;
}

/** Matrix inversion. */
export function $invert(m: Matrix3) {
  const [a, b, c] = m[0],
        [d, e, f] = m[1],
        [g, h, i] = m[2];
  
  // minors
  const ma = e*i - f*h;
  const mb = f*g - d*i;
  const mc = d*h - e*g;

  // determinant
  const det = a*ma + b*mb + c*mc;

  if (det === 0) {
    return $zero(3);
  }

  // adjugate
  const adj: Matrix3 = [
    [ma, mb, mc],
    [c*h-b*i, a*i-c*g, b*g-a*h],
    [b*f-c*e, c*d-a*f, a*e-b*d]
  ];
  return adj.map(row => row.map(entry => entry/det)) as Matrix3;
}

/** Zero matrix. */
export function $zero(n: 3): Matrix3;
export function $zero(n: number) {
  const m = [];
  for (let i = 0; i < n; ++i) {
    m.push(new Array(n).fill(0));
  }
  return m as Matrix;
}

/** Python's zip() */
export function $zip<T>(...lists: T[][]): T[][] {
  const zipped: T[][] = [];
  for (let i = 0; i < lists[0].length; ++i) {
    zipped.push(lists.map(list => list[i]));
  }
  return zipped;
}

/** Sign of a number */
export function $sign(x: number) {
  if (x === 0) {
    return 0;
  }
  if (x > 0) {
    return 1;
  }
  return -1;
}

/** Python's :: operator */
export function $jumpslice<T>(arr: T[], start: number, step: number) {
  return range(Math.floor((arr.length - start) / step)).map(k => arr[start + k * step]);
}

/** NumPy's linspace */
export function $linspace(a: number, b: number, num: number) {
  return range(num).map(i => a + i * (b-a)/(num-1));
}

/** Vector interpolation */
export function $interpolate(u: Vec3, v: Vec3, t: number): Vec3 {
  return $add(u, $scale($sub(v, u), t));
}
