// from _Future__ import annotations

// from .. import config, logger
// from ..utils.hashing import getHashFromPlayCall


// handleCachingPlay(func) {
//     """Decorator that returns a wrapped version of func that will compute
//     the hash of the play invocation.

//     The returned function will act according to the computed hash: either skip
//     the animation because it's already cached, or let the invoked function
//     play normally.

//     Parameters
//     ----------
//     func : Callable[[...], None]
//         The play like function that has to be written to the video file stream.
//         Take the same parameters as `scene.play`.
//     """

//     # NOTE : This is only kept for OpenGL renderer.
//     # The play logic of the cairo renderer as been refactored and does not need this function anymore.
//     # When OpenGL renderer will have a proper testing system,
//     # the play logic of the latter has to be refactored in the same way the cairo renderer has been, and thus this
//     # method has to be deleted.

//     wrapper(this, scene, *args, **kwargs) {
//         this.skipAnimations = this.OriginalSkippingStatus
//         this.updateSkippingStatus()
//         animations = scene.compileAnimations(*args, **kwargs)
//         scene.addMobjectsFromAnimations(animations)
//         if this.skipAnimations:
//             logger.debug(f"Skipping animation {this.numPlays}")
//             func(this, scene, *args, **kwargs)
//             # If the animation is skipped, we mark its hash as None.
//             # When sceneFileWriter will start combining partial movie files, it won't take into account None hashes.
//             this.animationsHashes.append(None)
//             this.fileWriter.addPartialMovieFile(None)
//             return
//         if not config["disableCaching"]:
//             mobjectsOnScene = scene.mobjects
//             hashPlay = getHashFromPlayCall(
//                 this,
//                 this.camera,
//                 animations,
//                 mobjectsOnScene,
//             )
//             if this.fileWriter.isAlreadyCached(hashPlay) {
//                 logger.info(
//                     f"Animation {this.numPlays} : Using cached data (hash : %(hashPlay)s)",
//                     {"hashPlay": hashPlay},
//                 )
//                 this.skipAnimations = True
//         else:
//             hashPlay = f"uncached_{this.numPlays:05}"
//         this.animationsHashes.append(hashPlay)
//         this.fileWriter.addPartialMovieFile(hashPlay)
//         logger.debug(
//             "List of the first few animation hashes of the scene: %(h)s",
//             {"h": str(this.animationsHashes[:5])},
//         )
//         func(this, scene, *args, **kwargs)

//     return wrapper
