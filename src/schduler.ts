const nextTick = Promise.resolve();
const queue = new Set<Function>();
let queued: Boolean = false;

function scheduler(func: Function) {
  queue.add(func);

  if (!queued) {
    queued = true;
    nextTick.then(flush);
  }
}

function flush() {
  queue.forEach(func => {
    func();
  });

  // queue.length = 0;
  queue.clear();
  queued = false;
}

export default scheduler;
