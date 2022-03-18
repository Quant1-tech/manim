// from _Future__ import annotations

// import copy

// from .camera import Camera


// class WebGLCamera(Camera) {
//     _Init__(this, **kwargs) {
//         super()._Init__(this, **kwargs)
//         this.serializedFrame = []
//         this.pixelArray = None

//     displayMultipleNonBackgroundColoredVmobjects(this, vmobjects, _) {
//         for vmobject in vmobjects:
//             # TODO: Store a proto instead of JSON.
//             needsRedraw = False
//             pointHash = hash(tuple(vmobject.points.flatten()))
//             if vmobject.pointHash != pointHash:
//                 vmobject.pointHash = pointHash
//                 needsRedraw = True
//             this.serializedFrame.append(
//                 {
//                     "points": vmobject.points.tolist(),
//                     "style": vmobject.getStyle(simple=True),
//                     "id": id(vmobject),
//                     "needsRedraw": needsRedraw,
//                 },
//             )

//     reset(this) {
//         this.serializedFrame = []

//     setFrameToBackground(this, background) {
//         this.serializedFrame = copy.deepcopy(background)
