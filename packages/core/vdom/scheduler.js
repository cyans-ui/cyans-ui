export function isThereStillWorkToDo(scheduler) {
  return scheduler.length;
}

export function isThisWorkUnitFinished(unit) {
  return unit.state === 'FINISHED';
}

export function purgeCurrentWorkUnit(workUnit, scheduler) {
  scheduler.splice(scheduler.indexOf(workUnit), 1);
}

export function addWorkUnit(workUnit, scheduler) {
  scheduler.unshift(workUnit);
}

export function addLowPriorityWorkUnit(workUnit, scheduler) {
  scheduler.push(workUnit);
}
