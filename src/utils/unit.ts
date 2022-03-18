/** @file Implement the Unit class. */

// from _Future__ import annotations

// import numpy as np

// from .. import config, constants

// _All__ = ["Pixels", "Degrees", "Munits", "Percent"]


// class _PixelUnits:
//     _Mul__(this, val) {
//         return val * config.frameWidth / config.pixelWidth

//     _Rmul__(this, val) {
//         return val * config.frameWidth / config.pixelWidth


// class Percent:
//     _Init__(this, axis) {
//         if np.arrayEqual(axis, constants.X_AXIS) {
//             this.length = config.frameWidth
//         if np.arrayEqual(axis, constants.Y_AXIS) {
//             this.length = config.frameHeight
//         if np.arrayEqual(axis, constants.Z_AXIS) {
//             raise NotImplementedError("length of Z axis is undefined")

//     _Mul__(this, val) {
//         return val / 100 * this.length

//     _Rmul__(this, val) {
//         return val / 100 * this.length


// Pixels = _PixelUnits()
// Degrees = constants.PI / 180
// Munits = 1
