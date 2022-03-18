// from _Future__ import annotations

// import importlib.util
// import inspect
// import os
// import re
// import sys
// import types
// import warnings
// from pathlib import Path

// from .. import config, console, constants, logger
// from ..scene.sceneFileWriter import SceneFileWriter


// getModule(fileName: Path) {
//     if str(fileName) == "-":
//         module = types.ModuleType("inputScenes")
//         logger.info(
//             "Enter the animation's code & end with an EOF (CTRL+D on Linux/Unix, CTRL+Z on Windows):",
//         )
//         code = sys.stdin.read()
//         if not code.startswith("from manim import") {
//             logger.warning(
//                 "Didn't find an import statement for Manim. Importing automatically...",
//             )
//             code = "from manim import *\n" + code
//         logger.info("Rendering animation from typed code...")
//         try:
//             exec(code, module._Dict__)
//             return module
//         except Exception as e:
//             logger.error(f"Failed to render scene: {str(e)}")
//             sys.exit(2)
//     else:
//         if Path(fileName).exists() {
//             ext = fileName.suffix
//             if ext != ".py":
//                 raise ValueError(f"{fileName} is not a valid Manim python script.")
//             moduleName = ext.replace(os.sep, ".").split(".")[-1]

//             warnings.filterwarnings(
//                 "default",
//                 category=DeprecationWarning,
//                 module=moduleName,
//             )

//             spec = importlib.util.specFromFileLocation(moduleName, fileName)
//             module = importlib.util.moduleFromSpec(spec)
//             sys.modules[moduleName] = module
//             sys.path.insert(0, str(fileName.parent.absolute()))
//             spec.loader.execModule(module)
//             return module
//         else:
//             raise FileNotFoundError(f"{fileName} not found")


// getSceneClassesFromModule(module) {
//     from ..scene.scene import Scene

//     isChildScene(obj, module) {
//         return (
//             inspect.isclass(obj)
//             and issubclass(obj, Scene)
//             and obj != Scene
//             and obj._Module__.startswith(module._Name__)
//         )

//     return [
//         member[1]
//         for member in inspect.getmembers(module, lambda x: isChildScene(x, module))
//     ]


// getScenesToRender(sceneClasses) {
//     if not sceneClasses:
//         logger.error(constants.NO_SCENE_MESSAGE)
//         return []
//     if config["writeAll"]:
//         return sceneClasses
//     result = []
//     for sceneName in config["sceneNames"]:
//         found = False
//         for sceneClass in sceneClasses:
//             if sceneClass._Name__ == sceneName:
//                 result.append(sceneClass)
//                 found = True
//                 break
//         if not found and (sceneName != "") {
//             logger.error(constants.SCENE_NOT_FOUND_MESSAGE.format(sceneName))
//     if result:
//         return result
//     if len(sceneClasses) == 1:
//         config["sceneNames"] = [sceneClasses[0]._Name__]
//         return [sceneClasses[0]]
//     return promptUserForChoice(sceneClasses)


// promptUserForChoice(sceneClasses) {
//     numToClass = {}
//     SceneFileWriter.forceOutputAsSceneName = True
//     for count, sceneClass in enumerate(sceneClasses, 1) {
//         name = sceneClass._Name__
//         console.print(f"{count}: {name}", style="logging.level.info")
//         numToClass[count] = sceneClass
//     try:
//         userInput = console.input(
//             f"[log.message] {constants.CHOOSE_NUMBER_MESSAGE} [/log.message]",
//         )
//         sceneClasses = [
//             numToClass[int(numStr)]
//             for numStr in re.split(r"\s*,\s*", userInput.strip())
//         ]
//         config["sceneNames"] = [sceneClass._Name__ for sceneClass in sceneClasses]
//         return sceneClasses
//     except KeyError:
//         logger.error(constants.INVALID_NUMBER_MESSAGE)
//         sys.exit(2)
//     except EOFError:
//         sys.exit(1)
//     except ValueError:
//         logger.error("No scenes were selected. Exiting.")
//         sys.exit(1)


// sceneClassesFromFile(filePath, requireSingleScene=False, fullList=False) {
//     module = getModule(filePath)
//     allSceneClasses = getSceneClassesFromModule(module)
//     if fullList:
//         return allSceneClasses
//     sceneClassesToRender = getScenesToRender(allSceneClasses)
//     if requireSingleScene:
//         assert len(sceneClassesToRender) == 1
//         return sceneClassesToRender[0]
//     return sceneClassesToRender
