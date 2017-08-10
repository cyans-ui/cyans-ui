/* eslint-disable no-param-reassign */

import {
  isThereStillWorkToDo,
  isThisWorkUnitFinished,
  purgeCurrentWorkUnit,
  addWorkUnit,
} from './scheduler';

import {
  havePropsChanged,
  updateProps,
} from './props';

import {
  createTextDomNode,
  createDomNode,
} from './domNodes';

const WORK_TYPES = {
  DIFF: 'DIFF',
  APPEND: 'APPEND',
};

function createDomMarker(parent, cursor = 0) {
  return {
    parent,
    cursor,
  };
}

function createUnitOfWork(workType, parentVNode, nextTree, currentTree, domMarker, treeCursor = 0) {
  return {
    workType,
    parentVNode,
    nextTree,
    currentTree,
    treeCursor,
    domMarker,
    currentWorkStage: {},
    state: 'SCHEDULED',
  };
}

function createDiffUnitOfWork(nextTree, currentTree, domMarker, parentVNode) {
  return createUnitOfWork(WORK_TYPES.DIFF, parentVNode, nextTree, currentTree, domMarker);
}

function createAppendUnitOfWork(nextTree, domMarker, parentVNode) {
  return createUnitOfWork(WORK_TYPES.APPEND, parentVNode, nextTree, [], domMarker);
}

function performsWorkUnit(workUnit, scheduler) {
  const {
    domMarker = {},
    nextTree,
    currentTree,
    treeCursor,
  } = workUnit;

  const nextNode = nextTree[treeCursor];
  const currentNode = currentTree[treeCursor];

  if (typeof nextNode === 'object') {
    if (nextNode.nodeType === 'container') {
      let newElementsTree = nextNode.type({
        ...nextNode.props,
        children: nextNode.children,
      });
      newElementsTree = Array.isArray(newElementsTree) ? newElementsTree : [newElementsTree];
      nextNode.subTree = newElementsTree;
    } else {
      nextNode.subTree = nextNode.children;
    }
  }

  switch (workUnit.workType) {
    case WORK_TYPES.APPEND: {
      if (workUnit.state === 'IN_PROGRESS') {
        if (nextNode !== null && nextNode !== undefined) {
          if (typeof nextNode === 'object') {
            if (nextNode.nodeType === 'container') {
              // use sub tree
              addWorkUnit(
                createAppendUnitOfWork(nextNode.subTree, domMarker, nextNode.parentVNode),
                scheduler,
              );
            } else if (Array.isArray(nextNode)) {
              // use node as sub tree
              addWorkUnit(
                createAppendUnitOfWork(nextNode, domMarker),
                scheduler,
              );
            } else {
              const createdNode = createDomNode(nextNode);

              // evaluate subtree
              if (nextNode.subTree && nextNode.subTree.length) {
                // put the work unit on hold until the children have been created
                // and save the createdNode into the currentWorkStage
                workUnit.state = 'ON_HOLD';
                workUnit.currentWorkStage.createdNode = createdNode;

                addWorkUnit(
                  createAppendUnitOfWork(
                    nextNode.subTree,
                    createDomMarker(createdNode),
                    nextNode.parentVNode,
                  ),
                  scheduler,
                );
              } else {
                domMarker.parent.appendChild(createdNode);
              }
            }
          } else {
            domMarker.parent.appendChild(createTextDomNode(nextNode));
          }
        }
      }

      if (workUnit.state === 'ON_HOLD') {
        workUnit.state = 'IN_PROGRESS';

        domMarker.parent.appendChild(workUnit.currentWorkStage.createdNode);
      }

      break;
    }

    case WORK_TYPES.DIFF: {
      if (nextNode === undefined) {
        // remove current node
      } else if (currentNode === undefined) {
        // create a new unit of work of type ADD
        // using the tree from the current cursor on
        // based on the assumption that if the current node
        // is undefined, we don't need to check the rest of this tree
        // since it would all end up in an ADD operation
        addWorkUnit(
          createAppendUnitOfWork(nextTree.slice(treeCursor), domMarker, nextNode.parentVNode),
          scheduler,
        );
      } else if (typeof nextNode === 'object') {
        const {
          nodeType: nextNodeType,
          type: nextType,
          props: nextProps,
        } = nextNode || {};

        const {
          nodeType: currentNodeType,
          type: currentType,
          props: currentProps,
        } = currentNode || {};

        if (
          nextNodeType !== currentNodeType ||
          nextType !== currentType
        ) {
          // schedule replace
        } else if (havePropsChanged(currentProps, nextProps)) {
          // update props only if it's an element
          if (nextNodeType !== 'container') {
            updateProps(domMarker.parent.childNodes[domMarker.cursor], nextProps, currentProps);
          }
        }

        if (Array.isArray(nextNode.subTree) && nextNode.subTree.length) {
          const subDomMarker = nextNodeType === 'container' ?
            domMarker :
            createDomMarker(domMarker.parent.childNodes[domMarker.cursor]);

          addWorkUnit(
            createDiffUnitOfWork(nextNode.subTree, currentNode.subTree, subDomMarker, nextNode),
            scheduler,
          );
        }
      } else if (nextNode !== currentNode) {
        domMarker.parent.replaceChild(
          createTextDomNode(nextNode),
          domMarker.parent.childNodes[domMarker.cursor],
        );
      }

      break;
    }

    default: {
      throw new Error('batchUpdates: Unknown workType');
    }
  }

  // move the dom cursor if the parsed node is of type element
  if (typeof nextNode === 'object' && nextNode.nodeType === 'element') {
    workUnit.domMarker.cursor += 1;
  }

  // determine if the current unit is finished
  if (workUnit.state === 'IN_PROGRESS') {
    const nextTreeCursor = treeCursor + 1;
    if (nextTree[nextTreeCursor] === undefined && currentTree[nextTreeCursor] === undefined) {
      workUnit.state = 'FINISHED';
    } else {
      workUnit.treeCursor = nextTreeCursor;
    }
  }
}

export default function batchUpdates(newTree, oldTree, container, scheduler = []) {
  scheduler.push(createDiffUnitOfWork(newTree, oldTree, createDomMarker(container)));

  let stillWorkToDo = true;

  while (stillWorkToDo) {
    const currentWorkUnit = scheduler[0];
    if (currentWorkUnit.state === 'SCHEDULED') {
      currentWorkUnit.state = 'IN_PROGRESS';
    }

    performsWorkUnit(currentWorkUnit, scheduler);

    if (isThisWorkUnitFinished(currentWorkUnit)) {
      purgeCurrentWorkUnit(currentWorkUnit, scheduler);
    }

    if (!isThereStillWorkToDo(scheduler)) {
      stillWorkToDo = false;
    }
  }
}
