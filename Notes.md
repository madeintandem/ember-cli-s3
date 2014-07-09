Notes.md

Per Stefan Penner, most add-ons are pulling in ext/promise.js similar to ember-cli, but in a pull request now to be added to rsvp-party: 

```
https://github.com/stefanpenner/rsvp-party/pull/3
```

The `run` command in the build task should return a promise: 

```
https://github.com/stefanpenner/ember-cli/blob/master/lib/cli/cli.js#L47
```

Example of how to invoke the `ember build` task from within another task:

```
https://github.com/stefanpenner/ember-cli/blob/master/lib/commands/test.js#L56
```



