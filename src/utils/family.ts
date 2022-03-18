// from _Future__ import annotations

// import itertools as it

// from ..mobject.mobject import Mobject
// from ..utils.iterables import removeListRedundancies


// extractMobjectFamilyMembers(
//     mobjects,
//     useZIndex=False,
//     onlyThoseWithPoints=False,
// ) {
//     """Returns a list of the types of mobjects and their family members present.
//     A "family" in this context refers to a mobject, its submobjects, and their
//     submobjects, recursively.

//     Parameters
//     ----------
//     mobjects : Mobject
//         The Mobjects currently in the Scene
//     onlyThoseWithPoints : bool, optional
//         Whether or not to only do this for
//         those mobjects that have points. By default False

//     Returns
//     -------
//     list
//         list of the mobjects and family members.
//     """
//     if onlyThoseWithPoints:
//         method = Mobject.familyMembersWithPoints
//     else:
//         method = Mobject.getFamily
//     extractedMobjects = removeListRedundancies(
//         list(it.chain(*(method(m) for m in mobjects))),
//     )
//     if useZIndex:
//         return sorted(extractedMobjects, key=lambda m: m.zIndex)
//     return extractedMobjects
