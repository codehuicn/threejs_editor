# js-signals
Custom event/messaging system for JavaScript inspired by [AS3-Signals](https://github.com/robertpenner/as3-signals).

A Signal is similar to an Event Emitter/Dispatcher or a Pub/Sub system, the main difference is that each event type has its own controller and doesn't rely on strings to broadcast/subscribe to events.

## Basic Example
```js

//custom object that dispatch a `started` signal
var myObject = {
  started : new signals.Signal()
};
function onStarted(param1, param2){
  alert(param1 + param2);
}
myObject.started.add(onStarted); //add listener
myObject.started.dispatch('foo', 'bar'); //dispatch signal passing custom parameters
myObject.started.remove(onStarted); //remove a single listener

```

[JS-Signals Github](https://github.com/millermedeiros/js-signals)
[JS-Signals Document](http://millermedeiros.github.io/js-signals/)
[JS-Signals API](http://millermedeiros.github.io/js-signals/docs/index.html)
[JS-Signals Examples](https://github.com/millermedeiros/js-signals/wiki/Examples)