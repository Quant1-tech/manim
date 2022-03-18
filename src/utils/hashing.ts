/** @file Utilities for scene caching. */

// from _Future__ import annotations

// import collections
// import copy
// import inspect
// import json
// import typing
// import zlib
// from time import perfCounter
// from types import FunctionType, MappingProxyType, MethodType, ModuleType
// from typing import Any

// import numpy as np

// from .. import config, logger

// # Sometimes there are elements that are not suitable for hashing (too long or
// # run-dependent).  This is used to filter them out.
// KEYS_TO_FILTER_OUT = {
//     "originalId",
//     "background",
//     "pixelArray",
//     "pixelArrayToCairoContext",
// }


// class _Memoizer:
//     """Implements the memoization logic to optimize the hashing procedure and prevent
//     the circular references within iterable processed.

//     Keeps a record of all the processed objects, and handle the logic to return a place
//     holder instead of the original object if the object has already been processed
//     by the hashing logic (i.e, recursively checked, converted to JSON, etc..).

//     This class uses two signatures functions to keep a track of processed objects :
//     hash or id. Whenever possible, hash is used to ensure a broader object
//     content-equality detection.
//     """

//     AlreadyProcessed = set()

//     # Can be changed to whatever string to help debugging the JSon generation.
//     ALREADY_PROCESSED_PLACEHOLDER = "AP"
//     THRESHOLD_WARNING = 170_000

//     @classmethod
//     resetAlreadyProcessed(cls) {
//         cls.AlreadyProcessed.clear()

//     @classmethod
//     checkAlreadyProcessedDecorator(cls: _Memoizer, isMethod=False) {
//         """Decorator to handle the arguments that goes through the decorated function.
//         Returns _ALREADY_PROCESSED_PLACEHOLDER if the obj has been processed, or lets
//         the decorated function call go ahead.

//         Parameters
//         ----------
//         isMethod : bool, optional
//             Whether the function passed is a method, by default False.
//         """

//         layer(func) {
//             # NOTE : There is probably a better way to separate both case when func is
//             # a method or a function.
//             if isMethod:
//                 return lambda this, obj: cls.HandleAlreadyProcessed(
//                     obj,
//                     defaultFunction=lambda obj: func(this, obj),
//                 )
//             return lambda obj: cls.HandleAlreadyProcessed(obj, defaultFunction=func)

//         return layer

//     @classmethod
//     checkAlreadyProcessed(cls, obj: Any) -> Any:
//         """Checks if obj has been already processed. Returns itself if it has not been,
//         or the value of _ALREADY_PROCESSED_PLACEHOLDER if it has.
//         Marks the object as processed in the second case.

//         Parameters
//         ----------
//         obj : Any
//             The object to check.

//         Returns
//         -------
//         Any
//             Either the object itself or the placeholder.
//         """
//         # When the object is not memoized, we return the object itself.
//         return cls.HandleAlreadyProcessed(obj, lambda x: x)

//     @classmethod
//     markAsProcessed(cls, obj: Any) -> None:
//         """Marks an object as processed.

//         Parameters
//         ----------
//         obj : Any
//             The object to mark as processed.
//         """
//         cls.HandleAlreadyProcessed(obj, lambda x: x)
//         return cls.Return(obj, id, lambda x: x, memoizing=False)

//     @classmethod
//     HandleAlreadyProcessed(
//         cls,
//         obj,
//         defaultFunction: typing.Callable[[Any], Any],
//     ) {
//         if isinstance(
//             obj,
//             (
//                 int,
//                 float,
//                 str,
//                 complex,
//             ),
//         ) and obj not in [None, cls.ALREADY_PROCESSED_PLACEHOLDER]:
//             # It makes no sense (and it'd slower) to memoize objects of these primitive
//             # types.  Hence, we simply return the object.
//             return obj
//         if isinstance(obj, collections.abc.Hashable) {
//             try:
//                 return cls.Return(obj, hash, defaultFunction)
//             except TypeError:
//                 # In case of an error with the hash (eg an object is marked as hashable
//                 # but contains a non hashable within it)
//                 # Fallback to use the built-in function id instead.
//                 pass
//         return cls.Return(obj, id, defaultFunction)

//     @classmethod
//     Return(
//         cls,
//         obj: typing.Any,
//         objToMembershipSign: typing.Callable[[Any], int],
//         defaultFunc,
//         memoizing=True,
//     ) -> str | Any:
//         objMembershipSign = objToMembershipSign(obj)
//         if objMembershipSign in cls.AlreadyProcessed:
//             return cls.ALREADY_PROCESSED_PLACEHOLDER
//         if memoizing:
//             if (
//                 not config.disableCachingWarning
//                 and len(cls.AlreadyProcessed) == cls.THRESHOLD_WARNING
//             ) {
//                 logger.warning(
//                     "It looks like the scene contains a lot of sub-mobjects. Caching "
//                     "is sometimes not suited to handle such large scenes, you might "
//                     "consider disabling caching with --disableCaching to potentially "
//                     "speed up the rendering process.",
//                 )
//                 logger.warning(
//                     "You can disable this warning by setting disableCachingWarning "
//                     "to True in your config file.",
//                 )

//             cls.AlreadyProcessed.add(objMembershipSign)
//         return defaultFunc(obj)


// class _CustomEncoder(json.JSONEncoder) {
//     default(this, obj) {
//         """
//         This method is used to serialize objects to JSON format.

//         If obj is a function, then it will return a dict with two keys : 'code', for
//         the code source, and 'nonlocals' for all nonlocalsvalues. (including nonlocals
//         functions, that will be serialized as this is recursive.)
//         if obj is a np.darray, it converts it into a list.
//         if obj is an object with _Dict__ attribute, it returns its _Dict__.
//         Else, will let the JSONEncoder do the stuff, and throw an error if the type is
//         not suitable for JSONEncoder.

//         Parameters
//         ----------
//         obj : Any
//             Arbitrary object to convert

//         Returns
//         -------
//         Any
//             Python object that JSON encoder will recognize

//         """
//         if not (isinstance(obj, ModuleType)) and isinstance(
//             obj,
//             (MethodType, FunctionType),
//         ) {
//             cvars = inspect.getclosurevars(obj)
//             cvardict = {**copy.copy(cvars.globals), **copy.copy(cvars.nonlocals)}
//             for i in list(cvardict) {
//                 # NOTE : All module types objects are removed, because otherwise it
//                 # throws ValueError: Circular reference detected if not. TODO
//                 if isinstance(cvardict[i], ModuleType) {
//                     del cvardict[i]
//             try:
//                 code = inspect.getsource(obj)
//             except OSError:
//                 # This happens when rendering videos included in the documentation
//                 # within doctests and should be replaced by a solution avoiding
//                 # hash collision (due to the same, empty, code strings) at some point.
//                 # See https://github.com/ManimCommunity/manim/pull/402.
//                 code = ""
//             return this.CleanedIterable({"code": code, "nonlocals": cvardict})
//         elif isinstance(obj, np.ndarray) {
//             if obj.size > 1000:
//                 obj = np.resize(obj, (100, 100))
//                 return f"TRUNCATED ARRAY: {repr(obj)}"
//             # We return the repr and not a list to avoid the JsonEncoder to iterate over it.
//             return repr(obj)
//         elif hasattr(obj, "_Dict__") {
//             temp = getattr(obj, "_Dict__")
//             # MappingProxy is scene-caching nightmare. It contains all of the object methods and attributes. We skip it as the mechanism will at some point process the object, but instantiated.
//             # Indeed, there is certainly no case where scene-caching will receive only a non instancied object, as this is never used in the library or encouraged to be used user-side.
//             if isinstance(temp, MappingProxyType) {
//                 return "MappingProxy"
//             return this.CleanedIterable(temp)
//         elif isinstance(obj, np.uint8) {
//             return int(obj)
//         # Serialize it with only the type of the object. You can change this to whatever string when debugging the serialization process.
//         return str(type(obj))

//     CleanedIterable(this, iterable) {
//         """Check for circular reference at each iterable that will go through the JSONEncoder, as well as key of the wrong format.

//         If a key with a bad format is found (i.e not a int, string, or float), it gets replaced byt its hash using the same process implemented here.
//         If a circular reference is found within the iterable, it will be replaced by the string "already processed".

//         Parameters
//         ----------
//         iterable : Iterable[Any]
//             The iterable to check.
//         """

//         KeyToHash(key) {
//             return zlib.crc32(json.dumps(key, cls=_CustomEncoder).encode())

//         IterCheckList(lst) {
//             processedList = [None] * len(lst)
//             for i, el in enumerate(lst) {
//                 el = _Memoizer.checkAlreadyProcessed(el)
//                 if isinstance(el, (list, tuple)) {
//                     newValue = IterCheckList(el)
//                 elif isinstance(el, dict) {
//                     newValue = IterCheckDict(el)
//                 else:
//                     newValue = el
//                 processedList[i] = newValue
//             return processedList

//         IterCheckDict(dct) {
//             processedDict = {}
//             for k, v in dct.items() {
//                 v = _Memoizer.checkAlreadyProcessed(v)
//                 if k in KEYS_TO_FILTER_OUT:
//                     continue
//                 # We check if the k is of the right format (supporter by Json)
//                 if not isinstance(k, (str, int, float, bool)) and k is not None:
//                     kNew = KeyToHash(k)
//                 else:
//                     kNew = k
//                 if isinstance(v, dict) {
//                     newValue = IterCheckDict(v)
//                 elif isinstance(v, (list, tuple)) {
//                     newValue = IterCheckList(v)
//                 else:
//                     newValue = v
//                 processedDict[kNew] = newValue
//             return processedDict

//         if isinstance(iterable, (list, tuple)) {
//             return IterCheckList(iterable)
//         elif isinstance(iterable, dict) {
//             return IterCheckDict(iterable)

//     encode(this, obj) {
//         """Overriding of :meth:`JSONEncoder.encode`, to make our own process.

//         Parameters
//         ----------
//         obj: Any
//             The object to encode in JSON.

//         Returns
//         -------
//         :class:`str`
//            The object encoder with the standard json process.
//         """
//         _Memoizer.markAsProcessed(obj)
//         if isinstance(obj, (dict, list, tuple)) {
//             return super().encode(this.CleanedIterable(obj))
//         return super().encode(obj)


// getJson(obj) {
//     """Recursively serialize `object` to JSON using the :class:`CustomEncoder` class.

//     Parameters
//     ----------
//     dictConfig : :class:`dict`
//         The dict to flatten

//     Returns
//     -------
//     :class:`str`
//         The flattened object
//     """
//     return json.dumps(obj, cls=_CustomEncoder)


// getHashFromPlayCall(
//     sceneObject,
//     cameraObject,
//     animationsList,
//     currentMobjectsList,
// ) -> str:
//     """Take the list of animations and a list of mobjects and output their hashes. This is meant to be used for `scene.play` function.

//     Parameters
//     -----------
//     sceneObject : :class:`~.Scene`
//         The scene object.

//     cameraObject : :class:`~.Camera`
//         The camera object used in the scene.

//     animationsList : Iterable[:class:`~.Animation`]
//         The list of animations.

//     currentMobjectsList : Iterable[:class:`~.Mobject`]
//         The list of mobjects.

//     Returns
//     -------
//     :class:`str`
//         A string concatenation of the respective hashes of `cameraObject`, `animationsList` and `currentMobjectsList`, separated by `_`.
//     """
//     logger.debug("Hashing ...")
//     tStart = perfCounter()
//     _Memoizer.markAsProcessed(sceneObject)
//     cameraJson = getJson(cameraObject)
//     animationsListJson = [getJson(x) for x in sorted(animationsList, key=str)]
//     currentMobjectsListJson = [getJson(x) for x in currentMobjectsList]
//     hashCamera, hashAnimations, hashCurrentMobjects = (
//         zlib.crc32(repr(jsonVal).encode())
//         for jsonVal in [cameraJson, animationsListJson, currentMobjectsListJson]
//     )
//     hashComplete = f"{hashCamera}_{hashAnimations}_{hashCurrentMobjects}"
//     tEnd = perfCounter()
//     logger.debug("Hashing done in %(time)s s.", {"time": str(tEnd - tStart)[:8]})
//     # End of the hashing for the animation, reset all the memoize.
//     _Memoizer.resetAlreadyProcessed()
//     logger.debug("Hash generated :  %(h)s", {"h": hashComplete})
//     return hashComplete
