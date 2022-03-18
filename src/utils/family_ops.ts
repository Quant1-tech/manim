// from _Future__ import annotations

// import itertools as it


// extractMobjectFamilyMembers(mobjectList, onlyThoseWithPoints=False) {
//     result = list(it.chain(*(mob.getFamily() for mob in mobjectList)))
//     if onlyThoseWithPoints:
//         result = [mob for mob in result if mob.hasPoints()]
//     return result


// restructureListToExcludeCertainFamilyMembers(mobjectList, toRemove) {
//     """
//     Removes anything in toRemove from mobjectList, but in the event that one of
//     the items to be removed is a member of the family of an item in mobjectList,
//     the other family members are added back into the list.

//     This is useful in cases where a scene contains a group, e.g. Group(m1, m2, m3),
//     but one of its submobjects is removed, e.g. scene.remove(m1), it's useful
//     for the list of mobjectList to be edited to contain other submobjects, but not m1.
//     """
//     newList = []
//     toRemove = extractMobjectFamilyMembers(toRemove)

//     addSafeMobjectsFromList(listToExamine, setToRemove) {
//         for mob in listToExamine:
//             if mob in setToRemove:
//                 continue
//             intersect = setToRemove.intersection(mob.getFamily())
//             if intersect:
//                 addSafeMobjectsFromList(mob.submobjects, intersect)
//             else:
//                 newList.append(mob)

//     addSafeMobjectsFromList(mobjectList, set(toRemove))
//     return newList
