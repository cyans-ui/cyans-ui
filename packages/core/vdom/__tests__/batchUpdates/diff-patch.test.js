import batchUpdates from '../../batchUpdates';
import { createVElement } from '../../h';
import { createOldVElement } from '../../__tests-utils__/nodes';


describe('VDOM batchUpdates -> diff-patch', () => {
  let containerElement;

  beforeEach(() => {
    document.body.innerHTML = '<div></div>';
    containerElement = document.querySelector('div');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('when nodes\' types are equal', () => {
    describe('and node type is element', () => {
      it('should update props in case of changes', () => {
        containerElement.innerHTML = '<div class="old" hidden="false"></div>';
        batchUpdates([
          createVElement('div', { className: 'new', hidden: false }),
        ], [
          createVElement('div', { className: 'old', hidden: true }),
        ], containerElement);

        expect(containerElement.innerHTML).toBe('<div class="new"></div>');
      });

      it('should do nothing in case of no changes', () => {
        containerElement.innerHTML = '<div class="old" hidden="false"></div>';
        batchUpdates([
          createVElement('div', { className: 'old', hidden: true }),
        ], [
          createVElement('div', { className: 'old', hidden: true }),
        ], containerElement);

        expect(containerElement.innerHTML).toBe('<div class="old" hidden="false"></div>');
      });

      it('should check changes in all the subtrees', () => {
        containerElement.innerHTML = `
          <div class="old" hidden="false">
            <div class="description">
              <p>Text</p>
              <a href="http://www.google.com/">Google.com</a>
            </div>
          </div>
        `.replace(/\n|\s{2,}/g, '');

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
          createOldVElement('div', { className: 'old', hidden: true },
            createOldVElement('div', { className: 'description' },
              createOldVElement('p', undefined,
                'Text',
              ),
              createOldVElement('a', { href: 'http://www.google.com/' },
                'Google.com',
              ),
            ),
          ),
        ], containerElement);

        expect(containerElement.innerHTML.replace(/\n|\s{2,}/g, '')).toBe(`
          <div class="new">
            <div class="description --modified">
              <p>Modified Text</p>
              <a href="http://www.google.com/search">Go to Google search</a>
            </div>
          </div>
        `.replace(/\n|\s{2,}/g, ''));
      });
    });
  });
});
