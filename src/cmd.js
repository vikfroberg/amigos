let key = 0;

const Cmd = fork => ({
  fork,
  key: key++,
});

Cmd.none = Cmd(() => () => {});

Cmd.fromPromise = (resFn, rejFn, promise) =>
  Cmd(fork => {
    let isCancelled = false;
    promise()
      .then(x => !isCancelled && fork(resFn(x)))
      .catch(y => !isCancelled && fork(rejFn(y)));
    return () => (isCancelled = true);
  });

Cmd.fromTask = (resFn, rejFn, task) =>
  Cmd(fork => {
    const execution = task.fork(x => fork(resFn(x)), y => fork(rejFn(y)));
    return () => execution.cancel();
  });

Cmd.fromIO = (resFn, io) =>
  Cmd(fork => {
    let isCancelled = false;
    io.fork(x => !isCancelled && fork(resFn(x)));
    return () => (isCancelled = true);
  });

Cmd.fromObservable = (resFn, rejFn, observable) =>
  Cmd(fork => {
    const execution = observable.subscribe(
      x => fork(resFn(x)),
      y => fork(rejFn(y)),
    );
    return () => execution.unsubscribe();
  });

export default Cmd;
