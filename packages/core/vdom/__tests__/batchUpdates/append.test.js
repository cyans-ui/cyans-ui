import batchUpdates from '../../batchUpdates';
import { createVElement, createVContainer } from '../../h';
import { normaliseHtml } from '../../__tests-utils__';

describe('VDOM batchUpdates -> append', () => {
  let rootElement;

  beforeEach(() => {
    document.body.innerHTML = '<div></div>';
    rootElement = document.querySelector('div');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('when the node is new', () => {
    describe('and node type is element', () => {
      it('should create an element setting props', () => {
        batchUpdates([
          createVElement('div', { className: 'my-div' }),
        ], [], rootElement);

        expect(rootElement.innerHTML).toBe('<div class="my-div"></div>');
      });

      it('should handle children of type text', () => {
        batchUpdates([
          createVElement('div', { className: 'my-div' },
            'I am a text',
          ),
        ], [], rootElement);

        expect(rootElement.innerHTML).toBe('<div class="my-div">I am a text</div>');
      });

      it('should handle children of mixed types', () => {
        batchUpdates([
          createVElement('div', { className: 'my-div' },
            'I am a text',
            createVElement('p', {},
              'Paragraph example',
            ),
            createVElement('ul', { className: 'list' },
              createVElement('li', {},
                '#1',
              ),
              createVElement('li', {},
                '#2',
              ),
            ),
          ),
        ], [], rootElement);


        expect(normaliseHtml(rootElement.innerHTML)).toBe(normaliseHtml`
          <div class="my-div">
            I am a text
            <p>Paragraph example</p>
            <ul class="list">
              <li>#1</li>
              <li>#2</li>
            </ul>
          </div>
        `);
      });
    });

    describe('and node type is container', () => {
      const Div = ({ className, children }) => createVElement('div', { className }, children);
      const P = ({ children }) => createVElement('p', { }, children);
      const Ul = ({ className, children }) => createVElement('ul', { className }, children);
      const Li = ({ children }) => createVElement('li', {}, children);
      const TextList = ({ children }) => [createVElement('h1', {}, 'Text list'), children];

      it('should create an element setting props', () => {
        batchUpdates([
          createVContainer(Div, { className: 'my-div' }),
        ], [], rootElement);

        expect(rootElement.innerHTML).toBe('<div class="my-div"></div>');
      });

      it('should handle children of type text', () => {
        batchUpdates([
          createVContainer(P, {},
            'I am a text',
          ),
        ], [], rootElement);

        expect(rootElement.innerHTML).toBe('<p>I am a text</p>');
      });

      it('should handle children of mixed types', () => {
        batchUpdates([
          createVContainer(Div, { className: 'my-div' },
            'I am a text',
            createVContainer(P, {},
              'Paragraph example',
            ),
            createVContainer(Ul, { className: 'list' },
              createVContainer(Li, {},
                '#1',
              ),
              createVContainer(Li, {},
                '#2',
              ),
              createVElement('li', {},
                '#3',
              ),
            ),
          ),
        ], [], rootElement);

        expect(normaliseHtml(rootElement.innerHTML)).toBe(normaliseHtml`
          <div class="my-div">
            I am a text
            <p>Paragraph example</p>
            <ul class="list">
              <li>#1</li>
              <li>#2</li>
              <li>#3</li>
            </ul>
          </div>
        `);
      });

      it('should create an element handling arrays', () => {
        batchUpdates([
          createVContainer(TextList, {},
            createVContainer(P, {},
              'First paragraph',
            ),
            createVContainer(P, {},
              'Second paragraph',
            ),
            createVContainer(P, {},
              'Third paragraph',
            ),
          ),
        ], [], rootElement);

        expect(normaliseHtml(rootElement.innerHTML)).toBe(normaliseHtml`
          <h1>Text list</h1>
          <p>First paragraph</p>
          <p>Second paragraph</p>
          <p>Third paragraph</p>
        `);
      });
    });
  });
});
