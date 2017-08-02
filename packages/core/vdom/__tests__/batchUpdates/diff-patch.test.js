import batchUpdates from '../../batchUpdates';
import { createVElement, createVContainer } from '../../h';
import {
  createCurrentVElement,
  createCurrentVContainer,
  createContainer,
  normaliseHtml,
} from '../../__tests-utils__';

describe('VDOM batchUpdates -> diff-patch', () => {
  let rootElement;

  beforeEach(() => {
    document.body.innerHTML = '<div></div>';
    rootElement = document.querySelector('div');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('when nodes\' types are identical', () => {
    describe('and node type is element', () => {
      it('should update props in case of changes', () => {
        rootElement.innerHTML = '<div class="old" hidden="false"></div>';
        batchUpdates([
          createVElement('div', { className: 'new', hidden: false }),
        ], [
          createVElement('div', { className: 'old', hidden: true }),
        ], rootElement);

        expect(rootElement.innerHTML).toBe('<div class="new"></div>');
      });

      it('should do nothing in case of no changes', () => {
        rootElement.innerHTML = '<div class="old" hidden="false"></div>';
        batchUpdates([
          createVElement('div', { className: 'old', hidden: true }),
        ], [
          createVElement('div', { className: 'old', hidden: true }),
        ], rootElement);

        expect(rootElement.innerHTML).toBe('<div class="old" hidden="false"></div>');
      });

      it('should check changes in all the subtrees', () => {
        rootElement.innerHTML = normaliseHtml`
          <div class="old" hidden="false">
            <div class="description">
              <p>Text</p>
              <a href="http://www.google.com/">Google.com</a>
            </div>
          </div>
        `;

        batchUpdates([
          createVElement('div', { className: 'new', hidden: false },
            createVElement('div', { className: 'description --modified' },
              createVElement('p', undefined,
                'Modified Text',
              ),
              createVElement('a', { href: 'http://www.google.com/search' },
                'Go to Google search',
              ),
            ),
          ),
        ], [
          createCurrentVElement('div', { className: 'old', hidden: true },
            createCurrentVElement('div', { className: 'description' },
              createCurrentVElement('p', undefined,
                'Text',
              ),
              createCurrentVElement('a', { href: 'http://www.google.com/' },
                'Google.com',
              ),
            ),
          ),
        ], rootElement);

        expect(normaliseHtml(rootElement.innerHTML)).toBe(normaliseHtml`
          <div class="new">
            <div class="description --modified">
              <p>Modified Text</p>
              <a href="http://www.google.com/search">Go to Google search</a>
            </div>
          </div>
        `);
      });
    });

    describe('and the tree has containers and elements', () => {
      it('should update props in case of changes', () => {
        rootElement.innerHTML = '<div class="old" hidden="false"></div>';

        const Container = createContainer(_element => ({ old = true }) => (
          _element('div', { className: old ? 'old' : 'new', hidden: old ? false : undefined })
        ));

        batchUpdates([
          createVContainer(Container.next, { old: false }),
        ], [
          createCurrentVContainer(Container.current, { old: true }),
        ], rootElement);

        expect(rootElement.innerHTML).toBe('<div class="new"></div>');
      });

      it('should update props handling arrays', () => {
        rootElement.innerHTML = normaliseHtml`
          <div class="a"></div>
          <div class="b"></div>
          <div class="c"></div>
        `;

        const Container = createContainer(_element => ({ old = true }) => [
          _element('div', { className: old ? 'a' : 'd' }),
          _element('div', { className: old ? 'b' : 'e' }),
          _element('div', { className: old ? 'c' : 'f' }),
        ]);

        batchUpdates([
          createVContainer(Container.next, { old: false }),
        ], [
          createCurrentVContainer(Container.current, { old: true }),
        ], rootElement);

        expect(normaliseHtml(rootElement.innerHTML)).toBe(normaliseHtml`
          <div class="d"></div>
          <div class="e"></div>
          <div class="f"></div>
        `);
      });

      it('should do nothing in case of no changes', () => {
        rootElement.innerHTML = '<div class="old" hidden="false"></div>';

        const Container = createContainer(_element => ({ old = true }) => (
          _element('div', { className: old ? 'old' : 'new', hidden: old ? false : undefined })
        ));

        batchUpdates([
          createVContainer(Container.next, { old: true }),
        ], [
          createCurrentVContainer(Container.current, { old: true }),
        ], rootElement);

        expect(rootElement.innerHTML).toBe('<div class="old" hidden="false"></div>');
      });

      it('should check changes in all the subtrees', () => {
        rootElement.innerHTML = normaliseHtml`
          <div class="old" hidden="false">
            <div class="description">
              <p>Text</p>
              <a href="http://www.google.com/">Google.com</a>
            </div>
          </div>
        `;

        const Paragraph = createContainer(_element => ({ old = true }) => (
          _element('p', undefined,
            old ? 'Text' : 'Modified Text',
          )
        ));

        const A = createContainer(_element => ({ old = true }) => (
          _element('a', { href: old ? 'http://www.google.com/' : 'http://www.google.com/search' },
            old ? 'Google.com' : 'Go to Google search',
          )
        ));

        const Container = createContainer((_element, _container) => ({ old = true }) => (
          _element('div', { className: old ? 'old' : 'new', hidden: old ? false : undefined },
            _element('div', { className: `description${!old ? ' --modified' : ''}` },
              _container(Paragraph, { old }),
              _container(A, { old }),
            ),
          )
        ));

        batchUpdates([
          createVContainer(Container.next, { old: false }),
        ], [
          createCurrentVContainer(Container.current, { old: true }),
        ], rootElement);

        expect(normaliseHtml(rootElement.innerHTML)).toBe(normaliseHtml`
          <div class="new">
            <div class="description --modified">
              <p>Modified Text</p>
              <a href="http://www.google.com/search">Go to Google search</a>
            </div>
          </div>
        `);
      });
    });
  });
});
