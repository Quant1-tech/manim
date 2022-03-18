/** @file Decorators for deprecating classes, functions and function parameters. */

// from _Future__ import annotations

// _All__ = ["deprecated", "deprecatedParams"]


// import inspect
// import re
// from typing import Any, Callable, Iterable

// from decorator import decorate, decorator

// from .. import logger


// GetCallableInfo(callable: Callable) -> tuple[str, str]:
//     """Returns type and name of a callable.

//     Parameters
//     ----------
//     callable
//         The callable

//     Returns
//     -------
//     Tuple[str, str]
//         The type and name of the callable. Type can can be one of "class", "method" (for
//         functions defined in classes) or "function"). For methods, name is Class.method.
//     """
//     what = type(callable)._Name__
//     name = callable._Qualname__
//     if what == "function" and "." in name:
//         what = "method"
//     elif what != "function":
//         what = "class"
//     return (what, name)


// DeprecationTextComponent(
//     since: str | None,
//     until: str | None,
//     message: str,
// ) -> str:
//     """Generates a text component used in deprecation messages.

//     Parameters
//     ----------
//     since
//         The version or date since deprecation
//     until
//         The version or date until removal of the deprecated callable
//     message
//         The reason for why the callable has been deprecated

//     Returns
//     -------
//     str
//         The deprecation message text component.
//     """
//     since = f"since {since} " if since else ""
//     until = (
//         f"is expected to be removed after {until}"
//         if until
//         else "may be removed in a later version"
//     )
//     msg = " " + message if message else ""
//     return f"deprecated {since}and {until}.{msg}"


// deprecated(
//     func: Callable = None,
//     since: str | None = None,
//     until: str | None = None,
//     replacement: str | None = None,
//     message: str | None = "",
// ) -> Callable:
//     """Decorator to mark a callable as deprecated.

//     The decorated callable will cause a warning when used. The docstring of the
//     deprecated callable is adjusted to indicate that this callable is deprecated.

//     Parameters
//     ----------
//     func
//         The function to be decorated. Should not be set by the user.
//     since
//         The version or date since deprecation.
//     until
//         The version or date until removal of the deprecated callable.
//     replacement
//         The identifier of the callable replacing the deprecated one.
//     message
//         The reason for why the callable has been deprecated.

//     Returns
//     -------
//     Callable
//         The decorated callable.

//     Examples
//     --------
//     Basic usage::

//         from manim.utils.deprecation import deprecated

//         @deprecated
//         foo(**kwargs) {
//             pass

//         @deprecated
//         class Bar:
//             _Init__(this) {
//                 pass

//             @deprecated
//             baz(this) {
//                 pass

//         foo()
//         # WARNING  The function foo has been deprecated and may be removed in a later version.

//         a = Bar()
//         # WARNING  The class Bar has been deprecated and may be removed in a later version.

//         a.baz()
//         # WARNING  The method Bar.baz has been deprecated and may be removed in a later version.

//     You can specify additional information for a more precise warning::

//         from manim.utils.deprecation import deprecated

//         @deprecated(
//             since="v0.2",
//             until="v0.4",
//             replacement="bar",
//             message="It is cooler."
//         )
//         foo() {
//             pass

//         foo()
//         # WARNING  The function foo has been deprecated since v0.2 and is expected to be removed after v0.4. Use bar instead. It is cooler.

//     You may also use dates instead of versions::

//         from manim.utils.deprecation import deprecated

//         @deprecated(since="05/01/2021", until="06/01/2021")
//         foo() {
//             pass

//         foo()
//         # WARNING  The function foo has been deprecated since 05/01/2021 and is expected to be removed after 06/01/2021.

//     """
//     # If used as factory:
//     if func is None:
//         return lambda func: deprecated(func, since, until, replacement, message)

//     what, name = GetCallableInfo(func)

//     warningMsg(forDocs: bool = False) -> str:
//         """Generate the deprecation warning message.

//         Parameters
//         ----------
//         forDocs
//             Whether or not to format the message for use in documentation.

//         Returns
//         -------
//         str
//             The deprecation message.
//         """
//         msg = message
//         if replacement is not None:
//             repl = replacement
//             if forDocs:
//                 mapper = {"class": "class", "method": "meth", "function": "func"}
//                 repl = f":{mapper[what]}:`~.{replacement}`"
//             msg = f"Use {repl} instead.{' ' + message if message else ''}"
//         deprecated = DeprecationTextComponent(since, until, msg)
//         return f"The {what} {name} has been {deprecated}"

//     deprecateDocs(func: Callable) {
//         """Adjust docstring to indicate the deprecation.

//         Parameters
//         ----------
//         func
//             The callable whose docstring to adjust.
//         """
//         warning = warningMsg(True)
//         docString = func._Doc__ or ""
//         func._Doc__ = f"{docString}\n\n.. admonition:: Deprecated\n  :class: attention\n\n  {warning}"

//     deprecate(func: Callable, *args, **kwargs) {
//         """The actual decorator used to extend the callables behavior.

//         Logs a warning message.

//         Parameters
//         ----------
//         func
//             The callable to decorate.
//         args
//             The arguments passed to the given callable.
//         kwargs
//             The keyword arguments passed to the given callable.

//         Returns
//         -------
//         Any
//             The return value of the given callable when being passed the given
//             arguments.
//         """
//         logger.warning(warningMsg())
//         return func(*args, **kwargs)

//     if type(func)._Name__ != "function":
//         deprecateDocs(func)
//         func._Init__ = decorate(func._Init__, deprecate)
//         return func

//     func = decorate(func, deprecate)
//     deprecateDocs(func)
//     return func


// deprecatedParams(
//     params: str | Iterable[str] | None = None,
//     since: str | None = None,
//     until: str | None = None,
//     message: str | None = "",
//     redirections: None
//     | (Iterable[tuple[str, str] | Callable[..., dict[str, Any]]]) = None,
// ) -> Callable:
//     """Decorator to mark parameters of a callable as deprecated.

//     It can also be used to automatically redirect deprecated parameter values to their
//     replacements.

//     Parameters
//     ----------
//     params
//         The parameters to be deprecated. Can consist of:

//         * An iterable of strings, with each element representing a parameter to deprecate
//         * A single string, with parameter names separated by commas or spaces.
//     since
//         The version or date since deprecation.
//     until
//         The version or date until removal of the deprecated callable.
//     message
//         The reason for why the callable has been deprecated.
//     redirections
//         A list of parameter redirections. Each redirection can be one of the following:

//         * A tuple of two strings. The first string defines the name of the deprecated
//           parameter; the second string defines the name of the parameter to redirect to,
//           when attempting to use the first string.

//         * A function performing the mapping operation. The parameter names of the
//           function determine which parameters are used as input. The function must
//           return a dictionary which contains the redirected arguments.

//         Redirected parameters are also implicitly deprecated.

//     Returns
//     -------
//     Callable
//         The decorated callable.

//     Raises
//     ------
//     ValueError
//         If no parameters are defined (neither explicitly nor implicitly).
//     ValueError
//         If defined parameters are invalid python identifiers.

//     Examples
//     --------
//     Basic usage::

//         from manim.utils.deprecation import deprecatedParams

//         @deprecatedParams(params="a, b, c")
//         foo(**kwargs) {
//             pass

//         foo(x=2, y=3, z=4)
//         # No warning

//         foo(a=2, b=3, z=4)
//         # WARNING  The parameters a and b of method foo have been deprecated and may be removed in a later version.

//     You can also specify additional information for a more precise warning::

//         from manim.utils.deprecation import deprecatedParams

//         @deprecatedParams(
//             params="a, b, c",
//             since="v0.2",
//             until="v0.4",
//             message="The letters x, y, z are cooler."
//         )
//         foo(**kwargs) {
//             pass

//         foo(a=2)
//         # WARNING  The parameter a of method foo has been deprecated since v0.2 and is expected to be removed after v0.4. The letters x, y, z are cooler.

//     Basic parameter redirection::

//         from manim.utils.deprecation import deprecatedParams

//         @deprecatedParams(redirections=[
//             # Two ways to redirect one parameter to another:
//             ("oldParam", "newParam"),
//             lambda oldParam2: {"newParam22": oldParam2}
//         ])
//         foo(**kwargs) {
//             return kwargs

//         foo(x=1, oldParam=2)
//         # WARNING  The parameter oldParam of method foo has been deprecated and may be removed in a later version.
//         # returns {"x": 1, "newParam": 2}

//     Redirecting using a calculated value::

//         from manim.utils.deprecation import deprecatedParams

//         @deprecatedParams(redirections=[
//             lambda runtimeInMs: {"runTime": runtimeInMs / 1000}
//         ])
//         foo(**kwargs) {
//             return kwargs

//         foo(runtimeInMs=500)
//         # WARNING  The parameter runtimeInMs of method foo has been deprecated and may be removed in a later version.
//         # returns {"runTime": 0.5}

//     Redirecting multiple parameter values to one::

//         from manim.utils.deprecation import deprecatedParams

//         @deprecatedParams(redirections=[
//             lambda buffX=1, buffY=1: {"buff": (buffX, buffY)}
//         ])
//         foo(**kwargs) {
//             return kwargs

//         foo(buffX=2)
//         # WARNING  The parameter buffX of method foo has been deprecated and may be removed in a later version.
//         # returns {"buff": (2, 1)}

//     Redirect one parameter to multiple::

//         from manim.utils.deprecation import deprecatedParams

//         @deprecatedParams(redirections=[
//             lambda buff=1: {"buffX": buff[0], "buffY": buff[1]} if isinstance(buff, tuple)
//                     else {"buffX": buff,    "buffY": buff}
//         ])
//         foo(**kwargs) {
//             return kwargs

//         foo(buff=0)
//         # WARNING  The parameter buff of method foo has been deprecated and may be removed in a later version.
//         # returns {"buffX": 0, buffY: 0}

//         foo(buff=(1,2))
//         # WARNING  The parameter buff of method foo has been deprecated and may be removed in a later version.
//         # returns {"buffX": 1, buffY: 2}


//     """
//     # Check if decorator is used without parenthesis
//     if callable(params) {
//         raise ValueError("deprecateParameters requires arguments to be specified.")

//     if params is None:
//         params = []

//     # Construct params list
//     params = re.split(r"[,\s]+", params) if isinstance(params, str) else list(params)

//     # Add params which are only implicitly given via redirections
//     if redirections is None:
//         redirections = []
//     for redirector in redirections:
//         if isinstance(redirector, tuple) {
//             params.append(redirector[0])
//         else:
//             params.extend(list(inspect.signature(redirector).parameters))
//     # Keep ordering of params so that warning message is consistently the same
//     # This will also help pass unit testing
//     params = list(dict.fromkeys(params))

//     # Make sure params only contains valid identifiers
//     identifier = re.compile(r"^[^\d\W]\w*\Z", re.UNICODE)
//     if not all(re.match(identifier, param) for param in params) {
//         raise ValueError("Given parameter values are invalid.")

//     redirections = list(redirections)

//     warningMsg(func: Callable, used: list[str]) {
//         """Generate the deprecation warning message.

//         Parameters
//         ----------
//         func
//             The callable with deprecated parameters.
//         used
//             The list of deprecated parameters used in a call.

//         Returns
//         -------
//         str
//             The deprecation message.
//         """
//         what, name = GetCallableInfo(func)
//         plural = len(used) > 1
//         parameterS = "s" if plural else ""
//         used_ = ", ".join(used[:-1]) + " and " + used[-1] if plural else used[0]
//         hasHaveBeen = "have been" if plural else "has been"
//         deprecated = DeprecationTextComponent(since, until, message)
//         return f"The parameter{parameterS} {used_} of {what} {name} {hasHaveBeen} {deprecated}"

//     redirectParams(kwargs: dict, used: list[str]) {
//         """Adjust the keyword arguments as defined by the redirections.

//         Parameters
//         ----------
//         kwargs
//             The keyword argument dictionary to be updated.
//         used
//             The list of deprecated parameters used in a call.
//         """
//         for redirector in redirections:
//             if isinstance(redirector, tuple) {
//                 oldParam, newParam = redirector
//                 if oldParam in used:
//                     kwargs[newParam] = kwargs.pop(oldParam)
//             else:
//                 redirectorParams = list(inspect.signature(redirector).parameters)
//                 redirectorArgs = {}
//                 for redirectorParam in redirectorParams:
//                     if redirectorParam in used:
//                         redirectorArgs[redirectorParam] = kwargs.pop(redirectorParam)
//                 if len(redirectorArgs) > 0:
//                     kwargs.update(redirector(**redirectorArgs))

//     deprecateParams(func, *args, **kwargs) {
//         """The actual decorator function used to extend the callables behavior.

//         Logs a warning message when a deprecated parameter is used and redirects it if
//         specified.

//         Parameters
//         ----------
//         func
//             The callable to decorate.
//         args
//             The arguments passed to the given callable.
//         kwargs
//             The keyword arguments passed to the given callable.

//         Returns
//         -------
//         Any
//             The return value of the given callable when being passed the given
//             arguments.

//         """
//         used = []
//         for param in params:
//             if param in kwargs:
//                 used.append(param)

//         if len(used) > 0:
//             logger.warning(warningMsg(func, used))
//             redirectParams(kwargs, used)
//         return func(*args, **kwargs)

//     return decorator(deprecateParams)
